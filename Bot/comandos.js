
const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const comandos = [
    new SlashCommandBuilder()
        .setName('adm')
        .setDescription('Concede acesso ao painel administrativo.')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Pessoa que receberá acesso.')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('removeradm')
        .setDescription('Remove o acesso ao painel administrativo.')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Pessoa que perderá acesso.')
                .setRequired(true)
        )
].map(comando => comando.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function registrarComandos() {
    try {
        console.log('Registrando comandos do Akashic...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.DISCORD_CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: comandos }
        );

        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
}

module.exports = registrarComandos;
