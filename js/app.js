// CLOUDIA - Main Application
class CloudiaApp {
    constructor() {
        this.debounceTimer = null;
        this.currentTab = 'hourly';
        this.lastQuery = null;
        this.init();
    }

    init() {
        // Show loading screen initially
        weatherAnimations.showLoadingScreen();
        
        // Setup event listeners
        this.setupEventListeners();

        // Sync persisted UI state
        this.syncUiState();
        
        // Initialize startup 3D background
        weatherAnimations.initStartup3D();
        
        // Hide loading screen after duration
        weatherAnimations.hideLoadingScreen();
        
        // Don't auto-load weather - wait for user search
    }

    syncUiState() {
        weatherHandler.syncUnitButtons();
        this.loadFavorites();
        this.updateFavoriteButton();
    }

    setupEventListeners() {
        // Startup view search button
        const startupSearchBtn = document.getElementById('startup-search-btn');
        if (startupSearchBtn) {
            startupSearchBtn.addEventListener('click', () => this.handleStartupSearch());
        }

        // Startup view GPS button
        const startupGpsBtn = document.getElementById('startup-gps-btn');
        if (startupGpsBtn) {
            startupGpsBtn.addEventListener('click', () => this.handleStartupGPS());
        }

        // Startup view search input
        const startupCityInput = document.getElementById('startup-city-input');
        if (startupCityInput) {
            startupCityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleStartupSearch();
                }
            });
        }

        // Main view search button
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }

        // Main view GPS button
        const gpsBtn = document.getElementById('gps-btn');
        if (gpsBtn) {
            gpsBtn.addEventListener('click', () => this.handleGPS());
        }

        // Main view search input (Enter key and debounce)
        const cityInput = document.getElementById('city-input');
        if (cityInput) {
            cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });

            // Debounced search
            cityInput.addEventListener('input', () => {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    // Optional: Auto-search on input (commented out for now)
                    // this.handleSearch();
                }, CONFIG.DEBOUNCE_DELAY);
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => themeManager.toggleTheme());
        }

        // High contrast toggle
        const contrastToggle = document.getElementById('high-contrast-toggle');
        if (contrastToggle) {
            contrastToggle.addEventListener('click', () => themeManager.toggleHighContrast());
        }

        // Sound toggle
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => themeManager.toggleSound());
        }

        // Favorite button
        const favoriteBtn = document.getElementById('favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }

        // Temperature unit toggles
        const unitToggleC = document.getElementById('unit-toggle');
        const unitToggleF = document.getElementById('unit-toggle-f');
        if (unitToggleC) {
            unitToggleC.addEventListener('click', () => {
                weatherHandler.setUnit('celsius');
                this.refreshWeather();
            });
        }
        if (unitToggleF) {
            unitToggleF.addEventListener('click', () => {
                weatherHandler.setUnit('fahrenheit');
                this.refreshWeather();
            });
        }

        // Forecast tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchForecastTab(tab);
            });
        });
    }

    async initializeWeather() {
        // Try GPS first, then fallback to default city
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    await this.loadWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                async () => {
                    // GPS failed, use default city
                    await this.loadWeather(CONFIG.DEFAULT_CITY);
                },
                { timeout: 5000 }
            );
        } else {
            // No geolocation support, use default city
            await this.loadWeather(CONFIG.DEFAULT_CITY);
        }
    }

    async handleStartupSearch() {
        const cityInput = document.getElementById('startup-city-input');
        const city = cityInput?.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        await this.loadWeather(city, true);
    }

    async handleStartupGPS() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        const gpsBtn = document.getElementById('startup-gps-btn');
        if (gpsBtn) {
            gpsBtn.disabled = true;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await this.loadWeatherByCoords(position.coords.latitude, position.coords.longitude, true);
                if (gpsBtn) gpsBtn.disabled = false;
            },
            async (error) => {
                this.showError('Unable to retrieve your location. Please try again or search for a city.');
                if (gpsBtn) gpsBtn.disabled = false;
            },
            { timeout: 10000 }
        );
    }

    async handleSearch() {
        const cityInput = document.getElementById('city-input');
        const city = cityInput?.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        await this.loadWeather(city, false);
    }

    async handleGPS() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        const gpsBtn = document.getElementById('gps-btn');
        if (gpsBtn) {
            gpsBtn.disabled = true;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await this.loadWeatherByCoords(position.coords.latitude, position.coords.longitude);
                if (gpsBtn) gpsBtn.disabled = false;
            },
            async (error) => {
                this.showError('Unable to retrieve your location. Please try again or search for a city.');
                if (gpsBtn) gpsBtn.disabled = false;
            },
            { timeout: 10000 }
        );
    }

    async loadWeather(city, isStartup = false) {
        const trimmedCity = city.trim();
        return this.loadWeatherData({
            isStartup,
            getCurrent: (units) => weatherAPI.getCurrentWeather(trimmedCity, units),
            getForecast: (units) => weatherAPI.getForecast(trimmedCity, units)
        });
    }

    async loadWeatherByCoords(lat, lon, isStartup = false) {
        return this.loadWeatherData({
            isStartup,
            getCurrent: (units) => weatherAPI.getCurrentWeatherByCoords(lat, lon, units),
            getForecast: (units) => weatherAPI.getForecastByCoords(lat, lon, units)
        });
    }

    async loadWeatherData({ getCurrent, getForecast, isStartup = false }) {
        try {
            this.showLoading();
            
            const units = CONFIG.UNITS[weatherHandler.currentUnit];
            
            // Fetch current weather and forecast in parallel
            const [currentData, forecastData] = await Promise.all([
                getCurrent(units),
                getForecast(units)
            ]);

            this.lastQuery = {
                type: 'coords',
                lat: currentData.coord.lat,
                lon: currentData.coord.lon,
                city: currentData.name
            };

            // If this is the first search (startup), reveal main content
            if (isStartup) {
                weatherAnimations.revealMainContent();
            }

            // Display data
            weatherHandler.displayCurrentWeather(currentData, weatherHandler.currentUnit);
            weatherHandler.displayForecast(forecastData, weatherHandler.currentUnit, this.currentTab);
            this.loadFavorites();
            this.updateFavoriteButton();

            // Auto-switch theme based on weather
            const isDayTime = themeManager.isDayTime(currentData.sys.sunrise, currentData.sys.sunset);
            themeManager.autoSwitchThemeByWeather(currentData.weather[0].main, isDayTime);

            // Try to get alerts
            try {
                const alerts = await weatherAPI.getAlerts(currentData.coord.lat, currentData.coord.lon);
                weatherHandler.displayAlerts(alerts);
            } catch (e) {
                weatherHandler.displayAlerts([]);
            }

            this.hideLoading();
            this.hideError();

            const cityInput = isStartup
                ? document.getElementById('startup-city-input')
                : document.getElementById('city-input');
            if (cityInput) {
                cityInput.value = '';
            }

        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    }

    async refreshWeather() {
        if (!this.lastQuery) return;

        if (this.lastQuery.type === 'coords') {
            await this.loadWeatherByCoords(this.lastQuery.lat, this.lastQuery.lon);
            return;
        }

        await this.loadWeather(this.lastQuery.city);
    }

    switchForecastTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Refresh forecast from cached data when available
        if (weatherHandler.currentForecastData) {
            weatherHandler.displayForecast(
                weatherHandler.currentForecastData,
                weatherHandler.currentUnit,
                this.currentTab
            );
        } else if (weatherHandler.currentData) {
            this.refreshWeather();
        }
    }

    showLoading() {
        this.toggleActionButtons(true);

        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.setAttribute('aria-busy', 'true');
        }
    }

    hideLoading() {
        this.toggleActionButtons(false);

        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.removeAttribute('aria-busy');
        }
    }

    toggleActionButtons(disabled) {
        const buttonIds = [
            'search-btn',
            'gps-btn',
            'startup-search-btn',
            'startup-gps-btn',
            'favorite-btn'
        ];

        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.disabled = disabled;
            }
        });
    }

    showError(message) {
        this.hideError(); // Remove existing error
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = 'error-message';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'polite');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translateX(-50%)';
        errorDiv.style.zIndex = '10000';
        errorDiv.style.maxWidth = '90%';

        // Try to add to main content, otherwise add to body
        const mainContentWrapper = document.getElementById('main-content');
        const mainContent = document.querySelector('.main-content');
        const startupView = document.getElementById('startup-view');
        
        if (mainContent && mainContentWrapper && !mainContentWrapper.classList.contains('hidden')) {
            mainContent.insertBefore(errorDiv, mainContent.firstChild);
        } else if (startupView) {
            startupView.appendChild(errorDiv);
        } else {
            document.body.appendChild(errorDiv);
        }
    }

    hideError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Favorites management
    loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
        const favoritesList = document.getElementById('favorites-list');
        
        if (!favoritesList) return;

        favoritesList.innerHTML = '';

        if (favorites.length === 0) {
            const emptyState = document.createElement('p');
            emptyState.className = 'favorites-empty';
            emptyState.textContent = 'No favorite cities yet. Save one from the weather card to see it here.';
            favoritesList.appendChild(emptyState);
            return;
        }

        favorites.forEach(city => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.setAttribute('role', 'listitem');

            const cityButton = document.createElement('button');
            cityButton.className = 'favorite-city-btn';
            cityButton.type = 'button';
            cityButton.textContent = city;
            cityButton.setAttribute('aria-label', `Load weather for ${city}`);

            cityButton.addEventListener('click', () => {
                this.loadWeather(city);
            });

            cityButton.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.loadWeather(city);
                }
            });

            const removeButton = document.createElement('button');
            removeButton.className = 'favorite-remove-btn';
            removeButton.type = 'button';
            removeButton.textContent = 'Remove';
            removeButton.setAttribute('aria-label', `Remove ${city} from favorites`);
            removeButton.addEventListener('click', () => {
                this.removeFromFavorites(city);
                this.updateFavoriteButton();
            });

            favoriteItem.appendChild(cityButton);
            favoriteItem.appendChild(removeButton);

            favoritesList.appendChild(favoriteItem);
        });
    }

    addToFavorites(city) {
        const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
        if (!favorites.includes(city)) {
            favorites.push(city);
            localStorage.setItem('favoriteCities', JSON.stringify(favorites));
            this.loadFavorites();
        }
    }

    removeFromFavorites(city) {
        const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
        const filtered = favorites.filter(c => c !== city);
        localStorage.setItem('favoriteCities', JSON.stringify(filtered));
        this.loadFavorites();
    }

    toggleFavorite() {
        if (!weatherHandler.currentData) return;
        
        const city = weatherHandler.currentData.name;
        const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
        const isFavorite = favorites.includes(city);
        
        const favoriteBtn = document.getElementById('favorite-btn');
        
        if (isFavorite) {
            this.removeFromFavorites(city);
            if (favoriteBtn) {
                favoriteBtn.classList.remove('active');
                favoriteBtn.setAttribute('aria-label', 'Add to favorites');
                favoriteBtn.title = 'Add to favorites';
            }
        } else {
            this.addToFavorites(city);
            if (favoriteBtn) {
                favoriteBtn.classList.add('active');
                favoriteBtn.setAttribute('aria-label', 'Remove from favorites');
                favoriteBtn.title = 'Remove from favorites';
            }
        }
    }

    updateFavoriteButton() {
        if (!weatherHandler.currentData) return;
        
        const city = weatherHandler.currentData.name;
        const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
        const isFavorite = favorites.includes(city);
        
        const favoriteBtn = document.getElementById('favorite-btn');
        if (favoriteBtn) {
            if (isFavorite) {
                favoriteBtn.classList.add('active');
                favoriteBtn.setAttribute('aria-label', 'Remove from favorites');
                favoriteBtn.title = 'Remove from favorites';
            } else {
                favoriteBtn.classList.remove('active');
                favoriteBtn.setAttribute('aria-label', 'Add to favorites');
                favoriteBtn.title = 'Add to favorites';
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new CloudiaApp();
    // Make app globally available for debugging
    window.cloudiaApp = app;
});

