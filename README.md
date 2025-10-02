# SnapURL Admin Dashboard

Professional URL shortening service administration panel with advanced analytics, real-time monitoring, and comprehensive management features.

## 🌟 Features

### Core Functionality
- **URL Shortening** - Create, edit, and manage shortened URLs with custom aliases
- **QR Code Generation** - Dynamic QR codes
- **Bulk Operations** - Import/export URLs, batch processing capabilities
- **Analytics Dashboard** - Real-time click tracking, geographic data, referrer analysis
- **Role-Based Access** - Admin, Demo, and User permission levels

### Advanced Features
- **Real-time Notifications** - System-wide notification management with persistence
- **Responsive Design** - Mobile-first approach with seamless desktop experience
- **Dark/Light Theme** - Automatic system detection with manual override
- **Search & Filtering** - Advanced URL search with debouncing and keyboard navigation
- **Performance Monitoring** - System health tracking and uptime visualization
- **Data Export** - Multiple format support (JSON, CSV) with comprehensive analytics

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.2+
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.3+ with custom design system
- **Animations**: Framer Motion 10.16+
- **Charts**: Recharts 2.15+
- **Icons**: Lucide React 0.288+

### Development & Testing
- **Testing**: Jest
- **Accessibility**: jest-axe + manual testing
- **Code Quality**: ESLint + Prettier + Husky
- **Type Safety**: Strict TypeScript configuration

### Architecture
- **State Management**: Context API + Custom Hooks
- **Data Fetching**: Custom API layer with fallbacks
- **Authentication**: JWT with localStorage persistence
- **Error Handling**: Error boundaries + graceful fallbacks
- **Performance**: Code splitting, lazy loading, memoization

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0+
- npm 8.0.0+
- Modern browser with ES2020 support

### Installation

```bash
# Clone repository
git clone https://github.com/Toxicyy/Snap-URL-ADMIN

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Configuration

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
API_BASE_URL=http://localhost:3001
```

## 🎭 Demo Access
Want to explore SnapURL without registration? Use our demo account:

```
Email:    demo@snapurl.dev
Password: Demo123
```

> **Note:** The demo account has read-only access with limited functionality. Create your own account to unlock all features.

## 📁 Project Structure

```
├── __tests__/                      # Testing directory
│   ├── accessibility/              # Accessibility (a11y) tests
│   └── unit/                       # Unit tests for components and functions
├── app/                            # Next.js App Router - main application pages
│   ├── access-denied/              # Access denied error page
│   ├── analytics/                  # URL analytics and statistics
│   ├── auth/                       # Authentication pages (login, register, recovery)
│   ├── dashboard/                  # Main dashboard panel
│   ├── help/                       # Help and documentation page
│   ├── platform/                   # Platform overview and system information
│   ├── privacy/                    # Privacy policy page
│   ├── profile/                    # User profile page
│   ├── real-time/                  # Real-time monitoring page
│   ├── reports/                    # Reports and data export page
│   ├── settings/                   # Application settings page
│   ├── status/                     # System status and uptime page
│   └── urls/                       # URL management page
│   globals.css                     # Global styles
│   layout.tsx                      # Root layout component
│   not-found.tsx                   # 404 page route handler
│   NotFoundContent.tsx             # 404 page content component
│   page.tsx                        # Homepage
├── components/                     # React components library
│   ├── access-denied/              # Access denied page components
│   ├── analytics/                  # Analytics-related components
│   ├── auth/                       # Authentication components
│   ├── bulk/                       # Bulk operations components
│   ├── common/                     # Shared components (Header, Sidebar, Layout)
│   ├── createUrl/                  # URL creation form components
│   ├── dashboard/                  # Dashboard-specific components
│   ├── header/                     # Header-specific components
│   ├── help/                       # Help page components
│   ├── modals/                     # Modal dialogs and overlays
│   ├── platformOverview/           # Platform overview components
│   ├── platformPerformance/        # Performance monitoring components
│   ├── platformSecurity/           # Security dashboard components
│   ├── privacy/                    # Privacy policy components
│   ├── profile/                    # User profile components
│   ├── recovery/                   # Password recovery components
│   ├── settings/                   # Settings page components
│   ├── status/                     # System status components
│   └── urls/                       # URL management components
│   Providers.tsx                   # React context providers wrapper
├── context/                        # React Context providers
│   ├── AccessControlProvider.tsx   # Role-based access control provider
│   ├── AuthContext.tsx             # Authentication state management
│   └── ThemeContext.tsx            # Theme and appearance settings
├── hooks/                          # Custom React hooks
│   ├── useComingSoonModal.tsx      # Coming soon feature modal hook
│   ├── useDemoRestrictionModal.tsx # Demo account restriction modal hook
│   ├── useOutsideClick.tsx         # Detect clicks outside element
│   └── useNotifications.tsx        # Notification system hook
├── lib/                            # Utility libraries
│   └── api.ts                      # API client and endpoint definitions
├── types/                          # TypeScript type definitions
│   ├── analytics.types.ts          # Analytics data types
│   ├── api.types.ts                # API request/response types
│   ├── header.types.ts             # Header component types
│   ├── index.ts                    # Main type exports (barrel file)
│   ├── ui.types.ts                 # UI component types
│   ├── url.types.ts                # URL-related types
│   └── user.types.ts               # User-related types
└──
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test:all

# Unit tests with coverage
npm run test:coverage

# unit tests
npm run test:unit

# Accessibility tests
npm run test:accessibility

# Watch mode for development
npm run test:watch
```

## 🎨 Component Architecture

### Core Components

#### Header (`components/common/Header.tsx`)
- Global search with real-time results
- Notification system integration
- User menu and authentication
- Responsive navigation controls

#### Sidebar (`components/common/Sidebar.tsx`)
- Role-based navigation filtering
- Animated menu states
- Theme toggle integration
- Mobile-responsive overlay

#### Dashboard Layout (`components/common/DashboardLayout.tsx`)
- Authentication guards
- Responsive layout management
- Error boundary integration
- Loading state coordination

### Form Components

#### URL Creation (`components/createUrl/CreateUrlForm.tsx`)
- Multi-tab interface (Basic, QR, Privacy, Advanced)
- Real-time validation
- Demo account restrictions
- Bulk creation support

#### Authentication Forms
- Login/Register with validation
- Password reset functionality
- Social authentication (planned)

### Data Visualization

#### Analytics Components
- Real-time chart updates with Recharts
- Geographic data visualization
- Performance metrics dashboards
- Export functionality

## 🔐 Authentication & Authorization

### User Roles

| Role  | Permissions |
|-------|-------------|
| Admin | Full system access, platform analytics, user management |
| User  | Personal URL management, basic analytics |
| Demo  | Read-only access, feature limitations, restricted actions |

### Authentication Flow

1. **Login** → Token validation → Context update → Route protection
2. **Token Refresh** → Automatic renewal → Session persistence
3. **Logout** → Token cleanup → Context reset → Redirect

### Demo Mode Features

- **Restrictions**: No URL creation, editing, or deletion
- **Modal Notifications**: Contextual upgrade prompts
- **Feature Previews**: Full UI access with interaction blocks

## 🎯 Performance Optimizations

### Bundle Optimization
- **Code Splitting**: Route-based and component-based
- **Tree Shaking**: Unused code elimination
- **Dynamic Imports**: Lazy loading for heavy components

### Runtime Performance
- **Memoization**: React.memo, useMemo, useCallback
- **Virtual Scrolling**: Large data sets handling
- **Debounced Search**: API call optimization
- **Image Optimization**: Next.js automatic optimization

### Animation Performance
- **Framer Motion**: Optimized animation library
- **CSS Transforms**: Hardware acceleration
- **Reduced Motion**: Accessibility preference support

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px  
- **Desktop**: 1025px - 1920px
- **Ultra-wide**: 1921px+

### Mobile-First Approach
- Touch-optimized interactions
- Swipe gestures for navigation
- Optimized modal and dropdown sizes
- Thumb-friendly button placement

## 🚀 Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm run start

```


## 🔧 Development Workflow

### Code Quality
- **Pre-commit Hooks**: Linting, formatting, type checking
- **Pull Request Checks**: Tests, build verification, code review
- **Automated Testing**: Full test suite on every PR

### Development Scripts

```bash
# Development
npm run dev              # Start dev server

# Code Quality
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix linting issues  
npm run format           # Prettier formatting
npm run type-check       # TypeScript validation

# Building
npm run build            # Production build

# Maintenance
npm run clean            # Clean build artifacts
npm run prepare          # Setup hooks
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- **User Behavior**: Click tracking, navigation patterns
- **Performance**: Page load times, API response times
- **Error Tracking**: Client-side error monitoring
- **Accessibility**: Usage pattern analysis

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Ensure all tests pass: `npm run test:all`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open Pull Request

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Extended configuration with accessibility rules
- **Prettier**: Consistent code formatting

## 🆘 Support

### Documentation
- [API Documentation](https://snap-url-api-production.up.railway.app/api-docs/)

---

*Building the future of URL management, one click at a time.*
