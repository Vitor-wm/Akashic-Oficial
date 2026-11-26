
import { supabase } from './supabase.js';

async function protegerPainel() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        window.location.replace('index.html');
        return;
    }

    const { data: administrador, error: erroAdmin } =
        await supabase.rpc('is_admin');

    if (erroAdmin) {
        console.error('Erro ao verificar permissões:', erroAdmin);
        window.location.replace('index.html');
        return;
    }

    if (!administrador) {
        window.location.replace('index.html');
        return;
    }

    const metadata = session.user.user_metadata;

    document.getElementById('nomeAdmin').textContent =
        metadata.global_name || metadata.full_name || metadata.name || 'Administrador';

    console.log('Painel administrativo autorizado!');
}

document.getElementById('voltarSite').addEventListener('click', () => {
    window.location.href = 'index.html';
});

protegerPainel();
