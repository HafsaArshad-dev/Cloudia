// CLOUDIA - API Service
class WeatherAPI {
    constructor() {
        this.cache = new Map();
        this.apiKey = CONFIG.API_KEY;
        this.baseUrl = CONFIG.API_BASE_URL;
        this.storagePrefix = 'cloudiaCache:';
        this.requestTimeout = 10000;
        this.prunePersistentCache();
    }

    normalizeSegment(value) {
        return String(value).trim().toLowerCase();
    }

    formatCoordinate(value) {
        return Number(value).toFixed(4);
    }

    buildCacheKey(type, locationKey, units = '') {
        const normalizedLocation = Array.isArray(locationKey)
            ? locationKey.map(value => this.normalizeSegment(value)).join('_')
            : this.normalizeSegment(locationKey);

        return [type, normalizedLocation, units].filter(Boolean).join('_');
    }

    getStorageKey(key) {
        return `${this.storagePrefix}${key}`;
    }

    isCacheEntryValid(entry) {
        return Boolean(entry) && typeof entry.timestamp === 'number' &&
            Date.now() - entry.timestamp < CONFIG.CACHE_DURATION;
    }

    getCached(key) {
        const memoryEntry = this.cache.get(key);
        if (this.isCacheEntryValid(memoryEntry)) {
            return memoryEntry.data;
        }

        this.cache.delete(key);

        try {
            const storedEntry = localStorage.getItem(this.getStorageKey(key));
            if (!storedEntry) return null;

            const parsedEntry = JSON.parse(storedEntry);
            if (this.isCacheEntryValid(parsedEntry)) {
                this.cache.set(key, parsedEntry);
                return parsedEntry.data;
            }

            localStorage.removeItem(this.getStorageKey(key));
        } catch (error) {
            localStorage.removeItem(this.getStorageKey(key));
        }

        return null;
    }

    setCache(key, data) {
        const entry = {
            data,
            timestamp: Date.now()
        };

        this.cache.set(key, entry);

        try {
            localStorage.setItem(this.getStorageKey(key), JSON.stringify(entry));
        } catch (error) {
            console.warn('Unable to persist weather cache.', error);
            this.prunePersistentCache();
        }
    }

    prunePersistentCache() {
        try {
            const expiredKeys = [];

            for (let index = 0; index < localStorage.length; index += 1) {
                const key = localStorage.key(index);
                if (!key || !key.startsWith(this.storagePrefix)) {
                    continue;
                }

                const rawValue = localStorage.getItem(key);
                if (!rawValue) {
                    expiredKeys.push(key);
                    continue;
                }

                try {
                    const parsedValue = JSON.parse(rawValue);
                    if (!this.isCacheEntryValid(parsedValue)) {
                        expiredKeys.push(key);
                    }
                } catch (error) {
                    expiredKeys.push(key);
                }
            }

            expiredKeys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.warn('Unable to prune stored cache.', error);
        }
    }

    buildUrl(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        url.searchParams.append('appid', this.apiKey);

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return url.toString();
    }

    async fetchData(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please check the city name.');
                }

                if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your configuration.');
                }

                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }

            if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your internet connection.');
            }

            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async getCurrentWeather(city, units = 'metric') {
        const cacheKey = this.buildCacheKey('current', city, units);
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const url = this.buildUrl('weather', {
            q: city,
            units
        });

        const data = await this.fetchData(url);
        this.setCache(cacheKey, data);
        return data;
    }

    async getCurrentWeatherByCoords(lat, lon, units = 'metric') {
        const cacheKey = this.buildCacheKey(
            'current',
            [this.formatCoordinate(lat), this.formatCoordinate(lon)],
            units
        );
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const url = this.buildUrl('weather', {
            lat,
            lon,
            units
        });

        const data = await this.fetchData(url);
        this.setCache(cacheKey, data);
        return data;
    }

    async getForecast(city, units = 'metric') {
        const cacheKey = this.buildCacheKey('forecast', city, units);
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const url = this.buildUrl('forecast', {
            q: city,
            units
        });

        const data = await this.fetchData(url);
        this.setCache(cacheKey, data);
        return data;
    }

    async getForecastByCoords(lat, lon, units = 'metric') {
        const cacheKey = this.buildCacheKey(
            'forecast',
            [this.formatCoordinate(lat), this.formatCoordinate(lon)],
            units
        );
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        const url = this.buildUrl('forecast', {
            lat,
            lon,
            units
        });

        const data = await this.fetchData(url);
        this.setCache(cacheKey, data);
        return data;
    }

    async getAlerts(lat, lon) {
        const cacheKey = this.buildCacheKey(
            'alerts',
            [this.formatCoordinate(lat), this.formatCoordinate(lon)]
        );
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        try {
            const url = this.buildUrl('onecall', {
                lat,
                lon,
                exclude: 'current,minutely,hourly,daily'
            });
            const data = await this.fetchData(url);
            const alerts = data.alerts || [];
            this.setCache(cacheKey, alerts);
            return alerts;
        } catch (error) {
            return [];
        }
    }
}

const weatherAPI = new WeatherAPI();
