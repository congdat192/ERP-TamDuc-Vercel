
import { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getBusinessLogoUrl } from '@/services/businessService';

interface BusinessLogoUploadProps {
  currentLogoPath?: string | null;
  businessName: string;
  onLogoChange: (file: File) => void;
  isUploading?: boolean;
}

export function BusinessLogoUpload({ 
  currentLogoPath, 
  businessName, 
  onLogoChange, 
  isUploading = false 
}: BusinessLogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const logoUrl = previewUrl || getBusinessLogoUrl(currentLogoPath);
  const logoFallback = businessName ? businessName.substring(0, 2).toUpperCase() : 'BIZ';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file hình ảnh (JPG, PNG, GIF)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 2MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Call parent handler
    onLogoChange(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={logoUrl || undefined} alt={`Logo ${businessName}`} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
            {logoFallback}
          </AvatarFallback>
        </Avatar>
        <Button 
          size="sm" 
          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>
      
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Đang tải lên...' : 'Tải lên logo'}
        </Button>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG tối đa 2MB</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
