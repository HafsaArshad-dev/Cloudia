// CLOUDIA - Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.highContrast = localStorage.getItem('highContrast') === 'true';
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.init();
    }

    init() {
        if (typeof weatherSoundManager !== 'undefined') {
            this.soundEnabled = weatherSoundManager.isSoundEnabled();
        }

        this.applyTheme(this.currentTheme);
        this.applyHighContrast(this.highContrast);
        this.updateSoundToggle();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        localStorage.setItem('manualTheme', 'true');
        this.updateThemeToggleIcon();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.updateThemeToggleIcon();
    }

    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const icon = themeToggle.querySelector('.icon');
        if (icon) {
            icon.textContent = this.currentTheme === 'dark'
                ? '\u2600\uFE0F'
                : String.fromCodePoint(0x1F319);
        }
    }

    toggleHighContrast() {
        this.highContrast = !this.highContrast;
        this.applyHighContrast(this.highContrast);
        localStorage.setItem('highContrast', this.highContrast);
    }

    applyHighContrast(enabled) {
        if (enabled) {
            document.documentElement.setAttribute('data-contrast', 'high');
        } else {
            document.documentElement.removeAttribute('data-contrast');
        }
    }

    toggleSound() {
        if (typeof weatherSoundManager !== 'undefined') {
            this.soundEnabled = weatherSoundManager.toggleSound();
        } else {
            this.soundEnabled = !this.soundEnabled;
            localStorage.setItem('soundEnabled', this.soundEnabled);
            this.stopAllSounds();
        }

        this.updateSoundToggle();
    }

    updateSoundToggle() {
        if (typeof weatherSoundManager !== 'undefined') {
            this.soundEnabled = weatherSoundManager.isSoundEnabled();
        }

        const soundToggle = document.getElementById('sound-toggle');
        if (!soundToggle) return;

        const icon = soundToggle.querySelector('.icon');
        if (icon) {
            icon.textContent = this.soundEnabled
                ? String.fromCodePoint(0x1F50A)
                : String.fromCodePoint(0x1F507);
        }
    }

    stopAllSounds() {
        if (typeof weatherSoundManager !== 'undefined') {
            weatherSoundManager.stopAllSounds();
            return;
        }

        const sounds = ['rain-sound', 'thunder-sound', 'wind-sound'];
        sounds.forEach(soundId => {
            const audio = document.getElementById(soundId);
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }

    playWeatherSound(condition, weatherData = null) {
        if (typeof weatherSoundManager !== 'undefined' && weatherData) {
            weatherSoundManager.playWeatherSounds(weatherData);
            return;
        }

        if (!this.soundEnabled) return;

        this.stopAllSounds();
        const conditionLower = condition.toLowerCase();

        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            const rainSound = document.getElementById('rain-sound');
            if (rainSound) {
                rainSound.volume = 0.3;
                rainSound.play().catch(error => console.log('Sound play failed:', error));
            }
        } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
            const thunderSound = document.getElementById('thunder-sound');
            if (thunderSound) {
                thunderSound.volume = 0.2;
                thunderSound.play().catch(error => console.log('Sound play failed:', error));
            }
        } else if (conditionLower.includes('wind') || conditionLower.includes('breeze')) {
            const windSound = document.getElementById('wind-sound');
            if (windSound) {
                windSound.volume = 0.25;
                windSound.play().catch(error => console.log('Sound play failed:', error));
            }
        }
    }

    isDayTime(sunrise, sunset) {
        const now = Date.now() / 1000;
        return now >= sunrise && now < sunset;
    }

    applyTimeBasedTheme(sunrise, sunset) {
        document.documentElement.setAttribute(
            'data-time',
            this.isDayTime(sunrise, sunset) ? 'day' : 'night'
        );
    }

    autoSwitchThemeByWeather(weatherCondition, isDayTime = true) {
        const condition = weatherCondition.toLowerCase();
        let shouldBeDark = false;

        if (
            condition.includes('rain') ||
            condition.includes('snow') ||
            condition.includes('thunder') ||
            condition.includes('storm') ||
            condition.includes('drizzle')
        ) {
            shouldBeDark = true;
        } else if (condition.includes('clear') || condition.includes('sun')) {
            shouldBeDark = !isDayTime;
        } else {
            shouldBeDark = !isDayTime;
        }

        const manualTheme = localStorage.getItem('manualTheme');
        if (!manualTheme) {
            if (shouldBeDark && this.currentTheme !== 'dark') {
                this.applyTheme('dark');
            } else if (!shouldBeDark && this.currentTheme !== 'light') {
                this.applyTheme('light');
            }
        }
    }
}

const themeManager = new ThemeManager();
