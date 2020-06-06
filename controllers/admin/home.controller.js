const hitApi = require('../../utils/external');

module.exports = {
    home: (req, res) => {
        return res.render('admin/home', { title: 'Express Admin', layout: 'admin' });
    },
    login: (req, res) => {
        return res.render('admin/login', { title: 'Express Admin', layout: false });
    },
    event: async (req, res) => {
        const { headers: { cookie } } = req;
        const cookies = cookie.split('=');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies[1]}`
        };
        const events = await hitApi.hitApi({ path: '/all-events', method: 'GET', headers });
        console.log(events);
        return res.render('admin/event', { title: 'Express Admin Event', layout: 'admin', events: events.data });

    },
    addEvent: async (req, res) => {
        const { headers: { cookie } } = req;
        const cookies = cookie.split('=');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies[1]}`
        };
        const pricings = await hitApi.hitApi({ path: '/pricings', method: 'GET', headers });
        const eventCategories = await hitApi.hitApi({ path: '/event-categories', method: 'GET', headers });
        return res.render('admin/add-event', { title: 'Express Admin Event', layout: 'admin', pricings: pricings.data, eventCategories: eventCategories.data });
    }
};