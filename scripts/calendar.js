const { Calendar, interactionPlugin, dayGridPlugin, timeGridPlugin } = FullCalendar;

let calendarInstance = null;

function initCalendar() {
    window.addEvent = addEvent;
}

async function loadCalendar() {
    try {
        const data = await loadData();
        if (!data || !data.calendar) {
            throw new Error("Invalid data format");
        }
        renderCalendar(data.calendar);
    } catch (error) {
        console.error('Erreur loadCalendar:', error);
    }
}

function renderCalendar(events) {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    if (calendarInstance) calendarInstance.destroy();

    calendarInstance = new Calendar(calendarEl, {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: events,
        editable: true,
        eventClick: handleEventClick,
        eventDrop: handleEventUpdate,
        eventResize: handleEventUpdate
    });

    calendarInstance.render();
}

async function addEvent() {
    try {
        const event = {
            id: Date.now().toString(),
            title: document.getElementById('eventTitle').value,
            start: document.getElementById('eventStart').value,
            end: document.getElementById('eventEnd').value,
            color: document.getElementById('eventColor').value
        };

        const data = await loadData();
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
        data.calendar[index] = {
            ...data.calendar[index],
            start: info.event.startStr,
            end: info.event.endStr
        };
        await saveData(data);
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
            data.calendar[index].title = newTitle;
            await saveData(data);
            renderCalendar(data.calendar);
        }
    } catch (error) {
        console.error('Erreur handleEventClick:', error);
    }
}

initCalendar();
