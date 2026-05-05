const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;
  setToken(token: string | null) { this.token = token; }
  private async request(method: string, endpoint: string, body?: any) {
    const url = `${API_BASE}${endpoint}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const options: RequestInit = { method, headers };
    if (body && method !== 'GET') options.body = JSON.stringify(body);
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }
  get(endpoint: string) { return this.request('GET', endpoint); }
  post(endpoint: string, body: any) { return this.request('POST', endpoint, body); }
  put(endpoint: string, body: any) { return this.request('PUT', endpoint, body); }
  delete(endpoint: string) { return this.request('DELETE', endpoint); }
  async login(email: string, password: string) { return this.post('/auth/login', { email, password }); }
  async getContent(section?: string) { const query = section ? `?section=${section}` : ''; return this.get(`/content${query}`); }
  async getServices() { return this.get('/services'); }
  async getTestimonials() { return this.get('/testimonials'); }
  async getGallery() { return this.get('/gallery'); }
  async submitContact(data: any) { return this.post('/contact', data); }
  async getProducts() { return this.get('/products'); }
}

export const api = new ApiClient();
export function storeToken(token: string) { localStorage.setItem('token', token); api.setToken(token); }
export function getToken(): string | null { return localStorage.getItem('token'); }
export function clearToken() { localStorage.removeItem('token'); api.setToken(null); }
const storedToken = getToken(); if (storedToken) api.setToken(storedToken);
