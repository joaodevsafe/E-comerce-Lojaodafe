
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, Edit, Trash } from "lucide-react";
import ProductRating from "./ProductRating";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { reviewService, ProductReview } from "@/services/api";

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [userReview, setUserReview] = useState<ProductReview | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const { isAuthenticated, user, openAuthDialog } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchReviews();
  }, [productId]);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserReview();
    }
  }, [isAuthenticated, productId]);
  
  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const data = await reviewService.getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };
  
  const fetchUserReview = async () => {
    try {
      const review = await reviewService.getUserReview(productId);
      if (review) {
        setUserReview(review);
        setRating(review.rating);
        setReviewText(review.review_text || '');
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };
  
  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      openAuthDialog();
      return;
    }
    
    if (rating === 0) {
      toast({
        description: "Por favor, selecione uma classificação",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      let success;
      
      if (isEditing && userReview) {
        success = await reviewService.updateReview(
          userReview.id,
          rating,
          reviewText || null
        );
        if (success) {
          setUserReview({
            ...userReview,
            rating,
            review_text: reviewText || null
          });
          toast({
            description: "Sua avaliação foi atualizada com sucesso",
          });
          setIsEditing(false);
        }
      } else {
        success = await reviewService.addReview(
          productId,
          rating,
          reviewText || null
        );
        if (success) {
          await fetchReviews();
          await fetchUserReview();
          toast({
            description: "Sua avaliação foi enviada com sucesso",
          });
        }
      }
      
      if (!success) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao enviar sua avaliação",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua avaliação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    setIsSubmitting(true);
    try {
      const success = await reviewService.deleteReview(userReview.id);
      if (success) {
        setUserReview(null);
        setRating(0);
        setReviewText('');
        await fetchReviews();
        toast({
          description: "Sua avaliação foi excluída com sucesso",
        });
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir sua avaliação",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir sua avaliação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditReview = () => {
    if (!userReview) return;
    
    setRating(userReview.rating);
    setReviewText(userReview.review_text || '');
    setIsEditing(true);
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    if (userReview) {
      setRating(userReview.rating);
      setReviewText(userReview.review_text || '');
    }
  };
  
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6">Avaliações</h2>
      
      {isLoadingReviews ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reviews.length > 0 ? (
        <div>
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <span className="text-4xl font-bold">{getAverageRating().toFixed(1)}</span>
              <span className="text-lg text-gray-500">/5</span>
            </div>
            <div>
              <ProductRating rating={getAverageRating()} size="lg" />
              <p className="text-gray-500 mt-1">
                Baseado em {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {reviews.map(review => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {review.user_id.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <ProductRating rating={review.rating} />
                        <p className="text-gray-500 text-sm mt-1">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    {user && user.id === review.user_id && !isEditing && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={handleEditReview}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleDeleteReview}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {review.review_text && (
                    <p className="mt-4 text-gray-700">{review.review_text}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          Este produto ainda não possui avaliações.
        </p>
      )}
      
      <Separator className="my-8" />
      
      {!userReview || isEditing ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'Editar sua avaliação' : 'Avaliar este produto'}
          </h3>
          
          <div className="mb-4">
            <p className="mb-2">Sua classificação:</p>
            <ProductRating
              rating={rating}
              size="lg"
              readOnly={false}
              onRatingChange={setRating}
            />
          </div>
          
          <Textarea
            placeholder="Escreva sua opinião (opcional)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="min-h-[100px] mb-4"
          />
          
          <div className="flex gap-2">
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isEditing ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
            </Button>
            
            {isEditing && (
              <Button variant="outline" onClick={cancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Sua avaliação</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEditReview}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteReview}>
                <Trash className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <ProductRating rating={userReview.rating} size="md" />
              {userReview.review_text && (
                <p className="mt-4">{userReview.review_text}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
