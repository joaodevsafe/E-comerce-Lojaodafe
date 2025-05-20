
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigation } from "@/contexts/NavigationContext";
import { useToast } from "@/hooks/use-toast";

const NavigationSettings = () => {
  const { navigationConfig, updateNavigationItem, updateCategoryItem } = useNavigation();
  const { toast } = useToast();
  
  const [newArrivals, setNewArrivals] = useState({
    path: navigationConfig.newArrivals.path,
    categories: navigationConfig.newArrivals.filters?.categories?.map(c => c.name) || []
  });
  
  const [collections, setCollections] = useState({
    path: navigationConfig.collections.path,
    categories: navigationConfig.collections.filters?.categories?.map(c => c.name) || []
  });
  
  const [categoriesSettings, setCategoriesSettings] = useState({
    women: {
      path: navigationConfig.categories.women.path
    },
    men: {
      path: navigationConfig.categories.men.path
    },
    kids: {
      path: navigationConfig.categories.kids.path
    },
    accessories: {
      path: navigationConfig.categories.accessories.path
    }
  });

  const categoryOptions = ["Feminino", "Masculino", "Infantil", "Acessórios"];
  
  const handleSaveNewArrivals = () => {
    updateNavigationItem("newArrivals", {
      path: newArrivals.path,
      filters: {
        categories: newArrivals.categories.map(name => ({ name, active: true }))
      }
    });
    
    toast({
      title: "Configurações salvas",
      description: "As configurações de 'Novidades' foram atualizadas com sucesso."
    });
  };
  
  const handleSaveCollections = () => {
    updateNavigationItem("collections", {
      path: collections.path,
      filters: {
        categories: collections.categories.map(name => ({ name, active: true }))
      }
    });
    
    toast({
      title: "Configurações salvas",
      description: "As configurações de 'Coleções' foram atualizadas com sucesso."
    });
  };
  
  const handleSaveCategory = (category: "women" | "men" | "kids" | "accessories") => {
    let categoryName = "";
    switch(category) {
      case "women": categoryName = "Feminino"; break;
      case "men": categoryName = "Masculino"; break;
      case "kids": categoryName = "Infantil"; break;
      case "accessories": categoryName = "Acessórios"; break;
    }
    
    updateCategoryItem(category, {
      path: categoriesSettings[category].path,
      filters: {
        categories: [{ name: categoryName, active: true }]
      }
    });
    
    toast({
      title: "Configurações salvas",
      description: `As configurações da categoria ${categoryName} foram atualizadas com sucesso.`
    });
  };
  
  const handleCategoryChange = (category: string, settingType: "newArrivals" | "collections") => {
    if (settingType === "newArrivals") {
      setNewArrivals(prev => {
        const categories = prev.categories.includes(category)
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category];
        return { ...prev, categories };
      });
    } else {
      setCollections(prev => {
        const categories = prev.categories.includes(category)
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category];
        return { ...prev, categories };
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Navegação</CardTitle>
        <CardDescription>
          Configure os links e botões de navegação da loja.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="newArrivals">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="newArrivals">Novidades</TabsTrigger>
            <TabsTrigger value="collections">Coleções</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
          </TabsList>
          
          {/* Novidades */}
          <TabsContent value="newArrivals">
            <div className="space-y-4">
              <div>
                <Label htmlFor="newArrivalsPath">URL de Destino</Label>
                <Input 
                  id="newArrivalsPath" 
                  value={newArrivals.path} 
                  onChange={(e) => setNewArrivals(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="/produtos"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL para onde o botão "Ver Novidades" irá direcionar.
                </p>
              </div>
              
              <div>
                <Label>Filtros de Categoria</Label>
                <div className="mt-2 space-y-2">
                  {categoryOptions.map(category => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox 
                        id={`newArrivals-${category.toLowerCase()}`} 
                        checked={newArrivals.categories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category, "newArrivals")} 
                      />
                      <Label htmlFor={`newArrivals-${category.toLowerCase()}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={handleSaveNewArrivals}>Salvar Configurações</Button>
            </div>
          </TabsContent>
          
          {/* Coleções */}
          <TabsContent value="collections">
            <div className="space-y-4">
              <div>
                <Label htmlFor="collectionsPath">URL de Destino</Label>
                <Input 
                  id="collectionsPath" 
                  value={collections.path} 
                  onChange={(e) => setCollections(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="/produtos"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL para onde o botão "Coleções" irá direcionar.
                </p>
              </div>
              
              <div>
                <Label>Filtros de Categoria</Label>
                <div className="mt-2 space-y-2">
                  {categoryOptions.map(category => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox 
                        id={`collections-${category.toLowerCase()}`} 
                        checked={collections.categories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category, "collections")} 
                      />
                      <Label htmlFor={`collections-${category.toLowerCase()}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={handleSaveCollections}>Salvar Configurações</Button>
            </div>
          </TabsContent>
          
          {/* Categorias */}
          <TabsContent value="categories">
            <div className="space-y-6">
              {/* Feminino */}
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-3">Feminino</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="womenPath">URL de Destino</Label>
                    <Input 
                      id="womenPath" 
                      value={categoriesSettings.women.path} 
                      onChange={(e) => setCategoriesSettings(prev => ({
                        ...prev,
                        women: { ...prev.women, path: e.target.value }
                      }))}
                      placeholder="/produtos"
                    />
                  </div>
                  <Button onClick={() => handleSaveCategory("women")}>Salvar</Button>
                </div>
              </div>
              
              {/* Masculino */}
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-3">Masculino</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="menPath">URL de Destino</Label>
                    <Input 
                      id="menPath" 
                      value={categoriesSettings.men.path} 
                      onChange={(e) => setCategoriesSettings(prev => ({
                        ...prev,
                        men: { ...prev.men, path: e.target.value }
                      }))}
                      placeholder="/produtos"
                    />
                  </div>
                  <Button onClick={() => handleSaveCategory("men")}>Salvar</Button>
                </div>
              </div>
              
              {/* Infantil */}
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-3">Infantil</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="kidsPath">URL de Destino</Label>
                    <Input 
                      id="kidsPath" 
                      value={categoriesSettings.kids.path} 
                      onChange={(e) => setCategoriesSettings(prev => ({
                        ...prev,
                        kids: { ...prev.kids, path: e.target.value }
                      }))}
                      placeholder="/produtos"
                    />
                  </div>
                  <Button onClick={() => handleSaveCategory("kids")}>Salvar</Button>
                </div>
              </div>
              
              {/* Acessórios */}
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-3">Acessórios</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="accessoriesPath">URL de Destino</Label>
                    <Input 
                      id="accessoriesPath" 
                      value={categoriesSettings.accessories.path} 
                      onChange={(e) => setCategoriesSettings(prev => ({
                        ...prev,
                        accessories: { ...prev.accessories, path: e.target.value }
                      }))}
                      placeholder="/produtos"
                    />
                  </div>
                  <Button onClick={() => handleSaveCategory("accessories")}>Salvar</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Menu */}
          <TabsContent value="menu">
            <div className="text-center p-8">
              <p>As configurações do menu de navegação serão adicionadas em breve.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NavigationSettings;
