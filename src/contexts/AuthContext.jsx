import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, LocalDB } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured());
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Custom Orders, Reviews, and Collections state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [collections, setCollections] = useState([]);
  const [wishlistProductIds, setWishlistProductIds] = useState([]);
  const [impactStats, setImpactStats] = useState(null);

  // Initialize Auth state
  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            setUser({ ...session.user, ...profile });
          } else {
            setUser(null);
          }

          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              setUser({ ...session.user, ...profile });
            } else {
              setUser(null);
            }
          });

          setIsDemoMode(false);
          setLoading(false);
          return () => subscription?.unsubscribe();
        } catch (err) {
          console.warn('Supabase auth init failed, falling back to Local Demo mode:', err);
          setIsDemoMode(true);
          const localUser = LocalDB.getCurrentUser();
          setUser(localUser);
          setLoading(false);
        }
      } else {
        // Local Demo Mode
        setIsDemoMode(true);
        const localUser = LocalDB.getCurrentUser();
        setUser(localUser);
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            seller:profiles(id, name, state, craft_specialization, bio, public_phone, whatsapp_number, show_phone, show_whatsapp, profile_image_url)
          `)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.warn('Error fetching from Supabase, reading local products:', err);
        setProducts(LocalDB.getProducts());
      }
    } else {
      setProducts(LocalDB.getProducts());
    }
    setProductsLoading(false);
  }, [isDemoMode]);

  // Fetch all custom orders
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('custom_orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.warn('Error fetching custom orders from Supabase, reading local orders:', err);
        setOrders(LocalDB.getCustomOrders());
      }
    } else {
      setOrders(LocalDB.getCustomOrders());
    }
    setOrdersLoading(false);
  }, [isDemoMode]);

  // Fetch all reviews
  const fetchReviews = useCallback(async () => {
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
        console.warn('Error fetching reviews from Supabase, reading local reviews:', err);
        setReviews(LocalDB.getReviews());
      }
    } else {
      setReviews(LocalDB.getReviews());
    }
  }, [isDemoMode]);

  // Fetch collections for current user
  const fetchCollections = useCallback(async () => {
    if (!user) {
      setCollections([]);
      setWishlistProductIds([]);
      return;
    }
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('collections')
          .select(`
            *,
            items:collection_items(product_id)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        if (error) throw error;
        const normalized = (data || []).map(c => ({
          ...c,
          product_ids: (c.items || []).map(i => i.product_id)
        }));
        setCollections(normalized);
        const def = normalized.find(c => c.is_default);
        setWishlistProductIds(def ? def.product_ids : []);
      } catch (err) {
        console.warn('Error fetching collections from Supabase, reading local collections:', err);
        const localCols = LocalDB.getCollections(user.id);
        setCollections(localCols);
        setWishlistProductIds(LocalDB.getWishlistProductIds(user.id));
      }
    } else {
      const localCols = LocalDB.getCollections(user.id);
      setCollections(localCols);
      setWishlistProductIds(LocalDB.getWishlistProductIds(user.id));
    }
  }, [user, isDemoMode]);

  // Recalculate impact metrics
  const refreshImpactStats = useCallback(() => {
    const stats = LocalDB.calculateImpact();
    setImpactStats(stats);
    return stats;
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchReviews();
  }, [fetchProducts, fetchOrders, fetchReviews]);

  useEffect(() => {
    fetchCollections();
  }, [user, fetchCollections]);

  useEffect(() => {
    refreshImpactStats();
  }, [products, orders, refreshImpactStats]);

  // Auth Actions
  const login = async (email, password) => {
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        const fullUser = { ...data.user, ...profile };
        setUser(fullUser);
        return fullUser;
      } catch (err) {
        console.warn('Supabase login failed, trying local fallback:', err);
        const localUser = LocalDB.signIn(email, password);
        setUser(localUser);
        return localUser;
      }
    } else {
      const localUser = LocalDB.signIn(email, password);
      setUser(localUser);
      return localUser;
    }
  };

  const register = async (email, password, profileDetails) => {
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: profileDetails.name,
              role: profileDetails.role || 'seller'
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            name: profileDetails.name,
            role: profileDetails.role || 'seller',
            state: profileDetails.state || '',
            craft_specialization: profileDetails.craft_specialization || '',
            bio: profileDetails.bio || '',
            public_phone: profileDetails.public_phone || '',
            whatsapp_number: profileDetails.whatsapp_number || '',
            show_phone: profileDetails.show_phone !== undefined ? profileDetails.show_phone : true,
            show_whatsapp: profileDetails.show_whatsapp !== undefined ? profileDetails.show_whatsapp : true,
            profile_image_url: profileDetails.profile_image_url || ''
          });
          if (profileError) console.error('Error creating profile:', profileError);
          const fullUser = { ...data.user, ...profileDetails, id: data.user.id };
          setUser(fullUser);
          return fullUser;
        }
      } catch (err) {
        console.warn('Supabase register failed, trying local:', err);
        const localUser = LocalDB.signUp(email, password, profileDetails);
        setUser(localUser);
        return localUser;
      }
    } else {
      const localUser = LocalDB.signUp(email, password, profileDetails);
      setUser(localUser);
      return localUser;
    }
  };

  const logout = async () => {
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn(e);
      }
    }
    LocalDB.signOut();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('Not authenticated');
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
        if (error) throw error;
        setUser(prev => ({ ...prev, ...updates }));
      } catch (err) {
        console.warn('Supabase updateProfile error, fallback to local:', err);
        const updated = LocalDB.updateProfile(user.id, updates);
        setUser(updated);
      }
    } else {
      const updated = LocalDB.updateProfile(user.id, updates);
      setUser(updated);
    }
    await fetchProducts();
  };

  // Product Operations
  const addProduct = async (productData) => {
    if (!user) throw new Error('Must be logged in to add a product');
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').insert({
          seller_id: user.id,
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
          available: productData.available !== undefined ? productData.available : true,
          craftsmanship_hours: Number(productData.craftsmanship_hours) || 35
        }).select().single();
        if (error) throw error;
        await fetchProducts();
        return data;
      } catch (err) {
        console.warn('Supabase addProduct error, falling back to local:', err);
        const newProd = await LocalDB.addProduct(productData, user);
        await fetchProducts();
        return newProd;
      }
    } else {
      const newProd = await LocalDB.addProduct(productData, user);
      await fetchProducts();
      return newProd;
    }
  };

  const updateProduct = async (id, updates) => {
    if (!user) throw new Error('Must be logged in to update a product');
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').update(updates).eq('id', id).eq('seller_id', user.id).select().single();
        if (error) throw error;
        await fetchProducts();
        return data;
      } catch (err) {
        console.warn('Supabase updateProduct error, falling back to local:', err);
        const updatedProd = await LocalDB.updateProduct(id, updates, user.id);
        await fetchProducts();
        return updatedProd;
      }
    } else {
      const updatedProd = await LocalDB.updateProduct(id, updates, user.id);
      await fetchProducts();
      return updatedProd;
    }
  };

  const deleteProduct = async (id) => {
    if (!user) throw new Error('Must be logged in to delete a product');
    if (!isDemoMode && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id).eq('seller_id', user.id);
        if (error) throw error;
        await fetchProducts();
        return true;
      } catch (err) {
        console.warn('Supabase deleteProduct error, falling back to local:', err);
        const res = await LocalDB.deleteProduct(id, user.id);
        await fetchProducts();
        return res;
      }
    } else {
      const res = await LocalDB.deleteProduct(id, user.id);
      await fetchProducts();
      return res;
    }
  };

  const getProduct = (id) => {
    return products.find(p => p.id === id) || null;
  };

  // --- CUSTOM ORDERS OPERATIONS ---
  const createCustomOrder = async (orderData) => {
    if (!user) throw new Error('Please log in to submit a custom order request.');
    const newOrder = await LocalDB.createCustomOrder(orderData, user);
    await fetchOrders();
    refreshImpactStats();
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus, note) => {
    if (!user) throw new Error('Authentication required');
    const updated = await LocalDB.updateOrderStatus(orderId, newStatus, note, user);
    await fetchOrders();
    refreshImpactStats();
    return updated;
  };

  const proposeOrderTerms = async (orderId, proposal) => {
    if (!user) throw new Error('Authentication required');
    const updated = await LocalDB.proposeOrderTerms(orderId, proposal, user);
    await fetchOrders();
    return updated;
  };

  const respondToOrderProposal = async (orderId, action) => {
    if (!user) throw new Error('Authentication required');
    const updated = await LocalDB.respondToOrderProposal(orderId, action, user);
    await fetchOrders();
    refreshImpactStats();
    return updated;
  };

  const addOrderTimelineUpdate = async (orderId, updateData) => {
    if (!user) throw new Error('Authentication required');
    const res = await LocalDB.addOrderTimelineUpdate(orderId, updateData, user);
    await fetchOrders();
    return res;
  };

  const getBuyerOrders = (buyerId = user?.id) => {
    if (!buyerId) return [];
    return orders.filter(o => o.buyer_id === buyerId);
  };

  const getArtisanOrders = (artisanId = user?.id) => {
    if (!artisanId) return [];
    return orders.filter(o => o.artisan_id === artisanId);
  };

  // --- REVIEWS & RATINGS OPERATIONS ---
  const addReview = async (reviewData) => {
    if (!user) throw new Error('Must be logged in to leave a review.');
    const newReview = await LocalDB.addReview(reviewData, user);
    await fetchReviews();
    return newReview;
  };

  const getArtisanReviews = (artisanId) => {
    return reviews.filter(r => r.artisan_id === artisanId);
  };

  const getProductReviews = (productId) => {
    return reviews.filter(r => r.product_id === productId);
  };

  const getOrderReview = (orderId) => {
    return reviews.find(r => r.order_id === orderId) || null;
  };

  const getArtisanRating = (artisanId) => {
    return LocalDB.getArtisanRatingStats(artisanId);
  };

  // --- COLLECTIONS & WISHLIST OPERATIONS ---
  const createCollection = async ({ name, description, isPublic }) => {
    if (!user) throw new Error('Must be logged in to create a collection.');
    const newCol = await LocalDB.createCollection(user.id, { name, description, isPublic });
    await fetchCollections();
    return newCol;
  };

  const updateCollection = async (collectionId, updates) => {
    if (!user) throw new Error('Must be logged in to update collection.');
    const updated = await LocalDB.updateCollection(collectionId, updates, user.id);
    await fetchCollections();
    return updated;
  };

  const deleteCollection = async (collectionId) => {
    if (!user) throw new Error('Must be logged in to delete collection.');
    const res = await LocalDB.deleteCollection(collectionId, user.id);
    await fetchCollections();
    return res;
  };

  const toggleProductInCollection = async (collectionId, productId) => {
    if (!user) throw new Error('Must be logged in to save crafts.');
    const res = await LocalDB.toggleProductInCollection(collectionId, productId, user.id);
    await fetchCollections();
    return res;
  };

  const toggleWishlist = async (productId) => {
    if (!user) throw new Error('Must be logged in to save crafts.');
    const res = await LocalDB.toggleWishlistProduct(user.id, productId);
    await fetchCollections();
    return res;
  };

  const isProductInWishlist = (productId) => {
    return wishlistProductIds.includes(productId);
  };

  const getPublicCollection = (shareId) => {
    return LocalDB.getCollectionByShareId(shareId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        products,
        productsLoading,
        login,
        register,
        logout,
        updateProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        refreshProducts: fetchProducts,

        // Custom Orders
        orders,
        ordersLoading,
        createCustomOrder,
        updateOrderStatus,
        proposeOrderTerms,
        respondToOrderProposal,
        addOrderTimelineUpdate,
        getBuyerOrders,
        getArtisanOrders,
        fetchOrders,

        // Reviews
        reviews,
        addReview,
        getArtisanReviews,
        getProductReviews,
        getOrderReview,
        getArtisanRating,
        fetchReviews,

        // Collections & Wishlist
        collections,
        wishlistProductIds,
        createCollection,
        updateCollection,
        deleteCollection,
        toggleProductInCollection,
        toggleWishlist,
        isProductInWishlist,
        getPublicCollection,
        fetchCollections,

        // Impact
        impactStats,
        refreshImpactStats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
