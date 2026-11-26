import { supabase } from './supabase.js';

const botaoLogin = document.getElementById('loginDiscord');

botaoLogin.addEventListener('click', async () => {
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
