
import { Link } from 'react-router-dom';

interface InvoiceCodeLinkProps {
  invoiceCode: string;
  className?: string;
}

export function InvoiceCodeLink({ invoiceCode, className = '' }: InvoiceCodeLinkProps) {
  return (
    <Link 
      to={`/ERP/Invoices/${invoiceCode}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`theme-text-primary hover:theme-text-primary/80 underline cursor-pointer transition-colors font-medium ${className}`}
    >
      {invoiceCode}
    </Link>
  );
}
