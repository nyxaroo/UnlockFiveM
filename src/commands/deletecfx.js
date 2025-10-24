const Discord = require("discord.js");
const t = require('../utils/translate');
const config = require('../../config.json');

module.exports = {
    name: "deletecfx",
    type: Discord.ApplicationCommandType.ChatInput,
    description: "${t(config.language, 'delete_private_channel')}",
    run: async (client, interaction) => {
        const expectedChannelName = `${t(config.language, 'private')}-${interaction.author.id}`;
        if (interaction.channel.name !== expectedChannelName) {
            return interaction.reply({
                content: `❌ ${t(config.language, 'use_private_channel')}`,
            });
        }

        const embed = new Discord.EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`${t(config.language, 'deleting_private_channel')}`)
            .setDescription(`⚠️ ${t(config.language, 'private_channel_delete_confirm')}`);

        const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("deletecfx_yes")
                .setLabel(`${t(config.language, 'button_yes')}`)
                .setStyle(Discord.ButtonStyle.Danger),
            new Discord.ButtonBuilder()
                .setCustomId("deletecfx_no")
                .setLabel(`${t(config.language, 'button_no')}`)
                .setStyle(Discord.ButtonStyle.Secondary)
        );

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === interaction.author.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        collector.on('collect', async i => {
            if (i.customId === "deletecfx_yes") {
                await i.reply({ content: `${t(config.language, 'private_channel_deleted')}` });
                await interaction.channel.delete(`${t(config.language, 'deleted_success')}`);
            } else if (i.customId === "deletecfx_no") {
                await i.reply({ content: `${t(config.language, 'deleted_cancelled')}` });
            }
            collector.stop();
        });
    }
};
