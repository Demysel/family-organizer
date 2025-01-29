let currentCalendar = null;

async function loadCalendar() {
    try {
        const data = await loadData();
        const calendarEl = document.getElementById('calendar');
        
        if (!calendarEl) {
            console.error("Élément 'calendar' introuvable");
            return;
        }

        // [Le reste du code existant pour FullCalendar...]
        
    } catch (error) {
        console.error("Erreur de chargement du calendrier:", error);
    }
}

  currentCalendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth', // Vue par défaut
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: data.calendar.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      color: event.color
    })),
    editable: true,
    eventClick: (info) => openEditModal(info.event),
    eventDrop: (info) => updateEvent(info.event),
    eventResize: (info) => updateEvent(info.event),
    datesSet: () => document.querySelectorAll('.fc-event').forEach(applyEventColors)
  });

  currentCalendar.render();
}

// Fonction pour appliquer les couleurs
function applyEventColors(eventElement) {
  const event = currentCalendar.getEventById(eventElement.dataset.eventId);
  eventElement.style.backgroundColor = event.extendedProps.color;
}

// Modale d'édition
function openEditModal(event) {
  const newTitle = prompt('Modifier le titre:', event.title);
  const newColor = prompt('Couleur (ex: #FF0000):', event.color || '#3A87AD');

  if (newTitle) {
    event.setProp('title', newTitle);
    event.setProp('color', newColor);
    updateEvent(event);
  }
  
  if (confirm('Supprimer cet événement ?')) {
    event.remove();
    deleteEvent(event.id);
  }
}

async function updateEvent(event) {
  const data = await loadData();
  const index = data.calendar.findIndex(e => e.id === event.id);
  
  data.calendar[index] = {
    id: event.id,
    title: event.title,
    start: event.startStr,
    end: event.endStr,
    color: event.color
  };
  
  await saveData(data);
}

async function deleteEvent(eventId) {
  const data = await loadData();
  data.calendar = data.calendar.filter(e => e.id !== eventId);
  await saveData(data);
  loadCalendar();
}

// Ajout avec couleur
async function addEvent() {
  const title = document.getElementById('eventTitle').value;
  const start = document.getElementById('eventStart').value;
  const end = document.getElementById('eventEnd').value;
  const color = document.getElementById('eventColor').value || '#3A87AD';

  const data = await loadData();
  data.calendar.push({
    id: Date.now().toString(),
    title,
    start,
    end: end || start,
    color
  });
  
  await saveData(data);
  loadCalendar();
}
// Rafraîchissement automatique toutes les 30 secondes
setInterval(() => {
  if (document.getElementById('calendar')) loadCalendar();
}, 30000);
window.loadCalendar = loadCalendar;
window.addEvent = addEvent;
