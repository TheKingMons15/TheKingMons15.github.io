document.addEventListener("DOMContentLoaded", function() {
    const calendarHeader = document.getElementById("month-year");
    const daysContainer = document.getElementById("days");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const projectForm = document.getElementById("project-form");
    const projectList = document.getElementById("project-list");
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    function renderCalendar(month, year) {
        daysContainer.innerHTML = "";
        calendarHeader.innerText = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            daysContainer.appendChild(emptyDiv);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.innerText = i;
            dayDiv.dataset.date = `${year}-${month + 1}-${i}`;
            dayDiv.classList.add("calendar-day");
            daysContainer.appendChild(dayDiv);
        }
    }

    prevButton.addEventListener("click", function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextButton.addEventListener("click", function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    projectForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const projectName = document.getElementById("project-name").value;
        const dueDate = document.getElementById("due-date").value;
        const projectItem = document.createElement("li");
        projectItem.innerHTML = `<strong>${projectName}</strong> - Fecha de Entrega: ${formatDate(new Date(dueDate))}`;
        projectList.appendChild(projectItem);

        // Mostrar tarea en el calendario
        const dateParts = dueDate.split("T")[0].split("-");
