# Answers Collection - Questionnaire Application

## Project Overview
A Vue 3 questionnaire application built for collecting user responses through a multi-step form flow. The application features a welcome screen, question navigation, progress tracking, and completion screen.

## Tech Stack
- **Frontend Framework**: Vue 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router (Hash-based)
- **Build Tool**: Vite
- **Styling**: SCSS with global styles
- **HTTP Client**: Axios
- **Internationalization**: Vue I18n
- **Additional Libraries**: Intersection Observer, Query String

## Project Structure

```
src/
├── assets/          # Static assets and SCSS styles
├── components/      # Reusable Vue components
│   └── sharedComponents/
│       ├── BasicPopup.vue
│       ├── CircularProgressBar.vue
│       ├── ProgressBar.vue
│       └── ScrollObserver.vue
├── composables/     # Vue composables (reusable logic)
│   ├── remIndicatorComposable.js
│   └── useCommonUtilities.js
├── locales/         # i18n translation files
│   └── en.json
├── network/         # API service layer
│   ├── base/
│   │   ├── api.js
│   │   ├── apiRoutes.js
│   │   └── appAxios.js
│   └── project.service.js
├── router/          # Vue Router configuration
│   └── index.js
├── stores/          # Pinia state stores
│   ├── common.store.js
│   ├── questionnaire.store.js
│   └── user.store.js
├── views/           # Page-level components
│   ├── WelcomeWrapper.vue
│   ├── QuestionWrapper.vue
│   ├── EndWrapper.vue
│   ├── HomeWrapper.vue
│   └── LoginWrapper.vue
├── App.vue          # Root component
├── Provider.vue     # Provider wrapper component
├── Auth.vue         # Authentication component
├── Constants.js     # Application constants
├── i18n.js          # i18n configuration
└── main.js          # Application entry point
```

## Key Features Implemented

### 1. **Questionnaire Store** (`questionnaire.store.js`)
- **Initialization**: Fetches questionnaire data on app load (currently mocked)
- **State Management**:
  - Questionnaire data with welcome/end screens
  - Current question tracking
  - Progress bar visibility control
  - Completion percentage calculation
- **Navigation**: Next/previous question functionality
- **Answer Submission**: Updates answers and calculates progress dynamically

### 2. **Welcome Screen** (`WelcomeWrapper.vue`)
- Displays questionnaire title and description from API data
- "Let's Begin" CTA button to start questionnaire
- Debug panel showing welcome screen data
- Hides progress bar on mount

### 3. **Question Screen** (`QuestionWrapper.vue`)
- Dynamic question rendering with counter (e.g., "1. What's inspiring...")
- Support for two question types:
  - `SHORT_TEXT`: Single-line input
  - `LONG_TEXT`: Multi-line textarea
- Answer validation before proceeding
- Previous/Next navigation with state management
- Console logging for CTA clicks, answers, and progress
- Progress percentage tracking
- Debug panel showing current question object

### 4. **End Screen** (`EndWrapper.vue`)
- Thank you message from API data
- Shows completion screen after all questions answered
- Debug panel showing end screen object
- Shows progress bar at 100%

### 5. **Progress Bar** (`ProgressBar.vue`)
- Animated progress indicator
- Shows completion percentage based on answered questions
- Conditional visibility (hidden on welcome screen)
- Smooth width transition animation

### 6. **Router Configuration**
- Hash-based routing (`createWebHashHistory`)
- Three main routes: `/`, `/question`, `/end`
- Navigation guard for questionnaire initialization
- Questionnaire ID from query params (`?id=...`)

### 7. **Mock Data Implementation**
The questionnaire store includes comprehensive mock data:
- 6 sample questions about kitchen renovation
- Mix of required and optional questions
- Both SHORT_TEXT and LONG_TEXT question types
- Welcome screen with title and description
- End screen with completion message

## Application Flow

1. **App Initialization**
   - Router guard checks if questionnaire is initialized
   - Fetches questionnaire data using ID from query params
   - Falls back to default ID if not provided

2. **Welcome Screen** (`/`)
   - User sees welcome message and questionnaire description
   - Clicks "Let's Begin" to start

3. **Question Flow** (`/question`)
   - Shows current question with description
   - User enters answer (text input or textarea)
   - Validation ensures answer is provided
   - Progress bar updates based on answered questions
   - Previous/Next navigation between questions
   - Console logs track user interactions

4. **Completion** (`/end`)
   - Shows thank you message
   - Progress bar at 100%
   - Displays end screen content

## Console Logging Implementation

All CTA (Call-to-Action) clicks and key events are logged:
- `[CTA] Let's Begin button clicked` - Welcome screen start
- `[CTA] Next button clicked` - Question navigation
- `[CTA] Previous button clicked` - Backward navigation
- `[CTA] Moving to end screen` - Questionnaire completion
- `[VALIDATION] No answer provided` - Validation failure
- `[ANSWER] <user_answer>` - Answer submission
- `[PROGRESS] <percentage>%` - Progress updates

## Additional Configuration

### Vite Config
- Path alias: `@` → `src/`
- Global SCSS import for all components
- SCSS preprocessor integration
- Host mode enabled for network access
- Base path set to `./` for flexible deployment

### Development Features
- REM indicator for responsive design debugging
- Mac platform detection for OS-specific features
- Query parameter parsing utilities
- Global constants accessible via `window.Constants`

## How It Was Built

### Phase 1: Foundation
1. Started with Vue 3 boilerplate
2. Set up Vite with SCSS support
3. Configured Vue Router with hash-based routing
4. Integrated Pinia for state management

### Phase 2: Core Functionality
1. Created questionnaire store with mock data
2. Implemented router guard for initialization
3. Built three main view components (Welcome, Question, End)
4. Added progress tracking logic

### Phase 3: UI Components
1. Developed ProgressBar component with animations
2. Added input types for different question formats
3. Implemented navigation controls
4. Created debug panels for development

### Phase 4: Polish
1. Added validation for required answers
2. Implemented console logging for tracking
3. Styled components with SCSS
4. Added smooth transitions and animations

## Current Status
✅ Complete working MVP with:
- Full questionnaire flow from welcome to completion
- Dynamic progress tracking
- Answer validation
- Navigation between questions
- Debug information for development
- Mock API integration ready for real backend

## Next Steps (Future Enhancements)
- Replace mock API calls with real backend integration
- Add more question types (multiple choice, checkboxes, radio buttons)
- Implement file upload capability
- Add form validation with error messages
- Create admin panel for questionnaire management
- Add theming based on questionnaire configuration
- Implement answer persistence (save progress)
- Add analytics tracking
