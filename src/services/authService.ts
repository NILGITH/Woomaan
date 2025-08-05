import { supabase } from "@/integrations/supabase/client";
import type { Utilisateur } from "@/types";
import { AuthError, Session, User, AuthResponse } from "@supabase/supabase-js";

// Mock users pour la démonstration (sans backend)
const mockUsers = [
  {
    id: "admin-001",
    email: "admin@casualfi.com",
    password: "admin123",
    nom: "Admin",
    prenom: "Casual F&I",
    role: "admin",
    actif: true,
    mot_de_passe: "********",
    magasin_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const authService = {
  async login(email: string, password: string): Promise<{ session: Session | null; error: AuthError | null }> {
    // Vérifier les identifiants mock
    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    if (mockUser) {
      const mockSession: Session = {
        access_token: "mock-token",
        refresh_token: "mock-refresh",
        expires_in: 3600,
        token_type: "bearer",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          created_at: mockUser.created_at,
          updated_at: mockUser.updated_at,
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated"
        }
      };
      
      // Sauvegarder immédiatement dans localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem('mockSession', JSON.stringify(mockSession));
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
      }

      return { session: mockSession, error: null };
    }

    // Si pas de correspondance mock, essayer Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { session: data.session, error };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        session: null, 
        error: { 
          message: "Email ou mot de passe incorrect", 
          status: 400 
        } as AuthError 
      };
    }
  },

  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      return await supabase.auth.signUp({
        email,
        password,
      });
    } catch (error) {
      console.error("SignUp error:", error);
      return {
        data: { user: null, session: null },
        error: { message: "Erreur lors de la création du compte", status: 400 } as AuthError
      };
    }
  },

  async logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem('mockSession');
      localStorage.removeItem('mockUser');
    }
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async getSupabaseUser(): Promise<User | null> {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  },

  async getUserProfile(userId: string): Promise<Utilisateur | null> {
    // Vérifier d'abord le localStorage pour les utilisateurs mock
    if (typeof window !== "undefined") {
      const mockUserData = localStorage.getItem('mockUser');
      if (mockUserData) {
        try {
          const mockUser = JSON.parse(mockUserData);
          if (mockUser.id === userId) {
            return mockUser as unknown as Utilisateur;
          }
        } catch {
          localStorage.removeItem('mockUser');
        }
      }
    }

    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      return mockUser as unknown as Utilisateur;
    }

    try {
      const { data, error } = await supabase
        .from("utilisateurs")
        .select("id, email, nom, prenom, role, magasin_id, actif, created_at, updated_at")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code !== "PGRST116") {
          console.error("Error fetching user profile:", error);
        }
        return null;
      }
      return data as Utilisateur | null;
    } catch (error) {
      console.error("Get user profile error:", error);
      return null;
    }
  },

  async ensureUserProfile(user: User): Promise<Utilisateur | null> {
    try {
      // Vérifier d'abord les utilisateurs mock
      const mockUser = mockUsers.find(u => u.id === user.id || u.email === user.email);
      if (mockUser) {
        return mockUser as unknown as Utilisateur;
      }

      const { data: existingProfile, error: fetchError } = await supabase
        .from("utilisateurs")
        .select("*")
        .eq("id", user.id)
        .single();

      if (existingProfile && !fetchError) {
        return existingProfile as Utilisateur;
      }

      if (fetchError && fetchError.code === 'PGRST116') {
        const isAdmin = user.email === 'admin@casualfi.com';
        
        const { data: newProfile, error: insertError } = await supabase
          .from('utilisateurs')
          .insert({
            id: user.id,
            email: user.email || '',
            nom: user.email?.split('@')[0] || 'Utilisateur',
            prenom: 'Nouveau',
            role: isAdmin ? 'admin' : 'utilisateur',
            actif: true,
            mot_de_passe: '********',
            magasin_id: null
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating user profile:", insertError);
          return null;
        }
        
        return newProfile as Utilisateur;
      }

      return null;

    } catch (error) {
      console.error("Ensure user profile error:", error);
      return null;
    }
  },

  async getUsers(): Promise<Utilisateur[]> {
    try {
      const { data, error } = await supabase
        .from("utilisateurs")
        .select("id, email, nom, prenom, role, magasin_id, actif, created_at, updated_at")
        .order("nom", { ascending: true });

      if (error) throw error;
      return (data as Utilisateur[]) || [];
    } catch (error) {
      console.error("Get users error:", error);
      return mockUsers as unknown as Utilisateur[];
    }
  },

  async updateUser(id: string, updates: Partial<Omit<Utilisateur, "id" | "email" | "created_at" | "updated_at">>): Promise<Utilisateur> {
    try {
      const { data, error } = await supabase
        .from("utilisateurs")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Utilisateur;
    } catch (error) {
      console.error("Update user error:", error);
      throw new Error("Impossible de mettre à jour l'utilisateur");
    }
  },

  async createUser(user: { nom: string; prenom: string; email: string; role: string; magasin_id?: string; actif: boolean; mot_de_passe: string }): Promise<Utilisateur> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.mot_de_passe,
      });

      if (authError) {
        throw authError;
      }
      if (!authData.user) {
        throw new Error("User could not be created in Supabase Auth.");
      }

      const userToInsert = {
        id: authData.user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        magasin_id: user.magasin_id,
        actif: user.actif,
        mot_de_passe: "********"
      };

      const { data, error } = await supabase
        .from("utilisateurs")
        .insert(userToInsert)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data as Utilisateur;
    } catch (error) {
      console.error("Create user error:", error);
      throw new Error("Impossible de créer l'utilisateur");
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("utilisateurs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Delete user error:", error);
      throw new Error("Impossible de supprimer l'utilisateur");
    }
  }
};
