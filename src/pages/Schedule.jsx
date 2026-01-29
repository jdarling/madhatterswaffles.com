import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';
import dataSources from '../config/dataSources';

const dayNamesShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dayNamesLong = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function camelCaseKey(key) {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function normalizeValue(value) {
  if (typeof value === 'string') {
    value = value.trim();
  }
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (/true|yes/i.test(value)) return true;
  if (/false|no/i.test(value)) return false;
  return value;
}

function mapScheduleRow(row) {
  const mapped = {};
  Object.keys(row || {}).forEach((key) => {
    const newKey = camelCaseKey(key);
    const value = normalizeValue(row[key]);
    if (value !== null) {
      mapped[newKey] = value;
    }
  });
  return mapped;
}

function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = Number.parseInt(hours, 10);
  if (Number.isNaN(hour)) return timeString;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes ?? '00'} ${ampm}`;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function compareDates(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() === d2.getTime();
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function isProductionHost() {
  return /madhatters?waffles/i.test(window.location.hostname);
}

function shouldShowLocation(locationInfo, dayOfWeek, date) {
  if (locationInfo.test && isProductionHost()) {
    return false;
  }

  if (locationInfo.date) {
    if (compareDates(`${locationInfo.date}T00:00:00`, date)) {
      return true;
    }
  }

  if (locationInfo.daysOfWeek) {
    const daysArray = locationInfo.daysOfWeek.split(',').map((day) => day.trim());
    const dayMatch = daysArray.some(
      (day) =>
        day.toLowerCase() === dayOfWeek.toLowerCase() ||
        day.toLowerCase() === dayOfWeek.substring(0, 3).toLowerCase()
    );

    if (dayMatch) {
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

function getLocationsForDay(locations, dayOfWeek, date) {
  return locations.filter((locationInfo) =>
    shouldShowLocation(locationInfo, dayOfWeek, date)
  );
}

function Schedule() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [modalInfo, setModalInfo] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Papa.parse(dataSources.scheduleCsvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!active) return;
        const mapped = (results.data || []).map(mapScheduleRow);
        setLocations(mapped);
        setLoading(false);
      },
      error: (err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load schedule data.');
        setLoading(false);
      },
    });

    return () => {
      active = false;
    };
  }, []);

  const calendarDays = useMemo(() => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i += 1) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(year, month, day));
    }
    return days;
  }, [currentMonth]);

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }, [weekStart]);

  const handleOpenModal = (locationInfo, date) => {
    if (window.innerWidth <= 768) return;
    setModalInfo({ locationInfo, date });
  };

  const handleCloseModal = () => setModalInfo(null);
  const weekCards = weekDays.flatMap((day) => {
    const dayOfWeek = dayNamesLong[day.getDay()];
    const dayLocations = getLocationsForDay(locations, dayOfWeek, day);
    if (dayLocations.length === 0) return [];

    return dayLocations.map((locationInfo, idx) => {
      const address = locationInfo.location || '';
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
      return (
        <div className="week-card" key={`${day.toISOString()}-${idx}`}>
          <p className="week-day">
            {dayNamesShort[(day.getDay() + 6) % 7]}, {formatDate(day)}
          </p>
          <p className="week-time">
            {formatTime(locationInfo.startTime)} - {formatTime(locationInfo.endTime)}
          </p>
          <p className="week-name">Mad Hatter&apos;s Waffles</p>
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            {address}
          </a>
          {locationInfo.description && (
            <p className="week-notes">{locationInfo.description}</p>
          )}
        </div>
      );
    });
  });

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Find Us</h1>
          <p>Track the truck and plan your next waffle stop.</p>
        </div>
      </section>

      <section className="schedule-section">
        <div className="container">
          {loading && <p className="status">Loading schedule...</p>}
          {error && <p className="status error">{error}</p>}

          {!loading && !error && (
            <>
              <div className="calendar-controls">
                <button
                  className="btn outline"
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                    )
                  }
                >
                  Previous
                </button>
                <h2 className="calendar-title">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                  className="btn outline"
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                    )
                  }
                >
                  Next
                </button>
              </div>

              <div className="calendar-grid">
                {dayNamesShort.map((day) => (
                  <div key={day} className="calendar-header">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="calendar-cell muted" />;
                  }
                  const dayOfWeek = dayNamesLong[day.getDay()];
                  const locationsForDay = getLocationsForDay(locations, dayOfWeek, day);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = day < today;

                  return (
                    <div
                      key={day.toISOString()}
                      className={`calendar-cell${isPast ? ' past' : ''}`}
                    >
                      <div className="calendar-date">{day.getDate()}</div>
                      {locationsForDay.map((locationInfo, locationIdx) => {
                        const address = locationInfo.location || '';
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          address
                        )}`;
                        return (
                          <button
                            key={`${day.toISOString()}-${locationIdx}`}
                            type="button"
                            className={`location-chip${isPast ? ' past' : ''}`}
                            onClick={() => handleOpenModal(locationInfo, day)}
                            disabled={isPast}
                          >
                            <span className="location-time">
                              {formatTime(locationInfo.startTime)} -{' '}
                              {formatTime(locationInfo.endTime)}
                            </span>
                            <span className="location-name">Mad Hatter&apos;s Waffles</span>
                            <span className="location-address">
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(event) => event.stopPropagation()}
                              >
                                {address}
                              </a>
                            </span>
                            {locationInfo.description && (
                              <span className="location-notes">{locationInfo.description}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div className="week-view">
                <div className="week-controls">
                  <h3>
                    {formatDate(weekStart)} - {formatDate(weekDays[6])}
                  </h3>
                  <div className="week-buttons">
                    <button
                      className="btn outline"
                      type="button"
                      onClick={() => {
                        const prev = new Date(weekStart);
                        prev.setDate(prev.getDate() - 7);
                        setWeekStart(prev);
                      }}
                    >
                      Previous Week
                    </button>
                    <button
                      className="btn outline"
                      type="button"
                      onClick={() => {
                        const next = new Date(weekStart);
                        next.setDate(next.getDate() + 7);
                        setWeekStart(next);
                      }}
                    >
                      Next Week
                    </button>
                  </div>
                </div>

                <div className="week-cards">
                  {weekCards}
                  {weekCards.length === 0 && (
                    <p className="status">
                      No stops scheduled for this week. Follow us on social media
                      for updates.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {modalInfo && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="modal-card">
            <button className="modal-close" type="button" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Mad Hatter&apos;s Waffles</h2>
            <p className="modal-time">
              {dayNamesLong[modalInfo.date.getDay()]},{' '}
              {formatTime(modalInfo.locationInfo.startTime)} -{' '}
              {formatTime(modalInfo.locationInfo.endTime)}
            </p>
            <p className="modal-location">Food Truck Location</p>
            <p className="modal-address">{modalInfo.locationInfo.location}</p>
            {modalInfo.locationInfo.description && (
              <p className="modal-notes">{modalInfo.locationInfo.description}</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Schedule;
