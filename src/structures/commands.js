const colors = require('colors');
const fs = require('fs');
const t = require('../utils/translate');
const config = require('../../config.json');

module.exports = async () => {
    try {
        const files = fs.readdirSync('./src/commands');
        console.log(colors.red(`=== ${t(config.language, 'commands')} ===`));
        files
            .filter((file) => file.endsWith('.js'))
            .forEach((fileName) => {
                const commandName = fileName.slice(0, -3);
                console.log(
                    colors.green('-> ') +
                    ' ' +
                    colors.gray(`${t(config.language, 'command')} ${colors.cyan(commandName)} ${t(config.language, 'activated')}`)
                );
            });
    } catch (error) {
        console.error(error);
    }
};
