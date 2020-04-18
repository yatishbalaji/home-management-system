const express = require('express');
const controller = require('./user.controller');
const authenticate = require('../../components/authenticate');

const router = express.Router();

router.get('/device', authenticate, controller.getDevices);

router.post('/', controller.create);
router.post('/login', controller.login);
router.post('/device', authenticate, controller.addDevice);
router.post('/device/:id/command', authenticate, controller.commandDevice);

router.delete('/device/:id', authenticate, controller.deleteDevice);

module.exports = router;
