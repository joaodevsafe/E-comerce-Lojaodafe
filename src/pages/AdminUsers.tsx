
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, ShieldCheck, UserRound, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type AdminUser = {
  id: string;
  email: string;
  name: string;
};

const AdminUsers = () => {
  const { toast } = useToast();
  const { registerAdmin, removeAdmin, getAdminUsers } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>(getAdminUsers());
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const handleAddAdmin = () => {
    if (!newAdminEmail || !newAdminName || !newAdminPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar um administrador",
        variant: "destructive",
      });
      return;
    }

    try {
      const newAdmin = registerAdmin(newAdminEmail, newAdminPassword, newAdminName);
      setAdmins([...admins, newAdmin]);
      setNewAdminEmail("");
      setNewAdminName("");
      setNewAdminPassword("");
      
      toast({
        title: "Administrador adicionado",
        description: `${newAdminName} foi adicionado como administrador`,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o administrador. Email já pode estar em uso.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAdmin = (id: string, name: string) => {
    try {
      removeAdmin(id);
      setAdmins(admins.filter(admin => admin.id !== id));
      
      toast({
        title: "Administrador removido",
        description: `${name} foi removido da lista de administradores`,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o administrador",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <ShieldCheck className="mr-2" /> Gerenciamento de Administradores
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Administradores</CardTitle>
            <CardDescription>Lista de usuários com acesso administrativo</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" /> {admin.name}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveAdmin(admin.id, admin.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      Nenhum administrador adicional cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Administrador</CardTitle>
            <CardDescription>Cadastre um novo usuário com acesso administrativo</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddAdmin(); }}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome*</label>
                <Input 
                  id="name" 
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Nome do administrador" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email*</label>
                <Input 
                  id="email" 
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="email@exemplo.com" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Senha*</label>
                <Input 
                  id="password" 
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Digite uma senha segura" 
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
              >
                <UserRound className="h-4 w-4 mr-2" /> Adicionar Administrador
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
