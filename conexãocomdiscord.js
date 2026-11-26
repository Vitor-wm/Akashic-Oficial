
import { supabase } from './supabase.js';

const botaoLogin = document.getElementById('loginDiscord');
const botaoSair = document.getElementById('sairConta');

function atualizarBotoes(session) {
    if (botaoLogin) botaoLogin.hidden = !!session;
    if (botaoSair) botaoSair.hidden = !session;

    const botaoPainel = document.getElementById('botaoPainel');

    if (!session && botaoPainel) {
        botaoPainel.hidden = true;
    }
}

botaoLogin?.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: window.location.origin
        }
    });

    if (error) {
        alert('Não foi possível entrar com Discord: ' + error.message);
    }
});

async function verificarUsuario() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Erro ao verificar sessão:', error.message);
        return;
    }

    atualizarBotoes(session);

    if (!session) {
        console.log('Nenhum usuário conectado.');
        document.body.classList.remove('usuario-admin');
        return;
    }

    const usuario = session.user;
    const metadata = usuario.user_metadata;

    console.log('Usuário conectado!');
    console.log('ID do Discord:', metadata.provider_id);
    console.log('Nome:', metadata.full_name || metadata.name);
    console.log('Avatar:', metadata.avatar_url);
    console.log('E-mail:', usuario.email);

    const { data: administrador, error: erroAdmin } =
        await supabase.rpc('is_admin');

    if (erroAdmin) {
        console.error('Erro ao verificar administrador:', erroAdmin);
        return;
    }

    if (administrador) {
        console.log('Acesso administrativo autorizado!');
        document.body.classList.add('usuario-admin');
        document.getElementById('botaoPainel').hidden = false;
    } else {
        console.log('Usuário sem acesso administrativo.');
        document.body.classList.remove('usuario-admin');
    }
}

verificarUsuario();

supabase.auth.onAuthStateChange((event, session) => {
    console.log('Evento de autenticação:', event);

    atualizarBotoes(session);

    if (session) {
        console.log('Sessão ativa para:', session.user.user_metadata.full_name);
    } else {
        document.body.classList.remove('usuario-admin');
    }
});

async function sairDaConta() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Erro ao sair:', error.message);
        return;
    }

    console.log('Usuário desconectado!');
}

botaoSair?.addEventListener('click', sairDaConta);

window.sairDaConta = sairDaConta;