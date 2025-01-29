// Mot de passe familial hashé (utilisez SHA-256 pour le stocker)
const FAMILY_PASSWORD_HASH = "f1f4d6159f8a08a24a42486bc357342f788c4db8e901a98ac20d2705b2642bb2";

async function login() {
    const password = document.getElementById('familyPassword').value;
    const hash = await sha256(password);

    if (hash === FAMILY_PASSWORD_HASH) {
        window.location.href = 'dashboard.html';
    } else {
        alert('Mot de passe incorrect !');
    }
}

// Fonction pour hasher le mot de passe
async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
