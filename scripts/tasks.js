async function loadCalendar() {
    const data = await loadData();
    const calendarDiv = document.getElementById('calendarEvents');
    calendarDiv.innerHTML = '';

    data.calendar.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.innerHTML = `
            <strong>${event.date}</strong>: ${event.title}
        `;
        calendarDiv.appendChild(eventElement);
    });
}

async function addEvent() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;

    const data = await loadData();
    data.calendar.push({ title, date });
    await saveData(data);
    loadCalendar();
}

// Charger le calendrier au démarrage
document.addEventListener('DOMContentLoaded', loadCalendar);
