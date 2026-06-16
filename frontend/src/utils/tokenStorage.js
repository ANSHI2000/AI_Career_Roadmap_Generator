// Token storage utility
export const getToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// User storage utility
export const getUser = () => {
  try {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const setUser = (user) => {
  try {
    localStorage.setItem('authUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user:', error);
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem('authUser');
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Clear all auth data
export const clearAuthData = () => {
  removeToken();
  removeUser();
};
