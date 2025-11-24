# Mihrab Marine Utilities

This directory contains utility functions and helpers that are used throughout the Mihrab Marine application. These utilities help maintain consistent behavior and reduce code duplication across the app.

## Available Utilities

### Time Utilities (`timeUtils.ts`)

Contains functions for determining the time of day and associated theme colors:

- `getTimeOfDay()`: Returns the current time of day (Morning, Afternoon, Evening, Night) based on the current hour
- `getTimeOfDayColors()`: Returns the appropriate gradient colors for the current time of day
- `THEME_COLORS`: Constant containing color definitions for different times of day and UI elements

### Format Utilities (`formatUtils.ts`)

Contains functions for formatting data consistently across the app:

- `formatTime()`: Formats a Date object to a time string in 12-hour format
- `formatOceanDisplay()`: Formats ocean name for display
- `formatCoordinates()`: Formats latitude and longitude coordinates for display

## UI Components

Reusable UI components have been moved to the components directory:

### Sky Background (`components/ui/SkyBackground.tsx`)

- `SkyBackground`: A component that renders a night sky with animated stars
- `getTimeOfDayIcon`: A function that returns the appropriate icon for the current time of day

## Best Practices

1. Always use these utility functions instead of duplicating logic across components
2. Keep utility functions pure and focused on a single responsibility
3. Add new utility functions to the appropriate file based on their purpose
4. Document all utility functions with JSDoc comments