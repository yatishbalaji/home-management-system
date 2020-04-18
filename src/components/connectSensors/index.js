const logger = require('../../components/logger');
const UserModel = require('../../api/user/user.model');

async function runCommand(deviceId, command) {
    let state = 'Sync In Progress';

    try {
        const findQuery = [
            { $unwind :'$devices'},
            { $match : {'devices._id': deviceId }},
            { $project : { _id:0, type : '$devices.type' } },
        ]
        
        const device = await UserModel.aggregate(findQuery)
        
        if (device.length !== 1) {
            return "Sync Error";
        }

        const type = device[0].type;

        switch(type) {
            case 'Fan': 
                if (command === "ON") {
                    logger.debug("On the Fan");
                } else if (command === "OFF") {
                    logger.debug("Off the Fan");
                } else {
                    logger.debug("Change speed of the Fan");
                }

                state = command;
                break;

            case 'Temperature': 
                state = command;
                break;

            default:
                state = command;
        }
    } catch(err) {
        console.log(err);
        logger.error(err);
    }

    return state;
}

module.exports = {
    runCommand,
}