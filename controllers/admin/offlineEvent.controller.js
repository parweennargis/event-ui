const hitApi = require('../../utils/external');

const redirectPage = (err, res) => {
    if (err.message === 'Token') {
        res.clearCookie('token');
        return res.redirect('/admin/login');
    }
}

module.exports = {
    offlineAllEvents: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            // check user is logged in or not
            if (cookie === undefined) {
                return res.redirect('/admin/login');
            }
            const cookies = cookie.split('=');
            if (!cookies.length || cookies[0] !== 'token') {
                throw new Error('Token');
            }
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const body = { event_type: 'VIRTUAL' };

            const events = await hitApi.hitApi({ path: '/all-events', method: 'POST', body, headers });
            console.log(events);
            return res.render('admin/offline/all-event', { title: 'Express Admin Event', layout: 'admin', events: events.data });
        } catch (error) {
            console.log(error);
            redirectPage(error, res);
            return res.status(400).json({ data: error });
        }
    },
    offlineAddEvent: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            // check user is logged in or not
            if (cookie === undefined) {
                return res.redirect('/admin/login');
            }
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const eventCategories = await hitApi.hitApi({ path: '/offline-categories', method: 'GET', headers });
            return res.render('admin/offline/add-event', { title: 'Express Admin Event', layout: 'admin', eventCategories: eventCategories.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    offlineEditEvent: async (req, res) => {
        try {
            const { headers: { cookie }, params: { eventId } } = req;
            // check user is logged in or not
            if (cookie === undefined) {
                return res.redirect('/admin/login');
            }
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const [eventCategories, eventData] = await Promise.all([
                hitApi.hitApi({ path: '/offline-categories', method: 'GET', headers }),
                hitApi.hitApi({ path: `/offline-event/${eventId}`, method: 'GET', headers })
            ]);
            console.log('eventCategories: ', eventCategories);
            console.log('eventData: ', eventData);
            if (eventData && eventData.data && eventData.data.start_date) {
                const startDate = new Date(eventData.data.start_date);
                let day = startDate.getDate().toString();
                if (day.length < 2) {
                    day = `0${day}`;
                }
                let month = (startDate.getMonth() + 1).toString();
                if (month.length < 2) {
                    month = `0${month}`;
                }
                eventData.data.startDay = `${startDate.getFullYear()}-${month}-${day}`;
            }
            if (eventData && eventData.data && eventData.data.end_date) {
                const endDate = new Date(eventData.data.end_date);
                let day = endDate.getDate().toString();
                if (day.length < 2) {
                    day = `0${day}`;
                }
                let month = (endDate.getMonth() + 1).toString();
                if (month.length < 2) {
                    month = `0${month}`;
                }
                eventData.data.endDay = `${endDate.getFullYear()}-${month}-${day}`;
            }
            return res.render('admin/offline/edit-event', { title: 'Express Admin Event', layout: 'admin', eventCategories: eventCategories.data, eventData: eventData.data  });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    offlineAllCategories: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            // check user is logged in or not
            if (cookie === undefined) {
                return res.redirect('/admin/login');
            }
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };

            const categories = await hitApi.hitApi({ path: '/offline-categories', method: 'GET', headers });
            console.log(categories);
            return res.render('admin/offline/all-categories', { title: 'Express Admin Event', layout: 'admin', categories: categories.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    offlineAddCategory: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            // check user is logged in or not
            if (cookie === undefined) {
                return res.redirect('/admin/login');
            }
            return res.render('admin/offline/add-category', { title: 'Express Admin Event', layout: 'admin' });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    offlineEditCategory: async (req, res) => {
        try {
            const { headers: { cookie }, params: { categoryTd } } = req;
            // check user is logged in or not
            if (cookie === undefined) {
                return res.redirect('/admin/login');
            }
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const [offlineCategory] = await Promise.all([
                hitApi.hitApi({ path: `/offline-categories/${categoryTd}`, method: 'GET', headers })
            ]);
            console.log('offlineCategory: ', offlineCategory);
            return res.render('admin/offline/edit-category', { title: 'Express Admin Event', layout: 'admin', offlineCategory: offlineCategory.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    }
}; 