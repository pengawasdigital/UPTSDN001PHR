import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  writeBatch,
  setLogLevel
} from 'firebase/firestore';
import { initialSeedData } from './seedData.ts';
import { prepareSafeFirestoreDoc, sanitizeEntityBase64 } from './utils/fileStorage.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const firebaseConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../firebase-applet-config.json'), 'utf-8')
);
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
} from '../src/types.ts';

// Silence verbose internal Firestore gRPC idle stream warnings
setLogLevel('silent');

// Initialize Firebase App for Server-side
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// CRITICAL: Explicitly pass firestoreDatabaseId from firebase-applet-config.json
const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Dual-layer Database Store (In-Memory cache backed by Firebase Firestore)
class DatabaseStore {
  users: (User & { passwordHash: string })[] = [];
  schoolProfile: SchoolProfile = sanitizeEntityBase64({ ...initialSeedData.schoolProfile }, 'profile');
  visionMission: VisionMission = sanitizeEntityBase64({ ...initialSeedData.visionMission }, 'vm');
  principalMessage: PrincipalMessage = sanitizeEntityBase64({ ...initialSeedData.principalMessage }, 'pm');
  settings: WebSettings = sanitizeEntityBase64({ ...initialSeedData.settings }, 'settings');
  advantages: Advantage[] = [...initialSeedData.advantages];
  facilities: Facility[] = initialSeedData.facilities.map(f => sanitizeEntityBase64(f, 'fac'));
  extracurriculars: Extracurricular[] = initialSeedData.extracurriculars.map(e => sanitizeEntityBase64(e, 'extra'));
  organizationMembers: OrganizationMember[] = initialSeedData.organizationMembers.map(o => sanitizeEntityBase64(o, 'org'));
  news: News[] = initialSeedData.news.map(n => sanitizeEntityBase64(n, 'news'));
  achievements: Achievement[] = initialSeedData.achievements.map(a => sanitizeEntityBase64(a, 'ach'));
  galleries: Gallery[] = initialSeedData.galleries.map(g => sanitizeEntityBase64(g, 'gal'));
  teachersStaff: TeacherStaff[] = initialSeedData.teachersStaff.map(t => sanitizeEntityBase64(t, 'ptk'));
  subjects: Subject[] = [...initialSeedData.subjects];
  students: Student[] = [...initialSeedData.students];
  contactMessages: ContactMessage[] = [...initialSeedData.contactMessages];

  private initialized = false;

  async init() {
    if (this.initialized) return;

    // Requested credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'digitalpengawas@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Asyiella01@';
    const adminHash = await bcrypt.hash(adminPassword, 10);

    const opEmail = process.env.OPERATOR_EMAIL || 'basoekyphr25@gmail.com';
    const opPassword = process.env.OPERATOR_PASSWORD || 'Asyiella01@';
    const opHash = await bcrypt.hash(opPassword, 10);

    this.users = [
      {
        id: 'usr-admin-1',
        name: 'Administrator Utama',
        email: adminEmail,
        role: 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        passwordHash: adminHash,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-op-1',
        name: 'Operator Sekolah',
        email: opEmail,
        role: 'OPERATOR',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        passwordHash: opHash,
        createdAt: new Date().toISOString()
      }
    ];

    // Seed Firestore with initial records if not yet populated
    try {
      const profileSnap = await getDoc(doc(firestoreDb, 'schoolProfile', 'profile-1'));
      if (!profileSnap.exists()) {
        console.log('Seeding initial school profile to Firebase Firestore...');
        const batch = writeBatch(firestoreDb);
        batch.set(doc(firestoreDb, 'schoolProfile', 'profile-1'), prepareSafeFirestoreDoc(this.schoolProfile, 'profile-1'));
        batch.set(doc(firestoreDb, 'visionMission', 'vm-1'), prepareSafeFirestoreDoc(this.visionMission, 'vm-1'));
        batch.set(doc(firestoreDb, 'principalMessage', 'pm-1'), prepareSafeFirestoreDoc(this.principalMessage, 'pm-1'));
        batch.set(doc(firestoreDb, 'webSettings', 'settings-1'), prepareSafeFirestoreDoc(this.settings, 'settings-1'));

        for (const item of this.news) {
          batch.set(doc(firestoreDb, 'news', item.id), prepareSafeFirestoreDoc(item, item.id));
        }
        for (const item of this.achievements) {
          batch.set(doc(firestoreDb, 'achievements', item.id), prepareSafeFirestoreDoc(item, item.id));
        }
        for (const item of this.teachersStaff) {
          batch.set(doc(firestoreDb, 'teachersStaff', item.id), prepareSafeFirestoreDoc(item, item.id));
        }
        for (const item of this.students) {
          batch.set(doc(firestoreDb, 'students', item.id), prepareSafeFirestoreDoc(item, item.id));
        }
        for (const item of this.facilities) {
          batch.set(doc(firestoreDb, 'facilities', item.id), prepareSafeFirestoreDoc(item, item.id));
        }
        for (const item of this.extracurriculars) {
          batch.set(doc(firestoreDb, 'extracurriculars', item.id), prepareSafeFirestoreDoc(item, item.id));
        }
        await batch.commit();
        console.log('Firebase Firestore seeding completed successfully.');
      } else {
        // Load persisted profile from Firestore and ensure no oversized payload in memory
        const data = profileSnap.data() as SchoolProfile;
        this.schoolProfile = sanitizeEntityBase64({ ...this.schoolProfile, ...data }, 'profile');

        const [vmSnap, pmSnap, settingsSnap] = await Promise.allSettled([
          getDoc(doc(firestoreDb, 'visionMission', 'vm-1')),
          getDoc(doc(firestoreDb, 'principalMessage', 'pm-1')),
          getDoc(doc(firestoreDb, 'webSettings', 'settings-1'))
        ]);
        if (vmSnap.status === 'fulfilled' && vmSnap.value.exists()) {
          this.visionMission = sanitizeEntityBase64({ ...this.visionMission, ...(vmSnap.value.data() as VisionMission) }, 'vm');
        }
        if (pmSnap.status === 'fulfilled' && pmSnap.value.exists()) {
          this.principalMessage = sanitizeEntityBase64({ ...this.principalMessage, ...(pmSnap.value.data() as PrincipalMessage) }, 'pm');
        }
        if (settingsSnap.status === 'fulfilled' && settingsSnap.value.exists()) {
          this.settings = sanitizeEntityBase64({ ...this.settings, ...(settingsSnap.value.data() as WebSettings) }, 'settings');
        }
      }
    } catch (err) {
      console.warn('Firestore initial sync note:', err instanceof Error ? err.message : err);
    }

    this.initialized = true;
  }

  // --- Users & Auth ---
  async getUserByEmail(email: string) {
    await this.init();
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async getUserById(id: string) {
    await this.init();
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // --- Profile & General Info ---
  async getSchoolProfile(): Promise<SchoolProfile> {
    await this.init();
    return this.schoolProfile;
  }

  async updateSchoolProfile(data: Partial<SchoolProfile>): Promise<SchoolProfile> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'profile');
    this.schoolProfile = sanitizeEntityBase64({ ...this.schoolProfile, ...cleanData }, 'profile');
    try {
      const payload = prepareSafeFirestoreDoc(this.schoolProfile, 'profile-1');
      await setDoc(doc(firestoreDb, 'schoolProfile', 'profile-1'), payload, { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.schoolProfile;
  }

  async getVisionMission(): Promise<VisionMission> {
    await this.init();
    return this.visionMission;
  }

  async updateVisionMission(data: Partial<VisionMission>): Promise<VisionMission> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'vm');
    this.visionMission = sanitizeEntityBase64({ ...this.visionMission, ...cleanData }, 'vm');
    try {
      const payload = prepareSafeFirestoreDoc(this.visionMission, 'vm-1');
      await setDoc(doc(firestoreDb, 'visionMission', 'vm-1'), payload, { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.visionMission;
  }

  async getPrincipalMessage(): Promise<PrincipalMessage> {
    await this.init();
    return this.principalMessage;
  }

  async updatePrincipalMessage(data: Partial<PrincipalMessage>): Promise<PrincipalMessage> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'pm');
    this.principalMessage = sanitizeEntityBase64({ ...this.principalMessage, ...cleanData }, 'pm');
    try {
      const payload = prepareSafeFirestoreDoc(this.principalMessage, 'pm-1');
      await setDoc(doc(firestoreDb, 'principalMessage', 'pm-1'), payload, { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.principalMessage;
  }

  async getSettings(): Promise<WebSettings> {
    await this.init();
    return this.settings;
  }

  async updateSettings(data: Partial<WebSettings>): Promise<WebSettings> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'settings');
    this.settings = sanitizeEntityBase64({ ...this.settings, ...cleanData }, 'settings');
    try {
      const payload = prepareSafeFirestoreDoc(this.settings, 'settings-1');
      await setDoc(doc(firestoreDb, 'webSettings', 'settings-1'), payload, { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.settings;
  }

  // --- Advantages ---
  async getAdvantages(): Promise<Advantage[]> {
    await this.init();
    return [...this.advantages].sort((a, b) => a.urutan - b.urutan);
  }

  async createAdvantage(data: Omit<Advantage, 'id'>): Promise<Advantage> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'adv');
    const item: Advantage = {
      ...cleanData,
      id: `adv-${Date.now()}`
    };
    this.advantages.push(item);
    try {
      await setDoc(doc(firestoreDb, 'advantages', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateAdvantage(id: string, data: Partial<Advantage>): Promise<Advantage | null> {
    await this.init();
    const idx = this.advantages.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const cleanData = sanitizeEntityBase64(data, 'adv');
    this.advantages[idx] = sanitizeEntityBase64({ ...this.advantages[idx], ...cleanData }, 'adv');
    try {
      await setDoc(doc(firestoreDb, 'advantages', id), prepareSafeFirestoreDoc(this.advantages[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.advantages[idx];
  }

  async deleteAdvantage(id: string): Promise<boolean> {
    await this.init();
    const idx = this.advantages.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.advantages.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'advantages', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  // --- Facilities ---
  async getFacilities(): Promise<Facility[]> {
    await this.init();
    return [...this.facilities];
  }

  async createFacility(data: Omit<Facility, 'id'>): Promise<Facility> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'fac');
    const item: Facility = { ...cleanData, id: `fac-${Date.now()}` };
    this.facilities.push(item);
    try {
      await setDoc(doc(firestoreDb, 'facilities', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateFacility(id: string, data: Partial<Facility>): Promise<Facility | null> {
    await this.init();
    const idx = this.facilities.findIndex(f => f.id === id);
    if (idx === -1) return null;
    const cleanData = sanitizeEntityBase64(data, 'fac');
    this.facilities[idx] = sanitizeEntityBase64({ ...this.facilities[idx], ...cleanData }, 'fac');
    try {
      await setDoc(doc(firestoreDb, 'facilities', id), prepareSafeFirestoreDoc(this.facilities[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.facilities[idx];
  }

  async deleteFacility(id: string): Promise<boolean> {
    await this.init();
    const idx = this.facilities.findIndex(f => f.id === id);
    if (idx === -1) return false;
    this.facilities.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'facilities', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  // --- Extracurriculars ---
  async getExtracurriculars(): Promise<Extracurricular[]> {
    await this.init();
    return [...this.extracurriculars];
  }

  async createExtracurricular(data: Omit<Extracurricular, 'id'>): Promise<Extracurricular> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'extra');
    const item: Extracurricular = { ...cleanData, id: `extra-${Date.now()}` };
    this.extracurriculars.push(item);
    try {
      await setDoc(doc(firestoreDb, 'extracurriculars', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateExtracurricular(id: string, data: Partial<Extracurricular>): Promise<Extracurricular | null> {
    await this.init();
    const idx = this.extracurriculars.findIndex(e => e.id === id);
    if (idx === -1) return null;
    const cleanData = sanitizeEntityBase64(data, 'extra');
    this.extracurriculars[idx] = sanitizeEntityBase64({ ...this.extracurriculars[idx], ...cleanData }, 'extra');
    try {
      await setDoc(doc(firestoreDb, 'extracurriculars', id), prepareSafeFirestoreDoc(this.extracurriculars[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.extracurriculars[idx];
  }

  async deleteExtracurricular(id: string): Promise<boolean> {
    await this.init();
    const idx = this.extracurriculars.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.extracurriculars.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'extracurriculars', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  // --- Organization ---
  async getOrganization(): Promise<OrganizationMember[]> {
    await this.init();
    return [...this.organizationMembers].sort((a, b) => a.urutan - b.urutan);
  }

  async createOrganization(data: Omit<OrganizationMember, 'id'>): Promise<OrganizationMember> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'org');
    const item: OrganizationMember = { ...cleanData, id: `org-${Date.now()}` };
    this.organizationMembers.push(item);
    try {
      await setDoc(doc(firestoreDb, 'organizationMembers', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateOrganization(id: string, data: Partial<OrganizationMember>): Promise<OrganizationMember | null> {
    await this.init();
    const idx = this.organizationMembers.findIndex(o => o.id === id);
    if (idx === -1) return null;
    const cleanData = sanitizeEntityBase64(data, 'org');
    this.organizationMembers[idx] = sanitizeEntityBase64({ ...this.organizationMembers[idx], ...cleanData }, 'org');
    try {
      await setDoc(doc(firestoreDb, 'organizationMembers', id), prepareSafeFirestoreDoc(this.organizationMembers[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.organizationMembers[idx];
  }

  async deleteOrganization(id: string): Promise<boolean> {
    await this.init();
    const idx = this.organizationMembers.findIndex(o => o.id === id);
    if (idx === -1) return false;
    this.organizationMembers.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'organizationMembers', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  // --- News ---
  async getNews(options?: { category?: string; search?: string; status?: string }): Promise<News[]> {
    await this.init();
    let result = [...this.news];
    if (options?.category && options.category !== 'Semua') {
      result = result.filter(n => n.kategori.toLowerCase() === options.category!.toLowerCase());
    }
    if (options?.status) {
      result = result.filter(n => n.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(n => n.judul.toLowerCase().includes(q) || n.isi.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  async getNewsById(id: string): Promise<News | null> {
    await this.init();
    return this.news.find(n => n.id === id) || null;
  }

  async getNewsBySlug(slug: string): Promise<News | null> {
    await this.init();
    const item = this.news.find(n => n.slug === slug);
    if (item) {
      item.views = (item.views || 0) + 1;
      return item;
    }
    return null;
  }

  async createNews(data: Omit<News, 'id' | 'views' | 'createdAt'>): Promise<News> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'news');
    const slug = cleanData.slug || cleanData.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const item: News = {
      ...cleanData,
      id: `news-${Date.now()}`,
      slug,
      views: 0,
      createdAt: new Date().toISOString()
    };
    this.news.unshift(item);
    try {
      await setDoc(doc(firestoreDb, 'news', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateNews(id: string, data: Partial<News>): Promise<News | null> {
    await this.init();
    const idx = this.news.findIndex(n => n.id === id);
    if (idx === -1) return null;
    const cleanData = sanitizeEntityBase64(data, 'news');
    this.news[idx] = sanitizeEntityBase64({ ...this.news[idx], ...cleanData }, 'news');
    try {
      await setDoc(doc(firestoreDb, 'news', id), prepareSafeFirestoreDoc(this.news[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.news[idx];
  }

  async deleteNews(id: string): Promise<boolean> {
    await this.init();
    const idx = this.news.findIndex(n => n.id === id);
    if (idx === -1) return false;
    this.news.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'news', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  // --- Achievements ---
  async getAchievements(): Promise<Achievement[]> {
    await this.init();
    return [...this.achievements].sort((a, b) => parseInt(b.tahun, 10) - parseInt(a.tahun, 10));
  }

  async createAchievement(data: Omit<Achievement, 'id'>): Promise<Achievement> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'ach');
    const item: Achievement = { ...cleanData, id: `ach-${Date.now()}` };
    this.achievements.unshift(item);
    try {
      await setDoc(doc(firestoreDb, 'achievements', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateAchievement(id: string, data: Partial<Achievement>): Promise<Achievement | null> {
    await this.init();
    const idx = this.achievements.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const cleanData = sanitizeEntityBase64(data, 'ach');
    this.achievements[idx] = sanitizeEntityBase64({ ...this.achievements[idx], ...cleanData }, 'ach');
    try {
      await setDoc(doc(firestoreDb, 'achievements', id), prepareSafeFirestoreDoc(this.achievements[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.achievements[idx];
  }

  async deleteAchievement(id: string): Promise<boolean> {
    await this.init();
    const idx = this.achievements.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.achievements.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'achievements', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  // --- Galleries ---
  async getGalleries(): Promise<Gallery[]> {
    await this.init();
    return [...this.galleries].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  async createGallery(data: Omit<Gallery, 'id'>): Promise<Gallery> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'gal');
    const item: Gallery = { ...cleanData, id: `gal-${Date.now()}` };
    this.galleries.unshift(item);
    try {
      await setDoc(doc(firestoreDb, 'galleries', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateGallery(id: string, data: Partial<Gallery>): Promise<Gallery | null> {
    await this.init();
    const idx = this.galleries.findIndex(g => g.id === id);
    if (idx === -1) return null;
    const cleanData = sanitizeEntityBase64(data, 'gal');
    this.galleries[idx] = sanitizeEntityBase64({ ...this.galleries[idx], ...cleanData }, 'gal');
    try {
      await setDoc(doc(firestoreDb, 'galleries', id), prepareSafeFirestoreDoc(this.galleries[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.galleries[idx];
  }

  async deleteGallery(id: string): Promise<boolean> {
    await this.init();
    const idx = this.galleries.findIndex(g => g.id === id);
    if (idx === -1) return false;
    this.galleries.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'galleries', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  // --- Teachers & Staff ---
  async getTeachers(): Promise<TeacherStaff[]> {
    await this.init();
    return [...this.teachersStaff];
  }

  async createTeacher(data: Omit<TeacherStaff, 'id'>): Promise<TeacherStaff> {
    await this.init();
    const cleanData = sanitizeEntityBase64(data, 'ptk');
    const item: TeacherStaff = { ...cleanData, id: `ptk-${Date.now()}` };
    this.teachersStaff.push(item);
    try {
      await setDoc(doc(firestoreDb, 'teachersStaff', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateTeacher(id: string, data: Partial<TeacherStaff>): Promise<TeacherStaff | null> {
    await this.init();
    const idx = this.teachersStaff.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const cleanData = sanitizeEntityBase64(data, 'ptk');
    this.teachersStaff[idx] = sanitizeEntityBase64({ ...this.teachersStaff[idx], ...cleanData }, 'ptk');
    try {
      await setDoc(doc(firestoreDb, 'teachersStaff', id), prepareSafeFirestoreDoc(this.teachersStaff[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.teachersStaff[idx];
  }

  async deleteTeacher(id: string): Promise<boolean> {
    await this.init();
    const idx = this.teachersStaff.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.teachersStaff.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'teachersStaff', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  async batchInsertTeachers(teachers: Omit<TeacherStaff, 'id'>[]): Promise<number> {
    await this.init();
    let count = 0;
    for (const t of teachers) {
      const cleanData = sanitizeEntityBase64(t, 'ptk');
      const item = {
        ...cleanData,
        id: `ptk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      };
      this.teachersStaff.push(item);
      try {
        await setDoc(doc(firestoreDb, 'teachersStaff', item.id), prepareSafeFirestoreDoc(item, item.id));
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
      count++;
    }
    return count;
  }

  // --- Subjects ---
  async getSubjects(): Promise<Subject[]> {
    await this.init();
    return [...this.subjects];
  }

  async createSubject(data: Omit<Subject, 'id'>): Promise<Subject> {
    await this.init();
    const item: Subject = { ...data, id: `subj-${Date.now()}` };
    this.subjects.push(item);
    try {
      await setDoc(doc(firestoreDb, 'subjects', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject | null> {
    await this.init();
    const idx = this.subjects.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.subjects[idx] = { ...this.subjects[idx], ...data };
    try {
      await setDoc(doc(firestoreDb, 'subjects', id), prepareSafeFirestoreDoc(this.subjects[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.subjects[idx];
  }

  async deleteSubject(id: string): Promise<boolean> {
    await this.init();
    const idx = this.subjects.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.subjects.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'subjects', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  // --- Students ---
  async getStudents(options?: { kelas?: string; rombel?: string; search?: string }): Promise<Student[]> {
    await this.init();
    let list = [...this.students];
    if (options?.kelas && options.kelas !== 'Semua') {
      list = list.filter(s => s.kelas.toLowerCase() === options.kelas!.toLowerCase());
    }
    if (options?.rombel && options.rombel !== 'Semua') {
      list = list.filter(s => s.rombel.toLowerCase() === options.rombel!.toLowerCase());
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(s => s.nama.toLowerCase().includes(q) || s.nis.includes(q) || s.nisn.includes(q));
    }
    return list;
  }

  async createStudent(data: Omit<Student, 'id'>): Promise<Student> {
    await this.init();
    const item: Student = { ...data, id: `std-${Date.now()}` };
    this.students.push(item);
    try {
      await setDoc(doc(firestoreDb, 'students', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student | null> {
    await this.init();
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.students[idx] = { ...this.students[idx], ...data };
    try {
      await setDoc(doc(firestoreDb, 'students', id), prepareSafeFirestoreDoc(this.students[idx], id), { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.students[idx];
  }

  async deleteStudent(id: string): Promise<boolean> {
    await this.init();
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.students.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'students', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  async batchInsertStudents(students: Omit<Student, 'id'>[]): Promise<number> {
    await this.init();
    let count = 0;
    for (const s of students) {
      const item = {
        ...s,
        id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      };
      this.students.push(item);
      try {
        await setDoc(doc(firestoreDb, 'students', item.id), prepareSafeFirestoreDoc(item, item.id));
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }
      count++;
    }
    return count;
  }

  // --- Contact Messages ---
  async getContactMessages(): Promise<ContactMessage[]> {
    await this.init();
    return [...this.contactMessages].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  async createContactMessage(data: Omit<ContactMessage, 'id' | 'tanggal' | 'status'>): Promise<ContactMessage> {
    await this.init();
    const item: ContactMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      tanggal: new Date().toISOString(),
      status: 'belum_dibaca'
    };
    this.contactMessages.unshift(item);
    try {
      await setDoc(doc(firestoreDb, 'contactMessages', item.id), prepareSafeFirestoreDoc(item, item.id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return item;
  }

  async updateContactMessageStatus(id: string, status: 'belum_dibaca' | 'sudah_dibaca' | 'dibalas'): Promise<ContactMessage | null> {
    await this.init();
    const idx = this.contactMessages.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.contactMessages[idx].status = status;
    try {
      await setDoc(doc(firestoreDb, 'contactMessages', id), { status }, { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
    return this.contactMessages[idx];
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    await this.init();
    const idx = this.contactMessages.findIndex(m => m.id === id);
    if (idx === -1) return false;
    this.contactMessages.splice(idx, 1);
    try {
      await deleteDoc(doc(firestoreDb, 'contactMessages', id));
    } catch (e) {
      console.warn('Firestore delete warning:', e);
    }
    return true;
  }

  // --- Dashboard Stats ---
  async getDashboardStats(): Promise<DashboardStats> {
    await this.init();

    const classCountMap: Record<string, number> = {};
    for (const s of this.students) {
      const cls = s.kelas || 'Lainnya';
      classCountMap[cls] = (classCountMap[cls] || 0) + 1;
    }
    const siswaPerKelas = Object.keys(classCountMap).map(kelas => ({
      kelas,
      count: classCountMap[kelas]
    }));

    const yearCountMap: Record<string, number> = {};
    for (const a of this.achievements) {
      const yr = a.tahun || '2026';
      yearCountMap[yr] = (yearCountMap[yr] || 0) + 1;
    }
    const prestasiPerTahun = Object.keys(yearCountMap).map(tahun => ({
      tahun,
      count: yearCountMap[tahun]
    }));

    const ptkCountMap: Record<string, number> = {};
    for (const p of this.teachersStaff) {
      const jns = p.jenisPTK || 'Lainnya';
      ptkCountMap[jns] = (ptkCountMap[jns] || 0) + 1;
    }
    const ptkPerJenis = Object.keys(ptkCountMap).map(jenis => ({
      jenis,
      count: ptkCountMap[jenis]
    }));

    const unreadMessages = this.contactMessages.filter(m => m.status === 'belum_dibaca').length;

    return {
      totalSiswa: this.students.length,
      totalPTK: this.teachersStaff.length,
      totalBerita: this.news.length,
      totalPrestasi: this.achievements.length,
      totalGaleri: this.galleries.length,
      totalEkstrakurikuler: this.extracurriculars.length,
      totalFasilitas: this.facilities.length,
      pesanMasuk: unreadMessages,
      siswaPerKelas,
      prestasiPerTahun,
      ptkPerJenis,
      beritaPerBulan: [
        { bulan: 'Jan', count: 3 },
        { bulan: 'Feb', count: 5 },
        { bulan: 'Mar', count: 4 },
        { bulan: 'Apr', count: 6 },
        { bulan: 'Mei', count: 8 },
        { bulan: 'Jun', count: 7 }
      ]
    };
  }
}

export const db = new DatabaseStore();
