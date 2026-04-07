// CLOUDIA - Main Application
class CloudiaApp {
    constructor() {
        this.currentTab = 'hourly';
        this.lastQuery = null;
        this.maxSuggestions = 6;
        this.popularCities = [
            { city: 'London', country: 'GB' },
            { city: 'New York', country: 'US' },
            { city: 'Los Angeles', country: 'US' },
            { city: 'Chicago', country: 'US' },
            { city: 'Toronto', country: 'CA' },
            { city: 'Vancouver', country: 'CA' },
            { city: 'Dubai', country: 'AE' },
            { city: 'Abu Dhabi', country: 'AE' },
            { city: 'Riyadh', country: 'SA' },
            { city: 'Doha', country: 'QA' },
            { city: 'Istanbul', country: 'TR' },
            { city: 'Paris', country: 'FR' },
            { city: 'Berlin', country: 'DE' },
            { city: 'Madrid', country: 'ES' },
            { city: 'Rome', country: 'IT' },
            { city: 'Tokyo', country: 'JP' },
            { city: 'Seoul', country: 'KR' },
            { city: 'Beijing', country: 'CN' },
            { city: 'Shanghai', country: 'CN' },
            { city: 'Singapore', country: 'SG' },
            { city: 'Bangkok', country: 'TH' },
            { city: 'Mumbai', country: 'IN' },
            { city: 'Delhi', country: 'IN' },
            { city: 'Bengaluru', country: 'IN' },
            { city: 'Lahore', country: 'PK' },
            { city: 'Karachi', country: 'PK' },
            { city: 'Islamabad', country: 'PK' },
            { city: 'Faisalabad', country: 'PK' },
            { city: 'Peshawar', country: 'PK' },
            { city: 'Sydney', country: 'AU' },
            { city: 'Melbourne', country: 'AU' },
            { city: 'Auckland', country: 'NZ' }
        ];
        this.popularCityBoosts = new Map([
            ['london', 90],
            ['new york', 90],
            ['paris', 80],
            ['tokyo', 80],
            ['dubai', 80],
            ['karachi', 78],
            ['lahore', 76],
            ['islamabad', 74],
            ['mumbai', 74],
            ['delhi', 72],
            ['sydney', 70]
        ]);
        this.autocompleteTimers = {
            startup: null,
            main: null
        };
        this.autocompleteRequestIds = {
            startup: 0,
            main: 0
        };
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

        this.setupSearchInputEvents('startup-city-input', 'startup', () => this.handleStartupSearch());
        this.setupSearchInputEvents('city-input', 'main', () => this.handleSearch());

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

        document.addEventListener('click', (event) => this.handleDocumentClick(event));
    }

    setupSearchInputEvents(inputId, view, onEnter) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onEnter();
                return;
            }

            if (event.key === 'Escape') {
                this.hideSuggestions(view);
            }
        });

        input.addEventListener('input', () => {
            this.handleAutocompleteInput(view);
        });

        input.addEventListener('focus', () => {
            this.handleAutocompleteInput(view);
        });

        input.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(view), 120);
        });
    }

    getAutocompleteContext(view) {
        if (view === 'startup') {
            return {
                inputId: 'startup-city-input',
                suggestionsId: 'startup-suggestions',
                wrapperId: 'startup-search-wrapper',
                startup: true
            };
        }

        return {
            inputId: 'city-input',
            suggestionsId: 'main-suggestions',
            wrapperId: 'main-search-wrapper',
            startup: false
        };
    }

    async handleAutocompleteInput(view) {
        const context = this.getAutocompleteContext(view);
        const input = document.getElementById(context.inputId);
        if (!input) return;

        const query = input.value.trim();
        if (query.length < 2) {
            this.hideSuggestions(view);
            return;
        }

        clearTimeout(this.autocompleteTimers[view]);
        this.autocompleteTimers[view] = setTimeout(() => {
            this.loadCitySuggestions(view, query);
        }, CONFIG.DEBOUNCE_DELAY);
    }

    async loadCitySuggestions(view, query) {
        const context = this.getAutocompleteContext(view);
        const input = document.getElementById(context.inputId);
        if (!input) return;

        const requestId = ++this.autocompleteRequestIds[view];
        let suggestions = [];

        try {
            suggestions = await this.buildMergedSuggestions(query);
        } catch (error) {
            suggestions = [];
        }

        const queryNow = input.value.trim();
        if (requestId !== this.autocompleteRequestIds[view] || queryNow !== query.trim()) {
            return;
        }

        this.renderSuggestions(view, suggestions);
    }

    async buildMergedSuggestions(query) {
        const trimmedQuery = String(query || '').trim();
        if (trimmedQuery.length < 2) {
            return [];
        }

        const normalizedQuery = trimmedQuery.toLowerCase();
        const favoriteMatches = this.getFavoriteCities()
            .filter(city => city.toLowerCase().includes(normalizedQuery))
            .map(city => ({
                label: city,
                query: city,
                source: 'favorite'
            }));

        const popularMatches = this.getPopularSuggestions(trimmedQuery);

        let liveMatches = [];
        try {
            liveMatches = await weatherAPI.searchCities(trimmedQuery, this.maxSuggestions);
        } catch (error) {
            liveMatches = [];
        }

        const merged = [];
        const seen = new Set();
        const pushUnique = (item) => {
            const key = String(item.query || item.label || '').trim().toLowerCase();
            if (!key || seen.has(key)) {
                return;
            }

            seen.add(key);
            merged.push(item);
        };

        favoriteMatches.forEach(pushUnique);
        popularMatches.forEach(pushUnique);
        liveMatches.forEach(item => pushUnique({
            ...item,
            source: 'live'
        }));

        const ranked = merged
            .map(item => ({
                ...item,
                __score: this.getSuggestionScore(item, trimmedQuery)
            }))
            .sort((first, second) => {
                if (second.__score !== first.__score) {
                    return second.__score - first.__score;
                }

                return String(first.label).localeCompare(String(second.label));
            })
            .slice(0, this.maxSuggestions)
            .map(({ __score, ...item }) => item);

        return ranked;
    }

    getPopularSuggestions(query) {
        const normalizedQuery = String(query || '').trim().toLowerCase();
        if (normalizedQuery.length < 2) {
            return [];
        }

        return this.popularCities
            .filter(item => {
                const city = item.city.toLowerCase();
                return city.startsWith(normalizedQuery) || city.includes(normalizedQuery);
            })
            .map(item => ({
                name: item.city,
                country: item.country,
                label: `${item.city}, ${item.country}`,
                query: `${item.city},${item.country}`,
                source: 'popular'
            }));
    }

    getSuggestionCityName(suggestion) {
        if (suggestion && suggestion.name) {
            return String(suggestion.name).trim();
        }

        const label = String(suggestion?.label || '').trim();
        if (!label) {
            return '';
        }

        return label.split(',')[0].trim();
    }

    getSuggestionScore(suggestion, query) {
        const normalizedQuery = String(query || '').trim().toLowerCase();
        const cityName = this.getSuggestionCityName(suggestion).toLowerCase();
        const label = String(suggestion?.label || '').toLowerCase();
        const queryValue = String(suggestion?.query || '').toLowerCase();
        let score = 0;

        if (!normalizedQuery || !label) {
            return score;
        }

        if (cityName === normalizedQuery) {
            score += 420;
        }

        if (cityName.startsWith(normalizedQuery)) {
            score += 300;
        } else if (cityName.includes(normalizedQuery)) {
            score += 140;
        }

        if (label.startsWith(normalizedQuery)) {
            score += 210;
        } else if (label.includes(` ${normalizedQuery}`)) {
            score += 120;
        } else if (label.includes(normalizedQuery)) {
            score += 90;
        }

        const cityTokens = cityName.split(/[\s-]+/).filter(Boolean);
        if (cityTokens.some(token => token.startsWith(normalizedQuery))) {
            score += 160;
        }

        if (queryValue.startsWith(normalizedQuery)) {
            score += 110;
        }

        if (suggestion.source === 'favorite') {
            score += 32;
        }

        if (suggestion.source === 'popular') {
            score += 24;
        }

        score += this.popularCityBoosts.get(cityName) || 0;
        return score;
    }

    renderSuggestions(view, suggestions) {
        const context = this.getAutocompleteContext(view);
        const suggestionsElement = document.getElementById(context.suggestionsId);
        if (!suggestionsElement) return;

        suggestionsElement.innerHTML = '';

        if (!suggestions.length) {
            this.hideSuggestions(view);
            return;
        }

        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'search-suggestion-btn';
            button.type = 'button';
            button.setAttribute('role', 'option');
            button.setAttribute('aria-label', `Use ${suggestion.label}`);

            const label = document.createElement('span');
            label.className = 'search-suggestion-label';
            label.textContent = suggestion.label;
            button.appendChild(label);

            if (suggestion.source === 'favorite') {
                const badge = document.createElement('span');
                badge.className = 'search-suggestion-source';
                badge.textContent = 'Saved';
                button.appendChild(badge);
            }

            button.addEventListener('mousedown', (event) => {
                event.preventDefault();
            });

            button.addEventListener('click', () => {
                this.selectSuggestion(view, suggestion);
            });

            suggestionsElement.appendChild(button);
        });

        suggestionsElement.classList.remove('hidden');
    }

    async selectSuggestion(view, suggestion) {
        const context = this.getAutocompleteContext(view);
        const input = document.getElementById(context.inputId);
        if (input) {
            input.value = suggestion.label;
        }

        this.hideSuggestions(view);

        if (context.startup) {
            await this.loadWeather(suggestion.query, true);
            return;
        }

        await this.loadWeather(suggestion.query, false);
    }

    hideSuggestions(view) {
        const context = this.getAutocompleteContext(view);
        const suggestionsElement = document.getElementById(context.suggestionsId);
        if (!suggestionsElement) return;

        suggestionsElement.innerHTML = '';
        suggestionsElement.classList.add('hidden');
    }

    hideAllSuggestions() {
        this.hideSuggestions('startup');
        this.hideSuggestions('main');
    }

    handleDocumentClick(event) {
        ['startup', 'main'].forEach(view => {
            const context = this.getAutocompleteContext(view);
            const wrapper = document.getElementById(context.wrapperId);
            if (wrapper && !wrapper.contains(event.target)) {
                this.hideSuggestions(view);
            }
        });
    }

    getFavoriteCities() {
        try {
            const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
            if (!Array.isArray(favorites)) {
                return [];
            }

            return favorites
                .map(city => String(city || '').trim())
                .filter(Boolean);
        } catch (error) {
            return [];
        }
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

        this.hideSuggestions('startup');

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

        this.hideSuggestions('startup');
        const gpsBtn = document.getElementById('startup-gps-btn');
        if (gpsBtn) {
            gpsBtn.disabled = true;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await this.loadWeatherByCoords(position.coords.latitude, position.coords.longitude, true);
                if (gpsBtn) gpsBtn.disabled = false;
            },
            async () => {
                this.showError('Unable to retrieve your location. Please try again or search for a city.');
                if (gpsBtn) gpsBtn.disabled = false;
            },
            { timeout: 10000 }
        );
    }

    async handleSearch() {
        const cityInput = document.getElementById('city-input');
        const city = cityInput?.value.trim();

        this.hideSuggestions('main');

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

        this.hideSuggestions('main');
        const gpsBtn = document.getElementById('gps-btn');
        if (gpsBtn) {
            gpsBtn.disabled = true;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await this.loadWeatherByCoords(position.coords.latitude, position.coords.longitude);
                if (gpsBtn) gpsBtn.disabled = false;
            },
            async () => {
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
            this.hideAllSuggestions();
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

        const interactiveButtons = document.querySelectorAll('.startup-favorite-chip, .search-suggestion-btn');
        interactiveButtons.forEach(button => {
            button.disabled = disabled;
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
        const favorites = this.getFavoriteCities();
        this.renderMainFavorites(favorites);
        this.renderStartupFavorites(favorites);
    }

    renderMainFavorites(favorites) {
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

            cityButton.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
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

    renderStartupFavorites(favorites) {
        const startupFavorites = document.getElementById('startup-favorites');
        const startupFavoritesList = document.getElementById('startup-favorites-list');
        if (!startupFavorites || !startupFavoritesList) return;

        startupFavoritesList.innerHTML = '';

        if (favorites.length === 0) {
            startupFavorites.classList.add('hidden');
            return;
        }

        startupFavorites.classList.remove('hidden');

        favorites.forEach(city => {
            const chip = document.createElement('button');
            chip.className = 'startup-favorite-chip';
            chip.type = 'button';
            chip.textContent = city;
            chip.setAttribute('role', 'listitem');
            chip.setAttribute('aria-label', `Load weather for ${city}`);

            chip.addEventListener('click', () => {
                this.hideSuggestions('startup');
                this.loadWeather(city, true);
            });

            chip.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.hideSuggestions('startup');
                    this.loadWeather(city, true);
                }
            });

            startupFavoritesList.appendChild(chip);
        });
    }

    addToFavorites(city) {
        const favorites = this.getFavoriteCities();
        if (!favorites.includes(city)) {
            favorites.push(city);
            localStorage.setItem('favoriteCities', JSON.stringify(favorites));
            this.loadFavorites();
        }
    }

    removeFromFavorites(city) {
        const favorites = this.getFavoriteCities();
        const filtered = favorites.filter(savedCity => savedCity !== city);
        localStorage.setItem('favoriteCities', JSON.stringify(filtered));
        this.loadFavorites();
    }

    toggleFavorite() {
        if (!weatherHandler.currentData) return;

        const city = weatherHandler.currentData.name;
        const favorites = this.getFavoriteCities();
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
        const favorites = this.getFavoriteCities();
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
