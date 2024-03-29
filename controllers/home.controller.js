const externalUtils = require('../utils/external');
const { splitDate, splitTime } = require('../utils/helper');
const fs = require('fs');

const redirectPage = (err, req, res) => {
    if (err.message === 'Token') {
        res.clearCookie('token');
        res.redirect('/');
    } else if (err === 'Invalid token' || err.errors === 'jwt expired' || err.errors === 'jwt malformed' || err.errors === 'invalid signature') {
        res.clearCookie('token');
        res.redirect(req.originalUrl);
    } else {
        return res.render('404-error');
    }
}

const clearCookie = (err, req, res) => {
    if (err === 'Invalid token' || err.errors === 'jwt expired' || err.message === 'Token') {
        res.clearCookie('token');
    }
}

const getSponsors = async () => {
    return externalUtils.hitApi({ path: "/sponsors", qs: { 'is_active': true } });
}

module.exports = {
    home: async (req, res) => {
        try {
            const promises = [];
            promises.push(externalUtils.hitApi({ path: "/events" }));
            promises.push(externalUtils.hitApi({ path: "/event-categories" }));
            promises.push(externalUtils.hitApi({ path: "/offline-events", qs: { 'limit': 20 } }));
            promises.push(externalUtils.hitApi({ path: "/offline-categories" }));
            // promises.push(getSponsors());
            const [eventList, eventCategories, offlineEventList, offlineEventCategories] = await Promise.all(promises);

            // Event list api
            eventList.data.items = (eventList.data && eventList.data.items) ? splitDate(eventList.data.items) : [];
            offlineEventList.data.items = (offlineEventList.data && offlineEventList.data.items) ? splitDate(offlineEventList.data.items) : [];
            eventList.data.items = (eventList.data && eventList.data.items) ? splitTime(eventList.data.items) : [];
            offlineEventList.data.items = (offlineEventList.data && offlineEventList.data.items) ? splitTime(offlineEventList.data.items) : [];
            const virtualEventCategories = [];
            const [defaultVirtualEventCat] = (offlineEventCategories.data || []).filter(item => item.default);
            const virtualEventCat = (offlineEventCategories.data || []).filter(item => !item.default);
            if (defaultVirtualEventCat) virtualEventCategories.push(defaultVirtualEventCat);
            if (virtualEventCat && virtualEventCat.length) virtualEventCategories.push(...virtualEventCat);

            const onlineEventCategories = [];
            const [defaultOnlineEventCat] = (eventCategories.data || []).filter(item => item.default);
            const onlineEventCat = (eventCategories.data || []).filter(item => !item.default);
            if (defaultOnlineEventCat) onlineEventCategories.push(defaultOnlineEventCat);
            if (onlineEventCat && onlineEventCat.length) onlineEventCategories.push(...onlineEventCat);

            const data = {
                eventList: eventList.data,
                eventCategories: onlineEventCategories,
                offlineEventList: offlineEventList.data,
                offlineEventCategories: virtualEventCategories,
                host: req.hostname,
                // sponsors: sponsors.data
            };

            // console.log(data);
            return res.render('home', { data });
        } catch (error) {
            console.log(error);
            // return res.render('404-error');
            redirectPage(error, req, res);
        }
    },
    eventDetail: async (req, res) => {
        try {
            const { params: { eventId }, headers: { cookie } } = req;
            const promises = [
                externalUtils.hitApi({ path: `/events/${eventId}` }),
                // getSponsors()
            ];
            if (cookie) {
                const cookies = cookie.split('=');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies[1]}`
                };
                promises.push(externalUtils.hitApi({ path: `/profile`, headers }));
            }
            const [event, profile] = await Promise.all(promises);

            let isInterested = false;
            if (profile && profile.data && profile.data.event_interested && event && event.data) isInterested = profile.data.event_interested.includes(event.data._id);

            if (event && event.data && event.data.start_date) {
                event.data = splitDate([event.data], false)[0];
                event.data = splitTime([event.data], false)[0];
            }
            const data = {
                event: event.data,
                user: profile && profile.data,
                host: req.hostname,
                // sponsors: sponsors.data,
                isInterested
            };

            return res.render('event-detail', { title: 'Event Detail', data });
        } catch (error) {
            console.log(error);
            // return res.render('404-error');
            redirectPage(error, req, res);
        }
    },
    getEvents: async (req, res) => {
        try {
            const { query: { page, eventCategoryId } } = req;
            const eventList = await externalUtils.hitApi({ path: `/events`, qs: { page, eventCategoryId } });
            eventList.data.items = (eventList.data && eventList.data.items) ? splitDate(eventList.data.items) : [];
            eventList.data.items = (eventList.data && eventList.data.items) ? splitTime(eventList.data.items) : [];

            // console.log(apiResponse);
            return res.status(200).json(eventList);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    },
    register: async (req, res) => {
        const data = {
            host: req.hostname
        };
        return res.render('register', { title: 'Register', data });
    },
    plans: async (req, res) => {
        return res.render('plans');
    },
    cart: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/cart`, headers });
            // console.log('cart response: ', apiResponse);
            const { totalTax, totalPrice } = apiResponse.data.reduce((prev, curr) => {
                const startDate = new Date(curr.event.start_date).toDateString().split(' ');
                curr.event.startDay = startDate[2];
                curr.event.startMonth = startDate[1];
                curr.event.startYear = startDate[3];
                prev.totalTax += curr.tax;
                prev.totalPrice += curr.price;
                return prev;
            }, { totalTax: 0, totalPrice: 0 });

            return res.render('cart', { title: 'Cart', data: apiResponse.data, totalPrice, totalTax });
        } catch (error) {
            console.log(error);
            return res.redirect('/');
        }
    },
    eventPlan: async (req, res) => {
        try {
            const { params: { eventId } } = req;
            const apiResponse = await externalUtils.hitApi({ path: `/events/${eventId}` });

            if (apiResponse.data.start_date) {
                apiResponse.data = splitDate([apiResponse.data], false)[0];
                apiResponse.data = splitTime([apiResponse.data], false)[0];
            }
            // console.log(apiResponse);
            return res.render('plans', { title: 'Event Plan', data: apiResponse.data });
        } catch (error) {
            console.log(error);
            // return res.render('404-error');
            return res.redirect('/');
        }
    },
    checkout: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const promises = [
                externalUtils.hitApi({ path: `/cart`, headers }),
                externalUtils.hitApi({ path: `/profile`, headers })
            ]
            const [cart, profile] = await Promise.all(promises);
            // console.log('checkout response: ', cart, profile);
            const { totalTax, totalPrice } = cart.data.reduce((prev, curr) => {
                prev.totalTax += curr.tax;
                prev.totalPrice += curr.price;
                return prev;
            }, { totalTax: 0, totalPrice: 0 });

            return res.render('checkout', { title: 'Checkout', totalTax, totalPrice, profile: profile.data, cart: cart.data });
        } catch (error) {
            console.log(error);
            return res.redirect('/');
        }
    },
    response: async (req, res) => {
        return res.render('response');
    },
    contactResponse: async (req, res) => {
        return res.render('contact-response');
    },
    registrationSuccess: async (req, res) => {
        return res.render('registration-success');
    },
    error: async (req, res) => {
        return res.render('404-error');
    },
    profile: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            if (!cookie) throw new Error('Token');
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/profile`, headers });
            // console.log('profile response: ', apiResponse);

            return res.render('profile', { title: 'Profile', data: apiResponse.data });
        } catch (error) {
            console.log(error);
            // return res.render('404-error');
            redirectPage(error, req, res);
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { query: { token } } = req;
            if (!token) throw new Error('Link is invalid');
            const headers = {
                'Content-Type': 'application/json'
            };
            const body = { token };
            const apiResponse = await externalUtils.hitApi({ path: `/reset-password`, method: 'POST', body, headers });
            // console.log('reset password response: ', apiResponse);

            return res.render('resetpassword');
        } catch (error) {
            console.log(error);
            return res.render('resetpassword', { error: error.errors });
        }

    },
    login: async (req, res) => {
        try {
            const { body } = req;
            const headers = {
                'Content-Type': 'application/json'
            };
            const apiResponse = await externalUtils.hitApi({ path: `/login`, method: 'POST', body, headers });
            // console.log(apiResponse);

            res.cookie('token', apiResponse.data.token, { httpOnly: true, secure: false });

            return res.status(200).json({ data: apiResponse.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    logout: async (req, res) => {
        res.clearCookie('token');
        return res.json({});
    },
    payment: async (req, res) => {
        try {
            const { headers: { cookie }, body } = req;
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/payment`, method: 'POST', body, headers });
            res.json({});
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    addItemIncart: async (req, res) => {
        try {
            const { headers: { cookie }, body } = req;
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/cart`, method: 'POST', body, headers });
            // console.log('cart response: ', apiResponse);

            res.json({ data: apiResponse.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { body } = req;
            const headers = {
                'Content-Type': 'application/json'
            };
            const apiResponse = await externalUtils.hitApi({ path: `/forgot-password`, method: 'POST', body, headers });
            // console.log('forgot password response: ', apiResponse);

            res.json({});
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    changePassword: async (req, res) => {
        try {
            const { body } = req;
            const headers = {
                'Content-Type': 'application/json'
            };
            const apiResponse = await externalUtils.hitApi({ path: `/change-password`, method: 'POST', body, headers });
            // console.log('change password response: ', apiResponse);

            res.json({});
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    getUserCart: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            const cookies = cookie.split('=');
            // if (!cookies.length || cookies[0] !== 'token') {
            //     throw new Error('')
            // }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/cart`, headers });
            // console.log('getUserCart response: ', apiResponse);

            res.json({ data: apiResponse.data.length });
        } catch (error) {
            console.log(error);
            clearCookie(error, req, res);
            return res.status(400).json({ data: error });
        }
    },
    verify: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            const cookies = cookie.split('=');
            if (!cookies.length || cookies[0] !== 'token') {
                throw new Error('Some Error Occured');
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/verify`, headers });
            // console.log('verify response: ', apiResponse);

            res.json({ data: apiResponse.data });
        } catch (error) {
            console.log(error);
            clearCookie(error, req, res);
            return res.status(400).json({ data: error.message || error });
        }
    },
    deleteItemFromCart: async (req, res) => {
        try {
            const { headers: { cookie }, params: { cartId } } = req;
            const cookies = cookie.split('=');
            if (!cookies.length || cookies[0] !== 'token') {
                throw new Error('Some Error Occured');
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/cart/${cartId}`, headers, method: 'DELETE' });
            // console.log('deleteItemFromCart response: ', apiResponse);

            res.json({ data: apiResponse });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error.message || error });
        }
    },
    postRegister: async (req, res) => {
        try {
            const { body } = req;
            const headers = {
                'Content-Type': 'application/json'
            };
            const apiResponse = await externalUtils.hitApi({ path: `/register`, method: 'POST', body, headers });
            // console.log(apiResponse);

            return res.status(200).json({ data: apiResponse.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { headers: { cookie }, body } = req;
            const cookies = cookie.split('=');
            if (!cookies.length || cookies[0] !== 'token') {
                throw new Error('Some Error Occured');
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/profile`, method: 'PUT', headers, body });
            // console.log('update profile response: ', apiResponse);

            res.json({ data: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error.message || error });
        }
    },
    uploadData: async (req, res) => {
        try {
            const { headers: { cookie }, body: { name }, file } = req;
            const cookies = cookie.split('=');
            if (!cookies.length || cookies[0] !== 'token') {
                throw new Error('Some Error Occured');
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };

            const formData = {
                name,
                'file': {
                    'value': fs.createReadStream(file.destination + '/' + file.filename),
                    'options': {
                        'filename': file.originalname,
                        'contentType': file.mimetype
                    }
                }
            };
            const apiResponse = await externalUtils.hitApi({ path: `/profile/upload`, method: 'POST', headers, formData });
            // console.log('update profile response: ', apiResponse);

            fs.unlink(file.destination + '/' + file.filename, (err) => {
                if (err) console.log(err);
                console.log('File is deleted');
            });
            res.json({ data: apiResponse.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error.message || error });
        }
    },
    virtualEventDetail: async (req, res) => {
        try {
            const { params: { eventId }, headers: { cookie } } = req;
            const promises = [
                externalUtils.hitApi({ path: `/events/${eventId}` }),
                getSponsors()
            ];
            if (cookie) {
                const cookies = cookie.split('=');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies[1]}`
                };
                promises.push(externalUtils.hitApi({ path: `/profile`, headers }));
            }
            const [event, sponsors, profile] = await Promise.all(promises);

            if (event && event.data && event.data.start_date) {
                event.data = splitDate([event.data], false)[0];
                event.data = splitTime([event.data], false)[0];
            }
            let isEventFollow = false;
            const [eventFollow] = (profile && profile.data && profile.data.event_follows) ? profile.data.event_follows.filter(id => eventId === id) : [];
            if (eventFollow) isEventFollow = true;

            const data = {
                event: event.data,
                user: profile && profile.data ? profile.data : null,
                isUser: profile && profile.data,
                isEventFollow,
                host: req.hostname,
                sponsors: sponsors.data
            };

            return res.render('virtual-event-detail', { title: 'Virtual Event Detail', data });
        } catch (error) {
            console.log(error);
            // return res.render('404-error');
            redirectPage(error, req, res);
        }
    },
    eventAction: async (req, res) => {
        try {
            const { headers: { cookie }, body } = req;
            const cookies = cookie.split('=');
            if (!cookies.length || cookies[0] !== 'token') {
                throw new Error('Some Error Occured');
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/event-action`, method: 'POST', headers, body });
            // console.log('eventAction response: ', apiResponse);

            res.json({ data: apiResponse.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error.message || error });
        }
    },
    contact: async (req, res) => {
        const promises = [];
        promises.push(getSponsors());
        const [sponsors] = await Promise.all(promises);
        return res.render('contact', { title: 'Contact Us', data: { sponsors: sponsors.data } });
    },
    sendContact: async (req, res) => {
        try {
            const { body } = req;
            const headers = {
                'Content-Type': 'application/json'
            };
            const apiResponse = await externalUtils.hitApi({ path: `/contact`, method: 'POST', headers, body });
            // console.log('contcat us response: ', apiResponse);

            res.json({ data: true });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error.message || error });
        }
    },
    aboutus: async (req, res) => {
        const promises = [];
        promises.push(getSponsors());
        const [sponsors] = await Promise.all(promises);
        return res.render('aboutus', { title: 'AboutUs', data: { sponsors: sponsors.data } });
    },
    faq: async (req, res) => {
        const promises = [];
        promises.push(getSponsors());
        const [sponsors] = await Promise.all(promises);
        return res.render('faq', { title: 'FAQ', data: { sponsors: sponsors.data } });
    },
    previousEvents: async (req, res) => {
        try {
            const promises = [];
            promises.push(externalUtils.hitApi({ path: "/previous-events" }));
            promises.push(externalUtils.hitApi({ path: "/event-categories" }));
            promises.push(externalUtils.hitApi({ path: "/offline-categories" }));
            promises.push(getSponsors());
            const [previousEvents, eventCategories, virtualCategories, sponsors] = await Promise.all(promises);

            previousEvents.data.items = (previousEvents.data && previousEvents.data.items) ? splitDate(previousEvents.data.items, false) : [];

            return res.render('previous-events', { data: { previousEvents: previousEvents.data, eventCategories: eventCategories.data, virtualCategories: virtualCategories.data, sponsors: sponsors.data } });
        } catch (error) {
            console.error(error);
            // return res.render('404-error');
            redirectPage(error, req, res);
        }

    },
    previousEventsDetails: async (req, res) => {
        try {
            const { params: { eventId } } = req;
            const promises = [
                externalUtils.hitApi({ path: `/events/${eventId}` }),
                getSponsors()
            ]
            const [eventData, sponsors] = await Promise.all(promises);

            eventData.data = splitDate([eventData.data])[0];
            // console.log('previous event detail response: ', eventData);

            return res.render('previous-events-details', { title: 'Previous Event Detail', data: { event: eventData.data, sponsors: sponsors.data } });
        } catch (error) {
            console.error(error);
            // return res.render('404-error');
            redirectPage(error, req, res);
        }

    },
    tabPreviousEvents: async (req, res) => {
        try {
            const { query: { eventCategoryId } } = req;
            const eventData = await externalUtils.hitApi({ path: `/previous-events`, qs: { eventCategoryId } });
            const items = (eventData.data && eventData.data.items) ? splitDate(eventData.data.items, false) : [];
            if (eventData.data) eventData.data.items = items;

            // console.log('tabPreviousEvent: ', eventData);
            return res.status(200).json(eventData);
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    },
    ourServices: async (req, res) => {
        return res.render('our-services');
    },
    partners: async (req, res) => {
        return res.render('partners');
    },
    terms: async (req, res) => {
        return res.render('terms');
    },
    activateAccount: async (req, res) => {
        try {
            const { query: { token } } = req;
            if (!token) return res.render('activate-account', { error: 'Link is Invalid' });
            const headers = {
                'Content-Type': 'application/json'
            };
            const body = { token };
            const apiResponse = await externalUtils.hitApi({ path: `/activate-account`, method: 'POST', body, headers });

            return res.render('activate-account', { title: 'Activate Account', isActivate: true });
        } catch (error) {
            console.log(error);
            return res.render('activate-account', { error: error.errors });
        }
    },
    checkoutResponse: async (req, res) => {
        return res.render('checkout-response');
    },
    sponsors: async (req, res) => {
        try {
            const sponsors = await externalUtils.hitApi({ path: "/sponsors", qs: { 'is_active': true } });
            return res.status(200).json({ data: sponsors.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    },
    interested: async (req, res) => {
        try {
            const { headers: { cookie }, body } = req;
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const apiResponse = await externalUtils.hitApi({ path: `/jobseeker-send-email`, method: 'POST', body, headers });
            res.json({});
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    }
};