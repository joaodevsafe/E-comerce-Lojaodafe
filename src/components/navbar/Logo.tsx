
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="flex-shrink-0 mr-6">
      <Link to="/" className="text-2xl font-bold tracking-wider text-primary hover:text-primary/90 transition-colors relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-100 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary/70">
        LOJAODAFE
      </Link>
    </div>
  );
};

export default Logo;
