// scripts/database.js
const API_KEY = '$2a$10$j99ZptquF7iTqI/UP0xQMucBLqWZW/8bTlz859GxEqzmmfq0DpR4.'; // À remplacer par votre clé
const BIN_ID = '679ad82aacd3cb34a8d52eb5'; // À remplacer par votre ID de bin
const API_BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function loadData() {
    try {
        const response = await fetch(`${API_BASE}/latest`, {
            headers: { 
                'X-Master-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${await response.text()}`);
        }
        
        const { record } = await response.json();
        return record;
        
    } catch (error) {
        console.error('Erreur loadData:', error);
        return { calendar: [], tasks: [] }; // Retourne des données vides en cas d'erreur
    }
}

async function saveData(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: { 
                'X-Master-Key': API_KEY,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ ...cache, ...data })
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        return await response.json();
        
    } catch (error) {
        console.error('Erreur saveData:', error);
        throw error;
    }
}

// Export pour les tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadData, saveData };
}
