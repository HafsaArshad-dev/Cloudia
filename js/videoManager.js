// CLOUDIA - Weather Background Video Manager
class WeatherVideoManager {
    constructor() {
        this.videoElement = document.getElementById('bg-video');
        this.currentVideo = null;
        this.isTransitioning = false;
        
        // Video mapping based on weather conditions and time
        this.videoMap = {
            // Clear/Sunny
            'Clear': {
                day: 'assets/videos/sunny.mp4',
                night: 'assets/videos/nightsky.mp4',
                sunrise: 'assets/videos/sunrise.mp4',
                sunset: 'assets/videos/sunset.mp4'
            },
            // Clouds
            'Clouds': {
                day: 'assets/videos/partlycloudy.mp4',
                night: 'assets/videos/partlycloudynight.mp4',
                overcast: 'assets/videos/overcastclouds.mp4'
            },
            // Rain
            'Rain': {
                day: 'assets/videos/rainyday.mp4',
                night: 'assets/videos/rainynight.mp4'
            },
            'Drizzle': {
                day: 'assets/videos/rainyday.mp4',
                night: 'assets/videos/rainynight.mp4'
            },
            // Thunderstorm
            'Thunderstorm': {
                all: 'assets/videos/thunderstorm.mp4'
            },
            // Snow
            'Snow': {
                day: 'assets/videos/snowday.mp4',
                night: 'assets/videos/snowynight.mp4'
            },
            // Fog/Mist
            'Fog': {
                all: 'assets/videos/fog.mp4'
            },
            'Mist': {
                all: 'assets/videos/fog.mp4'
            },
            'Haze': {
                all: 'assets/videos/fog.mp4'
            }
        };

        // Initialize video element
        if (this.videoElement) {
            this.setupVideoElement();
            this.preloadVideos();
        }
    }

    setupVideoElement() {
        // Ensure video is properly configured
        this.videoElement.setAttribute('autoplay', '');
        this.videoElement.setAttribute('muted', '');
        this.videoElement.setAttribute('loop', '');
        this.videoElement.setAttribute('playsinline', '');
        this.videoElement.muted = true;
        this.videoElement.defaultMuted = true;
        this.videoElement.loop = true;
        this.videoElement.playsInline = true;
        this.videoElement.preload = 'auto';
        
        // Handle video load errors gracefully
        this.videoElement.addEventListener('error', (e) => {
            console.warn('Video failed to load:', this.videoElement.src);
            // Fallback to CSS background if video fails
            this.handleVideoError();
        });

        // Handle video loaded
        this.videoElement.addEventListener('loadeddata', () => {
            this.fadeInVideo();
        });
    }

    // Determine time of day category
    getTimeCategory(sunrise, sunset, currentTime = null) {
        if (!sunrise || !sunset) {
            // Fallback to current time if no sunrise/sunset data
            const hour = new Date().getHours();
            if (hour >= 6 && hour < 8) return 'sunrise';
            if (hour >= 18 && hour < 20) return 'sunset';
            if (hour >= 20 || hour < 6) return 'night';
            return 'day';
        }

        const now = currentTime || Date.now() / 1000;
        const sunriseTime = sunrise;
        const sunsetTime = sunset;
        
        // Sunrise window: 1 hour before to 2 hours after sunrise
        if (now >= sunriseTime - 3600 && now < sunriseTime + 7200) {
            return 'sunrise';
        }
        
        // Sunset window: 1 hour before to 1 hour after sunset
        if (now >= sunsetTime - 3600 && now < sunsetTime + 3600) {
            return 'sunset';
        }
        
        // Night: after sunset or before sunrise
        if (now >= sunsetTime || now < sunriseTime) {
            return 'night';
        }
        
        // Day: between sunrise and sunset
        return 'day';
    }

    // Get video path based on weather condition
    getVideoPath(weatherMain, sunrise = null, sunset = null) {
        const condition = weatherMain;
        const timeCategory = this.getTimeCategory(sunrise, sunset);
        
        // Check if condition exists in video map
        if (!this.videoMap[condition]) {
            // Fallback: use time-based default
            if (timeCategory === 'night') {
                return 'assets/videos/nightsky.mp4';
            }
            return 'assets/videos/sunny.mp4';
        }

        const conditionMap = this.videoMap[condition];
        
        // Check for time-specific videos
        if (conditionMap[timeCategory]) {
            return conditionMap[timeCategory];
        }
        
        // Check for 'all' time video
        if (conditionMap.all) {
            return conditionMap.all;
        }
        
        // Fallback to day/night
        if (timeCategory === 'night' && conditionMap.night) {
            return conditionMap.night;
        }
        
        if (conditionMap.day) {
            return conditionMap.day;
        }
        
        // Final fallback
        return 'assets/videos/sunny.mp4';
    }

    // Change video with smooth transition
    changeVideo(videoPath, weatherMain, sunrise = null, sunset = null) {
        if (!this.videoElement || !videoPath) return;

        // Recover if a previous load error temporarily hid the video element.
        this.videoElement.style.display = 'block';
        const hasActiveVideo = Boolean(this.currentVideo || this.videoElement.currentSrc);
        
        // If same video, don't change
        if (this.currentVideo === videoPath && this.videoElement.src) {
            if (this.videoElement.paused) {
                this.videoElement.play().catch(e => {
                    console.warn('Video autoplay prevented:', e);
                });
            }
            this.fadeInVideo();
            return;
        }

        // If transitioning, wait
        if (this.isTransitioning) {
            setTimeout(() => this.changeVideo(videoPath, weatherMain, sunrise, sunset), 100);
            return;
        }

        this.isTransitioning = true;
        this.currentVideo = videoPath;

        const swapSourceAndPlay = () => {
            let playbackStarted = false;

            const startPlayback = () => {
                if (playbackStarted) return;
                playbackStarted = true;

                this.videoElement.play().catch(e => {
                    console.warn('Video autoplay prevented:', e);
                }).finally(() => {
                    setTimeout(() => {
                        this.fadeInVideo();
                    }, 60);
                });
            };

            // Attach listeners before load() so the first ready event is never missed.
            this.videoElement.addEventListener('canplay', startPlayback, { once: true });
            this.videoElement.addEventListener('loadeddata', startPlayback, { once: true });

            this.videoElement.src = videoPath;
            this.videoElement.load();

            if (this.videoElement.readyState >= 2) {
                startPlayback();
            }

            // Fallback for browsers that skip ready events under cached/media edge-cases.
            setTimeout(() => {
                startPlayback();
            }, 800);
        };

        // First load after search should appear quickly; skip unnecessary fade out.
        if (hasActiveVideo) {
            this.fadeOutVideo(swapSourceAndPlay);
        } else {
            swapSourceAndPlay();
        }
    }

    // Fade out video
    fadeOutVideo(callback) {
        if (!this.videoElement) {
            if (callback) callback();
            return;
        }

        this.videoElement.style.transition = 'opacity 1s ease-in-out';
        this.videoElement.style.opacity = '0';
        
        setTimeout(() => {
            if (callback) callback();
        }, 1000);
    }

    // Fade in video
    fadeInVideo() {
        if (!this.videoElement) return;
        
        this.videoElement.style.transition = 'opacity 1.5s ease-in-out';
        this.videoElement.style.opacity = '1';
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 1500);
    }

    // Handle video load error - fallback to CSS backgrounds
    handleVideoError() {
        console.warn('Video not available, using CSS background fallback');
        this.videoElement.style.display = 'none';
        this.isTransitioning = false;
    }

    // Apply video based on weather data
    applyWeatherVideo(weatherData) {
        if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
            return;
        }

        const weatherMain = weatherData.weather[0].main;
        const sunrise = weatherData.sys?.sunrise || null;
        const sunset = weatherData.sys?.sunset || null;
        
        const videoPath = this.getVideoPath(weatherMain, sunrise, sunset);
        this.changeVideo(videoPath, weatherMain, sunrise, sunset);
    }

    // Preload videos (optional - for better performance)
    preloadVideos() {
        const videosToPreload = [
            'assets/videos/sunny.mp4',
            'assets/videos/nightsky.mp4',
            'assets/videos/sunrise.mp4',
            'assets/videos/sunset.mp4',
            'assets/videos/partlycloudy.mp4',
            'assets/videos/overcastclouds.mp4',
            'assets/videos/thunderstorm.mp4'
        ];

        videosToPreload.forEach(videoPath => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = videoPath;
            document.head.appendChild(link);
        });
    }

    // Show default video on startup (optional)
    showStartupVideo() {
        // Show a subtle video during startup
        const defaultVideo = 'assets/videos/sunny.mp4';
        if (this.videoElement) {
            this.videoElement.src = defaultVideo;
            this.videoElement.load();
            this.videoElement.play().catch(e => {
                console.warn('Startup video autoplay prevented:', e);
            });
            this.videoElement.style.opacity = '0.3'; // Subtle during startup
        }
    }
}

// Create singleton instance
const weatherVideoManager = new WeatherVideoManager();
