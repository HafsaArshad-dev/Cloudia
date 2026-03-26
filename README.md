# 🌦️ CLOUDIA - Weather Web App

A modern, animated, and interactive Weather Web App designed and built by **Hafsa**.

![CLOUDIA](https://img.shields.io/badge/CLOUDIA-Weather%20App-blue?style=for-the-badge)

## 📋 Overview

CLOUDIA is a beautiful, responsive weather application that provides real-time weather data with stunning animations, ambient sounds, and adaptive themes. The app features glassmorphism design, smooth transitions, and comprehensive accessibility support.

### ✨ Key Features

- 🌍 **Real-time Weather Data** - Current weather, 5-day forecast, and weather alerts
- 🎨 **Animated UI** - Weather-themed loading animations, floating icons, and dynamic backgrounds
- 🌓 **Dark/Light Mode** - Smooth theme transitions with time-based auto-switching
- 🔊 **Ambient Sounds** - Background sounds for rain, thunder, and wind (toggleable)
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ♿ **Accessibility** - Full keyboard navigation, screen reader support, and high contrast mode
- 📍 **GPS & Manual Search** - Get weather by location or search any city
- 🌡️ **Unit Toggle** - Switch between Celsius and Fahrenheit
- ⭐ **Favorite Cities** - Save and quickly access your favorite locations
- 📊 **Multiple Forecast Views** - Hourly, daily, and weekly forecasts

## 🚀 Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An OpenWeather API key (free tier available)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd Cloudia
   ```

2. **Get your OpenWeather API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key from your dashboard
   - Copy your API key

3. **Configure the API Key**
   - Open `js/config.js`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   API_KEY: 'your-actual-api-key-here'
   ```

4. **Add Sound Files (Optional)**
   - Place ambient sound files in the `sounds/` directory:
     - `rain.mp3` - Rain sound effect
     - `thunder.mp3` - Thunder sound effect
     - `wind.mp3` - Wind sound effect
   - If sounds are not available, the app will work without them (sound toggle will be disabled)

5. **Add Favicon (Optional)**
   - Place `favicon.ico` in the `icons/` directory
   - Or update the favicon link in `index.html`

6. **Open the App**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (with http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```
   - Navigate to `http://localhost:8000` in your browser

## 🎯 Development Milestones

### Phase 1: Setup & Preparation ✅
- [x] **Sr#1** - Create Project Folder Structure
- [x] **Sr#2** - Select Tech Stack (Vanilla HTML/CSS/JS)
- [x] **Sr#3** - Configure API Key
- [x] **Sr#4** - Plan UI Layout
- [x] **Sr#5** - Collect Assets Structure

### Phase 2: Core Functionality - API Integration ✅
- [x] **Sr#6** - Create Base HTML Structure
- [x] **Sr#7** - Connect OpenWeather API
- [x] **Sr#8** - Parse API Data
- [x] **Sr#9** - Display Data Dynamically
- [x] **Sr#10** - Add Forecast API
- [x] **Sr#11** - Add Weather Alerts API
- [x] **Sr#12** - Add Error Handling

### Phase 3: Design, Theme & Interactions ✅
- [x] **Sr#13** - Apply Theme (Royal Blue, Sapphire, Quicksand palette)
- [x] **Sr#14** - Add Dark/Light Mode Toggle
- [x] **Sr#15** - Add High Contrast Mode
- [x] **Sr#16** - Add Animated Backgrounds
- [x] **Sr#17** - Add Animated Weather Icons
- [x] **Sr#18** - Add Sound Effects
- [x] **Sr#19** - Add Loading Animation
- [x] **Sr#20** - Add Responsive Design

### Phase 4: Advanced Features ✅
- [x] **Sr#21** - Temperature Unit Toggle (°C / °F)
- [x] **Sr#22** - Save Favorite Cities
- [x] **Sr#23** - Daily / Hourly / Weekly Tabs
- [x] **Sr#24** - Sunrise / Sunset Times
- [x] **Sr#25** - Real-Time Background Change
- [x] **Sr#26** - Weather Widget
- [x] **Sr#27** - Accessibility Features

### Phase 5: Optimization & Finishing Touches ✅
- [x] **Sr#28** - Optimize API Calls (Debouncing)
- [x] **Sr#29** - Cache Data (LocalStorage)
- [x] **Sr#30** - Optimize Assets Structure
- [x] **Sr#31** - Test Responsive Design
- [x] **Sr#32** - Add App Icon & Title

## 🎨 Theme & Design

### Color Palette
- **Primary**: Royal Blue (#112250) - Main background/nav
- **Accent**: Sapphire (#3C507D) - Card headers, highlights
- **Secondary**: Quicksand (#E0C58F) - Text contrast & highlights
- **Light Tones**: 
  - Swan Wing (#F5F0E9) - Background layers
  - Shellstone (#D9CBC2) - Light mode UI

### Design Features
- **Glassmorphism** - Soft transparency with backdrop blur
- **Smooth Animations** - Gradual transitions between themes
- **Adaptive Backgrounds** - Changes based on weather conditions
- **Modern Typography** - Poppins font family

## 📱 Usage

### Getting Weather Data

1. **Search by City**
   - Type a city name in the search bar
   - Press Enter or click the search button

2. **Use GPS Location**
   - Click the GPS button (📍)
   - Allow location access when prompted
   - Weather for your current location will load automatically

3. **Switch Temperature Units**
   - Click °C or °F buttons to toggle units

4. **View Forecasts**
   - Click on "Hourly", "Daily", or "Weekly" tabs
   - Scroll through forecast cards

5. **Toggle Themes**
   - Click the moon/sun icon for dark/light mode
   - Click the eye icon for high contrast mode
   - Click the speaker icon to toggle sounds

6. **Save Favorite Cities**
   - (Feature can be extended to add favorites from search results)

## 🔧 Configuration

### API Configuration
Edit `js/config.js` to customize:
- API endpoints
- Cache duration
- Default city
- Debounce delay
- Loading duration

### Theme Customization
Edit `css/style.css` CSS variables to change:
- Color scheme
- Glassmorphism effects
- Animation speeds
- Spacing and sizing

## 🌐 Deployment

### Deploy to GitHub Pages
1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select your branch and folder
4. Your app will be live at `https://yourusername.github.io/repository-name`

### Deploy to Netlify
1. Drag and drop the project folder to [Netlify](https://netlify.com)
2. Or connect your GitHub repository
3. Netlify will automatically deploy

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

## 🐛 Troubleshooting

### API Errors
- **401 Unauthorized**: Check your API key in `js/config.js`
- **404 Not Found**: Verify the city name is correct
- **Network Error**: Check your internet connection

### Sound Not Playing
- Ensure sound files are in the `sounds/` directory
- Check browser autoplay policies (some browsers require user interaction)
- Verify sound toggle is enabled (🔊 icon)

### Location Not Working
- Ensure location permissions are granted
- Check if HTTPS is enabled (required for geolocation)
- Try using manual city search instead

## 📝 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Privacy

- No user data is sent to external servers except OpenWeather API
- Location data is only used for weather requests
- All preferences are stored locally in your browser

## 📄 License

This project is created for personal use. All rights reserved.

## 👤 Credits

**Designed & Built by Hafsa**

---

## 🎯 Future Enhancements

Potential features for future versions:
- Weather maps integration
- Historical weather data
- Weather notifications
- Multiple location tracking
- Export weather data
- Social sharing features

---

**Enjoy using CLOUDIA! 🌦️✨**

