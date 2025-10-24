const t = require('./src/utils/translate');
const Discord = require('discord.js'),

    { Client, GatewayIntentBits, ApplicationCommandOptionType, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js'),
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
        failIfNotExists: false,
        retryLimit: 3,
        presence: {
            status: 'online'
        }
    }),
    config = require('./config.json'),
    commandes = require('./src/structures/commands'),
    events = require('./src/structures/events')
    
    if (!config.token || config.token === "TOKENBOT") {
        console.error(`${t(config.language, 'error_no_token')}`);
        process.exit(1);
    }

    if (!config.guild || config.guild === "IDSERVEUR") {
        console.error(`${t(config.language, 'error_no_guild')}`);
        process.exit(1);
    }

    if (!config.roles || config.roles.user === "IDROLE") {
        console.error(`${t(config.language, 'error_no_roles')}`);
        process.exit(1);
    }

    if (!config.channels || config.channels.cfx === "IDSALON") {
        console.error(`${t(config.language, 'error_no_channels')}`);
        process.exit(1);
    }

commandes()
events(client)

module.exports = client
client.on('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return interaction.reply('Error');
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        command.run(client, interaction);
    }
});

client.once('clientReady', () => {
    console.log(`${t(config.language, 'connected_as')} ${client.user.tag}`);
});

client.login(config.token).catch(err => {
    console.error(`${t(config.language, 'connection_error')}`, err);
});

process.on('beforeExit', (code) => { //
  console.error('[antiCrash] :: [beforeExit]');
  console.error(code);
});
process.on('exit', (error) => { //
  console.error('[antiCrash] :: [exit]');
  console.error(error);
});
/* process.on('multipleResolves', (type, promise, reason) => {
  console.error('[antiCrash] :: [multipleResolves]');
  console.error(type, promise, reason);
}); */
process.on('unhandledRejection', (error) => {
    console.error(`${t(config.language, 'unhandled_error')}`, error);
});
process.on('rejectionHandled', (promise) => { //
  console.error('[antiCrash] :: [rejectionHandled]');
  console.error(promise);
})
process.on("uncaughtException", (error) => {
    console.error(`${t(config.language, 'uncaught_exception')}`, error);
    process.exit(1);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error('[antiCrash] :: [uncaughtExceptionMonitor]');
  console.error(err, origin);
});
process.on('warning', (warning) => { //
  console.error('[antiCrash] :: [warning]');
  console.error(warning);
});