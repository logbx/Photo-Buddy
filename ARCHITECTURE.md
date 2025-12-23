# Photo Buddy - Architecture Documentation

## Overview

Photo Buddy is an iOS app built with Expo/React Native that helps users recreate camera angles from reference photos using AI-powered real-time guidance from OpenAI's Vision API.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Expo SDK 54 | Cross-platform development, managed workflow |
| Language | TypeScript | Type safety and developer experience |
| Navigation | Expo Router | File-based routing system |
| State | Zustand | Lightweight global state management |
| API State | TanStack Query | Server state, caching, loading states |
| Camera | expo-camera | Native camera access |
| Storage | expo-file-system | Local file persistence |
| AI | OpenAI GPT-4 Vision | Image analysis and comparison |
| Styling | NativeWind (Tailwind CSS) | Utility-first CSS |
| Icons | Lucide React Native | Consistent iconography |

## Project Structure

```
photo-buddy/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout with providers
│   ├── index.tsx                 # Home screen
│   ├── camera.tsx                # Camera with guidance overlay
│   ├── gallery.tsx               # Project list
│   └── project/
│       └── [id].tsx              # Project detail view
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx            # Primary/secondary buttons
│   │   ├── Card.tsx              # Container component
│   │   ├── IconButton.tsx        # Icon-only buttons
│   │   └── LoadingSpinner.tsx    # Loading indicator
│   ├── camera/
│   │   ├── GuidanceOverlay.tsx   # Direction prompts overlay
│   │   ├── DirectionIcon.tsx     # Arrow/tilt indicators
│   │   ├── LightingAdvice.tsx    # Lighting tips display
│   │   └── CaptureButton.tsx     # Photo capture button
│   └── home/
│       └── (future components)
│
├── services/
│   ├── openai.ts                 # OpenAI API client & prompts
│   └── storage.ts                # File system operations
│
├── stores/
│   ├── projectStore.ts           # Project & attempt state
│   ├── guidanceStore.ts          # Real-time guidance state
│   └── settingsStore.ts          # App preferences
│
├── hooks/
│   ├── useRealtimeAnalysis.ts    # 1-second AI analysis loop
│   └── useImageAnalysis.ts       # Reference image analysis
│
├── types/
│   ├── project.ts                # Project, Attempt interfaces
│   ├── guidance.ts               # GuidanceState, ImageAnalysis
│   ├── api.ts                    # API response types
│   └── index.ts                  # Barrel exports
│
├── config/
│   └── env.ts                    # Environment variables
│
└── assets/                       # Static assets
```

## Data Flow

### 1. Reference Image Analysis

```
User selects image
       ↓
readImageAsBase64()
       ↓
analyzeReferenceImage() → OpenAI GPT-4 Vision
       ↓
ImageAnalysis stored in projectStore
       ↓
Navigate to Camera screen
```

### 2. Real-time Guidance Loop

```
┌─────────────────────────────────────────┐
│  useRealtimeAnalysis hook (1s interval) │
└─────────────────────────────────────────┘
           ↓
  Camera.takePictureAsync() (low quality)
           ↓
  compareToReference() → OpenAI GPT-4o-mini
           ↓
  GuidanceState returned
           ↓
  guidanceStore.setGuidance()
           ↓
  GuidanceOverlay re-renders with new directions
           ↓
  User adjusts camera position
           ↓
  (Loop repeats every 1 second)
```

### 3. Photo Capture

```
User taps capture button
       ↓
Camera.takePictureAsync() (high quality)
       ↓
saveImage() → copies to app storage
       ↓
createProject() or addAttempt()
       ↓
Persisted to AsyncStorage via Zustand
```

## State Management

### Project Store (Zustand + Persist)

```typescript
interface ProjectState {
  // Session state (not persisted)
  currentReferenceUri: string | null;
  currentAnalysis: ImageAnalysis | null;
  isAnalyzing: boolean;

  // Persisted projects
  projects: Project[];

  // Actions
  createProject(name, uri, analysis): Project;
  addAttempt(projectId, attempt): void;
  deleteProject(id): void;
}
```

### Guidance Store (Zustand, not persisted)

```typescript
interface GuidanceStoreState {
  guidance: GuidanceState | null;
  isAnalyzing: boolean;
  isPaused: boolean;

  // Actions
  setGuidance(guidance): void;
  togglePause(): void;
}
```

## API Integration

### OpenAI Vision API

**Reference Analysis** (GPT-4o):
- Analyzes composition, lighting, perspective
- Returns structured ImageAnalysis object
- Called once when reference is selected

**Live Comparison** (GPT-4o-mini):
- Compares current camera view to reference
- Returns positioning/rotation guidance
- Called every 1 second during active shooting
- Uses lower quality images to minimize latency

### API Cost Optimization

| Strategy | Implementation |
|----------|---------------|
| Image compression | Quality 0.3 for comparison snapshots |
| Cheaper model | GPT-4o-mini for live comparisons |
| Request deduplication | Skip if previous request still processing |
| Pause control | User can pause analysis |
| Ready detection | Stop when match > 85% |

## Screen Navigation

```
Home (index.tsx)
  ├── New Project → Camera
  │                    └── Capture → Project Detail
  ├── View All → Gallery
  │                └── Project Card → Project Detail
  └── Recent Projects → Project Detail
                          └── Continue Shooting → Camera
```

## Key Components

### GuidanceOverlay

The main overlay that displays real-time guidance:

- **Position indicators**: Arrows for left/right/up/down
- **Distance indicator**: Zoom in/out icons
- **Rotation indicator**: Tilt left/right icons
- **Match score**: Progress bar (0-100%)
- **Primary instruction**: Single actionable text
- **Lighting advice**: Tips when lighting differs

### CaptureButton

- Changes color when match score > 85% (green = ready)
- Provides haptic feedback on capture
- Shows disabled state during capture

## Environment Configuration

```env
# .env (not committed)
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
```

```typescript
// config/env.ts
export const ENV = {
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
};
```

## Testing on Expo Go

1. Install Expo Go on iOS device
2. Run `npm start` in project directory
3. Scan QR code with Camera app
4. Add your OpenAI API key to `.env`

## Future Enhancements

### Phase 2 (Nice to Have)
- [ ] Side-by-side comparison view
- [ ] Opacity overlay of reference on live feed
- [ ] Focal length/zoom guidance
- [ ] History of attempts with improvement tracking
- [ ] Share to social media

### Phase 3 (Future)
- [ ] User accounts & cloud sync
- [ ] Community shared locations
- [ ] Offline AI model for basic guidance

## Performance Considerations

1. **Image compression**: All comparison images resized to reduce API tokens
2. **Request queuing**: Prevents overlapping API calls
3. **Abort controller**: Cancels stale requests
4. **Lazy loading**: Reference analysis only when needed
5. **Persisted state**: Projects survive app restart

## Security Notes

- API key stored in environment variable, not committed
- Images stored locally in app sandbox
- No user data sent to external servers (except OpenAI)
