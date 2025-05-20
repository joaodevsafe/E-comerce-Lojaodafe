
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the types for our navigation items
type CategoryFilter = {
  name: string;
  active: boolean;
};

type NavigationItem = {
  path: string;
  filters?: {
    categories?: CategoryFilter[];
    priceRange?: { min: number; max: number };
    sizes?: string[];
  };
};

type NavigationConfig = {
  newArrivals: NavigationItem;
  collections: NavigationItem;
  categories: {
    women: NavigationItem;
    men: NavigationItem;
    kids: NavigationItem;
    accessories: NavigationItem;
  };
};

// Default navigation configuration
const defaultNavigationConfig: NavigationConfig = {
  newArrivals: { path: "/produtos", filters: { categories: [] } },
  collections: { path: "/produtos", filters: { categories: [] } },
  categories: {
    women: { path: "/produtos", filters: { categories: [{ name: "Feminino", active: true }] } },
    men: { path: "/produtos", filters: { categories: [{ name: "Masculino", active: true }] } },
    kids: { path: "/produtos", filters: { categories: [{ name: "Infantil", active: true }] } },
    accessories: { path: "/produtos", filters: { categories: [{ name: "Acessórios", active: true }] } },
  }
};

interface NavigationContextType {
  navigationConfig: NavigationConfig;
  updateNavigationItem: (key: string, item: NavigationItem) => void;
  updateCategoryItem: (category: string, item: NavigationItem) => void;
  getNavigationUrl: (key: string) => string;
  getCategoryUrl: (category: string) => string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>(defaultNavigationConfig);

  useEffect(() => {
    // Load saved navigation config from localStorage on mount
    const savedConfig = localStorage.getItem("navigationConfig");
    if (savedConfig) {
      try {
        setNavigationConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Failed to parse saved navigation config", error);
      }
    }
  }, []);

  const updateNavigationItem = (key: "newArrivals" | "collections", item: NavigationItem) => {
    const updatedConfig = { ...navigationConfig };
    updatedConfig[key] = item;
    setNavigationConfig(updatedConfig);
    localStorage.setItem("navigationConfig", JSON.stringify(updatedConfig));
  };

  const updateCategoryItem = (category: "women" | "men" | "kids" | "accessories", item: NavigationItem) => {
    const updatedConfig = { ...navigationConfig };
    updatedConfig.categories[category] = item;
    setNavigationConfig(updatedConfig);
    localStorage.setItem("navigationConfig", JSON.stringify(updatedConfig));
  };

  // Helper function to get navigation URL (with query params if needed)
  const getNavigationUrl = (key: "newArrivals" | "collections") => {
    const item = navigationConfig[key];
    let url = item.path;
    
    // Add query parameters for filters if they exist
    if (item.filters && Object.keys(item.filters).length > 0) {
      const params = new URLSearchParams();
      
      // Add category filters
      if (item.filters.categories && item.filters.categories.length > 0) {
        const activeCategories = item.filters.categories
          .filter(cat => cat.active)
          .map(cat => cat.name);
        
        if (activeCategories.length > 0) {
          params.set('categories', activeCategories.join(','));
        }
      }
      
      // Add price range if it exists
      if (item.filters.priceRange) {
        params.set('minPrice', item.filters.priceRange.min.toString());
        params.set('maxPrice', item.filters.priceRange.max.toString());
      }
      
      // Add sizes if they exist
      if (item.filters.sizes && item.filters.sizes.length > 0) {
        params.set('sizes', item.filters.sizes.join(','));
      }
      
      // Append query string if we have parameters
      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
    }
    
    return url;
  };

  // Helper function to get category URL (with query params if needed)
  const getCategoryUrl = (category: "women" | "men" | "kids" | "accessories") => {
    const item = navigationConfig.categories[category];
    let url = item.path;
    
    // Add query parameters for filters if they exist
    if (item.filters && Object.keys(item.filters).length > 0) {
      const params = new URLSearchParams();
      
      // Add category filters
      if (item.filters.categories && item.filters.categories.length > 0) {
        const activeCategories = item.filters.categories
          .filter(cat => cat.active)
          .map(cat => cat.name);
        
        if (activeCategories.length > 0) {
          params.set('categories', activeCategories.join(','));
        }
      }
      
      // Add price range if it exists
      if (item.filters.priceRange) {
        params.set('minPrice', item.filters.priceRange.min.toString());
        params.set('maxPrice', item.filters.priceRange.max.toString());
      }
      
      // Add sizes if they exist
      if (item.filters.sizes && item.filters.sizes.length > 0) {
        params.set('sizes', item.filters.sizes.join(','));
      }
      
      // Append query string if we have parameters
      const queryString = params.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
    }
    
    return url;
  };

  return (
    <NavigationContext.Provider value={{ 
      navigationConfig, 
      updateNavigationItem, 
      updateCategoryItem,
      getNavigationUrl,
      getCategoryUrl
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
