import { createClient } from '@supabase/supabase-js';
import { storeLocalFile, getLocalFile, deleteLocalFile } from './indexedDb';
import { INITIAL_DEMO_PRODUCTS, STATES_DATA } from '../data/crafts';

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
// ORDER STATUS WORKFLOW DEFINITION
// ==========================================
export const ORDER_STATUS_STEPS = [
  { key: 'request_received', label: 'Request Received', description: 'Bespoke customization request submitted by buyer' },
  { key: 'accepted', label: 'Accepted', description: 'Artisan agreed to craft request with finalized terms' },
  { key: 'design_finalized', label: 'Design Finalized', description: 'Motif sketch, pattern, or palette approved' },
  { key: 'in_progress', label: 'Work in Progress', description: 'Artisan actively handcrafting the masterpiece' },
  { key: 'quality_check', label: 'Quality Check', description: 'Traditional quality & finish verification' },
  { key: 'ready_for_dispatch', label: 'Ready for Dispatch', description: 'Secured in protective cultural packaging' },
  { key: 'completed', label: 'Completed', description: 'Delivered and accepted by patron' }
];

// ==========================================
// LOCAL DEMO MODE STORAGE & AUTH EMULATION
// ==========================================
const LOCAL_USERS_KEY = 'kalasetu_local_users';
const LOCAL_SESSION_KEY = 'kalasetu_local_session';
const LOCAL_PRODUCTS_KEY = 'kalasetu_local_products';
const LOCAL_ORDERS_KEY = 'kalasetu_local_orders';
const LOCAL_REVIEWS_KEY = 'kalasetu_local_reviews';
const LOCAL_COLLECTIONS_KEY = 'kalasetu_local_collections';

// Initial Seed Data for Evaluation & Demo Mode
const SEED_USERS = [
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
    bio: 'Demonstration seller account for evaluation. Ready to add new products, accept custom requests and share progress stories!',
    public_phone: '+919876500000',
    whatsapp_number: '919876500000',
    show_phone: true,
    show_whatsapp: true,
    profile_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'buyer-priya-sharma',
    email: 'priya.buyer@kalasetu.demo',
    password: 'password123',
    name: 'Priya Sharma',
    role: 'buyer',
    state: 'Maharashtra',
    craft_specialization: 'Art Collector & Patron',
    bio: 'Avid collector of authentic traditional Indian textiles, folk paintings, and regional handicrafts.',
    public_phone: '+919820011223',
    whatsapp_number: '919820011223',
    show_phone: true,
    show_whatsapp: true,
    profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  }
];

const SEED_ORDERS = [
  {
    id: 'order-101',
    buyer_id: 'buyer-priya-sharma',
    buyer_name: 'Priya Sharma',
    buyer_email: 'priya.buyer@kalasetu.demo',
    artisan_id: 'artisan-sita-devi',
    artisan_name: 'Sita Devi Mahasundari',
    product_id: 'prod-101',
    product_name: 'Tree of Life with Sun & Moon — Madhubani Canvas',
    title: 'Bespoke Madhubani Kohbar Painting for Living Room',
    description: 'A 36x24 inch canvas with Radha-Krishna surrounded by Kohbar auspicious symbols (fish, lotus, peacock) in traditional natural dyes.',
    size: '36 x 24 inches',
    colors: 'Indigo, turmeric ochre, vermilion red, soot black',
    quantity: 1,
    budget: 7500,
    agreed_price: 7500,
    deadline: '2026-10-15',
    reference_image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    status: 'completed',
    craftsmanship_hours: 56,
    craft_tradition: 'Madhubani Painting',
    created_at: '2026-09-01T10:00:00.000Z',
    updated_at: '2026-10-14T16:00:00.000Z',
    status_history: [
      { status: 'request_received', timestamp: '2026-09-01T10:00:00.000Z', note: 'Custom order request received from buyer.' },
      { status: 'accepted', timestamp: '2026-09-02T11:30:00.000Z', note: 'Order accepted by Sita Devi with agreed price ₹7,500.' },
      { status: 'design_finalized', timestamp: '2026-09-07T14:20:00.000Z', note: 'Charcoal layout sketch approved by patron.' },
      { status: 'in_progress', timestamp: '2026-09-12T09:15:00.000Z', note: 'Natural mineral and plant pigments prepared; linework underway.' },
      { status: 'quality_check', timestamp: '2026-10-08T17:45:00.000Z', note: 'Double-line hatching verified and natural gum protective coat applied.' },
      { status: 'ready_for_dispatch', timestamp: '2026-10-11T12:00:00.000Z', note: 'Carefully rolled in water-resistant butter paper & rigid protective cylinder.' },
      { status: 'completed', timestamp: '2026-10-14T16:00:00.000Z', note: 'Delivered and safely accepted by buyer. Thank you!' }
    ],
    timeline_updates: [
      {
        id: 'upd-1',
        sender_id: 'artisan-sita-devi',
        sender_name: 'Sita Devi',
        sender_role: 'artisan',
        message: 'Namaste Priya ji! Here is the initial charcoal motif pencil sketch on handmade silk paper before we apply vegetable dyes.',
        photo_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-07T14:20:00.000Z',
        status: 'design_finalized'
      },
      {
        id: 'upd-2',
        sender_id: 'artisan-sita-devi',
        sender_name: 'Sita Devi',
        sender_role: 'artisan',
        message: 'Filling the Kachni fine crosshatching with bamboo nibs. The indigo dye from our courtyard plants is looking vibrant.',
        photo_url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-09-22T16:00:00.000Z',
        status: 'in_progress'
      },
      {
        id: 'upd-3',
        sender_id: 'artisan-sita-devi',
        sender_name: 'Sita Devi',
        sender_role: 'artisan',
        message: 'Completed artwork passes our cooperative quality review! Packaged in moisture-proof packaging ready for dispatch.',
        photo_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-10-11T12:00:00.000Z',
        status: 'ready_for_dispatch'
      }
    ]
  },
  {
    id: 'order-102',
    buyer_id: 'buyer-priya-sharma',
    buyer_name: 'Priya Sharma',
    buyer_email: 'priya.buyer@kalasetu.demo',
    artisan_id: 'artisan-rabindra-barik',
    artisan_name: 'Rabindra Barik',
    product_id: 'prod-102',
    product_name: 'Dasavatara & Krishna Lila Pattachitra Scroll',
    title: 'Custom Gita Govinda Palm Leaf Inscription',
    description: 'Intricate palm leaf etching depicting verses of Gita Govinda with natural conch shell pigments.',
    size: '18 x 12 inches',
    colors: 'Natural conch white, lamp soot, red hingula',
    quantity: 1,
    budget: 11000,
    agreed_price: 11000,
    deadline: '2026-10-28',
    status: 'completed',
    craftsmanship_hours: 84,
    craft_tradition: 'Pattachitra & Palm Leaf',
    created_at: '2026-09-10T11:00:00.000Z',
    updated_at: '2026-10-25T14:30:00.000Z',
    status_history: [
      { status: 'request_received', timestamp: '2026-09-10T11:00:00.000Z', note: 'Request received' },
      { status: 'accepted', timestamp: '2026-09-11T15:00:00.000Z', note: 'Accepted by Rabindra Barik' },
      { status: 'design_finalized', timestamp: '2026-09-16T12:00:00.000Z', note: 'Palm leaf treated and sized' },
      { status: 'in_progress', timestamp: '2026-09-25T10:00:00.000Z', note: 'Iron stylus etching in progress' },
      { status: 'quality_check', timestamp: '2026-10-18T16:00:00.000Z', note: 'Lampblack rubbing inspected' },
      { status: 'ready_for_dispatch', timestamp: '2026-10-22T11:00:00.000Z', note: 'Mounted in silk casing' },
      { status: 'completed', timestamp: '2026-10-25T14:30:00.000Z', note: 'Delivered successfully' }
    ],
    timeline_updates: [
      {
        id: 'upd-201',
        sender_id: 'artisan-rabindra-barik',
        sender_name: 'Rabindra Barik',
        sender_role: 'artisan',
        message: 'Etching the fine hair of Krishna using the traditional iron stylus (Lekhani) on dried seasoned palm leaves.',
        photo_url: 'https://cdn.shopify.com/s/files/1/0582/4007/3878/files/pattachitra-1.jpg?v=1635751688',
        timestamp: '2026-09-25T10:00:00.000Z',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'order-103',
    buyer_id: 'buyer-priya-sharma',
    buyer_name: 'Priya Sharma',
    buyer_email: 'priya.buyer@kalasetu.demo',
    artisan_id: 'artisan-sita-devi',
    artisan_name: 'Sita Devi Mahasundari',
    product_id: 'prod-101',
    product_name: 'Tree of Life with Sun & Moon — Madhubani Canvas',
    title: 'Kohbar Wedding Blessing Panel for Sister',
    description: 'A vibrant Kohbar ceremonial painting with sacred bamboo, lotus pond, and pair of parrots.',
    size: '24 x 18 inches',
    colors: 'Vermilion, turmeric yellow, leaf green',
    quantity: 1,
    budget: 6000,
    agreed_price: 6000,
    deadline: '2026-12-10',
    status: 'in_progress',
    craftsmanship_hours: 42,
    craft_tradition: 'Madhubani Painting',
    created_at: '2026-11-01T08:30:00.000Z',
    updated_at: '2026-11-15T15:00:00.000Z',
    status_history: [
      { status: 'request_received', timestamp: '2026-11-01T08:30:00.000Z', note: 'Request received from Priya Sharma' },
      { status: 'accepted', timestamp: '2026-11-02T10:15:00.000Z', note: 'Accepted by Sita Devi' },
      { status: 'design_finalized', timestamp: '2026-11-06T14:00:00.000Z', note: 'Motifs approved' },
      { status: 'in_progress', timestamp: '2026-11-15T15:00:00.000Z', note: 'Painting central lotus pond' }
    ],
    timeline_updates: [
      {
        id: 'upd-301',
        sender_id: 'artisan-sita-devi',
        sender_name: 'Sita Devi',
        sender_role: 'artisan',
        message: 'The border is completed! Today we ground fresh turmeric roots for the radiant gold hue in the central Kohbar.',
        photo_url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=80',
        timestamp: '2026-11-15T15:00:00.000Z',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'order-104',
    buyer_id: 'buyer-priya-sharma',
    buyer_name: 'Priya Sharma',
    buyer_email: 'priya.buyer@kalasetu.demo',
    artisan_id: 'artisan-demo',
    artisan_name: 'Arjun Das (Demo Artisan)',
    product_id: 'prod-103',
    product_name: 'Royal Cobalt Blue Floral Urn with Lid',
    title: 'Set of 4 Hand-glazed Blue Pottery Planters',
    description: 'Geometric floral planters with drainage holes for terrace garden.',
    size: '8 inches height each',
    colors: 'Cobalt blue and turquoise on off-white',
    quantity: 4,
    budget: 5200,
    agreed_price: null,
    deadline: '2026-12-25',
    status: 'request_received',
    craftsmanship_hours: 28,
    craft_tradition: 'Jaipur Blue Pottery',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    status_history: [
      { status: 'request_received', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), note: 'Bespoke request submitted by Priya Sharma.' }
    ],
    timeline_updates: []
  }
];

const SEED_REVIEWS = [
  {
    id: 'rev-101',
    order_id: 'order-101',
    buyer_id: 'buyer-priya-sharma',
    buyer_name: 'Priya Sharma',
    artisan_id: 'artisan-sita-devi',
    product_id: 'prod-101',
    rating: 5,
    review_text: 'An absolute masterpiece! Sita Devi ji kept me updated with regular photos throughout the entire process. The natural dyes have a warmth and depth that no synthetic print could ever match. Everyone who enters our home asks about it!',
    photo_urls: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
    ],
    created_at: '2026-10-16T11:20:00.000Z'
  },
  {
    id: 'rev-102',
    order_id: 'order-102',
    buyer_id: 'buyer-priya-sharma',
    buyer_name: 'Priya Sharma',
    artisan_id: 'artisan-rabindra-barik',
    product_id: 'prod-102',
    rating: 5,
    review_text: 'The level of micro-detail on the palm leaf inscription is astonishing. Rabindra Barik is a true national treasure. Thank you KalaSetu for connecting us directly!',
    photo_urls: [
      'https://cdn.shopify.com/s/files/1/0582/4007/3878/files/pattachitra-1.jpg?v=1635751688'
    ],
    created_at: '2026-10-27T09:40:00.000Z'
  }
];

const SEED_COLLECTIONS = [
  {
    id: 'col-wishlist-priya',
    user_id: 'buyer-priya-sharma',
    name: 'My Wishlist',
    description: 'Curated handmade crafts I love and wish to support.',
    is_public: false,
    is_default: true,
    share_id: 'wishlist-priya',
    product_ids: ['prod-101', 'prod-104'],
    created_at: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'col-wedding-gifts',
    user_id: 'buyer-priya-sharma',
    name: 'Wedding Gifts',
    description: 'Heirloom handmade crafts handpicked for my sister’s upcoming wedding celebration.',
    is_public: true,
    share_id: 'wedding-gifts-2026',
    is_default: false,
    product_ids: ['prod-101', 'prod-105', 'prod-102'],
    created_at: '2026-09-15T00:00:00.000Z'
  },
  {
    id: 'col-diwali-decor',
    user_id: 'buyer-priya-sharma',
    name: 'Diwali Decorations',
    description: 'Traditional earthen and quartz creations to illuminate our festive home.',
    is_public: true,
    share_id: 'diwali-decor-2026',
    is_default: false,
    product_ids: ['prod-103'],
    created_at: '2026-10-01T00:00:00.000Z'
  }
];

// Initialize local store with demo seed data if empty
export function initLocalData() {
  if (!localStorage.getItem(LOCAL_PRODUCTS_KEY)) {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_DEMO_PRODUCTS));
  } else {
    // Ensure all stored products have craftsmanship_hours
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]');
      let updated = false;
      const patched = stored.map(p => {
        if (!p.craftsmanship_hours) {
          const match = INITIAL_DEMO_PRODUCTS.find(i => i.id === p.id);
          p.craftsmanship_hours = match?.craftsmanship_hours || 35;
          updated = true;
        }
        return p;
      });
      if (updated) localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(patched));
    } catch (e) {
      console.warn('Error patching products:', e);
    }
  }

  // Users setup
  if (!localStorage.getItem(LOCAL_USERS_KEY)) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(SEED_USERS));
  } else {
    // Ensure buyer-priya-sharma exists in existing local users
    try {
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
      if (!users.some(u => u.email === 'priya.buyer@kalasetu.demo')) {
        users.push(SEED_USERS[2]);
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.warn('Error patching users:', e);
    }
  }

  // Orders setup
  if (!localStorage.getItem(LOCAL_ORDERS_KEY)) {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(SEED_ORDERS));
  }

  // Reviews setup
  if (!localStorage.getItem(LOCAL_REVIEWS_KEY)) {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
  }

  // Collections setup
  if (!localStorage.getItem(LOCAL_COLLECTIONS_KEY)) {
    localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(SEED_COLLECTIONS));
  }
}

// Ensure initialized immediately
initLocalData();

// Local Storage Product, Artisan, Orders, Reviews, Collections & Impact Operations
export const LocalDB = {
  // --- AUTH ---
  getCurrentUser() {
    const session = localStorage.getItem(LOCAL_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  getAllUsers() {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  },

  signUp(email, password, { name, role = 'seller', state = '', craft_specialization = '', bio = '', public_phone = '', whatsapp_number = '', show_phone = true, show_whatsapp = true, profile_image_url = '' }) {
    const users = this.getAllUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: (role === 'buyer' ? 'buyer-' : 'artisan-') + Date.now(),
      email,
      password,
      name,
      role,
      state,
      craft_specialization: craft_specialization || (role === 'buyer' ? 'Art Patron' : 'Heritage Crafts'),
      bio,
      public_phone,
      whatsapp_number,
      show_phone,
      show_whatsapp,
      profile_image_url: profile_image_url || (role === 'buyer' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'),
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newUser));

    // Ensure buyer has a default wishlist collection initialized
    if (newUser.role === 'buyer') {
      this.getCollections(newUser.id);
    }

    return newUser;
  },

  signIn(email, password) {
    const users = this.getAllUsers();
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
    const users = this.getAllUsers();
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
    const users = this.getAllUsers();
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
      craftsmanship_hours: Number(productData.craftsmanship_hours) || 35,
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
      quantity: updates.quantity !== undefined ? Number(updates.quantity) : products[idx].quantity,
      craftsmanship_hours: updates.craftsmanship_hours !== undefined ? Number(updates.craftsmanship_hours) : (products[idx].craftsmanship_hours || 35)
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

  // --- CUSTOM ORDERS & ORDER TRACKING ---
  getCustomOrders() {
    return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  },

  getCustomOrdersForBuyer(buyerId) {
    const orders = this.getCustomOrders();
    return orders.filter(o => o.buyer_id === buyerId);
  },

  getCustomOrdersForArtisan(artisanId) {
    const orders = this.getCustomOrders();
    return orders.filter(o => o.artisan_id === artisanId);
  },

  getOrderById(orderId) {
    const orders = this.getCustomOrders();
    return orders.find(o => o.id === orderId) || null;
  },

  async createCustomOrder(orderData, buyerUser) {
    const orders = this.getCustomOrders();
    const newOrder = {
      id: 'order-' + Date.now(),
      buyer_id: buyerUser.id,
      buyer_name: buyerUser.name,
      buyer_email: buyerUser.email,
      artisan_id: orderData.artisan_id,
      artisan_name: orderData.artisan_name,
      product_id: orderData.product_id || null,
      product_name: orderData.product_name || null,
      title: orderData.title,
      description: orderData.description,
      size: orderData.size || '',
      colors: orderData.colors || '',
      quantity: Number(orderData.quantity) || 1,
      budget: Number(orderData.budget),
      agreed_price: null,
      deadline: orderData.deadline,
      reference_image_url: orderData.reference_image_url || '',
      status: 'request_received',
      artisan_proposal: null,
      craftsmanship_hours: Number(orderData.craftsmanship_hours) || 30,
      craft_tradition: orderData.craft_tradition || 'Traditional Craft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status_history: [
        {
          status: 'request_received',
          timestamp: new Date().toISOString(),
          note: 'Custom order request received from buyer.'
        }
      ],
      timeline_updates: []
    };

    orders.unshift(newOrder);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
  },

  async updateOrderStatus(orderId, newStatus, note, user) {
    const orders = this.getCustomOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    const prevStatus = order.status;
    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    // If accepted and agreed_price is null, set agreed_price to budget or proposal
    if (newStatus === 'accepted' && !order.agreed_price) {
      order.agreed_price = order.artisan_proposal?.proposedPrice || order.budget;
    }

    const statusNote = note || `Status advanced from ${prevStatus} to ${newStatus}`;
    order.status_history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: statusNote,
      updated_by: user?.name || 'System'
    });

    orders[idx] = order;
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return order;
  },

  async proposeOrderTerms(orderId, { proposedPrice, proposedDeadline, note }, artisanUser) {
    const orders = this.getCustomOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    order.artisan_proposal = {
      proposedPrice: Number(proposedPrice),
      proposedDeadline,
      note: note || '',
      proposedAt: new Date().toISOString()
    };
    order.updated_at = new Date().toISOString();

    const noteText = `Artisan proposed adjusted terms: ₹${Number(proposedPrice).toLocaleString('en-IN')}${proposedDeadline ? `, Deadline: ${proposedDeadline}` : ''}. Note: "${note || 'None'}"`;
    order.status_history.push({
      status: order.status,
      timestamp: new Date().toISOString(),
      note: noteText,
      updated_by: artisanUser.name
    });

    order.timeline_updates.push({
      id: 'upd-' + Date.now(),
      sender_id: artisanUser.id,
      sender_name: artisanUser.name,
      sender_role: 'artisan',
      message: noteText,
      photo_url: '',
      timestamp: new Date().toISOString(),
      status: order.status
    });

    orders[idx] = order;
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return order;
  },

  async respondToOrderProposal(orderId, action, buyerUser) {
    const orders = this.getCustomOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    if (action === 'accept') {
      order.agreed_price = order.artisan_proposal.proposedPrice;
      if (order.artisan_proposal.proposedDeadline) {
        order.deadline = order.artisan_proposal.proposedDeadline;
      }
      order.status = 'accepted';
      order.status_history.push({
        status: 'accepted',
        timestamp: new Date().toISOString(),
        note: `Buyer accepted revised proposal of ₹${order.agreed_price.toLocaleString('en-IN')}. Order is now officially Accepted.`,
        updated_by: buyerUser.name
      });
      order.artisan_proposal = null;
    } else {
      order.status = 'rejected';
      order.status_history.push({
        status: 'rejected',
        timestamp: new Date().toISOString(),
        note: 'Buyer declined the artisan counter-proposal.',
        updated_by: buyerUser.name
      });
    }

    order.updated_at = new Date().toISOString();
    orders[idx] = order;
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return order;
  },

  async addOrderTimelineUpdate(orderId, { message, photo_url }, senderUser) {
    const orders = this.getCustomOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const order = orders[idx];
    const updateRecord = {
      id: 'upd-' + Date.now(),
      sender_id: senderUser.id,
      sender_name: senderUser.name,
      sender_role: senderUser.role || 'artisan',
      message: message || '',
      photo_url: photo_url || '',
      timestamp: new Date().toISOString(),
      status: order.status
    };

    order.timeline_updates.push(updateRecord);
    order.updated_at = new Date().toISOString();

    orders[idx] = order;
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return updateRecord;
  },

  // --- REVIEWS & RATINGS ---
  getReviews() {
    return JSON.parse(localStorage.getItem(LOCAL_REVIEWS_KEY) || '[]');
  },

  getReviewsForArtisan(artisanId) {
    const reviews = this.getReviews();
    return reviews.filter(r => r.artisan_id === artisanId);
  },

  getReviewsForProduct(productId) {
    const reviews = this.getReviews();
    return reviews.filter(r => r.product_id === productId);
  },

  getOrderReview(orderId) {
    const reviews = this.getReviews();
    return reviews.find(r => r.order_id === orderId) || null;
  },

  getArtisanRatingStats(artisanId) {
    const reviews = this.getReviewsForArtisan(artisanId);
    if (reviews.length === 0) {
      return {
        averageRating: 5.0, // Default baseline for certified master artisans
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
    const avg = Number((sum / reviews.length).toFixed(1));
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const score = Math.round(Number(r.rating));
      if (distribution[score] !== undefined) distribution[score]++;
    });

    return {
      averageRating: avg,
      totalReviews: reviews.length,
      distribution
    };
  },

  async addReview(reviewData, buyerUser) {
    // 1. Validation: Must be authenticated buyer
    if (!buyerUser || buyerUser.role !== 'buyer') {
      throw new Error('Only verified buyers can submit reviews.');
    }

    // 2. Validation: Must have a completed order
    const order = this.getOrderById(reviewData.order_id);
    if (!order) {
      throw new Error('Associated order not found.');
    }
    if (order.buyer_id !== buyerUser.id) {
      throw new Error('You can only review orders you have placed.');
    }
    if (order.status !== 'completed') {
      throw new Error('Reviews can only be submitted after the order has been completed.');
    }

    // 3. Validation: Prevent duplicate reviews
    const existing = this.getOrderReview(reviewData.order_id);
    if (existing) {
      throw new Error('A review has already been submitted for this order.');
    }

    const reviews = this.getReviews();
    const newReview = {
      id: 'rev-' + Date.now(),
      order_id: reviewData.order_id,
      buyer_id: buyerUser.id,
      buyer_name: buyerUser.name,
      artisan_id: order.artisan_id,
      product_id: order.product_id || null,
      rating: Math.min(5, Math.max(1, Number(reviewData.rating))),
      review_text: reviewData.review_text.trim(),
      photo_urls: reviewData.photo_urls || [],
      created_at: new Date().toISOString()
    };

    reviews.unshift(newReview);
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
    return newReview;
  },

  // --- WISHLIST & GIFT COLLECTIONS ---
  getCollections(userId) {
    let collections = JSON.parse(localStorage.getItem(LOCAL_COLLECTIONS_KEY) || '[]');
    if (!userId) return collections;

    // Ensure default wishlist collection exists for this user
    let userCollections = collections.filter(c => c.user_id === userId);
    if (!userCollections.some(c => c.is_default)) {
      const defaultWishlist = {
        id: `col-wishlist-${userId}`,
        user_id: userId,
        name: 'My Wishlist',
        description: 'All my saved handmade favorites.',
        is_public: false,
        is_default: true,
        share_id: `wishlist-${userId.slice(-6)}`,
        product_ids: [],
        created_at: new Date().toISOString()
      };
      collections.unshift(defaultWishlist);
      localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(collections));
      userCollections.unshift(defaultWishlist);
    }

    return userCollections;
  },

  getCollectionById(collectionId) {
    const collections = JSON.parse(localStorage.getItem(LOCAL_COLLECTIONS_KEY) || '[]');
    return collections.find(c => c.id === collectionId) || null;
  },

  getCollectionByShareId(shareId) {
    const collections = JSON.parse(localStorage.getItem(LOCAL_COLLECTIONS_KEY) || '[]');
    return collections.find(c => c.share_id === shareId && c.is_public) || null;
  },

  async createCollection(userId, { name, description = '', isPublic = false }) {
    const collections = JSON.parse(localStorage.getItem(LOCAL_COLLECTIONS_KEY) || '[]');
    const shareSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
    const newCol = {
      id: 'col-' + Date.now(),
      user_id: userId,
      name: name.trim(),
      description: description.trim(),
      is_public: Boolean(isPublic),
      is_default: false,
      share_id: shareSlug,
      product_ids: [],
      created_at: new Date().toISOString()
    };

    collections.push(newCol);
    localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(collections));
    return newCol;
  },

  async updateCollection(collectionId, updates, userId) {
    const collections = JSON.parse(localStorage.getItem(LOCAL_COLLECTIONS_KEY) || '[]');
    const idx = collections.findIndex(c => c.id === collectionId);
    if (idx === -1) throw new Error('Collection not found');
    if (collections[idx].user_id !== userId) throw new Error('Unauthorized');

    const updated = {
      ...collections[idx],
      name: updates.name !== undefined ? updates.name.trim() : collections[idx].name,
      description: updates.description !== undefined ? updates.description.trim() : collections[idx].description,
      is_public: updates.is_public !== undefined ? Boolean(updates.is_public) : collections[idx].is_public
    };
    collections[idx] = updated;
    localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(collections));
    return updated;
  },

  async deleteCollection(collectionId, userId) {
    const collections = JSON.parse(localStorage.getItem(LOCAL_COLLECTIONS_KEY) || '[]');
    const target = collections.find(c => c.id === collectionId);
    if (!target) throw new Error('Collection not found');
    if (target.user_id !== userId) throw new Error('Unauthorized');
    if (target.is_default) throw new Error('The default wishlist collection cannot be deleted.');

    const remaining = collections.filter(c => c.id !== collectionId);
    localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(remaining));
    return true;
  },

  async toggleProductInCollection(collectionId, productId, userId) {
    const collections = JSON.parse(localStorage.getItem(LOCAL_COLLECTIONS_KEY) || '[]');
    const idx = collections.findIndex(c => c.id === collectionId);
    if (idx === -1) throw new Error('Collection not found');
    if (collections[idx].user_id !== userId) throw new Error('Unauthorized');

    const col = collections[idx];
    const exists = col.product_ids.includes(productId);
    if (exists) {
      col.product_ids = col.product_ids.filter(p => p !== productId);
    } else {
      col.product_ids.push(productId);
    }
    collections[idx] = col;
    localStorage.setItem(LOCAL_COLLECTIONS_KEY, JSON.stringify(collections));
    return { inCollection: !exists, collection: col };
  },

  getWishlistProductIds(userId) {
    if (!userId) return [];
    const userCollections = this.getCollections(userId);
    const defaultWishlist = userCollections.find(c => c.is_default);
    return defaultWishlist ? defaultWishlist.product_ids : [];
  },

  async toggleWishlistProduct(userId, productId) {
    const userCollections = this.getCollections(userId);
    const defaultWishlist = userCollections.find(c => c.is_default);
    if (!defaultWishlist) return false;
    const res = await this.toggleProductInCollection(defaultWishlist.id, productId, userId);
    return res.inCollection;
  },

  // --- IMPACT TRACKER: 100% DYNAMIC METRICS ---
  calculateImpact() {
    const orders = this.getCustomOrders();
    const products = this.getProducts();

    // 1. Total value of completed orders (never hardcoded)
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalCompletedOrderValue = completedOrders.reduce((sum, o) => {
      const price = Number(o.agreed_price || o.budget || 0);
      return sum + price;
    }, 0);

    // 2. Unique artisans supported
    // Distinct artisan IDs from completed orders + active catalog artisans
    const artisanIds = new Set();
    completedOrders.forEach(o => {
      if (o.artisan_id) artisanIds.add(o.artisan_id);
    });
    products.forEach(p => {
      if (p.seller_id) artisanIds.add(p.seller_id);
    });
    const uniqueArtisansSupported = artisanIds.size;

    // 3. Total craftsmanship hours preserved
    // Completed custom orders craftsmanship hours + craftsmanship hours embodied in active catalog works
    const orderCraftHours = completedOrders.reduce((sum, o) => {
      return sum + (Number(o.craftsmanship_hours) || 30);
    }, 0);
    const productCraftHours = products.reduce((sum, p) => {
      return sum + (Number(p.craftsmanship_hours) || 35);
    }, 0);
    const totalCraftsmanshipHours = orderCraftHours + productCraftHours;

    // 4. Number of craft traditions represented
    const craftTraditions = new Set();
    products.forEach(p => {
      if (p.category) craftTraditions.add(p.category.trim());
      if (p.seller?.craft_specialization) craftTraditions.add(p.seller.craft_specialization.trim());
    });
    completedOrders.forEach(o => {
      if (o.craft_tradition) craftTraditions.add(o.craft_tradition.trim());
    });
    Object.values(STATES_DATA).forEach(st => {
      if (st.primaryCraft) craftTraditions.add(st.primaryCraft.trim());
    });
    const craftTraditionsCount = craftTraditions.size;

    // Regional breakdown
    const stateBreakdown = {};
    products.forEach(p => {
      const st = p.state || 'Other';
      if (!stateBreakdown[st]) {
        stateBreakdown[st] = { productsCount: 0, ordersCount: 0, value: 0 };
      }
      stateBreakdown[st].productsCount++;
    });

    completedOrders.forEach(o => {
      // Find state of artisan
      const prod = products.find(p => p.id === o.product_id);
      const st = prod?.state || 'Other';
      if (!stateBreakdown[st]) {
        stateBreakdown[st] = { productsCount: 0, ordersCount: 0, value: 0 };
      }
      stateBreakdown[st].ordersCount++;
      stateBreakdown[st].value += Number(o.agreed_price || o.budget || 0);
    });

    return {
      totalCompletedOrderValue,
      uniqueArtisansSupported,
      totalCraftsmanshipHours,
      craftTraditionsCount,
      completedOrdersCount: completedOrders.length,
      totalOrdersCount: orders.length,
      stateBreakdown,
      craftTraditionsList: Array.from(craftTraditions),
      recentCompletedOrders: completedOrders.slice(0, 5)
    };
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
      let bucket = 'products';
      if (category === 'stories') bucket = 'stories';
      else if (category === 'orders') bucket = 'orders';
      else if (category === 'reviews') bucket = 'reviews';

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (error) {
        console.warn('Supabase storage upload error, falling back to local:', error);
      } else {
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        return publicUrlData.publicUrl;
      }
    }

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
};
