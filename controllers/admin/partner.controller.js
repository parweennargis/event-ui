const hitApi = require('../../utils/external');

const redirectPage = (err, res) => {
    if (err.message === 'Token') {
        res.clearCookie('token');
        return res.redirect('/admin/login');
    }
}

module.exports = {
    allPartners: async (req, res) => {
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

            const partners = await hitApi.hitApi({ path: '/all-partners', method: 'GET', headers });
            console.log(partners);
            return res.render('admin/partner/all-partner', { title: 'Express Admin Event', layout: 'admin', partners: partners.data });
        } catch (error) {
            console.log(error);
            redirectPage(error, res);
            return res.status(400).json({ data: error });
        }
    },
    addPartner: async (req, res) => {
        try {
            const { headers: { cookie } } = req;
            // check user is logged in or not
            if (cookie === undefined) {
                return res.redirect('/admin/login');
            }
            return res.render('admin/partner/add-partner', { title: 'Express Admin Event', layout: 'admin' });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    },
    editPartner: async (req, res) => {
        try {
            const { headers: { cookie }, params: { partnerId } } = req;
            // check user is logged in or not
            if (cookie === undefined) {
                return res.redirect('/admin/login');
            }
            const cookies = cookie.split('=');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies[1]}`
            };
            const [partnerData] = await Promise.all([
                hitApi.hitApi({ path: `/event/${eventId}`, method: 'GET', headers })
            ]);
            console.log('partnerData: ', partnerData);
            return res.render('admin/partner/edit-partner', { title: 'Express Admin Event', layout: 'admin', partnerData: partnerData.data });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ data: error });
        }
    }
}; 