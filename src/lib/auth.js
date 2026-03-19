export const isAuthenticated = () => {
  return !!localStorage.getItem('makel_token');
};

export const getToken = () => {
  return localStorage.getItem('makel_token');
};

export const setAuth = (session) => {
  localStorage.setItem('makel_token', session.access_token);
  localStorage.setItem('makel_user', JSON.stringify(session.user));
};

export const clearAuth = () => {
  localStorage.removeItem('makel_token');
  localStorage.removeItem('makel_user');
};

export const getUser = () => {
  const user = localStorage.getItem('makel_user');
  return user ? JSON.parse(user) : null;
};
