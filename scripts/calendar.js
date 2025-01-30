document.addEventListener('DOMContentLoaded', () => {
    let calendar = null;
    const CALENDAR_ID = 'family-calendar';

    // Initialisation
    async function initCalendar() {
        try {
            const data = await loadData();
            setupCalendar(data.calendar || []);
            setupEventHandlers();
        } catch (error) {
            console.error('Erreur initialisation calendrier:', error);
        }
    }

    // Configuration du calendrier
    function setupCalendar(events) {
        const container = document.getElementById('calendar');
        if (!container) return;

        calendar = new tui.Calendar(container, {
            defaultView: 'month',
            useFormPopup: false,
            calendars: [{
                id: CALENDAR_ID,
                name: 'Famille',
                color: '#fff',
                bgColor: '#4CAF50'
            }]
        });

        const convertedEvents = events.map(event => ({
            id: event.id,
            calendarId: CALENDAR_ID,
            title: event.title,
            start: event.start,
            end: event.end,
            color: event.color,
            category: 'time'
        }));

        calendar.createEvents(convertedEvents);
    }

    // Gestion des événements
    function setupEventHandlers() {
        // Ajout d'événement via formulaire
        window.addEvent = async () => {
            const title = document.getElementById('eventTitle').value.trim();
            const start = document.getElementById('eventStart').value;
            const end = document.getElementById('eventEnd').value;
            const color = document.getElementById('eventColor').value;

            if (!title || !start) {
                alert('Titre et date de début requis !');
                return;
            }

            const newEvent = {
                id: Date.now().toString(),
                calendarId: CALENDAR_ID,
                title,
                start: new Date(start),
                end: end ? new Date(end) : null,
                color,
                category: 'time'
            };

            calendar.createEvents([newEvent]);
            await saveCalendarData();
        };

        // Mise à jour des événements
        calendar.on('beforeUpdateEvent', async ({ event, changes }) => {
            Object.assign(event, changes);
            await saveCalendarData();
        });

        // Suppression d'événement
        calendar.on('beforeDeleteEvent', async event => {
            calendar.deleteEvent(event.id, event.calendarId);
            await saveCalendarData();
        });
    }

    // Sauvegarde des données
    async function saveCalendarData() {
        const events = calendar.getEvents().map(event => ({
            id: event.id,
            title: event.title,
            start: event.start.toISOString(),
            end: event.end?.toISOString() || null,
            color: event.color
        }));

        await saveData({ calendar: events });
    }

   window.initCalendar = async () => {
    try {
        const data = await loadData();
        setupCalendar(data.calendar || []);
        setupEventHandlers();
    } catch (error) {
        console.error('Erreur initCalendar:', error);
    }
};
