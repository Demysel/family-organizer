const STORAGE_KEY = 'family-auth';
const PASSWORD_HASH = 'f1f4d6159f8a08a24a42486bc357342f788c4db8e901a98ac20d2705b2642bb2'; // Générer avec la méthode précédente

async function sha256(message) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    } catch (error) {
        console.error('Erreur de hashage:', error);
        throw error;
    }
}

async function login() {
    try {
        const password = document.getElementById('familyPassword').value;
        const hash = await sha256(password);
        
        if (hash !== PASSWORD_HASH) {
            throw new Error('Mot de passe incorrect');
        }
        
        localStorage.setItem(STORAGE_KEY, hash);
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Erreur login:', error);
        alert(error.message);
    }
}

// Vérification automatique au chargement
window.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.endsWith('dashboard.html')) {
        const storedHash = localStorage.getItem(STORAGE_KEY);
        if (storedHash !== PASSWORD_HASH) {
            window.location.href = 'index.html';
        }
    }
});
