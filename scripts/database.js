const API_KEY = '$2a$10$j99ZptquF7iTqI/UP0xQMucBLqWZW/8bTlz859GxEqzmmfq0DpR4.'; // Remplacez par votre clé
const BIN_ID = '679a37b5e41b4d34e480b1be'; // Remplacez par votre ID de bin

// Charger les données
async function loadData() {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });
    const data = await response.json();
    return data.record; // Retourne les données de la famille
}

// Sauvegarder les données
async function saveData(data) {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'X-Master-Key': API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}
