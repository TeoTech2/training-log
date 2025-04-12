# Triathlon Training Log

A lightweight, browser-based training log application for tracking and visualizing triathlon training activities (swim, bike, run).

## Features

- Log swim, bike, and run workouts with duration, distance, and intensity levels
- Color-coded training zones (L1-L4 + intervals) for workout intensity management
- Interactive dashboard with dynamic charts for visualizing weekly training volume and distribution
- Complete offline experience with client-side data storage
- Weekly progress tracking and comparison

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Start logging your training activities!

## Usage

### Adding Activities

1. Select the date of your workout
2. Choose the activity type (swim, bike, run)
3. Enter the duration in minutes
4. Optionally add the distance
5. Select the intensity level:
   - L1: Easy/Recovery (Grey)
   - L2: Moderate/Endurance (Green)
   - L3: Threshold (Blue)
   - L4: High Intensity (Red)
   - Intervals: Mixed high-intensity intervals (Red)
6. Add optional notes about your workout
7. Click "Save Activity"

### Analyzing Your Training

- View your weekly training volume in the bar chart
- See your activity distribution in the pie chart
- Analyze your intensity distribution in the second pie chart
- Filter data by selecting different time ranges (1, 4, or 12 weeks)

### Managing Activities

- View all your logged activities in the activity log table
- Edit or delete activities as needed

## Technologies Used

- HTML, CSS, and vanilla JavaScript
- Chart.js for data visualization
- localStorage for data persistence

## Contributing

Feel free to submit issues or pull requests!

## License

MIT 