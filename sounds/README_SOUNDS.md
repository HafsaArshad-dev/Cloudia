# Ambient Weather Sounds Guide

## 📁 Folder Structure

Place your ambient sound files in the `/sounds/` directory with the following exact names:

```
sounds/
├── wind.mp3                    (Universal - all conditions)
├── lowhum.mp3                  (Universal - overcast, snow, fog)
├── airwhoosh.mp3               (Universal - fog/mist/haze)
├── drizzle_light.mp3           (Universal - rain, drizzle)
├── puddles.mp3                 (Universal - rain, drizzle)
├── storm_wind.mp3              (Universal - thunderstorms)
├── birds_day.mp3               (Day - clear, sunrise, partly cloudy)
├── morning_chimes.mp3          (Day - sunrise)
├── crunch_snow_day.mp3         (Day - snow)
├── rain_day_medium.mp3         (Day - rain, thunderstorms)
├── crickets_night.mp3          (Night - clear, partly cloudy)
├── evening_ambience.mp3       (Night - sunset, snow)
├── snow_night_ambience.mp3      (Night - snow)
└── rain_night_soft.mp3         (Night - rain)
└── thunder_strong.mp3          (Thunderstorms)
```

## 🎵 Sound File Specifications

### Recommended Format
- **Format**: MP3 (most compatible)
- **Alternative**: OGG, WAV
- **Bitrate**: 128-192 kbps (good quality, reasonable file size)
- **Duration**: 10-30 seconds (will loop automatically)
- **File Size**: Aim for 200KB - 1MB per file

## 🌤️ Weather Condition Sound Mapping

### Universal Sounds (Work for Day & Night)
These sounds can be used across multiple conditions and times:
- `wind.mp3` - Wind sound (used in most conditions)
- `lowhum.mp3` - Low hum (overcast, snow, fog)
- `airwhoosh.mp3` - Air whoosh (fog/mist/haze)
- `drizzle_light.mp3` - Light drizzle (rain, drizzle)
- `puddles.mp3` - Puddle sounds (rain, drizzle)
- `storm_wind.mp3` - Storm wind (thunderstorms)

### Day-Specific Sounds
- `birds_day.mp3` - Birds chirping (clear day, sunrise, partly cloudy day)
- `morning_chimes.mp3` - Morning chimes (sunrise)
- `crunch_snow_day.mp3` - Snow crunching (snow day)
- `rain_day_medium.mp3` - Medium rain (rain day, thunderstorms)

### Night-Specific Sounds
- `crickets_night.mp3` - Crickets (clear night, partly cloudy night)
- `evening_ambience.mp3` - Evening ambience (sunset, snow night)
- `snow_night_ambience.mp3` - Snow night ambience (snow night)
- `rain_night_soft.mp3` - Soft rain (rain night)

### Thunderstorm-Specific
- `thunder_strong.mp3` - Strong thunder (thunderstorms)

## 🎬 Complete Weather → Video → Sound Mapping

| Weather Condition | Video File | Sound Layers (Simultaneous) |
|------------------|------------|----------------------------|
| **Clear Day** | `sunny.mp4` | `birds_day.mp3` + `wind.mp3` |
| **Clear Night** | `nightsky.mp4` | `crickets_night.mp3` + `wind.mp3` |
| **Sunrise** | `sunrise.mp4` | `birds_day.mp3` + `morning_chimes.mp3` + `wind.mp3` |
| **Sunset** | `sunset.mp4` | `evening_ambience.mp3` + `wind.mp3` |
| **Partly Cloudy Day** | `partlycloudy.mp4` | `birds_day.mp3` + `wind.mp3` |
| **Partly Cloudy Night** | `partlycloudynight.mp4` | `crickets_night.mp3` + `wind.mp3` |
| **Overcast Day** | `overcastclouds.mp4` | `wind.mp3` + `lowhum.mp3` |
| **Rain Day** | `rainyday.mp4` | `rain_day_medium.mp3` + `drizzle_light.mp3` + `puddles.mp3` + `wind.mp3` |
| **Rain Night** | `rainynight.mp4` | `rain_night_soft.mp3` + `drizzle_light.mp3` + `puddles.mp3` + `wind.mp3` |
| **Drizzle Day** | `rainyday.mp4` | `drizzle_light.mp3` + `puddles.mp3` + `wind.mp3` |
| **Drizzle Night** | `rainynight.mp4` | `drizzle_light.mp3` + `puddles.mp3` + `wind.mp3` |
| **Thunderstorm** | `thunderstorm.mp4` | `storm_wind.mp3` + `rain_day_medium.mp3` + `thunder_strong.mp3` |
| **Snow Day** | `snowday.mp4` | `crunch_snow_day.mp3` + `wind.mp3` + `lowhum.mp3` |
| **Snow Night** | `snowynight.mp4` | `snow_night_ambience.mp3` + `wind.mp3` + `lowhum.mp3` |
| **Fog / Mist / Haze** | `fog.mp4` | `lowhum.mp3` + `airwhoosh.mp3` + `wind.mp3` |

## 🎛️ Volume Levels

- **Primary Sounds**: 28-35% volume (main ambient sound)
- **Secondary/Layered Sounds**: 15-25% volume (background layers)
- **Wind Sound**: 25% volume (consistent across conditions)
- **Thunder**: 25% volume (louder for impact)

## 🎵 Layering Rules

1. **Multiple sounds play simultaneously** - Creates rich, immersive ambience
2. **Primary sounds** are the main ambient layer (birds, crickets, rain, etc.)
3. **Universal sounds** (wind, lowhum) layer with time-specific sounds
4. **Time-specific sounds** take precedence for clarity (day vs night)

## 📍 Where to Get Sounds

### Free Sound Resources:
1. **Freesound.org** - https://freesound.org
   - Search for specific sounds (e.g., "birds chirping", "rain medium", "thunder")
   - Filter by: CC0 or CC BY license
   - Download MP3 format

2. **Zapsplat** - https://www.zapsplat.com
   - Free account required
   - High quality ambient sounds
   - Multiple variations available

3. **Mixkit** - https://mixkit.co/free-sound-effects/
   - Free ambient sounds
   - No attribution required
   - Good quality selection

4. **Pixabay** - https://pixabay.com/music/
   - Free music and sound effects
   - No attribution required
   - Good variety

## 🎛️ Integration in App

The app automatically plays sounds based on:
- Weather condition (from OpenWeather API)
- Time of day (sunrise, sunset, day, night)
- Multiple sounds layer simultaneously for rich ambience

Sounds can be toggled on/off using the 🔊 button in the header.

## ⚠️ Important Notes

1. **Browser Autoplay Policy**: Some browsers require user interaction before playing sounds. The app handles this gracefully.

2. **File Names**: Must match exactly (case-sensitive):
   - `wind.mp3` (not `Wind.mp3` or `wind-sound.mp3`)
   - All file names use lowercase with underscores

3. **Looping**: Sounds will loop continuously while the weather condition persists.

4. **Layered Sounds**: Multiple sounds play simultaneously for richer ambience.

5. **Volume Control**: Sounds are set to appropriate volumes automatically (primary louder, secondary quieter).

6. **Fallback**: If sound files are missing, the app will work normally without sounds (no errors).

## 🔧 Testing

After adding sound files:
1. Test each weather condition
2. Verify multiple sounds play simultaneously (layered)
3. Check volume levels are appropriate
4. Test sound toggle button
5. Verify sounds stop when weather changes
6. Test day vs night sound differences

## 📋 Complete File List (15 files total)

### Universal Sounds (6 files)
1. `wind.mp3`
2. `lowhum.mp3`
3. `airwhoosh.mp3`
4. `drizzle_light.mp3`
5. `puddles.mp3`
6. `storm_wind.mp3`

### Day-Specific Sounds (4 files)
7. `birds_day.mp3`
8. `morning_chimes.mp3`
9. `crunch_snow_day.mp3`
10. `rain_day_medium.mp3`

### Night-Specific Sounds (4 files)
11. `crickets_night.mp3`
12. `evening_ambience.mp3`
13. `snow_night_ambience.mp3`
14. `rain_night_soft.mp3`

### Thunderstorm-Specific (1 file)
15. `thunder_strong.mp3`

---

**Note**: The app works perfectly without sound files. Sounds are optional enhancements for immersion. You can add them gradually - the app will use available sounds and skip missing ones.

**Designed & Built by Hafsa** 🌦️✨
