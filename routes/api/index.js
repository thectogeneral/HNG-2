const express = require('express');
const router = express.Router();
const authenticate = require('../../middlewares/authenticate')
const { validateOrganization } = require('../../validators/orgValidator');

const apiController = require('../../controllers/api/apiController');

router.get('/users/:id', authenticate, apiController.get_user);
router.get('/organisations', authenticate, apiController.get_all_organisations);
router.post('/organisations', authenticate, validateOrganization, apiController.create_organisation);
router.get('/organisations/:orgId',authenticate, apiController.get_single_organisation);
router.post('/organisations/:orgId/users', apiController.add_user_to_organisation);

module.exports = router; 
