# 🎵 Harmony Music Player v3.0

**HiFi Music Streaming Player** with support for Tidal, Audius, and Lucida APIs

## ✨ Features

- 🎵 **Multi-Source Streaming**: Tidal (HiFi), Audius (Free), Lucida (QQDL)
- 🎨 **20 Professional Themes**: Nord, Dracula, macOS, Windows, and more
- 🔊 **HiFi Quality**: Up to FLAC lossless audio
- 📱 **Fully Responsive**: Desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts**: Space (play), arrows (skip/volume)
- 🎮 **Rich Controls**: Shuffle, repeat, volume, equalizer
- 💾 **Local Persistence**: Queue, settings, preferences saved
- ⚡ **Fast & Reliable**: Optimized for Render & Vercel

## 🚀 Deploy

### Render (Recommended)
```bash
1. Push to GitHub
2. Go to render.com
3. Create Web Service
4. Connect repo
5. Deploy! (auto-detects render.yaml)
```

### Vercel
```bash
1. Push to GitHub
2. Go to vercel.com
3. Import project
4. Deploy! (auto-detects vercel.json)
```

### Local
```bash
npm install
npm start
# Visit http://localhost:3000
```

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/search?q=query` | Search all sources |
| `GET /api/search/tidal?q=query` | Search Tidal HiFi |
| `GET /api/search/audius?q=query` | Search Audius |
| `GET /api/trending` | Trending tracks |
| `GET /api/health` | Health check |

## 🎨 Themes (20+)

1. Monochrome
2. Nord
3. Dracula
4. Catppuccin
5. One Dark
6. Gruvbox
7. Solarized
8. Tokyo Night
9. Ayu
10. Pale Night
11. Material Ocean
12. Synthwave
13. Cyberpunk
14. Deep Blue
15. Forest Green
16. Lavender
17. Sunset
18. Ocean
19. Forest
20. macOS Liquid
21. Windows Aero

## 🔊 Quality Options

- 128 kbps (Streaming)
- 256 kbps (High)
- 320 kbps (Very High)
- HiFi FLAC (Lossless)

## 🎹 Keyboard Shortcuts

- `Space` - Play/Pause
- `→` - Next track
- `←` - Previous track
- `↑` - Volume up
- `↓` - Volume down

## 🔗 Sources

- **Tidal**: `https://hifi.geeked.wtf` (Primary)
- **Audius**: `https://discoveryprovider.audius.co`
- **Lucida**: Multiple endpoints for redundancy

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Deployment**: Render, Vercel, Heroku
- **APIs**: Tidal, Audius, Lucida, geeked.wtf

## ✅ Status

- ✓ All themes working
- ✓ Multi-source API integration
- ✓ HiFi quality support
- ✓ Keyboard shortcuts
- ✓ Mobile responsive
- ✓ Error handling
- ✓ Production ready
- ✓ Render compatible
- ✓ Vercel compatible

## 📝 License

MIT - Open source

---

**Made with 🎵 for music lovers**
