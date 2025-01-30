document.addEventListener('DOMContentLoaded', () => {
    // Utilisation directe de l'objet global FullCalendar
    const { Calendar, dayGridPlugin, timeGridPlugin, interactionPlugin } = FullCalendar;
    
    let calendarInstance = null;

    async function loadCalendar() {
        try {
            const data = await loadData();
            renderCalendar(data?.calendar || []);
        } catch (error) {
            console.error('Erreur loadCalendar:', error);
        }
    }

    function renderCalendar(events) {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;

        if (calendarInstance) calendarInstance.destroy();

        calendarInstance = new Calendar(calendarEl, {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Plugins corrects
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: events.map(event => ({
                title: event.title,
                start: event.start,
                end: event.end,
                color: event.color
            })),
            editable: true
        });

        calendarInstance.render();
    }


    window.loadCalendar = loadCalendar;
    loadCalendar();

    async function addEvent() {
        try {
            const title = document.getElementById('eventTitle').value.trim();
            const start = document.getElementById('eventStart').value.trim();
            const end = document.getElementById('eventEnd').value.trim();
            const color = document.getElementById('eventColor').value.trim();

            if (!title || !start) {
                alert('Le titre et la date de début sont obligatoires.');
                return;
            }

            const event = {
                id: Date.now().toString(),
                title,
                start,
                end: end || null,
                color: color || '#3788d8'
            };

            const data = await loadData();
            data.calendar = data.calendar || [];
            data.calendar.push(event);
            await saveData(data);
            renderCalendar(data.calendar);
        } catch (error) {
            console.error('Erreur addEvent:', error);
        }
    }

    async function handleEventUpdate(info) {
        try {
            const data = await loadData();
            const index = data.calendar.findIndex(e => e.id === info.event.id);
            if (index !== -1) {
                data.calendar[index] = {
                    ...data.calendar[index],
                    start: info.event.startStr,
                    end: info.event.endStr
                };
                await saveData(data);
            }
        } catch (error) {
            console.error('Erreur updateEvent:', error);
        }
    }

    async function handleEventClick(info) {
        try {
            const newTitle = prompt('Nouveau titre:', info.event.title);
            if (newTitle) {
                const data = await loadData();
                const index = data.calendar.findIndex(e => e.id === info.event.id);
                if (index !== -1) {
                    data.calendar[index].title = newTitle;
                    await saveData(data);
                    renderCalendar(data.calendar);
                }
            }
        } catch (error) {
            console.error('Erreur handleEventClick:', error);
        }
    }

    // Rendre `addEvent` accessible globalement
    window.addEvent = addEvent;
});
