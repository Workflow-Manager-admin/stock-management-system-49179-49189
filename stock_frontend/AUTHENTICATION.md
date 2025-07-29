# Admin Authentication & Token Handling (Frontend-Backend Integration)

## Overview

This document describes the **admin authentication** flow and **token handling** strategy between the Vue-based frontend (`stock_frontend`) and FastAPI backend (`stock_backend`) for the Stock Management System. It covers how admins log in, how tokens are issued and stored, and how tokens are used for admin-only API calls.

---

## 1. Admin Login Flow

### Backend Login Endpoint

- **URL:**  
  ```
  POST /login
  ```
  Example: `https://vscode-internal-2114-beta.beta01.cloud.kavia.ai:3001/login`
  - The base URL for all backend API requests is now set in [`src/constants.ts`](./src/constants.ts) and *NOT* from an environment variable.  
  - To change backend destination, edit `API_BASE_URL` in the constants file.

- **Request Body:**  
  ```json
  {
    "username": "<admin_username>",
    "password": "<admin_password>"
  }
  ```

- **Response (Success, 200):**  
  ```json
  {
    "access_token": "<JWT_or_bearer_token>",
    "token_type": "bearer"
  }
  ```

- **Errors:**  
  - `401 Unauthorized`: If credentials are incorrect.
  - `422 Unprocessable Entity`: If request fields are missing or invalid.

#### Example request (in frontend with the constants file):
```js
import { API_BASE_URL } from '@/constants'
const resp = await fetch(`${API_BASE_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});
const data = await resp.json();
if (resp.ok) {
  // Successful login: data.access_token is present
}
```

---

## 2. Token Storage (Frontend)

- The bearer token (`access_token`) from a successful login is stored **in memory** (Pinia store, not persisted to localStorage/sessionStorage for security; adjust if persistence is desired).
- The login state (`isAdmin`) is updated to `true` as long as a valid token is present.

### Relevant Vue Pinia Store
See `src/stores/auth.ts`

- `token`: string | null; // in-memory only
- `isAdmin`: boolean
- Token is cleared on logout.

---

## 3. Making Authenticated API Calls (Admin Only)

- For any API that **requires admin rights**, attach the token from the store in the `Authorization` header using the `Bearer` scheme.

- **Header Example:**
  ```
  Authorization: Bearer <access_token>
  ```

#### Example (`getAuthHeader` helper in Pinia auth store):
```js
function getAuthHeader() {
  return token.value ? { Authorization: `Bearer ${token.value}` } : undefined;
}
```

#### Example API call (with fetch):
```js
const resp = await fetch('/admin/protected-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader()
  },
  body: JSON.stringify(payload)
});
```

---

## 4. Logout

- **Logout** simply clears the token and `isAdmin` status in the auth store.
- Any further protected actions will require re-login.

---

## 5. Security Notes

- **Tokens are only held in memory** for the session.
- On browser reload, session is lost (for persistent admin sessions, extend the store to use `localStorage`/`sessionStorage` as needed).
- Never expose tokens in URLs or logs.
- All admin actions must pass the `Authorization` header or the backend will respond with 401 Unauthorized.

---

## 6. API Reference

Refer to the backend [OpenAPI spec](https://vscode-internal-6-beta.beta01.cloud.kavia.ai:3001/docs) for details about available endpoints and which require authentication.

**Summary Table**

| Action               | Endpoint        | Auth Required | How Token Is Used         |
|----------------------|----------------|--------------|--------------------------|
| Admin login          | POST /login    | No           | Token returned on success|
| Public data fetch    | GET /categories, /products | No | None                   |
| Admin-only operation | e.g. /admin/*  | Yes          | Send Bearer token in `Authorization` header |

---

## 7. Frontend File References

- **Login page:** `src/views/AdminLoginView.vue`
- **Auth store:** `src/stores/auth.ts`
- **Token usage in API calls:** Use `getAuthHeader()` in requests

---

## Example: Full Admin Login & Authenticated Request (in frontend)
```js
// Login
await auth.login(username, password);
// Use token on subsequent admin-only requests
await fetch('/admin/products', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        ...auth.getAuthHeader()
    },
    body: JSON.stringify({...})
});
```

---

## 8. Updating the Auth Flow

If backend auth behavior or API route structure changes, **update this file and the store logic accordingly.**

---

*Contact backend maintainer for details about token expiry or refresh protocols if implemented in the backend in the future.*
