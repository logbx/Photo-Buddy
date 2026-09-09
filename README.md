# Photo Buddy

AI-powered camera guidance app that helps you recreate photos with real-time positioning feedback.

## What It Does

Photo Buddy uses OpenAI's Vision API to analyze a reference photo and provide live guidance as you position your camera to recreate the shot. It gives you real-time feedback on:

- Horizontal and vertical positioning
- Camera distance (zoom in/out)
- Camera tilt and rotation
- Lighting conditions
- Overall match score (0-100%)

When you achieve an 85%+ match, the capture button turns green to indicate you're ready to take the shot.

## Status

**MVP Complete** - Core features implemented and functional:
- ✅ Reference image analysis (composition, lighting, perspective)
- ✅ Real-time camera guidance with 1-second feedback loop
- ✅ Project management with attempt history
- ✅ Local storage with persistent state
- ✅ iOS-first design with Expo Go support

**Known Limitations:**
- Requires OpenAI API key (see Setup below)
- Tested primarily on iOS via Expo Go
- Network-dependent (API calls for each guidance update)

## Requirements

- Node.js 18+ and npm
- iOS device with Expo Go app installed
- OpenAI API key with GPT-4o and GPT-4o-mini access

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-api-key-here
```

> **Important:** Never commit your `.env` file. It's already in `.gitignore`.

### 3. Start Development Server

```bash
npm start
```

This will show a QR code in your terminal.

### 4. Open on Your Device

1. Install [Expo Go](https://expo.dev/client) on your iOS device
2. Open the Camera app and scan the QR code
3. The app will open in Expo Go

## How to Use

1. **Choose a Reference Photo**
   - Tap "Choose from Gallery" or "Take a Photo" on the home screen
   - Select or capture the image you want to recreate

2. **Wait for Analysis**
   - The app analyzes the reference photo's composition, lighting, and perspective
   - This takes a few seconds

3. **Follow the Guidance**
   - The camera screen opens with a real-time guidance overlay
   - Move your device following the on-screen instructions
   - Watch the match score increase as you align the shot

4. **Capture When Ready**
   - The capture button turns green at 85%+ match
   - Tap to save the attempt to your project

5. **Review Your Attempts**
   - View all projects from the Gallery screen
   - Compare attempts within each project
   - Continue shooting to improve your match

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Expo SDK 54 | React Native framework with managed workflow |
| TypeScript | Type-safe development |
| Expo Router | File-based navigation |
| Zustand | Lightweight state management |
| TanStack Query | API state and caching |
| OpenAI GPT-4o | Reference image analysis (high detail) |
| OpenAI GPT-4o-mini | Live comparison (faster, cost-optimized) |
| NativeWind 4 | Tailwind CSS for React Native |
| Lucide Icons | Icon library |

## Project Structure

```
photo-buddy/
├── app/                     # Expo Router screens
│   ├── _layout.tsx          # Root layout with providers
│   ├── index.tsx            # Home screen
│   ├── camera.tsx           # Camera with guidance overlay
│   ├── gallery.tsx          # Project list
│   └── project/[id].tsx     # Project detail view
├── components/
│   ├── ui/                  # Reusable UI components
│   └── camera/              # Camera-specific components
├── services/
│   ├── openai.ts            # OpenAI Vision API integration
│   └── storage.ts           # File system operations
├── stores/
│   ├── projectStore.ts      # Project state (Zustand + persist)
│   ├── guidanceStore.ts     # Guidance state
│   └── settingsStore.ts     # App settings
├── hooks/
│   ├── useRealtimeAnalysis.ts  # 1-second guidance loop
│   └── useImageAnalysis.ts     # Reference image analysis
└── types/                   # TypeScript definitions
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## API Cost Optimization

Photo Buddy minimizes API costs through:

- **Model Selection**: Uses GPT-4o-mini for live comparisons (cheaper than GPT-4o)
- **Image Compression**: Reduces comparison images to quality 0.3
- **Request Deduplication**: Skips new requests if previous one is still processing
- **Low Detail Mode**: Uses OpenAI's "low" detail setting for live frames
- **Pause Control**: Users can pause guidance when not actively shooting

Typical costs (as of 2024):
- Reference analysis: ~$0.01-0.02 per photo
- Live guidance: ~$0.002 per comparison (~$0.12/minute of active guidance)

## Development

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Open on Android emulator
npm run ios        # Open on iOS simulator
npm run web        # Open in web browser
```

### Type Checking

```bash
npx tsc --noEmit
```

### Environment Variables

All environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app:

```bash
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
```

## Troubleshooting

### "No response from OpenAI"

- Verify your API key is correct in `.env`
- Check that your OpenAI account has API credits
- Ensure you have access to GPT-4o models

### Camera Permission Denied

- Close Expo Go completely
- Go to iOS Settings → Expo Go → Allow Camera & Photo Library
- Reopen the app

### App Crashes or White Screen

- Restart the Expo dev server
- Clear Expo Go cache: Settings → Expo Go → Clear Cache
- Check the terminal for error messages

### Dependencies Issues

If you encounter dependency errors:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Security

- API keys are stored in `.env` (gitignored)
- Images are stored locally in the app sandbox
- No user data is sent to external servers except OpenAI for analysis

## Future Enhancements

- Side-by-side comparison view
- Opacity overlay of reference on live camera
- Focal length detection and guidance
- Offline mode with on-device AI
- Cloud sync and user accounts
- Community-shared locations and compositions

## License

MIT

## Contributing

This is a portfolio project. Feel free to fork and adapt for your own use.

## Acknowledgments

Built with:
- [Expo](https://expo.dev/) - React Native framework
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision) - Image analysis
- [NativeWind](https://www.nativewind.dev/) - Tailwind for React Native
