/**
 * Main application logic
 */
const App = {
    // Store currently edited activity ID
    currentEditId: null,
    
    // Store activities data
    activities: [],
    
    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.loadActivities();
        this.setupModal();
        this.setupCharts();
    },
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // New activity button
        document.getElementById('new-activity-btn').addEventListener('click', () => {
            this.openModal();
        });
        
        // Export data button
        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });
        
        // Import data button
        document.getElementById('import-data-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        
        // Import file change
        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });
        
        // Save notes button
        document.getElementById('save-notes-btn').addEventListener('click', () => {
            this.saveNotes();
        });
        
        // Show trends button
        document.getElementById('show-trends-btn').addEventListener('click', function(e) {
            console.log('Trends button clicked');
            const trendsModal = document.getElementById('trends-modal');
            if (trendsModal) {
                trendsModal.style.display = 'block';
            } else {
                console.error('Trends modal not found');
            }
        });
        
        // Form submission
        document.getElementById('activity-form').addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Cancel button
        document.getElementById('cancel-activity').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Rating selector
        const ratingOptions = document.querySelectorAll('.rating-option');
        ratingOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const value = e.target.dataset.value;
                document.getElementById('activity-rating').value = value;
                
                // Update selected class
                ratingOptions.forEach(opt => opt.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });
        
        // Week notes saving
        document.getElementById('week-notes').addEventListener('change', (e) => {
            localStorage.setItem('week_notes', e.target.value);
        });
        
        // Clear data button
        document.getElementById('clear-data-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all training data? This cannot be undone!')) {
                Storage.clearAllActivities();
                localStorage.removeItem('week_notes');
                this.loadActivities();
                alert('All data has been cleared!');
            }
        });
        
        // Reload data button
        document.getElementById('reload-data-btn').addEventListener('click', () => {
            this.loadActivities();
            alert('Data reloaded!');
        });
    },
    
    /**
     * Set up modal functionality
     */
    setupModal() {
        const activityModal = document.getElementById('activity-modal');
        const trendsModal = document.getElementById('trends-modal');
        const closeButtons = document.querySelectorAll('.close-modal');
        
        // Close modals when clicking X
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                activityModal.style.display = 'none';
                trendsModal.style.display = 'none';
            });
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === activityModal) {
                activityModal.style.display = 'none';
            }
            if (e.target === trendsModal) {
                trendsModal.style.display = 'none';
            }
        });
    },
    
    /**
     * Set up charts
     */
    setupCharts() {
        // Initialize charts for trends
        Charts.initTrendsCharts();
    },
    
    /**
     * Export data to file
     */
    exportData() {
        const data = {
            activities: Storage.getAllActivities(),
            notes: localStorage.getItem('week_notes') || ''
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(dataBlob);
        downloadLink.download = `training-log-${new Date().toISOString().slice(0, 10)}.json`;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    },
    
    /**
     * Import data from file
     * @param {File} file - JSON file to import
     */
    importData(file) {
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                console.log('File read successfully');
                const data = JSON.parse(e.target.result);
                
                // Validate data format
                if (!data.activities || !Array.isArray(data.activities)) {
                    throw new Error('Invalid data format');
                }
                
                console.log(`Found ${data.activities.length} activities to import`);
                
                // Import activities
                const success = Storage.importActivities(data.activities);
                console.log(`Import status: ${success ? 'Success' : 'Failed'}`);
                
                // Import notes if available
                if (data.notes) {
                    localStorage.setItem('week_notes', data.notes);
                    console.log('Notes imported');
                }
                
                // Force reload data
                this.loadActivities();
                console.log('Data reloaded after import');
                
                // Verify storage
                const storedActivities = Storage.getAllActivities();
                console.log(`Storage now contains ${storedActivities.length} activities`);
                
                alert(`Data imported successfully! ${data.activities.length} activities imported.`);
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Error importing data: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    },
    
    /**
     * Save weekly notes
     */
    saveNotes() {
        const notes = document.getElementById('week-notes').value;
        localStorage.setItem('week_notes', notes);
        alert('Notes saved successfully!');
    },
    
    /**
     * Show trends modal with charts
     */
    showTrends() {
        console.log('Trends button clicked');
        const trendsModal = document.getElementById('trends-modal');
        
        if (!trendsModal) {
            console.error('Trends modal element not found');
            return;
        }
        
        // Simplify the modal content - just keep one chart
        trendsModal.querySelector('.modal-content').innerHTML = `
            <span class="close-modal">&times;</span>
            <h2>Running Data Analysis</h2>
            <div class="chart-wrapper">
                <canvas id="test-chart"></canvas>
            </div>
        `;
        
        // Add event listener to close button
        trendsModal.querySelector('.close-modal').addEventListener('click', () => {
            trendsModal.style.display = 'none';
        });
        
        // Show modal
        trendsModal.style.display = 'block';
        
        // Create chart AFTER the modal is visible
        setTimeout(() => {
            Charts.createTestChart();
        }, 100);
    },
    
    /**
     * Get weekly data for a number of weeks
     * @param {Number} numWeeks - Number of weeks to include
     * @returns {Array} Weekly data
     */
    getWeeklyData(numWeeks) {
        const activities = Storage.getAllActivities();
        const weeks = [];
        
        // Get current week
        const now = new Date();
        const currentWeek = Utils.getWeekNumber(now);
        const currentYear = now.getFullYear();
        
        // Initialize weeks
        for (let i = 0; i < numWeeks; i++) {
            const weekDate = new Date(now);
            weekDate.setDate(weekDate.getDate() - (i * 7));
            const weekNumber = Utils.getWeekNumber(weekDate);
            const weekYear = weekDate.getFullYear();
            const weekKey = `${weekYear}-${weekNumber}`;
            
            weeks.push({
                key: weekKey,
                label: `Week ${weekNumber}`,
                year: weekYear,
                week: weekNumber,
                totals: {
                    duration: 0,
                    distance: 0
                },
                activities: [],
                byType: {
                    swim: { duration: 0, distance: 0 },
                    bike: { duration: 0, distance: 0 },
                    run: { duration: 0, distance: 0, avgPace: 0 },
                    other: { duration: 0, distance: 0 }
                },
                byIntensity: {
                    'I1': { duration: 0, distance: 0 },
                    'I2': { duration: 0, distance: 0 },
                    'I3': { duration: 0, distance: 0 },
                    'I4': { duration: 0, distance: 0 },
                    'I5': { duration: 0, distance: 0 },
                    'I6': { duration: 0, distance: 0 },
                    'I7': { duration: 0, distance: 0 }
                },
                runningIntensity: {
                    easy: 0,
                    moderate: 0,
                    hard: 0
                }
            });
        }
        
        // Group activities by week
        activities.forEach(activity => {
            // Convert activity date to week key
            const activityDate = new Date(activity.date);
            if (isNaN(activityDate.getTime())) return;
            
            const weekNumber = Utils.getWeekNumber(activityDate);
            const weekYear = activityDate.getFullYear();
            const weekKey = `${weekYear}-${weekNumber}`;
            
            const weekIndex = weeks.findIndex(w => w.key === weekKey);
            if (weekIndex === -1) return; // Skip if not in our range
            
            const week = weeks[weekIndex];
            
            // Add activity to week
            week.activities.push(activity);
            
            // Add to totals
            const minutes = this.timeToMinutes(activity.time) || 0;
            const distance = parseFloat(activity.distance) || 0;
            
            week.totals.duration += minutes;
            week.totals.distance += distance;
            
            // Add by type
            let typeCategory = activity.type;
            if (!['swim', 'bike', 'run'].includes(typeCategory)) {
                typeCategory = 'other';
            }
            
            week.byType[typeCategory].duration += minutes;
            week.byType[typeCategory].distance += distance;
            
            // Add by intensity
            if (week.byIntensity[activity.intensity]) {
                week.byIntensity[activity.intensity].duration += minutes;
                week.byIntensity[activity.intensity].distance += distance;
            }
            
            // Special handling for running activities
            if (typeCategory === 'run') {
                // Track running intensity distribution
                if (['I1', 'I2'].includes(activity.intensity)) {
                    week.runningIntensity.easy += minutes;
                } else if (activity.intensity === 'I3') {
                    week.runningIntensity.moderate += minutes;
                } else {
                    week.runningIntensity.hard += minutes;
                }
            }
        });
        
        // Calculate derived metrics for each week
        weeks.forEach(week => {
            // Calculate average running pace
            if (week.byType.run.distance > 0) {
                week.byType.run.avgPace = week.byType.run.duration / week.byType.run.distance;
            }
        });
        
        // Sort weeks (newest first)
        weeks.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.week - a.week;
        });
        
        return weeks;
    },
    
    /**
     * Get week key from date
     * @param {String} dateStr - Date string (YYYY-MM-DD)
     * @returns {String} Week key (YYYY-WW)
     */
    getWeekKeyFromDate(dateStr) {
        if (!dateStr) return null;
        
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        
        const weekNumber = Utils.getWeekNumber(date);
        const year = date.getFullYear();
        
        return `${year}-${weekNumber}`;
    },
    
    /**
     * Open activity modal
     * @param {String} activityId - Optional activity ID for editing
     */
    openModal(activityId = null) {
        const modal = document.getElementById('activity-modal');
        const form = document.getElementById('activity-form');
        const saveBtn = document.getElementById('save-activity');
        
        // Reset form
        form.reset();
        
        // Set today as day
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        document.getElementById('activity-date').value = formattedDate;
        
        // Reset rating
        document.querySelectorAll('.rating-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelector('.rating-option[data-value="3"]').classList.add('selected');
        document.getElementById('activity-rating').value = 3;
        
        if (activityId) {
            // Edit mode
            const activity = Storage.getActivityById(activityId);
            if (activity) {
                this.currentEditId = activityId;
                saveBtn.textContent = 'Update Workout';
                
                // Populate form with activity data
                document.getElementById('activity-date').value = activity.date || new Date().toISOString().split('T')[0];
                document.getElementById('activity-type').value = activity.type || 'swim';
                document.getElementById('activity-intensity').value = activity.intensity || 'I1';
                document.getElementById('activity-time').value = activity.time || '00:00';
                document.getElementById('activity-details').value = activity.details || '';
                document.getElementById('activity-distance').value = activity.distance || '';
                document.getElementById('activity-feeling').value = activity.feeling || 'average';
                document.getElementById('activity-comment').value = activity.comment || '';
                document.getElementById('activity-rating').value = activity.rating || 3;
                
                // Set rating UI
                document.querySelectorAll('.rating-option').forEach(opt => opt.classList.remove('selected'));
                document.querySelector(`.rating-option[data-value="${activity.rating || 3}"]`).classList.add('selected');
            }
        } else {
            // Add mode
            this.currentEditId = null;
            saveBtn.textContent = 'Save Workout';
        }
        
        // Show modal
        modal.style.display = 'block';
    },
    
    /**
     * Close activity modal
     */
    closeModal() {
        const modal = document.getElementById('activity-modal');
        modal.style.display = 'none';
        this.currentEditId = null;
    },
    
    /**
     * Handle form submission
     * @param {Event} event - Form submit event
     */
    handleFormSubmit(event) {
        event.preventDefault();
        
        // Get form data
        const formData = {
            date: document.getElementById('activity-date').value,
            type: document.getElementById('activity-type').value,
            intensity: document.getElementById('activity-intensity').value,
            time: document.getElementById('activity-time').value,
            details: document.getElementById('activity-details').value,
            distance: document.getElementById('activity-distance').value || 0,
            feeling: document.getElementById('activity-feeling').value,
            comment: document.getElementById('activity-comment').value,
            rating: document.getElementById('activity-rating').value
        };
        
        // Validate form data
        if (!formData.date || !formData.type || !formData.intensity || !formData.time || !formData.details) {
            alert('Please fill out all required fields');
            return;
        }
        
        // Validate time format
        if (!/^\d{1,2}:\d{2}$/.test(formData.time)) {
            alert('Time must be in format HH:MM');
            return;
        }
        
        // Convert time format to minutes for storage
        formData.minutes = this.timeToMinutes(formData.time);
        
        // Save or update activity
        if (this.currentEditId) {
            Storage.updateActivity(this.currentEditId, formData);
        } else {
            Storage.saveActivity(formData);
        }
        
        // Close modal and reload activities
        this.closeModal();
        this.loadActivities();
    },
    
    /**
     * Load activities from storage and update UI
     */
    loadActivities() {
        const activities = Storage.getAllActivities();
        console.log('Loading activities:', activities);
        
        // Sort activities by day (ascending)
        activities.sort((a, b) => parseInt(a.day) - parseInt(b.day));
        
        // Store activities
        this.activities = activities;
        
        // Render activities
        this.renderActivities(activities);
        
        // Update summary statistics
        this.updateSummaryStats(activities);
        
        // Load week notes
        const weekNotes = localStorage.getItem('week_notes') || '';
        document.getElementById('week-notes').value = weekNotes;
    },
    
    /**
     * Render activities in the table
     * @param {Array} activities - Array of activity objects
     */
    renderActivities(activities) {
        const tableBody = document.getElementById('activities-list');
        tableBody.innerHTML = '';
        
        if (activities.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="7" style="text-align: center; padding: 20px;">No activities found. Click "New Workout" to add your first workout!</td>
            `;
            tableBody.appendChild(emptyRow);
            return;
        }
        
        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.dataset.id = activity.id;
            
            // Get intensity background color
            const intensityClass = activity.intensity ? activity.intensity.toLowerCase().replace('i', 'i') : 'i1';
            
            // Get feeling indicator
            const feelingClass = `feeling-${activity.feeling || 'average'}`;
            
            row.innerHTML = `
                <td class="activity-day">${new Date(activity.date).getDate()}</td>
                <td>
                    <div class="activity-intensity ${intensityClass}">${activity.intensity || 'I1'}</div>
                </td>
                <td class="activity-time">${activity.time || '00:00'}</td>
                <td>${activity.details || ''}</td>
                <td class="activity-feeling">
                    <div class="feeling-indicator ${feelingClass}"></div>
                </td>
                <td>${activity.comment || ''}</td>
                <td class="activity-rating">${activity.rating || '3'}</td>
            `;
            
            // Add click event to edit activity
            row.addEventListener('click', () => {
                this.openModal(activity.id);
            });
            
            tableBody.appendChild(row);
        });
    },
    
    /**
     * Update summary statistics
     * @param {Array} activities - Array of activity objects
     */
    updateSummaryStats(activities) {
        // Calculate total time
        let totalMinutes = 0;
        let specificMinutes = 0;
        let generalMinutes = 0;
        let activeSessionCount = 0;
        let recoverySessionCount = 0;
        let alternativeMinutes = 0;
        let competitionDistance = 0;
        
        // Initialize intensity minutes and distances
        const intensityData = {
            'I1': { duration: 0, distance: 0 },
            'I2': { duration: 0, distance: 0 },
            'I3': { duration: 0, distance: 0 },
            'I4': { duration: 0, distance: 0 },
            'I5': { duration: 0, distance: 0 },
            'I6': { duration: 0, distance: 0 },
            'I7': { duration: 0, distance: 0 }
        };
        
        // Process activities
        activities.forEach(activity => {
            const minutes = this.timeToMinutes(activity.time) || 0;
            const distance = parseFloat(activity.distance) || 0;
            
            totalMinutes += minutes;
            
            // Add to intensity data
            if (intensityData[activity.intensity]) {
                intensityData[activity.intensity].duration += minutes;
                intensityData[activity.intensity].distance += distance;
            }
            
            // Count session types
            if (activity.type === 'recovery') {
                recoverySessionCount++;
                generalMinutes += minutes;
            } else if (activity.type === 'strength' || activity.type === 'alternative') {
                alternativeMinutes += minutes;
                generalMinutes += minutes;
            } else if (activity.type === 'competition') {
                competitionDistance += distance;
                specificMinutes += minutes;
            } else {
                activeSessionCount++;
                
                // Specific vs general training (I1-I2 are general, I3+ are specific)
                if (['I1', 'I2'].includes(activity.intensity)) {
                    generalMinutes += minutes;
                } else {
                    specificMinutes += minutes;
                }
            }
        });
        
        // Update UI with calculated values
        const totalTime = this.minutesToTime(totalMinutes);
        document.querySelector('.total-value').textContent = totalTime;
        
        document.getElementById('total-sessions').textContent = activities.length;
        document.getElementById('active-sessions').textContent = activeSessionCount;
        document.getElementById('recovery-sessions').textContent = recoverySessionCount;
        document.getElementById('sick-days').textContent = '0'; // Placeholder, could be tracked separately
        document.getElementById('alternative-time').textContent = this.minutesToTime(alternativeMinutes);
        document.getElementById('competition-km').textContent = competitionDistance.toFixed(1);
        
        // Update intensity values - both time and distance
        for (const [intensity, data] of Object.entries(intensityData)) {
            const timeElementId = intensity.toLowerCase() + '-time';
            const distanceElementId = intensity.toLowerCase() + '-distance';
            
            document.getElementById(timeElementId).textContent = this.minutesToTime(data.duration);
            document.getElementById(distanceElementId).textContent = data.distance.toFixed(1);
        }
        
        // Calculate and update specific vs general training percentages
        const totalTrainingMinutes = specificMinutes + generalMinutes;
        let specificPercent = 0;
        let generalPercent = 0;
        
        if (totalTrainingMinutes > 0) {
            specificPercent = Math.round((specificMinutes / totalTrainingMinutes) * 100);
            generalPercent = 100 - specificPercent;
        }
        
        document.getElementById('specific-training-percent').textContent = specificPercent;
        document.getElementById('general-training-percent').textContent = generalPercent;
        document.getElementById('specific-training-bar').style.width = `${specificPercent}%`;
        document.getElementById('general-training-bar').style.width = `${generalPercent}%`;
    },
    
    /**
     * Convert time string (HH:MM) to minutes
     * @param {String} timeStr - Time string in format HH:MM
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
     * Convert minutes to time string (HH:MM)
     * @param {Number} minutes - Minutes to convert
     * @returns {String} Time string in format HH:MM
     */
    minutesToTime(minutes) {
        if (!minutes) return '0:00';
        
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        return `${hours}:${mins.toString().padStart(2, '0')}`;
    },
    
    clearFilters() {
        // Reset week filter to the default (most recent weeks)
        document.getElementById('filter-weeks').value = '4'; // Or whatever your default is
        
        // Reload activities
        this.loadActivities();
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => App.init()); 