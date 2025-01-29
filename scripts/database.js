const API_KEY = '$2a$10$j99ZptquF7iTqI/UP0xQMucBLqWZW/8bTlz859GxEqzmmfq0DpR4.'; // Remplacez par votre clé
const BIN_ID = '679a37b5e41b4d34e480b1be//';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let cache = {
    calendar: [],
    tasks: [],
    photos: [],
    location: {}
};

async function loadData() {
    try {
        const response = await fetch(`${API_URL}/latest`, {
            headers: { 
                'X-Master-Key': API_KEY,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const { record } = await response.json();
        cache = { ...cache, ...record };
        return cache;
        
    } catch (error) {
        console.error('Erreur loadData:', error);
        return cache; // Retour cache offline
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
