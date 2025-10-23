# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Code Quality
```bash
# Lint code with ESLint (auto-fix enabled)
npm run lint

# Format code with Prettier
npm run format
```

## Project Architecture

### Vue 3 + Vite Stack
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite with `@vitejs/plugin-vue`
- **State Management**: Pinia stores
- **Routing**: Vue Router with hash-based routing
- **Internationalization**: Vue i18n
- **Styling**: SCSS with global imports
- **HTTP Client**: Axios with custom wrapper functions

### Authentication Flow
The application uses a Provider-based authentication system:
- `Provider.vue` is the entry point that checks for auth token in localStorage
- Renders `App.vue` if authenticated, `Auth.vue` if not
- Auth token is managed through the user store (`stores/user.store.js`)

### Key Architectural Patterns

#### Dependency Injection Pattern
- `appImages`: Asset management system accessible via `inject('appImages')`
- `Constants`: Application constants available via `inject('Constants')` and `window.Constants`
- Images accessed by filename: `appImages['loader.gif']`

#### Network Layer Architecture
- **API Routes**: Centralized in `network/base/apiRoutes.js`
- **HTTP Wrappers**: Generic functions in `network/base/api.js` (GET, POST, PUT, DELETE)
- **Service Layer**: Business logic in `network/project.service.js`
- **Axios Instance**: Configured in `network/base/appAxios.js` with base URL from env

#### Store Structure
- Pinia stores follow `[fileName].store.js` naming convention
- Router instance injected into all stores via `store.$router`
- Common store provides global loader state management

#### Component Organization
- **Views**: Route components named `[RouteName]Wrapper.vue` (e.g., `HomeWrapper.vue`)
- **Shared Components**: Reusable components in `components/sharedComponents/`
- **Assets**: SCSS partials system with global imports via Vite config

#### Styling System
- SCSS partials with underscore prefix (`_variables.scss`, `_mixins.scss`, `_typology.scss`)
- `global.scss` serves as main import file
- Vite auto-imports `global.scss` in all components
- Responsive scaling via rem units controlled by `_typology.scss`

## File Naming Conventions
- Components: PascalCase (e.g., `CircularProgressBar.vue`)
- Stores: `[name].store.js`
- Views: `[RouteName]Wrapper.vue`
- SCSS partials: `_[name].scss`

## Development Notes
- Uses hash-based routing (`createWebHashHistory`)
- Environment-based API base URL configuration
- Platform detection utility (`window.IS_MAC`)
- Intersection Observer integration for scroll-based functionality
- Query parameter-based language switching (`?lang=en`)