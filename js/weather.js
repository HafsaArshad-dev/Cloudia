// CLOUDIA - Weather Data Handler
class WeatherHandler {
    constructor() {
        this.currentUnit = localStorage.getItem('temperatureUnit') || 'celsius';
        this.currentData = null;
        this.currentForecastData = null;
        this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    convertTemp(temp, fromUnit, toUnit) {
        if (fromUnit === toUnit) return temp;

        if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
            return Math.round((temp * 9 / 5) + 32);
        }

        if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
            return Math.round((temp - 32) * 5 / 9);
        }

        return temp;
    }

    getUnitSymbol(unit = this.currentUnit) {
        return unit === 'celsius' ? '\u00B0C' : '\u00B0F';
    }

    getShiftedDate(timestamp, timezone = 0) {
        return new Date((timestamp + timezone) * 1000);
    }

    getWindDisplay(speed, unit = this.currentUnit) {
        if (unit === 'celsius') {
            return {
                value: Math.round(speed * 3.6),
                label: 'km/h'
            };
        }

        return {
            value: Math.round(speed),
            label: 'mph'
        };
    }

    formatTime(timestamp, timezone = 0) {
        const date = this.getShiftedDate(timestamp, timezone);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');

        return `${displayHours}:${displayMinutes} ${ampm}`;
    }

    formatDate(timestamp, timezone = 0) {
        const date = this.getShiftedDate(timestamp, timezone);
        return `${this.weekdays[date.getUTCDay()]}, ${this.months[date.getUTCMonth()]} ${date.getUTCDate()}`;
    }

    formatRelativeDate(timestamp, timezone = 0) {
        const target = this.getShiftedDate(timestamp, timezone);
        const now = this.getShiftedDate(Date.now() / 1000, timezone);

        const targetDay = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());
        const currentDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
        const dayDiff = Math.round((targetDay - currentDay) / 86400000);

        if (dayDiff === 0) return 'Today';
        if (dayDiff === 1) return 'Tomorrow';

        return this.formatDate(timestamp, timezone);
    }

    getDayKey(timestamp, timezone = 0) {
        const date = this.getShiftedDate(timestamp, timezone);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    pickRepresentativeItem(items, timezone = 0) {
        return items.reduce((closestItem, currentItem) => {
            const closestHour = this.getShiftedDate(closestItem.dt, timezone).getUTCHours();
            const currentHour = this.getShiftedDate(currentItem.dt, timezone).getUTCHours();
            return Math.abs(currentHour - 12) < Math.abs(closestHour - 12) ? currentItem : closestItem;
        });
    }

    getDailySummaries(forecastData) {
        const timezone = forecastData.city?.timezone || 0;
        const groupedDays = new Map();

        forecastData.list.forEach(item => {
            const dayKey = this.getDayKey(item.dt, timezone);
            if (!groupedDays.has(dayKey)) {
                groupedDays.set(dayKey, []);
            }

            groupedDays.get(dayKey).push(item);
        });

        return Array.from(groupedDays.values()).map(items => {
            const representative = this.pickRepresentativeItem(items, timezone);
            const temperatures = items.map(item => item.main.temp);
            const humidities = items.map(item => item.main.humidity);
            const windSpeeds = items.map(item => item.wind.speed);
            const precipitation = items.map(item => item.pop || 0);

            return {
                ...representative,
                dt: items[0].dt,
                tempMin: Math.min(...temperatures),
                tempMax: Math.max(...temperatures),
                tempAvg: temperatures.reduce((sum, value) => sum + value, 0) / temperatures.length,
                humidityAvg: Math.round(humidities.reduce((sum, value) => sum + value, 0) / humidities.length),
                windAvg: windSpeeds.reduce((sum, value) => sum + value, 0) / windSpeeds.length,
                popMax: Math.max(...precipitation)
            };
        });
    }

    escapeHtml(value = '') {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    getWeatherIcon(iconCode) {
        return `${CONFIG.ICON_BASE_URL}/${iconCode}@2x.png`;
    }

    displayCurrentWeather(data, unit = 'celsius') {
        this.currentData = data;

        const unitSymbol = this.getUnitSymbol(unit);
        const windDisplay = this.getWindDisplay(data.wind.speed, unit);

        const tempElement = document.getElementById('temperature');
        if (tempElement) {
            tempElement.textContent = Math.round(data.main.temp);
        }

        const unitElements = document.querySelectorAll('.temp-unit, .widget-unit');
        unitElements.forEach(element => {
            element.textContent = unitSymbol;
        });

        const iconElement = document.getElementById('weather-icon');
        if (iconElement) {
            iconElement.src = this.getWeatherIcon(data.weather[0].icon);
            iconElement.alt = data.weather[0].description;
        }

        const descElement = document.getElementById('weather-desc');
        if (descElement) {
            descElement.textContent = data.weather[0].description;
        }

        const cityElement = document.getElementById('city-name');
        if (cityElement) {
            cityElement.textContent = `${data.name}, ${data.sys.country}`;
        }

        const feelsLikeElement = document.getElementById('feels-like');
        if (feelsLikeElement) {
            feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}${unitSymbol}`;
        }

        const humidityElement = document.getElementById('humidity');
        if (humidityElement) {
            humidityElement.textContent = `${data.main.humidity}%`;
        }

        const windElement = document.getElementById('wind-speed');
        if (windElement) {
            windElement.textContent = `${windDisplay.value} ${windDisplay.label}`;
        }

        const pressureElement = document.getElementById('pressure');
        if (pressureElement) {
            pressureElement.textContent = `${data.main.pressure} hPa`;
        }

        const sunriseElement = document.getElementById('sunrise');
        if (sunriseElement) {
            sunriseElement.textContent = this.formatTime(data.sys.sunrise, data.timezone);
        }

        const sunsetElement = document.getElementById('sunset');
        if (sunsetElement) {
            sunsetElement.textContent = this.formatTime(data.sys.sunset, data.timezone);
        }

        this.updateWidget(data, unit);

        if (typeof weatherVideoManager !== 'undefined') {
            weatherVideoManager.applyWeatherVideo(data);
        }

        const isDayTime = themeManager.isDayTime(data.sys.sunrise, data.sys.sunset);
        weatherAnimations.applyWeatherBackground(data.weather[0].main, isDayTime);
        themeManager.applyTimeBasedTheme(data.sys.sunrise, data.sys.sunset);
        themeManager.playWeatherSound(data.weather[0].main, data);
    }

    updateWidget(data, unit = 'celsius') {
        const windDisplay = this.getWindDisplay(data.wind.speed, unit);

        const widgetTemp = document.getElementById('widget-temp');
        if (widgetTemp) {
            widgetTemp.textContent = Math.round(data.main.temp);
        }

        const widgetIcon = document.getElementById('widget-icon');
        if (widgetIcon) {
            widgetIcon.src = this.getWeatherIcon(data.weather[0].icon);
            widgetIcon.alt = data.weather[0].description;
        }

        const widgetHumidity = document.getElementById('widget-humidity');
        if (widgetHumidity) {
            widgetHumidity.textContent = `${data.main.humidity}%`;
        }

        const widgetWind = document.getElementById('widget-wind');
        if (widgetWind) {
            widgetWind.textContent = `${windDisplay.value} ${windDisplay.label}`;
        }
    }

    buildForecastMarkup(item, type, unit = 'celsius', timezone = 0) {
        const unitSymbol = this.getUnitSymbol(unit);
        const description = this.escapeHtml(item.weather[0].description);
        const iconUrl = this.getWeatherIcon(item.weather[0].icon);
        const windDisplay = this.getWindDisplay(item.windAvg ?? item.wind.speed, unit);
        const rainChance = Math.round((item.popMax ?? item.pop ?? 0) * 100);

        if (type === 'hourly') {
            const metaLine = rainChance > 0
                ? `Rain ${rainChance}%`
                : `Wind ${windDisplay.value} ${windDisplay.label}`;

            return `
                <div class="forecast-time">${this.formatTime(item.dt, timezone)}</div>
                <img src="${iconUrl}" alt="${description}" class="forecast-icon">
                <div class="forecast-temp">${Math.round(item.main.temp)}${unitSymbol}</div>
                <div class="forecast-desc">${description}</div>
                <div class="forecast-meta">${metaLine}</div>
            `;
        }

        if (type === 'daily') {
            const metaLine = rainChance > 0
                ? `Rain ${rainChance}%`
                : `Humidity ${item.humidityAvg}%`;

            return `
                <div class="forecast-time">${this.formatRelativeDate(item.dt, timezone)}</div>
                <img src="${iconUrl}" alt="${description}" class="forecast-icon">
                <div class="forecast-temp-range">
                    <span>H ${Math.round(item.tempMax)}${unitSymbol}</span>
                    <span>L ${Math.round(item.tempMin)}${unitSymbol}</span>
                </div>
                <div class="forecast-desc">${description}</div>
                <div class="forecast-meta">${metaLine}</div>
            `;
        }

        return `
            <div class="forecast-time">${this.formatDate(item.dt, timezone)}</div>
            <img src="${iconUrl}" alt="${description}" class="forecast-icon">
            <div class="forecast-temp">${Math.round(item.tempAvg)}${unitSymbol} avg</div>
            <div class="forecast-temp-range">
                <span>H ${Math.round(item.tempMax)}${unitSymbol}</span>
                <span>L ${Math.round(item.tempMin)}${unitSymbol}</span>
            </div>
            <div class="forecast-desc">${description}</div>
            <div class="forecast-meta">Humidity ${item.humidityAvg}% - Wind ${windDisplay.value} ${windDisplay.label}</div>
        `;
    }

    displayForecast(forecastData, unit = 'celsius', type = 'hourly') {
        const forecastContent = document.getElementById('forecast-content');
        if (!forecastContent) return;

        this.currentForecastData = forecastData;
        forecastContent.innerHTML = '';
        forecastContent.dataset.view = type;

        const items = type === 'hourly'
            ? forecastData.list.slice(0, 12)
            : this.getDailySummaries(forecastData).slice(0, 5);
        const timezone = forecastData.city?.timezone || 0;

        if (items.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'forecast-empty';
            emptyState.textContent = 'Forecast data is not available right now.';
            forecastContent.appendChild(emptyState);
            return;
        }

        items.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = this.buildForecastMarkup(item, type, unit, timezone);
            forecastContent.appendChild(forecastItem);
        });
    }

    displayAlerts(alerts) {
        const alertsSection = document.getElementById('weather-alerts');
        const alertsContent = document.getElementById('alerts-content');

        if (!alerts || alerts.length === 0) {
            if (alertsSection) {
                alertsSection.style.display = 'none';
            }
            return;
        }

        if (alertsSection) {
            alertsSection.style.display = 'block';
        }

        if (alertsContent) {
            alertsContent.innerHTML = '';

            alerts.forEach(alert => {
                const alertItem = document.createElement('div');
                alertItem.className = 'alert-item';

                const title = document.createElement('h4');
                title.textContent = alert.event;

                const description = document.createElement('p');
                description.textContent = alert.description;

                const timing = document.createElement('small');
                timing.textContent = `From: ${new Date(alert.start * 1000).toLocaleString()} To: ${new Date(alert.end * 1000).toLocaleString()}`;

                alertItem.appendChild(title);
                alertItem.appendChild(description);
                alertItem.appendChild(timing);
                alertsContent.appendChild(alertItem);
            });
        }
    }

    syncUnitButtons() {
        const unitButtons = document.querySelectorAll('.unit-btn');
        unitButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.unit === this.currentUnit);
        });
    }

    setUnit(unit) {
        this.currentUnit = unit;
        localStorage.setItem('temperatureUnit', unit);
        this.syncUnitButtons();

        if (this.currentData) {
            this.displayCurrentWeather(this.currentData, unit);
        }
    }
}

const weatherHandler = new WeatherHandler();
