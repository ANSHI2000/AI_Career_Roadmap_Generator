import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RoleGuard } from './RoleGuard.jsx';
import { USER_ROLES } from '../constants/roleConstants.js';
import { ROUTES } from '../constants/routeConstants.js';
import { Loader } from '../components/common/Loader.jsx';

// Public Pages
const Home = lazy(() => import('../pages/Public/Home.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));
const VerifyRegisterOtp = lazy(() => import('../pages/VerifyRegisterOtp.jsx'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('../pages/ResetPassword.jsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const NotFound = lazy(() => import('../pages/Public/NotFound.jsx'));

// Student Pages
const StudentDashboard = lazy(() => import('../pages/Student/Dashboard.jsx'));
const CareerProfile = lazy(() => import('../pages/Student/CareerProfile.jsx'));
const GoalSelection = lazy(() => import('../pages/Student/GoalSelection.jsx'));
const SkillInventory = lazy(() => import('../pages/Student/SkillInventory.jsx'));
const GapAnalysis = lazy(() => import('../pages/Student/GapAnalysis.jsx'));
const RoadmapBuilder = lazy(() => import('../pages/Student/RoadmapBuilder.jsx'));
const ProgressTracking = lazy(() => import('../pages/Student/ProgressTracking.jsx'));
const ProjectPlanner = lazy(() => import('../pages/Student/ProjectPlanner.jsx'));
const MentorReview = lazy(() => import('../pages/Student/MentorReview.jsx'));
const Notifications = lazy(() => import('../pages/Student/Notifications.jsx'));

// Mentor Pages
const MentorDashboard = lazy(() => import('../pages/Mentor/MentorDashboard.jsx'));
const StudentDetail = lazy(() => import('../pages/Mentor/StudentDetail.jsx'));
const Review = lazy(() => import('../pages/Mentor/Review.jsx'));

// Placement Pages
const PlacementDashboard = lazy(() => import('../pages/Placement/PlacementDashboard.jsx'));
const Reports = lazy(() => import('../pages/Placement/Reports.jsx'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard.jsx'));
const CareerRoleCatalog = lazy(() => import('../pages/Admin/CareerRoleCatalog.jsx'));
const ContentManagement = lazy(() => import('../pages/Admin/ContentManagement.jsx'));
const UserManagement = lazy(() => import('../pages/Admin/UserManagement.jsx'));

function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-register-otp" element={<VerifyRegisterOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.STUDENT_DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path={ROUTES.CAREER_PROFILE} element={<ProtectedRoute><CareerProfile /></ProtectedRoute>} />
        <Route path="/student/career-profile" element={<ProtectedRoute><CareerProfile /></ProtectedRoute>} />
        <Route path={ROUTES.GOAL_SELECTION} element={<ProtectedRoute><GoalSelection /></ProtectedRoute>} />
        <Route path="/student/goal-selection" element={<ProtectedRoute><GoalSelection /></ProtectedRoute>} />
        <Route path={ROUTES.SKILL_INVENTORY} element={<ProtectedRoute><SkillInventory /></ProtectedRoute>} />
        <Route path="/student/skill-inventory" element={<ProtectedRoute><SkillInventory /></ProtectedRoute>} />
        <Route path={ROUTES.GAP_ANALYSIS} element={<ProtectedRoute><GapAnalysis /></ProtectedRoute>} />
        <Route path="/student/gap-analysis" element={<ProtectedRoute><GapAnalysis /></ProtectedRoute>} />
        <Route path={ROUTES.ROADMAP_BUILDER} element={<ProtectedRoute><RoadmapBuilder /></ProtectedRoute>} />
        <Route path="/student/roadmap-builder" element={<ProtectedRoute><RoadmapBuilder /></ProtectedRoute>} />
        <Route path={ROUTES.PROGRESS_TRACKING} element={<ProtectedRoute><ProgressTracking /></ProtectedRoute>} />
        <Route path="/student/progress-tracking" element={<ProtectedRoute><ProgressTracking /></ProtectedRoute>} />
        <Route path={ROUTES.PROJECT_PLANNER} element={<ProtectedRoute><ProjectPlanner /></ProtectedRoute>} />
        <Route path="/student/project-planner" element={<ProtectedRoute><ProjectPlanner /></ProtectedRoute>} />
        <Route path={ROUTES.MENTOR_REVIEW} element={<ProtectedRoute><MentorReview /></ProtectedRoute>} />
        <Route path="/student/mentor-review" element={<ProtectedRoute><MentorReview /></ProtectedRoute>} />
        <Route path={ROUTES.NOTIFICATIONS} element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/student/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        <Route
          path={ROUTES.MENTOR_DASHBOARD}
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[USER_ROLES.MENTOR]}>
                <MentorDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STUDENT_DETAIL}
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[USER_ROLES.MENTOR]}>
                <StudentDetail />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.REVIEW}
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[USER_ROLES.MENTOR]}>
                <Review />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PLACEMENT_DASHBOARD}
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[USER_ROLES.PLACEMENT_OFFICER]}>
                <PlacementDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.REPORTS}
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[USER_ROLES.PLACEMENT_OFFICER]}>
                <Reports />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CAREER_ROLE_CATALOG}
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
                <CareerRoleCatalog />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CONTENT_MANAGEMENT}
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
                <ContentManagement />
              </RoleGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USER_MANAGEMENT}
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
                <UserManagement />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
