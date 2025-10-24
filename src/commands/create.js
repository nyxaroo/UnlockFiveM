const Discord = require("discord.js");
const t = require('../utils/translate');
const config = require('../../config.json');

module.exports = {
    name: "create",
    type: Discord.ApplicationCommandType.ChatInput,
    description: `${t(config.language, 'create_private_channel')}`,
    run: async (client, interaction) => {
        try {
            const baseCategoryName = `${t(config.language, 'private_channels')}
`;
            let categoryIndex = 1;
            let categoryName = baseCategoryName;
            let category = interaction.guild.channels.cache.find(c => c.type === Discord.ChannelType.GuildCategory && c.name === categoryName);

            while (category && interaction.guild.channels.cache.filter(c => c.parentId === category.id && c.type === Discord.ChannelType.GuildText).size >= 50) {
                categoryIndex++;
                categoryName = `${baseCategoryName}-${categoryIndex}`;
                category = interaction.guild.channels.cache.find(c => c.type === Discord.ChannelType.GuildCategory && c.name === categoryName);
            }
            if (!category) {
                category = await interaction.guild.channels.create({
                    name: categoryName,
                    type: Discord.ChannelType.GuildCategory
                });
            }

            const channelName = `${t(config.language, 'private')}-${interaction.author.id}`;
            const existing = interaction.guild.channels.cache.find(c => c.parentId === category.id && c.name === channelName);
            if (existing) {
                interaction.reply({ content: `❌ ${t(config.language, 'already_have_private_channel')}`, ephemeral: true });
                return;
            }

            const privateChannel = await interaction.guild.channels.create({
                name: channelName,
                type: Discord.ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [Discord.PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.author.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    },
                    {
                        id: client.user.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    }
                ]
            });

            const embed = new Discord.EmbedBuilder()
                .setColor("#5865F2")
                .setTitle(`${t(config.language, 'welcome_private_channel')}`)
                .setDescription(
                    `${t(config.language, 'welcome')} <@${interaction.author.id}> !\n\n` +
                    `${t(config.language, 'check_instructions')} <#1395050438436323429>.\n\n` +
                    `${t(config.language, 'close_ticket_instruction')}`
                )
                .setFooter({ text: "by S4NA DEV & Nyxaro" });

            const row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("deletecfx_btn")
                    .setLabel(`${t(config.language, 'close_channel')}`)
                    .setStyle(Discord.ButtonStyle.Danger)
            );

            await privateChannel.send({ embeds: [embed], components: [row] });

            const filter = i => i.customId === "deletecfx_btn" && i.user.id === interaction.author.id;
            const collector = privateChannel.createMessageComponentCollector({ filter, time: 3600 * 1000 });
            collector.on('collect', async i => {
                await i.reply({ content: `${t(config.language, 'channel_deleted')}` });
                await privateChannel.delete(`${t(config.language, 'deletion_requested_button')}`);
                collector.stop();
            });

            try { await interaction.delete(); } catch (e) {}

            setTimeout(() => {
                privateChannel.delete(`${t(config.language, 'auto_private_channel_deletion')}`);
            }, 60 * 60 * 1000);
        } catch (error) {
            console.error(error);
            interaction.reply(`${t(config.language, 'error_creating_private_channel')}`);
        }
    }
};
