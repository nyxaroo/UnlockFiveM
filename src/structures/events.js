const path = require('path');
const colors = require('colors');
const fs = require('fs');
const t = require('../utils/translate');
const config = require('../../config.json');

module.exports = async (client) => {
    try {
        const files = fs.readdirSync('./src/events');
        console.log(colors.red(`=== ${t(config.language, 'events')} ===`));
        files
            .filter((file) => file.endsWith('.js'))
            .forEach((fileName) => {
                const eventName = fileName.slice(0, -3);
                const eventHandler = require(path.join(__dirname, '../events', eventName));
                client.on(eventName, eventHandler.bind(null, client));
                console.log(
                    colors.green('-> ') +
                    ' ' +
                    colors.gray(`${t(config.language, 'event')} ${colors.cyan(eventName)} ${t(config.language, 'activated')}`)
                );
            });
    } catch (error) {
        console.error(error);
    }
};
