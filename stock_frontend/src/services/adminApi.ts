import { useAuthStore } from '../stores/auth'

const API_BASE = 'https://vscode-internal-6-beta.beta01.cloud.kavia.ai:3001'

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
}
