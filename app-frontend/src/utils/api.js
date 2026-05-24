export function apiUrl(path = '') {
  const configuredUrl = import.meta.env.VITE_API_URL;

  if (configuredUrl) {
    return `${configuredUrl}${path}`;
  }

  const { hostname } = window.location;
  const backendHost = hostname && hostname !== 'localhost' ? hostname : '127.0.0.1';

  return `http://${backendHost}:8000${path}`;
}
