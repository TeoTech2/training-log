/**
 * Storage module for managing activity data in localStorage
 */
const Storage = {
    STORAGE_KEY: 'training_logbook_activities',
    
    /**
     * Retrieve all activities from localStorage
     * @returns {Array} Array of activity objects
     */
    getAllActivities() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },
    
    /**
     * Save a new activity
     * @param {Object} activity - Activity object to save
     * @returns {Object} Saved activity with ID
     */
    saveActivity(activity) {
        const activities = this.getAllActivities();
        activity.id = Date.now().toString();
        activity.createdAt = Date.now();
        activities.push(activity);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities));
        return activity;
    },
    
    /**
     * Retrieve a single activity by ID
     * @param {String} id - Activity ID
     * @returns {Object|null} Activity object or null if not found
     */
    getActivityById(id) {
        const activities = this.getAllActivities();
        return activities.find(activity => activity.id === id) || null;
    },
    
    /**
     * Update an existing activity
     * @param {String} id - ID of activity to update
     * @param {Object} updatedData - New activity data
     * @returns {Object|null} Updated activity or null if not found
     */
    updateActivity(id, updatedData) {
        const activities = this.getAllActivities();
        const index = activities.findIndex(activity => activity.id === id);
        
        if (index === -1) return null;
        
        const updatedActivity = { ...activities[index], ...updatedData };
        activities[index] = updatedActivity;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities));
        
        return updatedActivity;
    },
    
    /**
     * Delete an activity
     * @param {String} id - ID of activity to delete
     * @returns {Boolean} True if deleted, false if not found
     */
    deleteActivity(id) {
        const activities = this.getAllActivities();
        const index = activities.findIndex(activity => activity.id === id);
        
        if (index === -1) return false;
        
        activities.splice(index, 1);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(activities));
        
        return true;
    },
    
    /**
     * Get activities by type
     * @param {String} type - Activity type
     * @returns {Array} Filtered activities
     */
    getActivitiesByType(type) {
        const activities = this.getAllActivities();
        return activities.filter(activity => activity.type === type);
    },
    
    /**
     * Get activities for a specific day
     * @param {Number} day - Day number (1-7)
     * @returns {Array} Filtered activities
     */
    getActivitiesByDay(day) {
        const activities = this.getAllActivities();
        return activities.filter(activity => parseInt(activity.day) === day);
    },
    
    /**
     * Import activities from external data
     * @param {Array} activities - Array of activity objects
     * @returns {Boolean} True if successful
     */
    importActivities(activities) {
        if (!Array.isArray(activities)) return false;
        
        // Ensure all activities have valid IDs and timestamps
        const validatedActivities = activities.map(activity => {
            if (!activity.id) {
                activity.id = Date.now() + Math.random().toString(36).substr(2, 9);
            }
            if (!activity.createdAt) {
                activity.createdAt = Date.now();
            }
            return activity;
        });
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validatedActivities));
        return true;
    },
    
    /**
     * Clear all activities data
     * @returns {Boolean} True if cleared
     */
    clearAllActivities() {
        localStorage.removeItem(this.STORAGE_KEY);
        return true;
    },
    
    /**
     * Get activities by date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Filtered activities
     */
    getActivitiesByDateRange(startDate, endDate) {
        const activities = this.getAllActivities();
        return activities.filter(activity => {
            if (!activity.date) return false;
            const activityDate = new Date(activity.date);
            return activityDate >= startDate && activityDate <= endDate;
        });
    }
}; 