import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BranchInventory {
  branch_id: string;
  branch_name: string;
  on_hand: number;
  reserved: number;
  days_until_out_of_stock?: number;
  status?: 'active' | 'inactive';
}

interface ProductStockTabProps {
  product: {
    inventoryByBranch?: BranchInventory[];
  };
}

export function ProductStockTab({ product }: ProductStockTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data if not available from backend
  const mockInventoryByBranch: BranchInventory[] = [
    { branch_id: '1', branch_name: '01. Tân Bình', on_hand: 1, reserved: 0, days_until_out_of_stock: 0, status: 'active' },
    { branch_id: '2', branch_name: '02. Chi nhánh Q11', on_hand: 1, reserved: 0, days_until_out_of_stock: 0, status: 'active' },
    { branch_id: '3', branch_name: '03. Thủ Đức', on_hand: 1, reserved: 0, days_until_out_of_stock: 0, status: 'active' },
    { branch_id: '4', branch_name: '04. Bình Thạnh', on_hand: 1, reserved: 0, days_until_out_of_stock: 0, status: 'active' },
    { branch_id: '5', branch_name: '05. Quận 1', on_hand: 1, reserved: 0, days_until_out_of_stock: 0, status: 'active' },
    { branch_id: '6', branch_name: '06. Gò Vấp', on_hand: 0, reserved: 0, days_until_out_of_stock: 0, status: 'active' },
    { branch_id: '7', branch_name: '07. Quận 7', on_hand: 1, reserved: 0, days_until_out_of_stock: 0, status: 'active' },
    { branch_id: '8', branch_name: '08. Quận 12', on_hand: 0, reserved: 0, days_until_out_of_stock: 0, status: 'active' },
    { branch_id: '9', branch_name: '09. Quận 9', on_hand: 1, reserved: 0, days_until_out_of_stock: 0, status: 'active' },
  ];
  
  const inventoryByBranch = product.inventoryByBranch && product.inventoryByBranch.length > 0 
    ? product.inventoryByBranch 
    : mockInventoryByBranch;
  
  // Filter branches by search term
  const filteredBranches = inventoryByBranch.filter(branch =>
    branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate totals
  const totalStock = filteredBranches.reduce((sum, b) => sum + b.on_hand, 0);
  const totalReserved = filteredBranches.reduce((sum, b) => sum + b.reserved, 0);

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm tên chi nhánh"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Chi nhánh</TableHead>
              <TableHead className="text-right font-semibold">Tồn kho</TableHead>
              <TableHead className="text-right font-semibold">KH đặt</TableHead>
              <TableHead className="text-right font-semibold">Dự kiến hết hàng</TableHead>
              <TableHead className="text-right font-semibold">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Summary Row */}
            <TableRow className="bg-muted/30 font-medium hover:bg-muted/30">
              <TableCell className="font-normal text-muted-foreground">
                {filteredBranches.length > 0 ? `${filteredBranches.length} chi nhánh` : 'Không có dữ liệu'}
              </TableCell>
              <TableCell className="text-right">{totalStock}</TableCell>
              <TableCell className="text-right">{totalReserved}</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">-</TableCell>
            </TableRow>

            {/* Branch Rows */}
            {filteredBranches.map((branch) => (
              <TableRow key={branch.branch_id}>
                <TableCell className="font-medium">{branch.branch_name}</TableCell>
                <TableCell className="text-right">{branch.on_hand}</TableCell>
                <TableCell className="text-right">{branch.reserved}</TableCell>
                <TableCell className="text-right">
                  {branch.days_until_out_of_stock !== undefined && branch.days_until_out_of_stock > 0
                    ? `${branch.days_until_out_of_stock} ngày` 
                    : '0 ngày'
                  }
                </TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="outline" 
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {branch.status === 'active' ? 'Đang kinh doanh' : 'Ngừng hoạt động'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}

            {/* Total Row */}
            {filteredBranches.length > 0 && (
              <TableRow className="font-semibold bg-muted/30 hover:bg-muted/30">
                <TableCell>Tổng kho</TableCell>
                <TableCell className="text-right">{totalStock}</TableCell>
                <TableCell className="text-right">{totalReserved}</TableCell>
                <TableCell className="text-right">0 ngày</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant="outline" 
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Đang kinh doanh
                  </Badge>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredBranches.map(branch => (
          <div key={branch.branch_id} className="p-4 border rounded-lg bg-card">
            <h4 className="font-medium mb-3">{branch.branch_name}</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Tồn kho:</span>
                <p className="font-semibold">{branch.on_hand}</p>
              </div>
              <div>
                <span className="text-muted-foreground">KH đặt:</span>
                <p className="font-semibold">{branch.reserved}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Dự kiến:</span>
                <p>{branch.days_until_out_of_stock || 0} ngày</p>
              </div>
              <div>
                <Badge 
                  variant="outline" 
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {branch.status === 'active' ? 'Đang kinh doanh' : 'Ngừng hoạt động'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBranches.length === 0 && searchTerm && (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p>Không tìm thấy chi nhánh "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
