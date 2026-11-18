import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, LocalDB } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured());
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

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
  const fetchProducts = async () => {
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
  };

  useEffect(() => {
    fetchProducts();
  }, [isDemoMode]);

  // Auth Actions
  const login = async (email, password) => {
    if (!isDemoMode && isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      const fullUser = { ...data.user, ...profile };
      setUser(fullUser);
      return fullUser;
    } else {
      const localUser = LocalDB.signIn(email, password);
      setUser(localUser);
      return localUser;
    }
  };

  const register = async (email, password, profileDetails) => {
    if (!isDemoMode && isSupabaseConfigured()) {
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
        // Upsert profile
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
    } else {
      const localUser = LocalDB.signUp(email, password, profileDetails);
      setUser(localUser);
      return localUser;
    }
  };

  const logout = async () => {
    if (!isDemoMode && isSupabaseConfigured()) {
      await supabase.auth.signOut();
    } else {
      LocalDB.signOut();
    }
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('Not authenticated');
    if (!isDemoMode && isSupabaseConfigured()) {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
      setUser(prev => ({ ...prev, ...updates }));
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
        available: productData.available !== undefined ? productData.available : true
      }).select().single();
      if (error) throw error;
      await fetchProducts();
      return data;
    } else {
      const newProd = await LocalDB.addProduct(productData, user);
      await fetchProducts();
      return newProd;
    }
  };

  const updateProduct = async (id, updates) => {
    if (!user) throw new Error('Must be logged in to update a product');
    if (!isDemoMode && isSupabaseConfigured()) {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).eq('seller_id', user.id).select().single();
      if (error) throw error;
      await fetchProducts();
      return data;
    } else {
      const updatedProd = await LocalDB.updateProduct(id, updates, user.id);
      await fetchProducts();
      return updatedProd;
    }
  };

  const deleteProduct = async (id) => {
    if (!user) throw new Error('Must be logged in to delete a product');
    if (!isDemoMode && isSupabaseConfigured()) {
      const { error } = await supabase.from('products').delete().eq('id', id).eq('seller_id', user.id);
      if (error) throw error;
      await fetchProducts();
      return true;
    } else {
      const res = await LocalDB.deleteProduct(id, user.id);
      await fetchProducts();
      return res;
    }
  };

  const getProduct = (id) => {
    return products.find(p => p.id === id) || null;
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
        refreshProducts: fetchProducts
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
