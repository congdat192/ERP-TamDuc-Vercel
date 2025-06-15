
import { Link } from 'react-router-dom';

interface ProductCodeLinkProps {
  productCode: string;
  className?: string;
}

export function ProductCodeLink({ productCode, className = '' }: ProductCodeLinkProps) {
  return (
    <Link 
      to={`/ERP/Products/${productCode}`}
      className={`theme-text-primary hover:theme-text-primary/80 underline cursor-pointer transition-colors ${className}`}
    >
      {productCode}
    </Link>
  );
}
