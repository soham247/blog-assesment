import { create } from 'zustand';

interface BlogState {
  // UI states
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Filter states
  selectedCategory: number | null;
  setSelectedCategory: (categoryId: number | null) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Post states
  postStatus: 'all' | 'draft' | 'published';
  setPostStatus: (status: 'all' | 'draft' | 'published') => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  // UI states
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Filter states
  selectedCategory: null,
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Post states
  postStatus: 'all',
  setPostStatus: (status) => set({ postStatus: status }),
}));