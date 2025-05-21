
import { useState } from 'react';
import { Star } from 'lucide-react';

interface ProductRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
}

const ProductRating = ({
  rating,
  size = 'md',
  readOnly = true,
  onRatingChange
}: ProductRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const stars = 5;
  
  const sizeClass = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const handleClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };
  
  const handleMouseEnter = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };
  
  const getRating = (index: number) => {
    if (hoverRating > 0) {
      return index <= hoverRating;
    }
    return index <= rating;
  };
  
  return (
    <div className="flex items-center">
      {[...Array(stars)].map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(index + 1)}
          onMouseEnter={() => handleMouseEnter(index + 1)}
          onMouseLeave={handleMouseLeave}
          className={`${
            readOnly ? 'cursor-default' : 'cursor-pointer'
          } p-0 focus:outline-none disabled:opacity-70`}
          disabled={readOnly}
        >
          <Star
            className={`${sizeClass[size]} ${
              getRating(index + 1)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

export default ProductRating;
