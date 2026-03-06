// API base URL - will be replaced by environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Niche {
  id?: number;
  name: string;
  description: string;
  category: string;
  trend_score: number;
  competition_score: number;
  profitability_score: number;
  search_volume: number;
  overall_score?: number;
}

export interface Company {
  id?: number;
  name: string;
  niche_id?: number;
  website: string;
  industry: string;
  size: string;
  location: string;
  founded_year: number;
}

export interface Contact {
  id?: number;
  company_id: number;
  name: string;
  email: string;
  phone: string;
  job_title: string;
  linkedin_url: string;
  department: string;
  seniority_level: string;
  company_name?: string;
  company_website?: string;
  company_industry?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Niche endpoints
  async getNiches(): Promise<Niche[]> {
    const response = await this.request<{ success: boolean; data: Niche[] }>('/niches');
    return response.data;
  }

  async searchNiches(query?: string, category?: string): Promise<Niche[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/niches/search?${queryString}` : '/niches/search';
    
    const response = await this.request<{ success: boolean; data: Niche[] }>(endpoint);
    return response.data;
  }

  async getNicheDetails(name: string): Promise<{
    success: boolean;
    data: Niche & { companies: Company[]; contacts: Contact[] };
  }> {
    return await this.request(`/niches/${encodeURIComponent(name)}`);
  }

  async saveNiche(niche: Omit<Niche, 'id' | 'overall_score'>): Promise<{ id: number }> {
    const response = await this.request<{ success: boolean; data: { id: number } }>('/niches/save', {
      method: 'POST',
      body: JSON.stringify(niche),
    });
    return response.data;
  }

  async getSavedNiches(): Promise<Niche[]> {
    const response = await this.request<{ success: boolean; data: Niche[] }>('/niches/saved');
    return response.data;
  }

  // Contact endpoints
  async getContactsForNiche(nicheName: string): Promise<Contact[]> {
    const response = await this.request<{ success: boolean; data: Contact[] }>(`/contacts/niche/${encodeURIComponent(nicheName)}`);
    return response.data;
  }

  async getContactsForCompany(companyName: string): Promise<Contact[]> {
    const response = await this.request<{ success: boolean; data: Contact[] }>(`/contacts/company/${encodeURIComponent(companyName)}`);
    return response.data;
  }

  async searchContacts(
    query?: string,
    company?: string,
    department?: string,
    seniority?: string
  ): Promise<Contact[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (company) params.append('company', company);
    if (department) params.append('department', department);
    if (seniority) params.append('seniority', seniority);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/contacts/search?${queryString}` : '/contacts/search';
    
    const response = await this.request<{ success: boolean; data: Contact[] }>(endpoint);
    return response.data;
  }

  async saveContact(contact: Omit<Contact, 'id'>): Promise<void> {
    await this.request('/contacts/save', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async getAllContacts(): Promise<Contact[]> {
    const response = await this.request<{ success: boolean; data: Contact[] }>('/contacts');
    return response.data;
  }
}

export const apiService = new ApiService();