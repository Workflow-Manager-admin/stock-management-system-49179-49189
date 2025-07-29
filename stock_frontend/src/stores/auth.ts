import { defineStore } from 'pinia';
import { ref } from 'vue';

// PUBLIC_INTERFACE
/**
 * Auth store: manages admin login state (token, isAdmin), login/logout actions, and error state.
 */
export const useAuthStore = defineStore('auth', () => {
  // JWT or backend token after successful login
  const token = ref<string | null>(null);
  // True if current user is admin (logged in as admin)
  const isAdmin = ref<boolean>(false);
  // Login error message
  const loginError = ref<string>('');

  // PUBLIC_INTERFACE
  /**
   * Returns HTTP Authorization header if logged in; else undefined.
   */
  function getAuthHeader(): Record<string, string> | undefined {
    return token.value ? { Authorization: `Bearer ${token.value}` } : undefined;
  }

  // PUBLIC_INTERFACE
  /**
   * Logs in as admin (calls backend /login, stores token and updates isAdmin).
   * @param username string
   * @param password string
   * @returns Promise<boolean>
   */
  async function login(username: string, password: string): Promise<boolean> {
    loginError.value = '';
    try {
      // Use environment variable for backend login endpoint
      const API_BASE = import.meta.env.VUE_APP_BACKEND_BASE_URL as string;
      if (!API_BASE) {
        // eslint-disable-next-line no-console
        console.warn('VUE_APP_BACKEND_BASE_URL not set! Login endpoint may not work.');
      }
      const resp = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!resp.ok) {
        if (resp.status === 401) {
          loginError.value = 'Invalid credentials. Please try again.';
        } else {
          loginError.value = 'Login failed. Server error.';
        }
        return false;
      }
      const data = await resp.json();
      token.value = data.access_token || null;
      isAdmin.value = !!token.value;
      return true;
    } catch {
      loginError.value = 'Network or server error.';
      return false;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Logs out the admin (clears token and isAdmin).
   */
  function logout() {
    token.value = null;
    isAdmin.value = false;
    loginError.value = '';
  }

  return { token, isAdmin, loginError, login, logout, getAuthHeader };
});
