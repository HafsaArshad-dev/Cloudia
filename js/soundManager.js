// CLOUDIA - Weather Sound Manager
class WeatherSoundManager {
    constructor() {
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.currentSounds = [];
        this.windThreshold = 15;
    }

    getSoundFiles(weatherMain, isDayTime, timeCategory, windSpeed = 0) {
        const condition = weatherMain;
        const isWindy = windSpeed >= this.windThreshold;
        const sounds = [];

        const windSound = { file: 'sounds/wind.mp3', volume: 0.25 };
        const lowHumSound = { file: 'sounds/lowhum.mp3', volume: 0.2 };
        const airWhooshSound = { file: 'sounds/airwhoosh.mp3', volume: 0.15 };
        const drizzleLightSound = { file: 'sounds/drizzle_light.mp3', volume: 0.25 };
        const puddlesSound = { file: 'sounds/puddles.mp3', volume: 0.18 };
        const stormWindSound = { file: 'sounds/storm_wind.mp3', volume: 0.24 };

        const birdsDaySound = { file: 'sounds/birds_day.mp3', volume: 0.3 };
        const morningChimesSound = { file: 'sounds/morning_chimes.mp3', volume: 0.25 };
        const crunchSnowDaySound = { file: 'sounds/crunch_snow_day.mp3', volume: 0.3 };
        const rainDayMediumSound = { file: 'sounds/rain_day_medium.mp3', volume: 0.35 };

        const cricketsNightSound = { file: 'sounds/crickets_night.mp3', volume: 0.3 };
        const eveningAmbienceSound = { file: 'sounds/evening_ambience.mp3', volume: 0.28 };
        const crunchSnowNightSound = { file: 'sounds/crunch_snow_night.mp3', volume: 0.24 };
        const rainSoftSound = { file: 'sounds/rain_day_soft.mp3', volume: 0.28 };

        if (condition === 'Clear') {
            if (timeCategory === 'sunrise') {
                sounds.push(birdsDaySound, morningChimesSound);
            } else if (timeCategory === 'sunset') {
                sounds.push(eveningAmbienceSound);
            } else if (isDayTime) {
                sounds.push(birdsDaySound);
            } else {
                sounds.push(cricketsNightSound);
            }

            if (isWindy) {
                sounds.push(windSound);
            }
        } else if (condition === 'Clouds') {
            sounds.push(isDayTime ? birdsDaySound : cricketsNightSound, lowHumSound);
            if (isWindy) {
                sounds.push(windSound);
            }
        } else if (condition === 'Rain') {
            sounds.push(isDayTime ? rainDayMediumSound : rainSoftSound, drizzleLightSound, puddlesSound);
            if (isWindy) {
                sounds.push(windSound);
            }
        } else if (condition === 'Drizzle') {
            sounds.push(drizzleLightSound, puddlesSound, lowHumSound);
            if (isWindy) {
                sounds.push(windSound);
            }
        } else if (condition === 'Thunderstorm') {
            sounds.push(stormWindSound, rainDayMediumSound, lowHumSound);
        } else if (condition === 'Snow') {
            sounds.push(isDayTime ? crunchSnowDaySound : crunchSnowNightSound, lowHumSound);
            if (isWindy) {
                sounds.push(windSound);
            }
        } else if (condition === 'Fog' || condition === 'Mist' || condition === 'Haze') {
            sounds.push(lowHumSound, airWhooshSound);
            if (isWindy) {
                sounds.push(windSound);
            }
        } else {
            sounds.push(lowHumSound);
            if (isWindy) {
                sounds.push(windSound);
            }
        }

        return this.dedupeSounds(sounds);
    }

    dedupeSounds(soundFiles) {
        const seenFiles = new Set();
        return soundFiles.filter(sound => {
            if (seenFiles.has(sound.file)) {
                return false;
            }

            seenFiles.add(sound.file);
            return true;
        });
    }

    createAudioId(filePath) {
        return `sound-${filePath.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
    }

    getOrCreateAudioElement(filePath) {
        const audioId = this.createAudioId(filePath);
        let audio = document.getElementById(audioId);

        if (!audio) {
            audio = document.createElement('audio');
            audio.id = audioId;
            audio.loop = true;
            audio.preload = 'auto';
            document.body.appendChild(audio);
        }

        let source = audio.querySelector('source');
        if (!source) {
            source = document.createElement('source');
            source.type = 'audio/mpeg';
            audio.appendChild(source);
        }

        if (source.getAttribute('src') !== filePath) {
            source.src = filePath;
            audio.load();
        }

        return audio;
    }

    stopAllSounds() {
        this.currentSounds.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        this.currentSounds = [];
    }

    playWeatherSounds(weatherData) {
        if (!this.soundEnabled) return;
        if (!weatherData || !weatherData.weather || !weatherData.weather[0]) return;

        this.stopAllSounds();

        const weatherMain = weatherData.weather[0].main;
        const sunrise = weatherData.sys?.sunrise || null;
        const sunset = weatherData.sys?.sunset || null;
        const windSpeed = weatherData.wind?.speed ? weatherData.wind.speed * 3.6 : 0;

        const timeCategory = this.getTimeCategory(sunrise, sunset);
        const isDayTime = this.isDayTime(sunrise, sunset);
        const soundFiles = this.getSoundFiles(weatherMain, isDayTime, timeCategory, windSpeed);

        soundFiles.forEach(soundConfig => {
            const audio = this.getOrCreateAudioElement(soundConfig.file);
            audio.volume = soundConfig.volume;
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.log(`Sound play failed for ${soundConfig.file}:`, error);
            });
            this.currentSounds.push(audio);
        });
    }

    getTimeCategory(sunrise, sunset) {
        if (!sunrise || !sunset) {
            const hour = new Date().getHours();
            if (hour >= 6 && hour < 8) return 'sunrise';
            if (hour >= 18 && hour < 20) return 'sunset';
            return hour >= 20 || hour < 6 ? 'night' : 'day';
        }

        const now = Date.now() / 1000;

        if (now >= sunrise - 3600 && now < sunrise + 7200) {
            return 'sunrise';
        }

        if (now >= sunset - 3600 && now < sunset + 3600) {
            return 'sunset';
        }

        if (now >= sunset || now < sunrise) {
            return 'night';
        }

        return 'day';
    }

    isDayTime(sunrise, sunset) {
        if (!sunrise || !sunset) {
            const hour = new Date().getHours();
            return hour >= 6 && hour < 20;
        }

        const now = Date.now() / 1000;
        return now >= sunrise && now < sunset;
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled);

        if (!this.soundEnabled) {
            this.stopAllSounds();
        }

        return this.soundEnabled;
    }

    isSoundEnabled() {
        return this.soundEnabled;
    }
}

const weatherSoundManager = new WeatherSoundManager();
