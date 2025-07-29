import { useAuthStore } from '../stores/auth'

/**
 * API base URL is sourced from environment variable for flexibility.
 * Ensure VUE_APP_BACKEND_BASE_URL is defined in your .env file.
 */
const API_BASE = import.meta.env.VUE_APP_BACKEND_BASE_URL as string
if (!API_BASE) {
  // For dev assurance, log if not set
  // eslint-disable-next-line no-console
  console.warn('VUE_APP_BACKEND_BASE_URL not set! Check your .env configuration.')
}

/**
 * Category type definition
 */
export interface Category {
  id: number
  name: string
}

/**
 * Product type definition
 */
export interface Product {
  id: number
  name: string
  category_id: number
  image_url: string
  quantity: number
}

/**
 * Create/Update category payload
 */
export interface CategoryInput {
  name: string
}

/**
 * Create/Update product payload
 */
export interface ProductInput {
  name: string
  category_id: number
  image_url: string
  quantity: number
}

/**
 * Admin API service for protected endpoints
 */
export const adminApi = {
  /**
   * Generic request helper with auth header
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const auth = useAuthStore()
    const headers = {
      'Content-Type': 'application/json',
      ...auth.getAuthHeader(),
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  },

  // Categories
  async createCategory(data: CategoryInput): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateCategory(id: number, data: CategoryInput): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteCategory(id: number): Promise<void> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    })
  },

  // Products
  async createProduct(data: ProductInput): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateProduct(id: number, data: ProductInput): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteProduct(id: number): Promise<void> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  },

  // Data Management
  async refillMockData(): Promise<void> {
    return this.request('/admin/refill-mocks', {
      method: 'POST',
    })
  },

  async clearAllData(): Promise<void> {
    return this.request('/admin/clear-data', {
      method: 'DELETE',
    })
  },
}
