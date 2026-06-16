# AI Career Roadmap Generator - Full Stack Setup

A professional production-ready React frontend for personalized career planning and skill development.

## 📁 Project Structure

```
AI_Career_Roadmap_Generator/
├── frontend/                 # React frontend application
│   ├── src/                 # Source code (move from root)
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components by role
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # React Context providers
│   │   ├── constants/      # App constants & configs
│   │   ├── routes/         # Route definitions & guards
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML entry point
│   ├── package.json        # Dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── postcss.config.js   # PostCSS config
│   └── .env                # Environment variables
│
├── backend/                # Backend API (to be implemented)
│   ├── src/               # Server source code
│   ├── routes/            # API endpoints
│   ├── controllers/       # Route handlers
│   ├── models/            # Database models
│   └── middleware/        # Express middleware
│
├── .git/                   # Git repository
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## 🚀 Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:4173`

### Features Implemented

#### Student Pages (10)
- ✅ Dashboard - Overview of progress and recent activities
- ✅ Career Profile - Education, experience, interests management
- ✅ Goal Selection - Career goals and timeline
- ✅ Skill Inventory - Track skills with evidence
- ✅ Gap Analysis - Visual comparison of current vs required skills
- ✅ Roadmap Builder - AI-generated career roadmap with timeline
- ✅ Progress Tracking - Mark milestones and upload evidence
- ✅ Project Planner - Plan learning projects
- ✅ Mentor Review - View mentor feedback
- ✅ Notifications - All updates and alerts

#### Mentor Pages (3)
- ✅ Mentor Dashboard - Assigned students overview
- ✅ Student Detail - View individual student profile
- ✅ Review - Provide feedback on roadmap

#### Placement Officer Pages (2)
- ✅ Placement Dashboard - Analytics and readiness metrics
- ✅ Reports - Generate and export reports

#### Admin Pages (4)
- ✅ Admin Dashboard - System overview
- ✅ Career Role Catalog - Manage target roles
- ✅ Content Management - Manage learning resources
- ✅ User Management - Manage platform users

#### Public Pages (4)
- ✅ Home - Landing page with hero and features
- ✅ Login - Email/password authentication
- ✅ Register - User signup with role selection
- ✅ NotFound - 404 page

### UI Components (17)

**Form Components:**
- Button (5 variants)
- Input (with icon & error support)
- Textarea
- Select (with options)
- Checkbox
- RadioGroup
- Switch (toggle)

**Display Components:**
- Card (with slots)
- Badge (5 variants)
- Tabs (accessible)
- Accordion (collapsible)
- ProgressBar
- Alert
- Tooltip

**Common Components:**
- Loader (with fullscreen option)
- ErrorMessage (with retry)
- EmptyState
- ConfirmationModal
- Pagination
- SearchBar (debounced)

**Layout Components:**
- Navbar (sticky with user menu)
- Footer (links + copyright)
- Sidebar (role-based navigation)
- DashboardLayout (complete dashboard wrapper)

### Core Features

**Authentication & Authorization:**
- ✅ Login/Register with email & password
- ✅ Token-based authentication with refresh logic
- ✅ Role-based access control (Student, Mentor, Placement Officer, Admin)
- ✅ Protected routes with ProtectedRoute & RoleGuard
- ✅ AuthContext for global auth state

**Form Handling:**
- ✅ React Hook Form integration
- ✅ Zod validation schemas
- ✅ Real-time validation & error messages
- ✅ Accessible form controls

**API Integration:**
- ✅ Axios with interceptors
- ✅ Request/response middleware
- ✅ Token refresh on 401
- ✅ Error handling & retries
- ✅ Service layer for all endpoints

**State Management:**
- ✅ React Context for auth state
- ✅ React Query for server state
- ✅ localStorage for preferences

**Custom Hooks:**
- useAuth - Authentication state
- useLocalStorage - Persist data
- useDebounce - Search optimization
- useOnClickOutside - Close dropdowns
- useScrollToTop - Auto scroll on navigation

**Performance:**
- ✅ Code splitting by route (lazy loading)
- ✅ Debounced search inputs
- ✅ Paginated lists
- ✅ Image optimization ready
- ✅ Suspense boundaries

**Design & UX:**
- ✅ Professional blue/indigo theme
- ✅ Dark mode support (toggle ready)
- ✅ Fully responsive (mobile/tablet/desktop)
- ✅ Smooth page transitions (Framer Motion)
- ✅ Loading skeletons ready
- ✅ Keyboard navigation support
- ✅ ARIA labels for accessibility

## 📦 Dependencies

### Frontend Stack
- **React 19** - UI library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **React Query** - Server state
- **Lucide React** - Icons
- **date-fns** - Date utilities
- **Zod** - Validation

## ⚙️ Configuration

### Environment Variables (.env)
```
VITE_API_BASE_URL=http://localhost:4000/api
```

### API Endpoints Structure
All endpoints are configured in `src/constants/apiConstants.js`:
- Auth endpoints: `/auth/*`
- Profile: `/profile`
- Career: `/career/*`
- Skills: `/skills`
- Roadmap: `/roadmap`
- Gap Analysis: `/gap-analysis`
- Projects: `/projects`
- Mentor: `/mentor/*`
- Notifications: `/notifications`
- Analytics: `/analytics`

## 🔐 Security Features

- ✅ JWT token-based auth
- ✅ Secure token refresh flow
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Form validation (client-side)
- ✅ No hardcoded URLs/credentials
- ✅ CORS-ready axios config

## 🎨 Design System

### Color Palette
- **Brand**: Indigo (600: #4f46e5)
- **Success**: Emerald
- **Warning**: Amber
- **Error**: Red
- **Info**: Sky
- **Neutral**: Slate

### Spacing & Border Radius
- Border radius: `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- Padding: Consistent 4px grid
- Shadows: Soft elevation with `shadow-soft`

### Responsive Breakpoints
- Mobile: < 640px (no Tailwind prefix)
- Tablet: 640px+ (sm:)
- Desktop: 1024px+ (lg:)

## 📝 Code Standards

- **PascalCase** for component files (Button.jsx)
- **camelCase** for utility files (helpers.js)
- **kebab-case** for CSS classes (user-card)
- **UPPER_SNAKE_CASE** for constants (API_BASE_URL)
- No inline styles (use Tailwind)
- No console.logs in production
- Extract reusable logic to hooks
- Keep components focused and small

## 🚀 Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

## 📋 Checklist for Next Steps

**Frontend:**
- [ ] Connect to actual backend API
- [ ] Implement form submission handlers
- [ ] Add loading skeletons for data
- [ ] Test responsive design on all devices
- [ ] Set up error boundaries
- [ ] Add analytics tracking

**Backend (To Do):**
- [ ] Node.js/Express server setup
- [ ] Database schema (PostgreSQL/MongoDB)
- [ ] Authentication endpoints
- [ ] All CRUD operations
- [ ] AI integration for roadmap generation
- [ ] Email notifications
- [ ] File upload handling

## 👥 User Roles & Permissions

**Student:**
- Create career profile
- Set goals and timeline
- Manage skills inventory
- View gap analysis
- Access AI-generated roadmap
- Track progress
- Plan projects
- Receive mentor feedback

**Mentor:**
- View assigned students
- Review student profiles
- Provide feedback
- Rate progress
- Track mentees

**Placement Officer:**
- View dashboard analytics
- Generate reports
- Track placement readiness
- Export data

**Admin:**
- System configuration
- Manage users
- Manage career roles
- Content management
- View system health

## 📞 Support & Documentation

All components have descriptive names and are self-documented. Check individual component files for props and usage examples.

## 📄 License

Proprietary - AI Career Roadmap Generator
