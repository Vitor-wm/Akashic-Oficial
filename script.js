async function loginDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord'
    });

    if (error) {
        console.error('Erro ao entrar:', error.message);
    }
}