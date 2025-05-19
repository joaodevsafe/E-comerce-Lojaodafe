
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Layout, Settings, Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([
    { id: 1, name: "Camisa Slim Fit", price: 129.90, category: "camisas", image: "/images/camisa-slim.jpg" },
    { id: 2, name: "Jeans Premium", price: 259.90, category: "calcas", image: "/images/jeans-premium.jpg" },
    { id: 3, name: "Blazer Clássico", price: 399.90, category: "blazers", image: "/images/blazer-classico.jpg" },
    { id: 4, name: "Camiseta Básica", price: 89.90, category: "camisetas", image: "/images/camiseta-basica.jpg" },
  ]);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleSelectChange = (value: string) => {
    setNewProduct({
      ...newProduct,
      category: value
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const productToAdd = {
      id: newId,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image_url || "/placeholder.svg"
    };

    setProducts([...products, productToAdd]);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: ""
    });

    toast({
      title: "Produto adicionado",
      description: `${newProduct.name} foi adicionado com sucesso.`
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Produto removido",
      description: "O produto foi removido com sucesso."
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Administração - LOJAODAFE</h1>
        <Link to="/admin/usuarios">
          <Button variant="outline" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Gerenciar Administradores
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" /> Produtos
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" /> Layout
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Configurações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Lista de Produtos</CardTitle>
                <CardDescription>Gerencie os produtos da sua loja</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Produto</CardTitle>
                <CardDescription>Preencha os dados do novo produto</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nome do Produto*</label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={newProduct.name}
                      onChange={handleInputChange}
                      placeholder="Nome do produto" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                    <Textarea 
                      id="description" 
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      placeholder="Descrição do produto" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Preço*</label>
                    <Input 
                      id="price" 
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      placeholder="99.90" 
                      type="number" 
                      step="0.01" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Categoria*</label>
                    <Select 
                      value={newProduct.category}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camisas">Camisas</SelectItem>
                        <SelectItem value="calcas">Calças</SelectItem>
                        <SelectItem value="blazers">Blazers</SelectItem>
                        <SelectItem value="camisetas">Camisetas</SelectItem>
                        <SelectItem value="acessorios">Acessórios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="image_url" className="text-sm font-medium">URL da Imagem</label>
                    <Input 
                      id="image_url" 
                      name="image_url"
                      value={newProduct.image_url}
                      onChange={handleInputChange}
                      placeholder="/imagens/seu-produto.jpg" 
                    />
                  </div>
                  
                  <Button 
                    type="button" 
                    onClick={handleAddProduct}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Produto
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Personalização de Layout</CardTitle>
              <CardDescription>Configure o layout da sua loja</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Banner Principal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <img src="/placeholder.svg" alt="Banner" className="w-full h-32 object-cover bg-gray-100 mb-2" />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="destructive" size="sm">Remover</Button>
                      </div>
                    </div>
                    <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <Button variant="outline">Adicionar Banner</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Categorias em Destaque</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="border rounded-md px-3 py-2 flex items-center gap-2">
                      Feminino <Button variant="ghost" size="icon" className="h-5 w-5"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                    <div className="border rounded-md px-3 py-2 flex items-center gap-2">
                      Masculino <Button variant="ghost" size="icon" className="h-5 w-5"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                    <div className="border rounded-md px-3 py-2 flex items-center gap-2">
                      Infantil <Button variant="ghost" size="icon" className="h-5 w-5"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                    <div className="border border-dashed rounded-md px-3 py-2">
                      <Button variant="ghost" size="sm" className="h-5"><Plus className="h-3 w-3 mr-1" /> Adicionar</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Cores do Tema</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Cor Primária</label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-l-md bg-primary"></div>
                        <Input className="rounded-l-none" defaultValue="#000000" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cor Secundária</label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-l-md bg-secondary"></div>
                        <Input className="rounded-l-none" defaultValue="#f1f1f1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Salvar Alterações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Loja</CardTitle>
              <CardDescription>Gerencie as configurações gerais da sua loja</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="store_name" className="text-sm font-medium">Nome da Loja</label>
                  <Input id="store_name" defaultValue="LOJAODAFE" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="store_description" className="text-sm font-medium">Descrição da Loja</label>
                  <Textarea 
                    id="store_description" 
                    defaultValue="Sua loja de moda online com as últimas tendências, qualidade e preços justos." 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="contact_email" className="text-sm font-medium">Email de Contato</label>
                    <Input id="contact_email" defaultValue="contato@lojaodafe.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contact_phone" className="text-sm font-medium">Telefone de Contato</label>
                    <Input id="contact_phone" defaultValue="(11) 99999-9999" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="store_address" className="text-sm font-medium">Endereço</label>
                  <Input id="store_address" defaultValue="Rua Exemplo, 123 - Bairro - Cidade/UF" />
                </div>
                
                <div className="flex justify-end">
                  <Button>Salvar Configurações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
