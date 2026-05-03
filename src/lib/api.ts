// API client for the backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request(method: string, endpoint: string, body?: any) {
    const url = `${API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  get(endpoint: string) {
    return this.request('GET', endpoint);
  }

  post(endpoint: string, body: any) {
    return this.request('POST', endpoint, body);
  }

  put(endpoint: string, body: any) {
    return this.request('PUT', endpoint, body);
  }

  delete(endpoint: string) {
    return this.request('DELETE', endpoint);
  }

  // Auth
  async login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  }

  async register(email: string, password: string, name?: string, phone?: string) {
    return this.post('/auth/register', { email, password, name, phone });
  }

  async me() {
    return this.get('/auth/me');
  }

  // Content
  async getContent(section?: string) {
    const query = section ? `?section=${section}` : '';
    return this.get(`/content${query}`);
  }

  async updateContent(section: string, key: string, value: string, type = 'text') {
    return this.put(`/content/${section}/${key}`, { value, type });
  }

  async bulkUpdateContent(data: Record<string, Record<string, any>>) {
    return this.post('/content/bulk', data);
  }

  // Services
  async getServices() {
    return this.get('/services');
  }

  // Bookings
  async getAvailability(date: string) {
    return this.get(`/bookings/availability?date=${date}`);
  }

  async createBooking(data: any) {
    return this.post('/bookings', data);
  }

  // Testimonials
  async getTestimonials() {
    return this.get('/testimonials');
  }

  // Contact
  async submitContact(data: any) {
    return this.post('/contact', data);
  }

  // Gallery
  async getGallery() {
    return this.get('/gallery');
  }

  // Settings
  async getSettings() {
    return this.get('/settings');
  }

  // Quiz
  async getQuiz(slug: string) {
    return this.get(`/quiz/${slug}`);
  }

  async submitQuiz(slug: string, answers: any[], email?: string) {
    return this.post(`/quiz/${slug}/submit`, { answers, email });
  }

  // Products
  async getProducts() {
    return this.get('/products');
  }

  async getProduct(slug: string) {
    return this.get(`/products/${slug}`);
  }
}

export const api = new ApiClient();

// Store token in localStorage
export function storeToken(token: string) {
  localStorage.setItem('token', token);
  api.setToken(token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function clearToken() {
  localStorage.removeItem('token');
  api.setToken(null);
}

// Initialize token from storage
const storedToken = getToken();
if (storedToken) {
  api.setToken(storedToken);
}
