// CLOUDIA - 3D Weather Animations Manager
class Weather3DAnimations {
    constructor() {
        this.container = document.getElementById('weather-3d-container');
        this.currentAnimation = null;
    }

    // Clear all 3D animations
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.currentAnimation = null;
    }

    // Create 3D Sunny Animation
    createSunny3D() {
        this.clear();
        if (!this.container) return;

        // Create 3D Sun
        const sun = document.createElement('div');
        sun.className = 'sun-3d';
        this.container.appendChild(sun);

        // Create Sun Rays
        const raysContainer = document.createElement('div');
        raysContainer.className = 'sun-rays';
        for (let i = 0; i < 12; i++) {
            const ray = document.createElement('div');
            ray.className = 'sun-ray';
            ray.style.transform = `rotate(${i * 30}deg)`;
            ray.style.left = '50%';
            ray.style.top = '50%';
            raysContainer.appendChild(ray);
        }
        this.container.appendChild(raysContainer);

        // Create 3D Clouds
        for (let i = 1; i <= 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = `cloud-3d cloud-3d-${i}`;
            cloud.style.setProperty('--cloud-z', `${30 + i * 25}px`);
            this.container.appendChild(cloud);
        }

        this.currentAnimation = 'sunny';
    }

    // Create 3D Rainy Animation
    createRainy3D() {
        this.clear();
        if (!this.container) return;

        // Create multiple 3D raindrops
        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop-3d';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            drop.style.animationDuration = `${0.3 + Math.random() * 0.4}s`;
            drop.style.opacity = `${0.4 + Math.random() * 0.4}`;
            this.container.appendChild(drop);
        }

        this.currentAnimation = 'rainy';
    }

    // Create 3D Snowy Animation
    createSnowy3D() {
        this.clear();
        if (!this.container) return;

        const snowflakeSymbols = ['❄', '❅', '❆', '✦', '✧'];
        
        // Create multiple 3D snowflakes
        for (let i = 0; i < 50; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake-3d';
            flake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.animationDelay = `${Math.random() * 5}s`;
            flake.style.animationDuration = `${4 + Math.random() * 4}s`;
            flake.style.opacity = `${0.5 + Math.random() * 0.5}`;
            this.container.appendChild(flake);
        }

        this.currentAnimation = 'snowy';
    }

    // Create 3D Thunderstorm Animation
    createThunder3D() {
        this.clear();
        if (!this.container) return;

        // Create lightning bolts
        for (let i = 0; i < 3; i++) {
            const lightning = document.createElement('div');
            lightning.className = 'lightning-3d';
            lightning.style.left = `${20 + i * 30}%`;
            lightning.style.top = `${10 + Math.random() * 20}%`;
            lightning.style.animationDelay = `${i * 1.5}s`;
            this.container.appendChild(lightning);
        }

        // Add rain with thunder
        for (let i = 0; i < 80; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop-3d';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            drop.style.animationDuration = `${0.2 + Math.random() * 0.3}s`;
            drop.style.opacity = `${0.5 + Math.random() * 0.3}`;
            this.container.appendChild(drop);
        }

        this.currentAnimation = 'thunder';
    }

    // Create 3D Night Animation
    createNight3D() {
        this.clear();
        if (!this.container) return;

        // Create 3D Moon
        const moon = document.createElement('div');
        moon.className = 'moon-3d';
        this.container.appendChild(moon);

        // Create 3D Stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star-3d';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 80}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${2 + Math.random() * 2}s`;
            this.container.appendChild(star);
        }

        this.currentAnimation = 'night';
    }

    // Apply 3D animation based on weather condition
    apply3DAnimation(weatherCondition, isDayTime = true) {
        const condition = weatherCondition.toLowerCase();
        
        if (condition.includes('thunder') || condition.includes('storm')) {
            this.createThunder3D();
        } else if (condition.includes('rain') || condition.includes('drizzle')) {
            this.createRainy3D();
        } else if (condition.includes('snow')) {
            this.createSnowy3D();
        } else if (condition.includes('clear') || condition.includes('sun')) {
            if (isDayTime) {
                this.createSunny3D();
            } else {
                this.createNight3D();
            }
        } else if (condition.includes('cloud')) {
            if (isDayTime) {
                this.createSunny3D(); // Sunny with clouds
            } else {
                this.createNight3D();
            }
        } else {
            // Default based on time
            if (isDayTime) {
                this.createSunny3D();
            } else {
                this.createNight3D();
            }
        }
    }

    // Create subtle 3D background for startup
    createStartup3D() {
        this.clear();
        if (!this.container) return;

        // Subtle floating particles/clouds for startup
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud-3d';
            cloud.style.width = `${80 + Math.random() * 60}px`;
            cloud.style.height = `${30 + Math.random() * 20}px`;
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.top = `${20 + Math.random() * 60}%`;
            cloud.style.setProperty('--cloud-z', `${20 + Math.random() * 40}px`);
            cloud.style.opacity = '0.6';
            cloud.style.animationDuration = `${15 + Math.random() * 10}s`;
            this.container.appendChild(cloud);
        }
    }
}

// Create singleton instance
const weather3D = new Weather3DAnimations();

