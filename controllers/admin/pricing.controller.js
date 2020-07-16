const hitApi = require('../../utils/external');

module.exports = {
    pricingPlanList: async (req, res) => {
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

            const pricings = await hitApi.hitApi({ path: '/pricings/all', method: 'GET', headers });
            return res.render('admin/pricing/list-pricing', { title: 'Express Admin Pricing Plan', layout: 'admin', pricings: pricings.data });
        } catch (error) {
            console.log(error);
            return res.redirect('/');
        }

    },
    addPricingPlan: async (req, res) => {
        const { headers: { cookie } } = req;
        // check user is logged in or not
        if (cookie === undefined) {
            return res.redirect('/admin/login');
        }

        return res.render('admin/pricing/add-pricing', { title: 'Express Admin Pricing Plan', layout: 'admin' });
    },
    editPricingPlan: async (req, res) => {
        const { headers: { cookie }, params: { pricingId } } = req;
        // check user is logged in or not
        if (cookie === undefined) {
            return res.redirect('/admin/login');
        }
        const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };

            const pricing = await hitApi.hitApi({ path: `/pricing/${pricingId}`, method: 'GET', headers });
            console.log(pricing);

        return res.render('admin/pricing/edit-pricing', { title: 'Admin Pricing Plan', layout: 'admin', pricing: pricing.data });
    }
};