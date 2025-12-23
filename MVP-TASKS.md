# Photo Buddy - MVP Task List

## Completed Tasks

### Phase 0: Project Setup
- [x] Initialize Expo project with TypeScript template
- [x] Install core dependencies (expo packages, zustand, openai, nativewind)
- [x] Configure NativeWind/Tailwind CSS v3
- [x] Create folder structure
- [x] Set up environment configuration (.env, config/env.ts)
- [x] Configure app.json with camera permissions

### Phase 1: Core Infrastructure
- [x] Create type definitions (project.ts, guidance.ts, api.ts)
- [x] Build OpenAI service with analysis prompts
- [x] Build storage service using new expo-file-system API
- [x] Create Zustand stores (project, guidance, settings)
- [x] Set up React Query provider

### Phase 2: UI Components
- [x] Build Button component (primary, secondary, outline variants)
- [x] Build Card component
- [x] Build IconButton component
- [x] Build LoadingSpinner component
- [x] Build DirectionIcon component
- [x] Build LightingAdvice component
- [x] Build CaptureButton component
- [x] Build GuidanceOverlay component

### Phase 3: Screens & Navigation
- [x] Create root layout with providers
- [x] Build Home screen with new project actions
- [x] Build Camera screen with guidance overlay
- [x] Build Gallery screen with project list
- [x] Build Project Detail screen with attempts

### Phase 4: Core Features
- [x] Implement image picker flow (gallery + camera)
- [x] Implement reference image analysis
- [x] Implement real-time analysis hook (1-second interval)
- [x] Implement photo capture and save
- [x] Implement project persistence

---

## Remaining Tasks for MVP

### Testing & Polish
- [ ] Test on iOS device via Expo Go
- [ ] Verify camera permissions work correctly
- [ ] Test image capture and storage
- [ ] Test OpenAI API integration with real key
- [ ] Handle API errors gracefully
- [ ] Add haptic feedback on capture

### Bug Fixes (if any discovered during testing)
- [ ] (To be filled during testing)

### Optional Enhancements
- [ ] Add empty state illustrations
- [ ] Improve loading state animations
- [ ] Add pull-to-refresh on gallery
- [ ] Add confirmation dialogs for destructive actions

---

## How to Test

1. **Add your OpenAI API key:**
   ```bash
   # Edit .env file
   EXPO_PUBLIC_OPENAI_API_KEY=sk-your-actual-key-here
   ```

2. **Start the development server:**
   ```bash
   cd photo-buddy
   npm start
   ```

3. **Open on device:**
   - Install Expo Go on your iOS device
   - Scan the QR code with Camera app
   - App should open in Expo Go

4. **Test flow:**
   1. Tap "Choose from Gallery" → select a reference photo
   2. Wait for analysis to complete
   3. Camera view should open with guidance overlay
   4. Move device to follow guidance instructions
   5. Tap capture when match score is high
   6. View captured attempt in project detail

---

## Files Created

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout with providers |
| `app/index.tsx` | Home screen |
| `app/camera.tsx` | Camera with guidance |
| `app/gallery.tsx` | Project list |
| `app/project/[id].tsx` | Project detail |
| `components/ui/*` | Reusable UI components |
| `components/camera/*` | Camera overlay components |
| `services/openai.ts` | OpenAI API integration |
| `services/storage.ts` | File system operations |
| `stores/*.ts` | Zustand state stores |
| `hooks/*.ts` | Custom React hooks |
| `types/*.ts` | TypeScript definitions |
| `config/env.ts` | Environment config |
| `tailwind.config.js` | Tailwind configuration |
| `metro.config.js` | Metro bundler with NativeWind |
| `ARCHITECTURE.md` | Technical documentation |

---

## Next Steps After MVP

1. **Gather user feedback** on the core guidance experience
2. **Optimize API costs** based on actual usage patterns
3. **Add side-by-side comparison** view
4. **Implement opacity overlay** of reference on live feed
5. **Add cloud backup** option
