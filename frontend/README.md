# Frontend Setup Guide

## File Organization

The frontend source code is organized as follows:

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # UI primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── Accordion.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Tooltip.jsx
│   │   │   ├── Dialog.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── RadioGroup.jsx
│   │   │   └── Switch.jsx
│   │   ├── common/                # Shared state components
│   │   │   ├── Loader.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── SearchBar.jsx
│   │   └── layout/                # Layout wrappers
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       ├── Sidebar.jsx
│   │       └── DashboardLayout.jsx
│   │
│   ├── pages/
│   │   ├── Public/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NotFound.jsx
│   │   ├── Student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CareerProfile.jsx
│   │   │   ├── GoalSelection.jsx
│   │   │   ├── SkillInventory.jsx
│   │   │   ├── GapAnalysis.jsx
│   │   │   ├── RoadmapBuilder.jsx
│   │   │   ├── ProgressTracking.jsx
│   │   │   ├── ProjectPlanner.jsx
│   │   │   ├── MentorReview.jsx
│   │   │   └── Notifications.jsx
│   │   ├── Mentor/
│   │   │   ├── MentorDashboard.jsx
│   │   │   ├── StudentDetail.jsx
│   │   │   └── Review.jsx
│   │   ├── Placement/
│   │   │   ├── PlacementDashboard.jsx
│   │   │   └── Reports.jsx
│   │   └── Admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── CareerRoleCatalog.jsx
│   │       ├── ContentManagement.jsx
│   │       └── UserManagement.jsx
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.js             # via AuthContext
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   ├── useOnClickOutside.js
│   │   └── useScrollToTop.js
│   │
│   ├── services/                  # API service layer
│   │   ├── axiosConfig.js         # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── profileService.js
│   │   ├── careerService.js
│   │   ├── skillService.js
│   │   ├── roadmapService.js
│   │   ├── gapAnalysisService.js
│   │   ├── projectService.js
│   │   ├── mentorService.js
│   │   ├── notificationService.js
│   │   └── analyticsService.js
│   │
│   ├── contexts/                  # React Context providers
│   │   └── AuthContext.jsx        # Global auth state
│   │
│   ├── constants/                 # Constants & configs
│   │   ├── apiConstants.js        # API endpoints
│   │   ├── appConstants.js        # App-wide constants
│   │   ├── roleConstants.js       # User roles & permissions
│   │   └── routeConstants.js      # All route paths
│   │
│   ├── routes/                    # Routing & guards
│   │   ├── AppRoutes.jsx          # Route definitions
│   │   ├── ProtectedRoute.jsx     # Auth guard
│   │   └── RoleGuard.jsx          # Role-based guard
│   │
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # Vite entry point
│   └── index.css                  # Global styles
│
├── index.html                     # HTML root
├── package.json                   # Dependencies
├── vite.config.js                # Vite config
├── tailwind.config.js            # Tailwind CSS config
├── postcss.config.js             # PostCSS plugins
├── .env                          # Environment variables
└── README.md                     # Frontend documentation
```

## Installation & Running

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Access at: `http://localhost:4173`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## Environment Variables

Create `.env` in frontend directory:
```
VITE_API_BASE_URL=http://localhost:4000/api
```

## API Integration

All API calls go through the service layer in `src/services/`.

### Example: Using a Service
```javascript
import { authService } from '../services/authService.js';

// Login
const response = await authService.login({ 
  email: 'user@example.com', 
  password: 'password' 
});

// Refresh token
const newToken = await authService.refreshToken();
```

## Using Components

### Example: Form with Button & Input
```javascript
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';

function LoginForm() {
  return (
    <>
      <Input 
        label="Email" 
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Button type="submit" variant="primary" size="md">
        Sign In
      </Button>
    </>
  );
}
```

### Example: Using DashboardLayout
```javascript
import { DashboardLayout } from '../components/layout/DashboardLayout.jsx';
import { Card } from '../components/ui/Card.jsx';

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <Card title="Welcome" description="Your dashboard">
        {/* Content here */}
      </Card>
    </DashboardLayout>
  );
}
```

## Routing

All routes are defined in `src/constants/routeConstants.js`:
```javascript
import { ROUTES } from '../constants/routeConstants.js';

<Link to={ROUTES.STUDENT_DASHBOARD}>Dashboard</Link>
<Link to={ROUTES.LOGIN}>Login</Link>
```

## Authentication Flow

1. User registers/logs in
2. JWT token + user data stored in `localStorage` and AuthContext
3. Axios interceptor adds token to all requests
4. On 401 response, token refresh is attempted
5. On refresh failure, user is redirected to login

Access auth state anywhere:
```javascript
import { useAuth } from '../contexts/AuthContext.jsx';

function MyComponent() {
  const { auth, isAuthenticated, isStudent, logout } = useAuth();
  // ...
}
```

## Form Handling

Uses React Hook Form + Zod validation:
```javascript
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors } } = useForm();

const onSubmit = (data) => {
  // Handle form submission
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Input 
      {...register('email', { required: 'Email required' })} 
      error={errors.email?.message}
    />
  </form>
);
```

## State Management

- **Auth State**: AuthContext + localStorage
- **Server State**: React Query (useQuery, useMutation)
- **UI State**: React hooks (useState)
- **Preferences**: localStorage via useLocalStorage hook

## Performance Tips

1. Use lazy loading for routes (already implemented)
2. Debounce search inputs (already in SearchBar)
3. Use React Query for caching
4. Code split admin pages if needed
5. Optimize images before uploading

## Accessibility

- All form inputs have labels
- Keyboard navigation supported
- ARIA labels on interactive elements
- Semantic HTML structure
- Color contrast meets WCAG AA

## Troubleshooting

### Port 4173 already in use
```bash
# Use different port
npm run dev -- --port 3000
```

### API connection issues
- Check `.env` VITE_API_BASE_URL
- Ensure backend is running on port 4000
- Check CORS configuration in backend

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Next Steps

1. Connect to actual backend API
2. Implement real data fetching
3. Add error boundary
4. Set up analytics
5. Configure CI/CD pipeline
6. Deploy to production
