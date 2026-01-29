// Mad Hatter Waffles food truck schedule CSV
const scheduleLink =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTStRZ-LbPMrvSERpZWS8-HYj4CYF4L1vXcnf_X8ajOtrCa93xIslvdfKzZGFNzc5oeKHgdEmo-23GF/pub?output=csv";

// Waffle Truck Schedule Calendar
document.addEventListener("DOMContentLoaded", function () {
  const currentDate = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  let locations = [];
  let currentWeekStart = null;

  Papa.parse(scheduleLink, {
    download: true,
    header: true,
    complete: showInfo,
  });

  function newKeyFrom(key) {
    return key.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  function getValueFrom(value) {
    if (typeof value === "string") {
      value = value.trim();
    }
    if (value === undefined || value === null || value === "") {
      return null;
    }
    if (/true|yes/i.test(value)) {
      return true;
    }
    if (/false|no/i.test(value)) {
      return false;
    }
    return value;
  }

  function mapResultsItem(item) {
    const keys = Object.keys(item);
    const mappedItem = {};
    keys.forEach((key) => {
      const newKey = newKeyFrom(key);
      const value = getValueFrom(item[key]);
      if (value) {
        mappedItem[newKey] = value;
      }
    });
    return mappedItem;
  }

  function showInfo(results) {
    const data = results.data;
    locations = data.map(mapResultsItem);
    console.log(locations);
    renderCalendar();
    renderWeekView();
  }

  function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  function renderCalendar() {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Update month display
    document.getElementById(
      "currentMonth"
    ).textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    // Add day headers
    dayNames.forEach((day) => {
      const header = document.createElement("div");
      header.className = "calendar-header";
      header.textContent = day;
      calendar.appendChild(header);
    });

    // Get calendar data
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "calendar-day other-month";
      calendar.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day";

      const dayNumber = document.createElement("div");
      dayNumber.className = "day-number";
      dayNumber.textContent = day;
      dayElement.appendChild(dayNumber);

      // Check if this day is in the past
      const dayDate = new Date(currentYear, currentMonth, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dayDate < today) {
        dayElement.classList.add("past");
      }

      // Add locations for this day
      const dayOfWeek = getDayName(dayDate);
      const locationsForDay = getLocationsForDay(dayOfWeek, dayDate);

      locationsForDay.forEach((locationInfo) => {
        const locationElement = document.createElement("div");
        locationElement.className = "location-item";
        
        // Check if the location is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPast = dayDate < today;
        
        const address = locationInfo.location || "";
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        
        locationElement.innerHTML = `
                    <div class="location-time">${formatTime(
                      locationInfo.startTime
                    )} - ${formatTime(locationInfo.endTime)}</div>
                    <div class="location-name">Mad Hatter Waffles</div>
                    <div class="location-address">
                        <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">${address}</a>
                    </div>
                    ${locationInfo.description ? `<div class="location-description">${locationInfo.description}</div>` : ''}
                `;

        // Add click event for desktop modal (only on desktop and not past)
        if (window.innerWidth > 768 && !isPast) {
          locationElement.style.cursor = "pointer";
          locationElement.addEventListener("click", (e) => {
            // Don't open modal if clicking on the address link
            if (e.target.tagName !== 'A') {
              openModal(locationInfo, dayDate);
            }
          });
        }

        dayElement.appendChild(locationElement);
      });

      calendar.appendChild(dayElement);
    }
  }

  function renderWeekView() {
    // Get current week start (Monday)
    if (!currentWeekStart) {
      currentWeekStart = getMonday(new Date());
    }
    const weekStart = currentWeekStart;

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    document.getElementById("currentWeek").textContent = `${formatDate(
      weekStart
    )} - ${formatDate(weekEnd)}`;

    const weekClasses = document.getElementById("weekClasses");
    weekClasses.innerHTML = "";

    // Get locations for the current week
    const weekLocationsData = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(currentDay.getDate() + i);

      const dayOfWeek = getDayName(currentDay);
      const locationsForDay = getLocationsForDay(dayOfWeek, currentDay);

      locationsForDay.forEach((locationInfo) => {
        weekLocationsData.push({
          ...locationInfo,
          date: new Date(currentDay),
          dayName: dayOfWeek,
        });
      });
    }

    weekLocationsData.forEach((locationInfo) => {
      const locationCard = document.createElement("div");
      locationCard.className = "week-location-card";

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPast = locationInfo.date < today;

      if (isPast) {
        locationCard.classList.add("past");
      }
      
      const address = locationInfo.location || "";
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      
      locationCard.innerHTML = `
                <div class="week-location-day">${locationInfo.dayName}, ${formatDate(
        locationInfo.date
      )}</div>
                <div class="week-location-time">${formatTime(
                  locationInfo.startTime
                )} - ${formatTime(locationInfo.endTime)}</div>
                <div class="week-location-name">Mad Hatter Waffles</div>
                <div class="week-location-address">
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">${address}</a>
                </div>
                ${locationInfo.description ? `<div class="week-location-notes">${locationInfo.description}</div>` : ''}
            `;

      weekClasses.appendChild(locationCard);
    });

    if (weekLocationsData.length === 0) {
      weekClasses.innerHTML =
        '<p style="text-align: center; color: #666; padding: 2rem;">No stops scheduled for this week. Follow us on social media for updates!</p>';
    }
  }

  function compareDates(date1, date2) {
    // Compare two dates without time
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    if (d1.getTime() === d2.getTime()) {
      return true;
    }
    return false;
  }

  function isProduction() {
    // Check if the current environment is production
    return /madhatterwaffles/i.test(window.location.hostname);
  }

  function shouldShowLocation(locationInfo, dayOfWeek, date) {
    if (locationInfo.test && isProduction()) {
      // If the location is marked as test and we're in production then don't show it
      return false;
    }
    
    // Check if specific date is set
    if (locationInfo && locationInfo.date) {
      if (compareDates(locationInfo.date + "T00:00:00", date)) {
        return true;
      }
    }

    // Check if this day matches the "Days of Week" field
    if (locationInfo.daysOfWeek) {
      const daysArray = locationInfo.daysOfWeek.split(',').map(day => day.trim());
      const dayMatch = daysArray.some(day => 
        day.toLowerCase() === dayOfWeek.toLowerCase() ||
        day.toLowerCase() === dayOfWeek.substring(0, 3).toLowerCase()
      );
      
      if (dayMatch) {
        // Only show locations that have started
        if (locationInfo.startDate) {
          const startDate = new Date(locationInfo.startDate);
          startDate.setHours(0, 0, 0, 0);

          const checkDate = new Date(date);
          checkDate.setHours(0, 0, 0, 0);

          if (checkDate >= startDate) {
            if (locationInfo.endDate) {
              const endDate = new Date(locationInfo.endDate);
              endDate.setHours(0, 0, 0, 0);
              if (checkDate > endDate) {
                return false;
              }
            }
            return true;
          }
        }
      }
    }
    return false;
  }

  function getLocationsForDay(dayOfWeek, date) {
    const locationsForDay = [];

    locations.forEach((locationInfo) => {
      if (shouldShowLocation(locationInfo, dayOfWeek, date) === true) {
        locationsForDay.push(locationInfo);
      }
    });

    return locationsForDay;
  }

  function getDayName(date) {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[date.getDay()];
  }

  function formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  function formatDate(date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // Navigation event listeners
  document.getElementById("prevMonth")?.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("nextMonth")?.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Week navigation event listeners
  document.getElementById("prevWeek")?.addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeekView();
  });

  document.getElementById("nextWeek")?.addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeekView();
  });

  // Modal functionality
  function openModal(locationInfo, date) {
    const modal = document.getElementById("locationModal");
    const modalTitle = document.querySelector(".modal-title");
    const modalTime = document.querySelector(".modal-time");
    const modalLocation = document.querySelector(".modal-location");
    const modalAddress = document.querySelector(".modal-address");
    const modalNotes = document.querySelector(".modal-notes");

    const address = locationInfo.location || "";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    // Populate modal content
    modalTitle.textContent = "Mad Hatter Waffles";
    modalTime.textContent = `${getDayName(date)}, ${formatTime(
      locationInfo.startTime
    )} - ${formatTime(locationInfo.endTime)}`;
    modalLocation.textContent = "Food Truck Location";
    modalAddress.innerHTML = `<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">${address}</a>`;
    modalNotes.textContent = locationInfo.description || "Come hungry for delicious waffles!";

    // Show modal
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  function closeModal() {
    const modal = document.getElementById("locationModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling
  }

  // Close modal when clicking the X
  document.querySelector(".modal-close")?.addEventListener("click", closeModal);

  // Close modal when clicking outside
  document.getElementById("locationModal")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Update modal behavior on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      closeModal(); // Close modal if switched to mobile
    }
  });
});