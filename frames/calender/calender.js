// script.js
document.addEventListener('DOMContentLoaded', function () {
    const calendarDays = document.getElementById('calendar-days');
    const monthYear = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const eventSidebar = document.getElementById('event-sidebar');
    const eventList = document.getElementById('event-list');
    const eventForm = document.getElementById('event-form');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const saveEventsBtn = document.getElementById('save-events');
    const calendarIcon = document.getElementById('calendar-icon');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let events = {};

    function renderCalendar(month, year) {
        calendarDays.innerHTML = '';
        monthYear.innerText = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

        const firstDay = new Date(year, month).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create empty cells for days before the start of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty-cell');
            calendarDays.appendChild(emptyCell);
        }

        // Create cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.innerText = day;
            const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dayCell.dataset.date = formattedDate;

            if (events[formattedDate]) {
                dayCell.classList.add('event-day');
                events[formattedDate].forEach(event => {
                    const eventSpan = document.createElement('span');
                    eventSpan.innerText = event;
                    dayCell.appendChild(eventSpan);
                });
            }

            dayCell.addEventListener('click', function () {
                eventDateInput.value = dayCell.dataset.date;
                openSidebar(dayCell.dataset.date);
            });

            calendarDays.appendChild(dayCell);
        }
    }

    function openSidebar(date) {
        eventSidebar.classList.add('open');
        renderEventList(date);
    }

    function renderEventList(date) {
        eventList.innerHTML = '';
        if (events[date]) {
            events[date].forEach((event, index) => {
                const eventDiv = document.createElement('div');
                const eventText = document.createElement('span');
                const deleteButton = document.createElement('button');

                eventText.innerText = event;
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', function () {
                    deleteEvent(date, index);
                });

                eventDiv.appendChild(eventText);
                eventDiv.appendChild(deleteButton);
                eventList.appendChild(eventDiv);
            });
        }
    }

    function deleteEvent(date, index) {
        events[date].splice(index, 1);
        if (events[date].length === 0) {
            delete events[date];
        }
        renderCalendar(currentMonth, currentYear);
        renderEventList(date);
    }

    prevMonthBtn.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    saveEventsBtn.addEventListener('click', function () {
        eventSidebar.classList.remove('open');
    });

    eventForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const date = eventDateInput.value;
        const title = eventTitleInput.value;

        if (date && title) {
            if (!events[date]) {
                events[date] = [];
            }
            events[date].push(title);
            renderCalendar(currentMonth, currentYear);
            renderEventList(date);
            eventForm.reset();
        }
    });

    // Initialize Flatpickr
    flatpickr("#calendar-icon", {
        onChange: function (selectedDates) {
            const date = selectedDates[0];
            currentMonth = date.getMonth();
            currentYear = date.getFullYear();
            renderCalendar(currentMonth, currentYear);
        }
    });

    renderCalendar(currentMonth, currentYear);
});
