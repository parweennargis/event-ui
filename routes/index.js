const homeController = require('../controllers/home.controller');

const indexRoutes = (app, router) => {
    router.get('/', homeController.home);
    router.get('/event/:eventId', homeController.eventDetail);
    router.get('/register', homeController.register);
    router.get('/events', homeController.getEvents);
    router.get('/plans', homeController.plans);
    router.get('/cart', homeController.cart);
    router.get('/checkout', homeController.checkout);
    router.get('/response', homeController.response);
    router.get('/error', homeController.error);
    router.get('/reset-password', homeController.resetPassword);
    router.get('/event/:eventId/plans', homeController.eventPlan);
    router.post('/login', homeController.login);
    router.get('/logout', homeController.logout);
    router.post('/payment', homeController.payment);
    router.post('/cart', homeController.addItemIncart);
    router.post('/forgot-password', homeController.forgotPassword);
    router.post('/change-password', homeController.changePassword);
    router.get('/profile', homeController.profile);
    router.get('/cart/count', homeController.getUserCart);
    router.get('/verify', homeController.verify);
    router.delete('/cart/:cartId', homeController.deleteItemFromCart);
    router.post('/register', homeController.postRegister);
    router.put('/profile', homeController.updateProfile);
    router.post('/upload', app.upload.single('file'), homeController.uploadData);

    router.get('/virtual-event/:eventId', homeController.virtualEventDetail);
    router.post('/event-action', homeController.eventAction);
    router.get('/contact', homeController.contact);
    router.post('/contact', homeController.sendContact);

    router.get('/aboutus', homeController.aboutus);
    router.get('/faq', homeController.faq);
    router.get('/previous-events', homeController.previousEvents);
    router.get('/previous-events/:eventId', homeController.previousEventsDetails);
    router.get('/previous-events-tab', homeController.tabPreviousEvents);
    router.get('/partners', homeController.partners);
    router.get('/our-services', homeController.ourServices);

    router.get('/services', homeController.ourServices);
    router.get('/terms', homeController.terms);
    router.get('/contact-success', homeController.contactResponse);
    router.get('/registration-success', homeController.registrationSuccess);

    router.get('/activate-account', homeController.activateAccount);

    return router;
}

module.exports = indexRoutes;