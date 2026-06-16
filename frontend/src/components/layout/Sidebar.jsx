import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routeConstants.js';
import { USER_ROLES } from '../../constants/roleConstants.js';

const menus = {
  [USER_ROLES.STUDENT]: [
    { label: 'Dashboard', to: ROUTES.STUDENT_DASHBOARD },
    { label: 'Career Profile', to: ROUTES.CAREER_PROFILE },
    { label: 'Goal Selection', to: ROUTES.GOAL_SELECTION },
    { label: 'Skill Inventory', to: ROUTES.SKILL_INVENTORY },
    { label: 'Gap Analysis', to: ROUTES.GAP_ANALYSIS },
    { label: 'Roadmap Builder', to: ROUTES.ROADMAP_BUILDER },
    { label: 'Progress Tracking', to: ROUTES.PROGRESS_TRACKING },
    { label: 'Project Planner', to: ROUTES.PROJECT_PLANNER },
    { label: 'Mentor Review', to: ROUTES.MENTOR_REVIEW },
    { label: 'Notifications', to: ROUTES.NOTIFICATIONS },
  ],
  [USER_ROLES.MENTOR]: [
    { label: 'Dashboard', to: ROUTES.MENTOR_DASHBOARD },
    { label: 'Student Detail', to: ROUTES.STUDENT_DETAIL.replace(':id', '1') },
    { label: 'Review', to: ROUTES.REVIEW },
  ],
  [USER_ROLES.PLACEMENT_OFFICER]: [
    { label: 'Dashboard', to: ROUTES.PLACEMENT_DASHBOARD },
    { label: 'Reports', to: ROUTES.REPORTS },
  ],
  [USER_ROLES.ADMIN]: [
    { label: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD },
    { label: 'Career Roles', to: ROUTES.CAREER_ROLE_CATALOG },
    { label: 'Content Management', to: ROUTES.CONTENT_MANAGEMENT },
    { label: 'User Management', to: ROUTES.USER_MANAGEMENT },
  ],
};

export function Sidebar({ role }) {
  return (
    <aside className="sticky top-0 hidden h-[calc(100vh-80px)] w-72 shrink-0 space-y-6 overflow-y-auto border-r border-slate-200 bg-slate-50 px-4 py-6 dark:border-slate-700 dark:bg-slate-950 lg:block">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Dashboard Navigation</p>
      </div>
      <nav className="space-y-2">
        {menus[role]?.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-brand-600 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
