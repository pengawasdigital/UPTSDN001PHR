import type {
  SchoolProfile,
  VisionMission,
  PrincipalMessage,
  WebSettings,
  Advantage,
  Facility,
  Extracurricular,
  OrganizationMember,
  News,
  Achievement,
  Gallery,
  TeacherStaff,
  Subject,
  Student,
  ContactMessage,
  User,
  DashboardStats
} from '../types.ts';

const TOKEN_KEY = 'sekolah_auth_token';
const USER_KEY = 'sekolah_user_info';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Permintaan gagal dengan status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User; message: string }> {
    const res = await request<{ success: boolean; token: string; user: User; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout network error ignored', e);
    } finally {
      authStorage.removeToken();
    }
  },

  async getMe(): Promise<User> {
    const res = await request<{ success: boolean; user: User }>('/api/auth/me');
    authStorage.setUser(res.user);
    return res.user;
  },

  // School Profile & Info
  async getSchoolProfile(): Promise<SchoolProfile> {
    const res = await request<{ success: boolean; data: SchoolProfile }>('/api/school-profile');
    return res.data;
  },

  async updateSchoolProfile(data: Partial<SchoolProfile>): Promise<SchoolProfile> {
    const res = await request<{ success: boolean; data: SchoolProfile }>('/api/school-profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async getVisionMission(): Promise<VisionMission> {
    const res = await request<{ success: boolean; data: VisionMission }>('/api/vision-mission');
    return res.data;
  },

  async updateVisionMission(data: Partial<VisionMission>): Promise<VisionMission> {
    const res = await request<{ success: boolean; data: VisionMission }>('/api/vision-mission', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async getPrincipalMessage(): Promise<PrincipalMessage> {
    const res = await request<{ success: boolean; data: PrincipalMessage }>('/api/principal-message');
    return res.data;
  },

  async updatePrincipalMessage(data: Partial<PrincipalMessage>): Promise<PrincipalMessage> {
    const res = await request<{ success: boolean; data: PrincipalMessage }>('/api/principal-message', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async getSettings(): Promise<WebSettings> {
    const res = await request<{ success: boolean; data: WebSettings }>('/api/settings');
    return res.data;
  },

  async updateSettings(data: Partial<WebSettings>): Promise<WebSettings> {
    const res = await request<{ success: boolean; data: WebSettings }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async getAdvantages(): Promise<Advantage[]> {
    const res = await request<{ success: boolean; data: Advantage[] }>('/api/advantages');
    return res.data;
  },

  async createAdvantage(data: Omit<Advantage, 'id'>): Promise<Advantage> {
    const res = await request<{ success: boolean; data: Advantage }>('/api/advantages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateAdvantage(id: string, data: Partial<Advantage>): Promise<Advantage> {
    const res = await request<{ success: boolean; data: Advantage }>(`/api/advantages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteAdvantage(id: string): Promise<void> {
    await request(`/api/advantages/${id}`, { method: 'DELETE' });
  },

  // News
  async getNews(params?: { category?: string; search?: string; status?: string }): Promise<News[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ success: boolean; data: News[] }>(`/api/news${qs}`);
    return res.data;
  },

  async getNewsBySlug(slug: string): Promise<News> {
    const res = await request<{ success: boolean; data: News }>(`/api/news/${slug}`);
    return res.data;
  },

  async createNews(data: Omit<News, 'id' | 'views' | 'createdAt'>): Promise<News> {
    const res = await request<{ success: boolean; data: News }>('/api/news', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateNews(id: string, data: Partial<News>): Promise<News> {
    const res = await request<{ success: boolean; data: News }>(`/api/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteNews(id: string): Promise<void> {
    await request(`/api/news/${id}`, { method: 'DELETE' });
  },

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    const res = await request<{ success: boolean; data: Achievement[] }>('/api/achievements');
    return res.data;
  },

  async createAchievement(data: Omit<Achievement, 'id'>): Promise<Achievement> {
    const res = await request<{ success: boolean; data: Achievement }>('/api/achievements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateAchievement(id: string, data: Partial<Achievement>): Promise<Achievement> {
    const res = await request<{ success: boolean; data: Achievement }>(`/api/achievements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteAchievement(id: string): Promise<void> {
    await request(`/api/achievements/${id}`, { method: 'DELETE' });
  },

  // Galleries
  async getGalleries(): Promise<Gallery[]> {
    const res = await request<{ success: boolean; data: Gallery[] }>('/api/galleries');
    return res.data;
  },

  async createGallery(data: Omit<Gallery, 'id'>): Promise<Gallery> {
    const res = await request<{ success: boolean; data: Gallery }>('/api/galleries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateGallery(id: string, data: Partial<Gallery>): Promise<Gallery> {
    const res = await request<{ success: boolean; data: Gallery }>(`/api/galleries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteGallery(id: string): Promise<void> {
    await request(`/api/galleries/${id}`, { method: 'DELETE' });
  },

  // Extracurriculars
  async getExtracurriculars(): Promise<Extracurricular[]> {
    const res = await request<{ success: boolean; data: Extracurricular[] }>('/api/extracurriculars');
    return res.data;
  },

  async createExtracurricular(data: Omit<Extracurricular, 'id'>): Promise<Extracurricular> {
    const res = await request<{ success: boolean; data: Extracurricular }>('/api/extracurriculars', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateExtracurricular(id: string, data: Partial<Extracurricular>): Promise<Extracurricular> {
    const res = await request<{ success: boolean; data: Extracurricular }>(`/api/extracurriculars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteExtracurricular(id: string): Promise<void> {
    await request(`/api/extracurriculars/${id}`, { method: 'DELETE' });
  },

  // Facilities
  async getFacilities(): Promise<Facility[]> {
    const res = await request<{ success: boolean; data: Facility[] }>('/api/facilities');
    return res.data;
  },

  async createFacility(data: Omit<Facility, 'id'>): Promise<Facility> {
    const res = await request<{ success: boolean; data: Facility }>('/api/facilities', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateFacility(id: string, data: Partial<Facility>): Promise<Facility> {
    const res = await request<{ success: boolean; data: Facility }>(`/api/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteFacility(id: string): Promise<void> {
    await request(`/api/facilities/${id}`, { method: 'DELETE' });
  },

  // Organization
  async getOrganization(): Promise<OrganizationMember[]> {
    const res = await request<{ success: boolean; data: OrganizationMember[] }>('/api/organization');
    return res.data;
  },

  async createOrganization(data: Omit<OrganizationMember, 'id'>): Promise<OrganizationMember> {
    const res = await request<{ success: boolean; data: OrganizationMember }>('/api/organization', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateOrganization(id: string, data: Partial<OrganizationMember>): Promise<OrganizationMember> {
    const res = await request<{ success: boolean; data: OrganizationMember }>(`/api/organization/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteOrganization(id: string): Promise<void> {
    await request(`/api/organization/${id}`, { method: 'DELETE' });
  },

  // Teachers / PTK
  async getTeachers(): Promise<TeacherStaff[]> {
    const res = await request<{ success: boolean; data: TeacherStaff[] }>('/api/teachers');
    return res.data;
  },

  async createTeacher(data: Omit<TeacherStaff, 'id'>): Promise<TeacherStaff> {
    const res = await request<{ success: boolean; data: TeacherStaff }>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateTeacher(id: string, data: Partial<TeacherStaff>): Promise<TeacherStaff> {
    const res = await request<{ success: boolean; data: TeacherStaff }>(`/api/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteTeacher(id: string): Promise<void> {
    await request(`/api/teachers/${id}`, { method: 'DELETE' });
  },

  async importTeachers(items: any[]): Promise<{ count: number; message: string }> {
    const res = await request<{ success: boolean; count: number; message: string }>('/api/teachers/import', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
    return res;
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    const res = await request<{ success: boolean; data: Subject[] }>('/api/subjects');
    return res.data;
  },

  async createSubject(data: Omit<Subject, 'id'>): Promise<Subject> {
    const res = await request<{ success: boolean; data: Subject }>('/api/subjects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    const res = await request<{ success: boolean; data: Subject }>(`/api/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteSubject(id: string): Promise<void> {
    await request(`/api/subjects/${id}`, { method: 'DELETE' });
  },

  // Students
  async getStudentsPublic(params?: { kelas?: string; rombel?: string; search?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.kelas) query.append('kelas', params.kelas);
    if (params?.rombel) query.append('rombel', params.rombel);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ success: boolean; data: any[] }>(`/api/students/public${qs}`);
    return res.data;
  },

  async getStudents(params?: { kelas?: string; rombel?: string; search?: string }): Promise<Student[]> {
    const query = new URLSearchParams();
    if (params?.kelas) query.append('kelas', params.kelas);
    if (params?.rombel) query.append('rombel', params.rombel);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<{ success: boolean; data: Student[] }>(`/api/students${qs}`);
    return res.data;
  },

  async createStudent(data: Omit<Student, 'id'>): Promise<Student> {
    const res = await request<{ success: boolean; data: Student }>('/api/students', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const res = await request<{ success: boolean; data: Student }>(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await request(`/api/students/${id}`, { method: 'DELETE' });
  },

  async importStudents(items: any[]): Promise<{ count: number; message: string }> {
    const res = await request<{ success: boolean; count: number; message: string }>('/api/students/import', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
    return res;
  },

  // Contact Messages
  async sendContactMessage(data: { nama: string; email: string; telepon?: string; subjek: string; pesan: string }): Promise<void> {
    await request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    const res = await request<{ success: boolean; data: ContactMessage[] }>('/api/contact');
    return res.data;
  },

  async updateContactMessageStatus(id: string, status: 'belum_dibaca' | 'sudah_dibaca' | 'dibalas'): Promise<ContactMessage> {
    const res = await request<{ success: boolean; data: ContactMessage }>(`/api/contact/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return res.data;
  },

  async deleteContactMessage(id: string): Promise<void> {
    await request(`/api/contact/${id}`, { method: 'DELETE' });
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await request<{ success: boolean; data: DashboardStats }>('/api/dashboard/stats');
    return res.data;
  },

  // Upload
  async uploadFile(filename: string, filetype: string, data: string): Promise<{ url: string }> {
    const res = await request<{ success: boolean; url: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ filename, filetype, data })
    });
    return res;
  }
};
