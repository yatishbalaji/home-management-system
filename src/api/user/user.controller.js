const _ = require('lodash');
const { ObjectId } = require('mongoose').Types;

const UserModel = require('./user.model');
const { runCommand } = require('../../components/connectSensors');

async function create(req, res, next) {
    try {
        const { email, password, name } = req.body;
        const lEmail = email.toLowerCase();
 
        const count = await UserModel.count({
            email: lEmail,
        });

        if (count) {
            return res.status(412).json({ message: 'User already exists.' });
        }
        
        await UserModel.create({
            email: lEmail,
            password,
            name,
            devices: [],
            device_operations: [],
        });

        return res.sendStatus(201);
    } catch (err) {
        return next(err);
    }
}

async function login(req, res, next) {
    try {
        if (req.method !== 'POST' ||
            !req.is('application/x-www-form-urlencoded')) {
            return res.status(400).json({
                message:
                'Method must be POST with application/x-www-form-urlencoded encoding',
            });
        }

        const { email, password } = req.body;

        const user = await UserModel.findByCredential(email.toLowerCase(), password);

        const token = await user.generateToken();

        return res.json({ token, user: _.pick(user, ['email', 'name'])});
    } catch (err) {
        return next(err);
    }
}

async function index(req, res, next) {
    try {
        const reqUser = req.user;

        const users = await UserModel.findOne({
            _id: reqUser._id
        })
            .select({ devices: 1 });

        return res.json(users);
    } catch (err) {
        return next(err);
    }
}

async function addDevice(req, res, next) {
    try {
        const reqUser = req.user;

        const {
            name, type, state = 'Sync Required',
        } = req.body;

        if (!name || !type) {
            return res.status(412).json({ message: 'Required fields missing' });
        }

        await UserModel.update({
            _id: new ObjectId(reqUser._id),
        }, {
            $push: {
                devices: {
                    _id: new ObjectId(),
                    name, type, state,
                }
            },
        });

        return res.sendStatus(201);
    } catch (err) {
        return next(err);
    }
}

async function commandDevice(req, res, next) {
    try {
        const reqUser = req.user;

        const {
            device_id,
            command
        } = req.body;

        if (!device_id || !command) {
            return res.status(412).json({ message: 'Required fields missing' });
        }

        const deviceId = new ObjectId(device_id);
        const state = await runCommand(deviceId, command);

        await UserModel.updateOne({
            _id: new ObjectId(reqUser._id),
            "devices._id": deviceId,
        }, {
            $push: {
                device_operations: {
                    device_id: deviceId,
                    command,
                },
            },
            $set: {
                "devices.$.state": state
            }
        });

        return res.sendStatus(200);
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    create,
    login,
    index,
    addDevice,
    commandDevice
};
