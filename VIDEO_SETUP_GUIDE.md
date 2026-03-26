# 🎬 CLOUDIA - Video Background Setup Guide

## 📋 Overview

CLOUDIA now supports dynamic weather background videos that automatically change based on real-time weather conditions and time of day. This guide will help you set up and deploy the video files.

## 📁 Folder Structure

Create the following folder structure (if not already created):

```
Cloudia/
├── assets/
│   └── videos/
│       ├── sunny.mp4
│       ├── sunrise.mp4
│       ├── sunset.mp4
│       ├── partlycloudy.mp4
│       ├── partlycloudynight.mp4
│       ├── overcastclouds.mp4
│       ├── rainynight.mp4
│       ├── snowday.mp4
│       ├── snowynight.mp4
│       ├── fog.mp4
│       ├── nightsky.mp4
│       └── thunderstorm.mp4
```

## 🎥 Required Video Files

Place your video files in `/assets/videos/` with these **exact names**:

| File Name | Weather Condition | Time of Day |
|-----------|------------------|-------------|
| `sunny.mp4` | Clear/Sunny | Day |
| `sunrise.mp4` | Clear/Sunny | Morning (sunrise window) |
| `sunset.mp4` | Clear/Sunny | Evening (sunset window) |
| `nightsky.mp4` | Clear/Sunny | Night |
| `partlycloudy.mp4` | Partly Cloudy | Day |
| `partlycloudynight.mp4` | Partly Cloudy | Night |
| `overcastclouds.mp4` | Overcast/Cloudy | Day |
| `rainynight.mp4` | Rain | Night |
| `snowday.mp4` | Snow | Day |
| `snowynight.mp4` | Snow | Night |
| `fog.mp4` | Fog/Mist/Haze | All times |
| `thunderstorm.mp4` | Thunderstorm | All times |

## 🎬 Video Specifications

### Recommended Settings:
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 (Full HD) minimum
- **Aspect Ratio**: 16:9
- **Duration**: 10-30 seconds (will loop automatically)
- **File Size**: Optimize for web (aim for 2-5 MB per video)
- **Frame Rate**: 24-30 fps
- **Audio**: Can include audio, but videos are muted by default

### Optimization Tips:
1. Use video compression tools (HandBrake, FFmpeg)
2. Target bitrate: 2-5 Mbps for good quality
3. Remove audio if not needed (saves file size)
4. Test on different devices for performance

## ⚙️ How It Works

### Automatic Video Selection:

The app automatically selects videos based on:

1. **Weather Condition** (from OpenWeather API):
   - Clear → `sunny.mp4` (day) or `nightsky.mp4` (night)
   - Clouds → `partlycloudy.mp4` (day) or `partlycloudynight.mp4` (night)
   - Rain → `overcastclouds.mp4` (day) or `rainynight.mp4` (night)
   - Thunderstorm → `thunderstorm.mp4` (all times)
   - Snow → `snowday.mp4` (day) or `snowynight.mp4` (night)
   - Fog/Mist → `fog.mp4` (all times)

2. **Time of Day** (from sunrise/sunset times):
   - **Sunrise Window**: 1 hour before to 2 hours after sunrise → `sunrise.mp4`
   - **Sunset Window**: 1 hour before to 1 hour after sunset → `sunset.mp4`
   - **Night**: After sunset or before sunrise → night versions
   - **Day**: Between sunrise and sunset → day versions

### Smooth Transitions:

- Videos fade in/out smoothly (1-2 seconds)
- No abrupt cuts between weather changes
- Overlay ensures text remains readable

## 🚀 Setup Steps

### Step 1: Prepare Your Videos
1. Ensure all 12 video files are ready
2. Optimize them for web (compress if needed)
3. Verify file names match exactly (case-sensitive)

### Step 2: Upload Videos
1. Navigate to `/assets/videos/` folder in your project
2. Copy all video files into this folder
3. Verify all files are present

### Step 3: Test the App
1. Open `index.html` in your browser
2. Search for different cities with different weather
3. Verify videos change correctly
4. Check transitions are smooth
5. Ensure text remains readable

### Step 4: Deploy
When deploying to a hosting service:
- Ensure `/assets/videos/` folder is included
- All video files are uploaded
- Check file paths are correct on server

## 🎨 Customization

### Adjust Overlay Opacity

Edit `css/style.css`:

```css
.video-overlay {
    background: rgba(0, 0, 0, 0.25); /* Change 0.25 to adjust opacity */
}
```

- Lower value (0.1-0.2) = More visible video, less text contrast
- Higher value (0.3-0.5) = Less visible video, better text contrast

### Disable 3D Animations (Optional)

If you want only videos (no 3D CSS animations), edit `css/style.css`:

```css
.weather-3d-container {
    display: none; /* Hide 3D animations */
}
```

### Change Transition Speed

Edit `js/videoManager.js`:

```javascript
// In fadeOutVideo method
setTimeout(() => {
    if (callback) callback();
}, 1000); // Change 1000 to adjust fade-out speed (milliseconds)
```

## 🐛 Troubleshooting

### Videos Not Playing:
1. **Check file paths**: Ensure videos are in `/assets/videos/`
2. **Check file names**: Must match exactly (case-sensitive)
3. **Check browser console**: Look for error messages
4. **Check file format**: Must be MP4 (H.264)
5. **Check file size**: Very large files may load slowly

### Videos Not Changing:
1. **Clear browser cache**: Hard refresh (Ctrl+F5)
2. **Check weather data**: Verify API is returning correct conditions
3. **Check console**: Look for JavaScript errors

### Performance Issues:
1. **Compress videos**: Reduce file size
2. **Lower resolution**: Use 1280x720 instead of 1920x1080
3. **Reduce duration**: Shorter videos = smaller files
4. **Check network**: Large files need good connection

### Text Not Readable:
1. **Increase overlay opacity**: Edit CSS (see Customization)
2. **Adjust theme**: Try dark/light mode toggle
3. **Check video brightness**: Some videos may be too bright/dark

## 📝 Fallback Behavior

If videos fail to load:
- App falls back to CSS gradient backgrounds
- 3D animations still work
- App continues to function normally
- No errors shown to user

## 🎵 Sound Files (Optional)

See `sounds/README_SOUNDS.md` for information about adding ambient weather sounds.

## ✅ Checklist

Before deploying:
- [ ] All 12 video files are in `/assets/videos/`
- [ ] File names match exactly
- [ ] Videos are optimized for web
- [ ] Tested on different weather conditions
- [ ] Tested on mobile devices
- [ ] Text remains readable with overlay
- [ ] Transitions are smooth
- [ ] No console errors

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify file paths and names
3. Test with one video file first
4. Check video format and codec

---

**Note**: The app works perfectly without videos (uses CSS backgrounds as fallback). Videos are an enhancement for a more immersive experience.

**Designed & Built by Hafsa** 🌦️✨


