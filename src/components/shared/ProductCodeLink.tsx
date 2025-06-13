
import { useNavigate } from 'react-router-dom';

interface ProductCodeLinkProps {
  productCode: string;
  className?: string;
  children?: React.ReactNode;
}

export function ProductCodeLink({ productCode, className = "", children }: ProductCodeLinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/ERP/Products/${productCode}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`theme-text font-medium hover:theme-text-primary hover:underline cursor-pointer transition-colors ${className}`}
    >
      {children || productCode}
    </button>
  );
}
