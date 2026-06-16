export const getDashboardPathForRole = (role) => {
  const routes = {
    student: '/dashboard',
    public: '/dashboard',
    mentor: '/mentor/dashboard',
    placement_officer: '/placement/dashboard',
    admin: '/admin/dashboard',
  };

  return routes[role] || '/dashboard';
};
