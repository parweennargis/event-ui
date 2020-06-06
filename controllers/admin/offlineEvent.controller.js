const hitApi = require('../../utils/external');

module.exports = {
    offlineAllEvents: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            const cookies = cookie.split('=');
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
            return res.status(400).json({ data: error });
        }
    },
    offlineAddEvent: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
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
            return res.render('admin/offline/edit-event', { title: 'Express Admin Event', layout: 'admin', eventCategories: eventCategories.data, eventData: eventData.data  });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    offlineAllCategories: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
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
            return res.render('admin/offline/add-category', { title: 'Express Admin Event', layout: 'admin' });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    offlineEditCategory: async (req, res) => {
        try {
            const { headers: { cookie }, params: { categoryTd } } = req;
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const [offlineCategory] = await Promise.all([
                hitApi.hitApi({ path: `/offline-categories/${categoryTd}`, method: 'GET', headers })
            ]);
            console.log('offlineCategory: ', offlineCategory);
            return res.render('admin/offline/edit-category', { title: 'Express Admin Event', layout: 'admin', offlineCategory: offlineCategory.data  });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    }
};