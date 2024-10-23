import { useState } from 'react';
import { useSelector } from 'react-redux';


function Copy({ onDateChange }) {
  // State to store the selected date, current month, and year
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const events = useSelector((state) => state.event);

  // Handle the date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const eventDates = events.map((event) => new Date(event.date));

  const handleDateClick = (newDate) => {
    onDateChange(newDate); // Call the parent function to update the date
  };

  // Function to go to the previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11); // December
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Function to go to the next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); // January
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate the days dynamically
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get total days in the current month and year

  // Disable past dates before today's date
  const minDate = new Date(); // Today's date
  const minDay = minDate.getDate(); // Get today's day of the month

  // Logic to determine past dates based on the requirements
  const isPastDate = (currentDay) => {
    const isSameYear = currentDay.getFullYear() === minDate.getFullYear();
    const isSameMonth = currentDay.getMonth() === minDate.getMonth();
    const isSameDate = currentDay.getDate() === minDate.getDate();

    // Mark as past date if it's before the current month of the current year or
    // if it's today's date in previous months of the current year.
    return (currentDay < minDate && !isSameDate) || (isSameYear && !isSameMonth);
  };

  return (
    <div className="react-calendar" style={{ backgroundColor: '#3b3a3a' }}>
      <div className="react-calendar__navigation" style={{ backgroundColor: '' }}>
        <button
          aria-label="Prev Month"
          className="react-calendar__navigation__arrow react-calendar__navigation__prev2-button"
          onClick={goToPreviousMonth}
          type="button"
          style={{ backgroundColor: 'transparent' }}
        >
          «
        </button>
        <button
          aria-label="Prev"
          className="react-calendar__navigation__arrow react-calendar__navigation__prev-button"
          onClick={goToPreviousMonth}
          type="button"
          style={{ backgroundColor: 'transparent' }}
        >
          ‹
        </button>
        <button
          aria-label="Current Month"
          className="react-calendar__navigation__label"
          type="button"
          style={{ flexGrow: 1, backgroundColor: 'transparent' }}
        >
          <span
            className="react-calendar__navigation__label__labelText react-calendar__navigation__label__labelText--from"
            style={{ backgroundColor: 'transparent' }}
          >
            {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
          </span>
        </button>
        <button
          aria-label="Next"
          className="react-calendar__navigation__arrow react-calendar__navigation__next-button"
          onClick={goToNextMonth}
          type="button"
        >
          ›
        </button>
        <button
          aria-label="Next Month"
          className="react-calendar__navigation__arrow react-calendar__navigation__next2-button"
          onClick={goToNextMonth}
          type="button"
        >
          »
        </button>
      </div>
      <div className="react-calendar__viewContainer">
        <div className="react-calendar__month-view">
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ flexGrow: 1, width: '100%' }}>
              <div
                className="react-calendar__month-view__weekdays"
                style={{ display: 'flex', flexWrap: 'nowrap' }}
              >
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div
                    key={index}
                    className={`react-calendar__month-view__weekdays__weekday ${
                      day === 'Sat' || day === 'Sun'
                        ? 'react-calendar__month-view__weekdays__weekday--weekend'
                        : ''
                    }`}
                    style={{
                      flex: '0 0 14.2857%',
                      overflow: 'hidden',
                      marginInlineEnd: '0px',
                    }}
                  >
                    <abbr title={day} style={{ textDecoration: 'none' }}>
                      {day}
                    </abbr>
                  </div>
                ))}
              </div>
              <div
                className="react-calendar__month-view__days"
                style={{ display: 'flex', flexWrap: 'wrap' }}
              >
                {[...Array(daysInMonth)].map((_, day) => {
                  const dayNumber = day + 1;
                  const currentDay = new Date(currentYear, currentMonth, dayNumber);
                  const pastDate = isPastDate(currentDay);
                  const isSelected =
                    selectedDate.getDate() === dayNumber &&
                    selectedDate.getMonth() === currentMonth &&
                    selectedDate.getFullYear() === currentYear;
                  const isEventDate = eventDates.some(
                    (eventDate) =>
                      eventDate.getDate() === currentDay.getDate() &&
                      eventDate.getMonth() === currentDay.getMonth() &&
                      eventDate.getFullYear() === currentDay.getFullYear()
                  );

                  return (
                    <button
                      key={day}
                      className={`react-calendar__tile react-calendar__month-view__days__day ${
                        isSelected ? 'selected' : ''
                      }`}
                      disabled={pastDate}
                      type="button"
                      style={{
                        flex: '0 0 14.2857%',
                        overflow: 'hidden',
                        marginInlineEnd: '0px',
                        backgroundColor: isSelected
                          ? 'royalblue'
                          : isEventDate
                          ? '#4F7942'
                          : pastDate
                          ? '#3b3a3a'
                          : '',
                      }}
                      onClick={() => {
                        handleDateChange(currentDay);
                        handleDateClick(currentDay);
                      }}
                    >
                      <abbr
                        aria-label={`${dayNumber} ${new Date(currentYear, currentMonth).toLocaleString(
                          'default',
                          { month: 'long' }
                        )} ${currentYear}`}
                        style={{ backgroundColor: 'transparent', color: 'white' }}
                      >
                        {dayNumber}
                      </abbr>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Copy;
