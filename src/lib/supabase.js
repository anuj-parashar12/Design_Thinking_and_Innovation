import { createClient } from '@supabase/supabase-js';
import { storeLocalFile, getLocalFile, deleteLocalFile } from './indexedDb';
import { INITIAL_DEMO_PRODUCTS } from '../data/crafts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid and not placeholders
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('your-project') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// LOCAL DEMO MODE STORAGE & AUTH EMULATION
// ==========================================
const LOCAL_USERS_KEY = 'kalasetu_local_users';
const LOCAL_SESSION_KEY = 'kalasetu_local_session';
const LOCAL_PRODUCTS_KEY = 'kalasetu_local_products';

// Initialize local store with demo seed data if empty
export function initLocalData() {
  if (!localStorage.getItem(LOCAL_PRODUCTS_KEY)) {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_DEMO_PRODUCTS));
  }
  if (!localStorage.getItem(LOCAL_USERS_KEY)) {
    // Seed default demo seller
    const defaultSellers = [
      {
        id: 'artisan-sita-devi',
        email: 'sita.devi@kalasetu.demo',
        password: 'password123',
        name: 'Sita Devi Mahasundari',
        role: 'seller',
        state: 'Bihar',
        craft_specialization: 'Madhubani & Kohbar Art',
        bio: 'Master artisan from Jitwarpur, Madhubani. Practicing the heritage art form for over 32 years with an artisan cooperative of 24 women.',
        public_phone: '+919876543210',
        whatsapp_number: '919876543210',
        show_phone: true,
        show_whatsapp: true,
        profile_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'artisan-demo',
        email: 'artisan@kalasetu.demo',
        password: 'password123',
        name: 'Arjun Das (Demo Artisan)',
        role: 'seller',
        state: 'Rajasthan',
        craft_specialization: 'Terracotta & Pottery',
        bio: 'Demonstration seller account for evaluation. Ready to add new products and stories!',
        public_phone: '+919876500000',
        whatsapp_number: '919876500000',
        show_phone: true,
        show_whatsapp: true,
        profile_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
      }
    ];
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaultSellers));
  }
}

// Ensure initialized immediately
initLocalData();

// Local Storage Product & Artisan Operations
export const LocalDB = {
  // --- AUTH ---
  getCurrentUser() {
    const session = localStorage.getItem(LOCAL_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  signUp(email, password, { name, role = 'seller', state = '', craft_specialization = '', bio = '', public_phone = '', whatsapp_number = '', show_phone = true, show_whatsapp = true, profile_image_url = '' }) {
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: 'artisan-' + Date.now(),
      email,
      password,
      name,
      role,
      state,
      craft_specialization,
      bio,
      public_phone,
      whatsapp_number,
      show_phone,
      show_whatsapp,
      profile_image_url: profile_image_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  signIn(email, password) {
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password.');
    }
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
    return user;
  },

  signOut() {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  },

  updateProfile(userId, updates) {
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    const updated = { ...users[idx], ...updates };
    users[idx] = updated;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

    const currentSession = this.getCurrentUser();
    if (currentSession && currentSession.id === userId) {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated));
    }

    // Also update seller details attached to existing products in demo mode
    const products = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
    const updatedProducts = products.map(p => {
      if (p.seller_id === userId) {
        return { ...p, seller: { ...p.seller, ...updates } };
      }
      return p;
    });
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updatedProducts));

    return updated;
  },

  getUserProfile(userId) {
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
    return users.find(u => u.id === userId) || null;
  },

  // --- PRODUCTS ---
  getProducts() {
    return JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  async addProduct(productData, sellerUser) {
    const products = this.getProducts();
    const newProduct = {
      id: 'prod-' + Date.now(),
      seller_id: sellerUser.id,
      name: productData.name,
      price: Number(productData.price),
      state: productData.state,
      category: productData.category,
      materials: productData.materials || '',
      quantity: Number(productData.quantity) || 1,
      description: productData.description || '',
      image_urls: productData.image_urls || [],
      story_text: productData.story_text || '',
      story_video_url: productData.story_video_url || '',
      story_document_url: productData.story_document_url || '',
      story_document_name: productData.story_document_name || '',
      available: productData.available !== undefined ? productData.available : true,
      created_at: new Date().toISOString(),
      seller: {
        id: sellerUser.id,
        name: sellerUser.name,
        state: sellerUser.state,
        craft_specialization: sellerUser.craft_specialization,
        bio: sellerUser.bio,
        public_phone: sellerUser.public_phone,
        whatsapp_number: sellerUser.whatsapp_number,
        show_phone: sellerUser.show_phone,
        show_whatsapp: sellerUser.show_whatsapp,
        profile_image_url: sellerUser.profile_image_url
      }
    };

    products.unshift(newProduct);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  },

  async updateProduct(id, updates, sellerId) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    if (products[idx].seller_id !== sellerId) {
      throw new Error('Unauthorized to update this product');
    }
    const updated = {
      ...products[idx],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : products[idx].price,
      quantity: updates.quantity !== undefined ? Number(updates.quantity) : products[idx].quantity
    };
    products[idx] = updated;
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    return updated;
  },

  async deleteProduct(id, sellerId) {
    const products = this.getProducts();
    const target = products.find(p => p.id === id);
    if (!target) throw new Error('Product not found');
    if (target.seller_id !== sellerId) {
      throw new Error('Unauthorized to delete this product');
    }
    const remaining = products.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(remaining));
    return true;
  },

  // --- FILE UPLOADS (Smart Hybrid: Cloudinary -> Supabase -> Local IndexedDB) ---
  async uploadMedia(file, category = 'images') {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // 1. Cloudinary upload if configured
    if (cloudName && uploadPreset) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        const resourceType = file.type.startsWith('video/') ? 'video' : 'auto';
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const cloudData = await res.json();
          return cloudData.secure_url;
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, attempting fallback:', cloudErr);
      }
    }

    // 2. Supabase Storage upload if configured
    if (isSupabaseConfigured()) {
      const bucket = category === 'images' ? 'products' : 'stories';
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    } else {
      // 3. Local demo mode with IndexedDB + Data URL
      return new Promise((resolve, reject) => {
        const fileId = `file_${Date.now()}_${file.name}`;
        storeLocalFile(fileId, file).then(() => {
          // For images & modest files, convert to data URL so it persists smoothly in local JSON
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }).catch(reject);
      });
    }
  }
};
