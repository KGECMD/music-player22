# 🎵 Harmony Music Player

A modern, minimal music player built with Node.js and vanilla JavaScript. Features a monochrome aesthetic with seamless integration to the Audius music API.

## Features

✨ **Clean Monochrome UI** - Minimal dark theme with glass-morphic design  
🔍 **Search** - Real-time music search powered by Audius API  
📋 **Queue Management** - Add, remove, and organize tracks  
⏯️ **Playback Controls** - Play, pause, skip, and navigate queue  
💾 **Local Storage** - Queue persists between sessions  
📱 **Responsive Design** - Works on desktop and mobile  
🚀 **Zero Ads** - Free and open-source  

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express
- **API**: Audius Discovery Provider
- **Deployment**: Render

## Installation & Local Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
```

## Project Structure

```
.
├── server/
│   └── index.js          # Express server & API routes
├── public/
│   ├── index.html        # Main UI
│   ├── app.js            # Frontend logic
│   └── styles.css        # Monochrome styling
├── package.json          # Dependencies
└── render.yaml           # Deployment config
```

## API Endpoints

### Search Music
```
GET /api/search?q=<query>
```
Returns matching tracks with stream URLs

### Health Check
```
GET /api/health
```

## Features Implemented

✅ Search functionality with Audius API  
✅ Queue management (add, remove, clear)  
✅ Playback control (play, pause, next, previous)  
✅ Local storage persistence  
✅ Progress tracking  
✅ Mini player display  
✅ Now playing view  
✅ Responsive layout  
✅ Error handling  
✅ Mobile-friendly controls  

## Fixed Issues

- ✅ Corrected CSS file reference (style.css → styles.css)
- ✅ Implemented missing view switching logic
- ✅ Fixed queue list rendering
- ✅ Added proper audio player implementation
- ✅ Created public directory structure
- ✅ Implemented Audius API integration
- ✅ Added proper server structure
- ✅ Fixed all JavaScript errors

## Deploy to Render

1. Push code to GitHub
2. Connect repo to Render (https://render.com)
3. Select "Web Service"
4. Choose Node environment
5. Use `render.yaml` config
6. Deploy!

Your app will be live at: `https://<your-service-name>.onrender.com`

## Environment Variables

No environment variables required - API uses public endpoints.

Optional for Render:
- `NODE_ENV=production`
- `PORT=3000` (Render sets automatically)

## Future Improvements

- [ ] Spotify integration
- [ ] YouTube Music support
- [ ] User authentication
- [ ] Playlist creation
- [ ] Dark/Light theme toggle
- [ ] Shuffle & repeat modes
- [ ] Volume control
- [ ] Equalizer

## License

MIT - Feel free to use and modify

## Support

For issues or suggestions, open a GitHub issue.

---

**Made with 🎵 for music lovers**
