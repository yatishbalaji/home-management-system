const express = require('express');
const controller = require('./user.controller');
const authenticate = require('../../components/authenticate');

const router = express.Router();

router.get('/', authenticate, controller.index);

router.post('/', controller.create);
router.post('/login', controller.login);
router.post('/device', authenticate, controller.addDevice);
router.post('/device/command', authenticate, controller.commandDevice);

module.exports = router;