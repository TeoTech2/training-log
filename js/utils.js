/**
 * Utility functions for the training logbook application
 */
const Utils = {
    /**
     * Get the current week number
     * @param {Date} date - Date object (defaults to today)
     * @returns {Number} Week number
     */
    getWeekNumber(date = new Date()) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    },
    
    /**
     * Format date to string
     * @param {Date} date - Date object
     * @returns {String} Formatted date string (YYYY-MM-DD)
     */
    formatDate(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },
    
    /**
     * Get color for intensity level
     * @param {String} intensity - Intensity level (I1-I7)
     * @returns {String} CSS variable name
     */
    getIntensityColor(intensity) {
        const colors = {
            'I1': 'var(--i1-color)',
            'I2': 'var(--i2-color)',
            'I3': 'var(--i3-color)',
            'I4': 'var(--i4-color)',
            'I5': 'var(--i5-color)',
            'I6': 'var(--i6-color)',
            'I7': 'var(--i7-color)'
        };
        
        return colors[intensity] || colors['I1'];
    },
    
    /**
     * Get feeling color
     * @param {String} feeling - Feeling (good, average, bad)
     * @returns {String} CSS class name
     */
    getFeelingClass(feeling) {
        const classes = {
            'good': 'feeling-good',
            'average': 'feeling-average',
            'bad': 'feeling-bad'
        };
        
        return classes[feeling] || classes['average'];
    },
    
    /**
     * Get the date range for a week
     * @param {Number} year - Year
     * @param {Number} week - Week number
     * @returns {Object} Object with startDate and endDate
     */
    getWeekDateRange(year, week) {
        const simple = new Date(year, 0, 1 + (week - 1) * 7);
        const dow = simple.getDay();
        const startDate = new Date(simple);
        if (dow <= 4) {
            startDate.setDate(simple.getDate() - simple.getDay() + 1);
        } else {
            startDate.setDate(simple.getDate() + 8 - simple.getDay());
        }
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        return { startDate, endDate };
    },
    
    /**
     * Check if a date is within a week
     * @param {Date} date - Date to check
     * @param {Number} year - Year of week
     * @param {Number} week - Week number
     * @returns {Boolean} True if date is in week
     */
    isDateInWeek(date, year, week) {
        const { startDate, endDate } = this.getWeekDateRange(year, week);
        return date >= startDate && date <= endDate;
    },
    
    /**
     * Parse time string to minutes
     * @param {String} timeStr - Time string (HH:MM)
     * @returns {Number} Minutes
     */
    timeToMinutes(timeStr) {
        if (!timeStr) return 0;
        
        const parts = timeStr.split(':');
        if (parts.length !== 2) return 0;
        
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        
        return (hours * 60) + minutes;
    },
    
    /**
     * Format minutes to time string
     * @param {Number} minutes - Total minutes
     * @returns {String} Formatted time string (HH:MM)
     */
    minutesToTime(minutes) {
        if (!minutes) return '0:00';
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        return `${hours}:${mins.toString().padStart(2, '0')}`;
    }
}; 