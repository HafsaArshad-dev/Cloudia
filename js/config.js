// CLOUDIA - Configuration File
const CONFIG = {
    API_KEY: '1b2a36e35ee7b69ebbbb9cb261406d54',
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    ICON_BASE_URL: 'https://openweathermap.org/img/wn',
    UNITS: {
        celsius: 'metric',
        fahrenheit: 'imperial'
    },
    DEFAULT_CITY: 'London',
    CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
    DEBOUNCE_DELAY: 500, // milliseconds
    LOADING_DURATION: 3000 // 3 seconds
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

