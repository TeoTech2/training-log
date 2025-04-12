/**
 * Simplified Charts module for debugging
 */
const Charts = {
    // Initialize flag to track if init has been called
    initialized: false,
    
    // Initialize charts object
    charts: {},
    
    // Simple init function without visual feedback
    init: function() {
        console.log('Charts.init called');
        this.initialized = true;
        
        // Try to create a simple test chart directly
        this.createTestChart();
    },
    
    // Create a simple test chart
    createTestChart: function() {
        console.log('Creating test chart...');
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded!');
            return;
        }
        
        // Try to get the modal element
        const modal = document.getElementById('trends-modal');
        if (!modal) {
            console.error('Modal element not found');
            return;
        }
        
        // Check if canvas exists, create it if not
        let testCanvas = document.getElementById('test-chart');
        if (!testCanvas) {
            console.log('Canvas not found, creating it dynamically');
            
            // Find container or create one
            let container = modal.querySelector('.trends-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'trends-container';
                modal.querySelector('.modal-content').appendChild(container);
            }
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'chart-wrapper';
            
            // Add title
            const title = document.createElement('h3');
            title.textContent = 'Training Progress';
            wrapper.appendChild(title);
            
            // Create canvas
            testCanvas = document.createElement('canvas');
            testCanvas.id = 'test-chart';
            testCanvas.width = 400;
            testCanvas.height = 200;
            wrapper.appendChild(testCanvas);
            
            // Add to container
            container.appendChild(wrapper);
            
            console.log('Canvas created dynamically');
        }
        
        // Get data from training.json
        this.loadTrainingData()
            .then(data => {
                this.renderTrainingLineChart(data);
            })
            .catch(error => {
                console.error('Error loading training data:', error);
                // Create a simple fallback chart with dummy data
                this.renderTrainingLineChart(this.createDummyTrainingData());
            });
    },
    
    // Simple method to show trends modal
    showTrendsModal: function() {
        console.log('showTrendsModal called');
        
        const modal = document.getElementById('trends-modal');
        if (modal) {
            modal.style.display = 'block';
            console.log('Modal displayed');
            
            // Create test chart when modal is shown
            this.createTestChart();
        } else {
            console.error('Modal element not found');
        }
    },
    
    // Initialize trends charts (simplified)
    initTrendsCharts: function() {
        console.log('initTrendsCharts called');
        // Just call the test chart function
        this.createTestChart();
    },
    
    // Update trends charts (simplified)
    updateTrendsCharts: function(data) {
        console.log('updateTrendsCharts called with data:', data);
        // No implementation needed for testing
    },
    
    // Load training data from training.json
    loadTrainingData: function() {
        return new Promise((resolve, reject) => {
            // Get current week dates
            const today = new Date();
            const currentDay = today.getDay();
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - currentDay); // Go back to Sunday
            
            const weekDates = [];
            const weekLabels = [];
            
            for (let i = 0; i < 7; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                
                // Format as YYYY-MM-DD for data lookup
                const formattedDate = date.toISOString().split('T')[0];
                weekDates.push(formattedDate);
                
                // Format as "Apr 12" for display
                weekLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            }
            
            // First try to get from localStorage
            const activities = Storage.getAllActivities();
            if (activities && activities.length > 0) {
                console.log('Using data from localStorage');
                resolve(this.processActivitiesForWeek(activities, weekDates, weekLabels));
                return;
            }
            
            // If no data in localStorage, try to fetch from file
            console.log('Trying to fetch training.json');
            fetch('training.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load training.json');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.activities) {
                        resolve(this.processActivitiesForWeek(data.activities, weekDates, weekLabels));
                    } else {
                        throw new Error('Invalid data format in training.json');
                    }
                })
                .catch(error => {
                    console.error('Error fetching training data:', error);
                    reject(error);
                });
        });
    },
    
    // Process activities data for chart
    processActivitiesForChart: function(activities) {
        // Get current week dates for backward compatibility
        const today = new Date();
        const currentDay = today.getDay();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - currentDay); // Go back to Sunday
        
        const weekDates = [];
        const weekLabels = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            // Format as YYYY-MM-DD for data lookup
            const formattedDate = date.toISOString().split('T')[0];
            weekDates.push(formattedDate);
            
            // Format as display label
            weekLabels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        
        // Use the weekly processing function
        return this.processActivitiesForWeek(activities, weekDates, weekLabels);
    },
    
    // Create dummy training data for testing
    createDummyTrainingData: function() {
        // Instead of using current week, use the sample data dates
        return {
            labels: ['Apr 6', 'Apr 7', 'Apr 8', 'Apr 10', 'Apr 11', 'Apr 12', 'Apr 13'],
            running: [4, 6, 6, 8, 6, 0, 0],
            swimming: [0, 0, 0, 0, 0, 0, 0],
            biking: [0, 0, 0, 0, 0, 0, 0],
            total: [4, 6, 6, 8, 6, 0, 0]
        };
    },
    
    // Process activities for the current week
    processActivitiesForWeek: function(activities, weekDates, weekLabels) {
        // Initialize data arrays
        const running = Array(7).fill(0);
        const swimming = Array(7).fill(0);
        const biking = Array(7).fill(0);
        const total = Array(7).fill(0);
        
        console.log('Processing activities for week:', weekDates);
        console.log('Activities data:', activities);
        
        // Process each activity
        activities.forEach(activity => {
            if (!activity.date) return;
            
            // Debug the activity date format
            console.log('Activity date:', activity.date, 'Type:', typeof activity.date);
            
            // Check if activity is in this week
            const dateIndex = weekDates.indexOf(activity.date);
            console.log('Date index for', activity.date, 'is', dateIndex);
            
            if (dateIndex === -1) return; // Not in current week
            
            const distance = parseFloat(activity.distance) || 0;
            console.log('Adding distance', distance, 'for', activity.type, 'on', activity.date);
            
            if (activity.type === 'run') {
                running[dateIndex] += distance;
            } else if (activity.type === 'swim') {
                swimming[dateIndex] += distance;
            } else if (activity.type === 'bike') {
                biking[dateIndex] += distance;
            }
            
            total[dateIndex] += distance;
        });
        
        console.log('Final data:', {
            labels: weekLabels,
            running,
            swimming,
            biking,
            total
        });
        
        return {
            labels: weekLabels,
            running,
            swimming,
            biking,
            total
        };
    },
    
    // Render training data as line chart
    renderTrainingLineChart: function(data) {
        const canvas = document.getElementById('test-chart');
        if (!canvas) {
            console.error('Canvas element not found in renderTrainingLineChart');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Initialize charts object if it doesn't exist
        if (!this.charts) {
            this.charts = {};
        }
        
        // Destroy existing chart if it exists
        if (this.charts.testChart) {
            this.charts.testChart.destroy();
        }
        
        try {
            // Create line chart with improved sizing
            this.charts.testChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Running',
                            data: data.running,
                            borderColor: '#f44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            borderWidth: 2,
                            tension: 0.1,
                            fill: true
                        },
                        {
                            label: 'Swimming',
                            data: data.swimming,
                            borderColor: '#2196f3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            borderWidth: 2,
                            tension: 0.1,
                            fill: true
                        },
                        {
                            label: 'Biking',
                            data: data.biking,
                            borderColor: '#4caf50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            borderWidth: 2,
                            tension: 0.1,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true, // This can help control the aspect ratio
                    aspectRatio: 2, // Width:height ratio (wider and less tall)
                    plugins: {
                        title: {
                            display: true,
                            text: 'Training Progress'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        },
                        legend: {
                            position: 'top',
                            labels: {
                                boxWidth: 12 // Smaller legend items
                            }
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Distance (miles)'
                            },
                            beginAtZero: true
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        }
                    }
                }
            });
            
            console.log('Line chart created successfully');
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }
};

// Self-initialize when script loads
console.log('Charts.js loaded');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded in charts.js');
    Charts.init();
}); 