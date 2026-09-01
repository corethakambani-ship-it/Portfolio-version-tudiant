document.addEventListener('DOMContentLoaded', function () {
    const monthYear = document.getElementById('month-year');
    const daysContainer = document.getElementById('days');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const nextPeriodInfo = document.getElementById('next-period-info');

    if (!monthYear || !daysContainer || !prevBtn || !nextBtn) {
        return;
    }

    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const today = new Date();
    let currentDate = new Date();
    let lastPeriodDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
    let cycleLength = 28;
    let periodDuration = 5;

    function parseDate(value) {
        if (!value) return null;
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return isNaN(date.getTime()) ? null : date;
    }

    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function loadSettingsFromUrl() {
        const parsedLastPeriod = parseDate(getQueryParam('dernierePeriode'));
        if (parsedLastPeriod) {
            lastPeriodDate = parsedLastPeriod;
        }

        const parsedCycleLength = Number(getQueryParam('duree'));
        if (!Number.isNaN(parsedCycleLength) && parsedCycleLength >= 21 && parsedCycleLength <= 40) {
            cycleLength = parsedCycleLength;
        }

        const parsedPeriodDuration = Number(getQueryParam('dernierJour'));
        if (!Number.isNaN(parsedPeriodDuration) && parsedPeriodDuration >= 2 && parsedPeriodDuration <= 10) {
            periodDuration = parsedPeriodDuration;
        }
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function isSameDay(a, b) {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    function isBetween(date, start, end) {
        return date >= start && date <= end;
    }

    function getPredictedStarts(startDate, length, endDate) {
        const dates = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + length);
        }

        return dates;
    }

    function formatDateFr(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}/${date.getFullYear()}`;
    }

    function getNextPredictedStart(referenceDate) {
        const endDate = addDays(referenceDate, cycleLength * 3);
        const starts = getPredictedStarts(lastPeriodDate, cycleLength, endDate);
        return starts.find((date) => date > referenceDate) || null;
    }

    function updateNextPeriodInfo() {
        if (!nextPeriodInfo) return;
        const nextDate = getNextPredictedStart(today);
        nextPeriodInfo.textContent = nextDate ? `Prochaine période prévue : ${formatDateFr(nextDate)}` : '';
    }

    function createPeriodData(periodStarts) {
        return periodStarts.map((start) => ({
            start,
            periodEnd: addDays(start, periodDuration - 1),
            ovulationDay: addDays(start, Math.round(cycleLength / 2) - 1),
            fertileStart: addDays(start, Math.round(cycleLength / 2) - 4),
            fertileEnd: addDays(start, Math.round(cycleLength / 2) + 1),
        }));
    }

    function setCellStyle(cell, bgColor, textColor, title) {
        cell.style.backgroundColor = bgColor;
        cell.style.color = textColor;
        cell.title = title;
    }

    function createDayCell(dayDate, periodData) {
        const cell = document.createElement('div');
        cell.classList.add('day-cell');
        cell.textContent = dayDate.getDate();

        if (isSameDay(dayDate, today)) {
            cell.classList.add('today');
        }

        const period = periodData.find((data) => isBetween(dayDate, data.start, data.periodEnd));
        if (period) {
            setCellStyle(cell, '#f7a8c9', '#ffffff', 'Jour de règles');
            return cell;
        }

        const hasOvulation = periodData.some((data) => isSameDay(dayDate, data.ovulationDay));
        if (hasOvulation) {
            setCellStyle(cell, '#6fa8ff', '#ffffff', "Jour probable d'ovulation");
            return cell;
        }

        const isFertile = periodData.some((data) => isBetween(dayDate, data.fertileStart, data.fertileEnd));
        if (isFertile) {
            setCellStyle(cell, '#6ee07a', '#ffffff', 'Période fertile');
        }

        return cell;
    }

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstWeekDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthYear.textContent = `${months[month]} ${year}`;
        daysContainer.innerHTML = '';

        const monthEnd = new Date(year, month, daysInMonth);
        const predictionEnd = addDays(monthEnd, cycleLength * 2);
        const periodStarts = getPredictedStarts(lastPeriodDate, cycleLength, predictionEnd);
        const periodData = createPeriodData(periodStarts);

        for (let i = 0; i < firstWeekDay; i += 1) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-empty');
            daysContainer.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const dayDate = new Date(year, month, day);
            daysContainer.appendChild(createDayCell(dayDate, periodData));
        }

        updateNextPeriodInfo();
    }

    function changeMonth(offset) {
        currentDate.setMonth(currentDate.getMonth() + offset);
        renderCalendar(currentDate);
    }

    loadSettingsFromUrl();
    prevBtn.addEventListener('click', () => changeMonth(-1));
    nextBtn.addEventListener('click', () => changeMonth(1));
    renderCalendar(currentDate);
});