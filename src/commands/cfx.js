const Discord = require("discord.js");
const config = require("../../config.json");
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ps = require('ps-node');
const t = require('../utils/translate');
var dis = false

const FOLDER_FILE = path.join(__dirname, '../../cfx/resources/dumpresource');
const FOLDER_KEY = path.join(__dirname, '../../cfx');
const director_decrypt = "C:\\turboh\\decrypt.lua"
const director_decrypt2 = "C:\\turboh\\turboh.luac"

module.exports = {
    name: "cfx",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.roles.cache.has(config.roles.user)) {
            const embed = new Discord.EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`${t(config.language, 'permission_denied')}`)
                .setDescription(`❌ ${t(config.language, 'no_permission_command')}`);
            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        try {

            if(dis===true){
                const embed = new Discord.EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`${t(config.language, 'decrypting_in_progress')}`)
                    .setDescription(`❌ ${t(config.language, 'bot_already_decrypting')}`);
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            try { await interaction.delete(); } catch (e) {}

            const pre = config.prefix+"cfx ";
            const key = interaction.content.slice(pre.length).trim();
            if (!key) {
                const embed = new Discord.EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`${t(config.language, 'missing_key')}`)
                    .setDescription(`❌ ${t(config.language, 'missing_keymaster_key')}`);
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            const fxapAttachment = interaction.attachments.find(att => att.name.endsWith('fxap'));
            const luaAttachment = interaction.attachments.find(att => att.name.endsWith('.lua'));
            if (!fxapAttachment || !luaAttachment) {
                const embed = new Discord.EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`${t(config.language, 'missing_attachments')}`)
                    .setDescription(`❌ ${t(config.language, 'need_file_attachments')}`);
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            const { default: fetch } = await import('node-fetch');

            dis = true;
            const fxapFilePath = path.join(FOLDER_FILE, ".fxap");
            const fxapResponse = await fetch(fxapAttachment.url);
            const fxapBuffer = await fxapResponse.arrayBuffer();
            const buffer = Buffer.from(fxapBuffer);
            fs.writeFileSync(fxapFilePath, buffer);

            const luaFilePath = path.join(FOLDER_FILE, "server.lua");
            const luaResponse = await fetch(luaAttachment.url);
            const luaBuffer = await luaResponse.arrayBuffer();
            const buffer2 = Buffer.from(luaBuffer);
            fs.writeFileSync(luaFilePath, buffer2);

            const cfg = `
            endpoint_add_tcp "0.0.0.0:30120"
            endpoint_add_udp "0.0.0.0:30120"
            sv_scriptHookAllowed 0
            sv_enforceGameBuild 2699
            sv_maxclients 1
            sv_hostname "Nyxaro" 
            sets sv_projectName "Nyxaro" 
            sets sv_projectDesc "Nyxaro" 
            set steam_webApiKey "none"
            sv_licenseKey "${key}"
            ensure dumpresource
            `
            const serverCfgFilePath = path.join(FOLDER_KEY, 'server.cfg');
            fs.writeFileSync(serverCfgFilePath, cfg);

            const embed = new Discord.EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`${t(config.language, 'decrypting_in_progress')}`)
                .setDescription(`💥 ${t(config.language, 'decrypting_please_wait')}\n\n⚠️ **${t(config.language, 'enable_private_messages_warning')}**`);
            interaction.reply({ embeds: [embed], ephemeral: false });

            function terminaProcessoFxServer() {
                return new Promise((resolve, reject) => {
                    ps.lookup({ command: 'FxServer.exe' }, (err, processi) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        if (processi.length > 0) {
                            exec(`taskkill /F /T /PID ${processi[0].pid}`, (error, stdout, stderr) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve();
                                }
                            });
                        } else {
                            resolve();
                        }
                    });
                });
            }

            async function eseguiCodice(cmd, directory) {
                await terminaProcessoFxServer();
                new Promise((resolve, reject) => {
                    const processo = exec(cmd, { cwd: directory }, (error, stdout, stderr) => {
                        if (error) {
                        } else {
                        }
                    });
                });
                return setTimeout(async () => { await eseguiCodice2(comando2, directory2); }, 3000);
            }

            function eliminaFile(percorsoFile) {
                return new Promise((resolve, reject) => {
                    fs.unlink(percorsoFile, (errore) => {
                        if (errore) {
                            reject(errore);
                        } else {
                            resolve();
                        }
                    });
                });
            }

            async function inviaMessaggioPrivatoConFile(userId, fileDirectory) {
                try {
                    const tempFile = fileDirectory.replace(/\.lua$/, '') + `_${userId}_${Date.now()}.lua`;
                    fs.copyFileSync(fileDirectory, tempFile);

                    const user = await client.users.fetch(userId);
                    const file = fs.readFileSync(tempFile);
                    await user.send({ files: [{ attachment: file, name: 's4naunlock.lua' }] });
                    await user.send(`✅ ${t(config.language, 'file_ready_clean_with_chatgpt')}\n\n${t(config.language, 'example_message_for_chatgpt')}\n\`\`\`${t(config.language, 'clean_lua_request_example')}\`\`\``);

                    eliminaFile(tempFile)
                        .then(() => { console.log(`❌ ${t(config.language, 'file_deleted_success')}`, tempFile); })
                        .catch((errore) => { console.error(`❌ ${t(config.language, 'file_delete_error')}`, errore); });
                    dis = false;
                } catch (error) {
                    console.error(`❌ ${t(config.language, 'private_message_send_error')}`, error);
                }
            }

            async function eseguiCodice2(cmd, directory) {
                new Promise((resolve, reject) => {
                    const processo = exec(cmd, { cwd: directory }, (error, stdout, stderr) => {
                        if (error) {
                        } else {
                        }
                    });
                });
                return setTimeout(async () => { await inviaMessaggioPrivatoConFile(interaction.author.id, director_decrypt); }, 2500);
            }

            const directory = 'C:\\UnlockFiveM\\cfx';
            const comando = 'server\\FxServer.exe +exec server.cfg';
            const directory2 = 'C:\\turboh';
            const comando2 = 'java -jar unluac54.jar turboh.luac > decrypt.lua';
            eseguiCodice(comando, directory);

        } catch (error) {
            console.error(error);
            interaction.reply(`${t(config.language, 'command_execution_error')}`);
        }
    }
};
