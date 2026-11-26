
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const registrarComandos = require('./comandos.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
);

client.once('ready', async () => {
    console.log(`Akashic Bot conectado como ${client.user.tag}!`);
    await registrarComandos();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (!['adm', 'removeradm'].includes(interaction.commandName)) return;

    if (interaction.user.id !== process.env.OWNER_DISCORD_ID) {
        return interaction.reply({
            content: 'Você não tem autorização para utilizar este comando.',
            ephemeral: true
        });
    }

    const usuario = interaction.options.getUser('usuario');

    if (usuario.bot) {
        return interaction.reply({
            content: 'Não é possível conceder acesso administrativo a bots.',
            ephemeral: true
        });
    }

    await interaction.deferReply({ ephemeral: true });

    if (interaction.commandName === 'adm') {
        const { error } = await supabase
            .from('administradores')
            .upsert({
                discord_id: usuario.id,
                autorizado_por: interaction.user.id
            });

        if (error) {
            console.error(error);
            return interaction.editReply('Não foi possível conceder o acesso.');
        }

        return interaction.editReply(
            `O usuário <@${usuario.id}> agora tem acesso ao painel administrativo!`
        );
    }

    if (interaction.commandName === 'removeradm') {
        const { data, error } = await supabase
            .from('administradores')
            .delete()
            .eq('discord_id', usuario.id)
            .select();

        if (error) {
            console.error(error);
            return interaction.editReply('Não foi possível remover o acesso.');
        }

        if (!data.length) {
            return interaction.editReply(
                'Esse usuário não possui acesso administrativo.'
            );
        }

        return interaction.editReply(
            `O acesso administrativo de <@${usuario.id}> foi removido!`
        );
    }
});

client.login(process.env.DISCORD_TOKEN);