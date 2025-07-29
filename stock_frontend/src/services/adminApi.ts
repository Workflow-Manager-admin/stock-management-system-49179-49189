import { useAuthStore } from '../stores/auth'
import { API_BASE_URL } from '../constants'

/**
 * API base URL is now sourced from the project-wide constant (src/constants.ts).
 * Do NOT use any environment variable or import.meta.env for the backend URL here.
 * To update the backend address, edit API_BASE_URL in constants.ts.
 */
const API_BASE = API_BASE_URL

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
