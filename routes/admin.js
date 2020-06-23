const express = require('express');
const router = express.Router();

const homeController = require('../controllers/admin/home.controller');
const pricingController = require('../controllers/admin/pricing.controller');
const offlineEventController = require('../controllers/admin/offlineEvent.controller');

// Login Routes
router.get('/login', homeController.login);
router.get('/', homeController.login);

// Dashboard
router.get('/dashboard', homeController.home);

// Event Routes
router.get('/event', homeController.event);
router.get('/add-event', homeController.addEvent);
router.get('/events/:eventId', homeController.getEventById);

// Pricing Plan Routes
router.get('/pricing-plan', pricingController.pricingPlanList);
router.get('/add-pricing-plan', pricingController.addPricingPlan);

// offline Webinars Routes
router.get('/offline-all-events', offlineEventController.offlineAllEvents);
router.get('/offline-all-categories', offlineEventController.offlineAllCategories);
router.get('/offline-add-event', offlineEventController.offlineAddEvent);
router.get('/offline-add-category', offlineEventController.offlineAddCategory);

router.get('/offline-all-events/:eventId', offlineEventController.offlineEditEvent);
router.get('/offline-update-category/:categoryTd', offlineEventController.offlineEditCategory);

module.exports = router;