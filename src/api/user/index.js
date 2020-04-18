const express = require('express');
const controller = require('./user.controller');
const authenticate = require('../../components/authenticate');

const router = express.Router();

router.get('/', authenticate, controller.index);

router.post('/login', controller.login);
router.post('/', controller.create);

module.exports = router;
