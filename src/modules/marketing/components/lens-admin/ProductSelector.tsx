import { Check, ChevronsUpDown, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { LensProduct } from '../../types/lens';
import { useState } from 'react';

interface ProductSelectorProps {
  products: LensProduct[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export function ProductSelector({ products, selectedId, onSelect, isLoading = false }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);

  // Defensive check: ensure products is always an array
  const safeProducts = products || [];
  const selectedProduct = safeProducts.find(p => p.id === selectedId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            {isLoading ? (
              <span className="text-muted-foreground">Đang tải...</span>
            ) : selectedProduct ? (
              <span className="truncate">{selectedProduct.name}</span>
            ) : (
              <span className="text-muted-foreground">Chọn sản phẩm...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm sản phẩm..." />
          <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {safeProducts.map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => {
                  onSelect(product.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedId === product.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-2 flex-1">
                  {product.image_urls && product.image_urls.length > 0 && (
                    <img 
                      src={product.image_urls[0]} 
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{product.name}</div>
                    {product.brand && (
                      <div className="text-xs text-muted-foreground">{product.brand.name}</div>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
