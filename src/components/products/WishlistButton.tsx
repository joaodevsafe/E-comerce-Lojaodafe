
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { wishlistService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  productId: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

const WishlistButton = ({ productId, variant = "outline" }: WishlistButtonProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated, user, openAuthDialog } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      checkWishlistStatus();
    } else {
      setIsLoading(false);
    }
  }, [productId, isAuthenticated, user]);

  const checkWishlistStatus = async () => {
    setIsLoading(true);
    try {
      const result = await wishlistService.isInWishlist(productId, user?.id);
      setIsInWishlist(result);
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      openAuthDialog();
      return;
    }

    setIsLoading(true);
    try {
      let result;
      
      if (isInWishlist) {
        result = await wishlistService.removeFromWishlist(productId, user?.id);
        if (result.success) {
          setIsInWishlist(false);
          toast({
            description: "Produto removido da lista de desejos",
          });
        }
      } else {
        result = await wishlistService.addToWishlist(productId, user?.id);
        if (result.success) {
          setIsInWishlist(true);
          toast({
            description: "Produto adicionado à lista de desejos",
          });
        }
      }
      
      if (!result.success) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao atualizar sua lista de desejos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar sua lista de desejos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleWishlist}
      disabled={isLoading}
      className={isInWishlist ? "text-red-500" : ""}
    >
      <Heart 
        className={`h-5 w-5 ${isInWishlist ? "fill-red-500" : ""}`} 
      />
    </Button>
  );
};

export default WishlistButton;
