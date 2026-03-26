// CLOUDIA - Weather Animations
class WeatherAnimations {
    constructor() {
        this.backgroundElement = document.getElementById('weather-background');
    }

    // Remove all weather classes
    clearWeatherClasses() {
        if (!this.backgroundElement) return;
        const classes = ['sunny', 'rainy', 'snowy', 'thunder', 'night'];
        classes.forEach(cls => this.backgroundElement.classList.remove(cls));
    }

    // Apply weather background animation (with 3D)
    applyWeatherBackground(weatherCondition, isDayTime = true) {
        if (!this.backgroundElement) return;

        this.clearWeatherClasses();

        const condition = weatherCondition.toLowerCase();
        
        // Remove existing animations (disabled - using video backgrounds)
        // this.removeRainAnimation();
        // this.removeSnowAnimation();

        // 3D animations disabled - using video backgrounds only
        // if (typeof weather3D !== 'undefined') {
        //     weather3D.apply3DAnimation(weatherCondition, isDayTime);
        // }

        if (condition.includes('thunder') || condition.includes('storm')) {
            this.backgroundElement.classList.add('thunder');
        } else if (condition.includes('rain') || condition.includes('drizzle')) {
            this.backgroundElement.classList.add('rainy');
            // this.createRainAnimation(); // Disabled - using video backgrounds
        } else if (condition.includes('snow')) {
            this.backgroundElement.classList.add('snowy');
            // this.createSnowAnimation(); // Disabled - using video backgrounds
        } else if (condition.includes('clear') || condition.includes('sun')) {
            if (isDayTime) {
                this.backgroundElement.classList.add('sunny');
            } else {
                this.backgroundElement.classList.add('night');
            }
        } else if (condition.includes('cloud')) {
            if (isDayTime) {
                this.backgroundElement.classList.add('sunny');
            } else {
                this.backgroundElement.classList.add('night');
            }
        } else {
            // Default based on time
            if (isDayTime) {
                this.backgroundElement.classList.add('sunny');
            } else {
                this.backgroundElement.classList.add('night');
            }
        }
    }

    // Create rain animation
    createRainAnimation() {
        if (!this.backgroundElement) return;

        const rainContainer = document.createElement('div');
        rainContainer.className = 'rain-drops';
        rainContainer.id = 'rain-container';

        // Create multiple rain drops
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            rainContainer.appendChild(drop);
        }

        this.backgroundElement.appendChild(rainContainer);
    }

    // Remove rain animation
    removeRainAnimation() {
        const rainContainer = document.getElementById('rain-container');
        if (rainContainer) {
            rainContainer.remove();
        }
    }

    // Create snow animation
    createSnowAnimation() {
        if (!this.backgroundElement) return;

        const snowContainer = document.createElement('div');
        snowContainer.className = 'snowflakes';
        snowContainer.id = 'snow-container';

        // Create snowflakes
        const snowflakeSymbols = ['\u2744', '\u2745', '\u2746'];
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.animationDelay = `${Math.random() * 5}s`;
            flake.style.animationDuration = `${3 + Math.random() * 4}s`;
            flake.style.opacity = `${0.5 + Math.random() * 0.5}`;
            snowContainer.appendChild(flake);
        }

        this.backgroundElement.appendChild(snowContainer);
    }

    // Remove snow animation
    removeSnowAnimation() {
        const snowContainer = document.getElementById('snow-container');
        if (snowContainer) {
            snowContainer.remove();
        }
    }

    // Hide loading screen
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, CONFIG.LOADING_DURATION);
        }
    }

    // Show loading screen
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            loadingScreen.style.display = 'flex';
        }
    }

    // Reveal main content after search
    revealMainContent() {
        const startupView = document.getElementById('startup-view');
        const mainContent = document.getElementById('main-content');
        
        if (startupView) {
            startupView.classList.add('hidden');
        }
        
        if (mainContent) {
            mainContent.classList.remove('hidden');
            setTimeout(() => {
                mainContent.classList.add('visible');
            }, 100);
        }
    }

    // Initialize startup 3D background
    initStartup3D() {
        // 3D animations disabled - using video backgrounds only
        // if (typeof weather3D !== 'undefined') {
        //     weather3D.createStartup3D();
        // }
        
        // Initialize startup video (optional)
        if (typeof weatherVideoManager !== 'undefined') {
            // Uncomment to show startup video:
            // weatherVideoManager.showStartupVideo();
        }
    }
}

// Create singleton instance
const weatherAnimations = new WeatherAnimations();
