const hitApi = require('../../utils/external');

module.exports = {
    home: (req, res) => {
        // check user is logged in or not
        const { headers: { cookie } } = req;
        if (cookie === undefined) {
            return res.redirect('/admin/login');
        }

        // redirect to dashboard page
        return res.render('admin/home', { title: 'Express Admin', layout: 'admin' });


    },
    login: (req, res) => {
        // check user is logged in or not
        const { headers: { cookie } } = req;
        if (cookie !== undefined) {
            return res.redirect('/admin/dashboard');
        }

        return res.render('admin/login', { title: 'Express Admin', layout: false });
    },
    event: async (req, res) => {
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
        const body = { event_type: 'ONLINE' };

        const events = await hitApi.hitApi({ path: '/all-events', method: 'POST', body, headers });
        // console.log(events);
        return res.render('admin/event', { title: 'Express Admin Event', layout: 'admin', events: events.data });
    },
    addEvent: async (req, res) => {
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
        const pricings = await hitApi.hitApi({ path: '/pricings', method: 'GET', headers });
        const eventCategories = await hitApi.hitApi({ path: '/event-categories', method: 'GET', headers });
        return res.render('admin/add-event', { title: 'Express Admin Event', layout: 'admin', pricings: pricings.data, eventCategories: eventCategories.data });
    },
    getEventById: async (req, res) => {
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
        
        const promises = [];
        promises.push(hitApi.hitApi({ path: `/events/${eventId}`, method: 'GET', headers }));
        promises.push(hitApi.hitApi({ path: '/pricings', method: 'GET', headers }));
        promises.push(hitApi.hitApi({ path: '/event-categories', method: 'GET', headers }));

        const [eventData, pricings, eventCategories] = await Promise.all(promises);
        
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
        // console.log(eventData);
        return res.render('admin/update-event', { title: 'Express Admin Event Edit', layout: 'admin', event: eventData.data, pricings: pricings.data, eventCategories: eventCategories.data });
    }
};