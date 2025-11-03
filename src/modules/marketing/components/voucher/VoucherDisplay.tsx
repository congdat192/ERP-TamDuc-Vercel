import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { supabase } from "@/integrations/supabase/client";
import { voucherService } from "../../services/voucherService";

interface VoucherDisplayProps {
  voucherData: {
    code: string;
    campaign_code: string;
    expired_at: string;
    activation_status: string;
    recipient_phone: string;
    customer_type: "new" | "old";
    customer_source: string;
    campaign_id: number;
    created_at: string;
    activated_at: string;
    creator_phone: string;
    success: boolean;
    meta: {
      request_id: string;
      duration_ms: number;
    };
  };
}

export function VoucherDisplay({ voucherData }: VoucherDisplayProps) {
  const voucherRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [templateText, setTemplateText] = useState<string | null>(null);

  const generateVoucherImage = async (): Promise<Blob> => {
    // 1. Get campaign template image URL
    const { data: campaign, error: campaignError } = await supabase
      .from("voucher_campaigns")
      .select("voucher_image_url")
      .eq("campaign_id", voucherData.campaign_id)
      .single();

    if (campaignError) throw campaignError;

    if (!campaign?.voucher_image_url) {
      throw new Error("Chiến dịch chưa có ảnh voucher template");
    }

    // 2. Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Cannot get canvas context");

    // 3. Load template image
    const templateImg = new Image();
    templateImg.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
      templateImg.onload = resolve;
      templateImg.onerror = () => reject(new Error("Failed to load template image"));
      templateImg.src = campaign.voucher_image_url;
    });

    canvas.width = templateImg.width;
    canvas.height = templateImg.height;

    // 4. Draw template image
    ctx.drawImage(templateImg, 0, 0);

    // 5. Generate QR code (black QR on white background)
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, voucherData.code, {
      width: 150,
      margin: 1,
      color: {
        dark: "#000000", // Black QR code
        light: "#FFFFFF", // White background
      },
    });

    // 6. Calculate position (20px from right, 60px from bottom)
    const qrSize = 150;
    const textHeight = 50; // Space for 2 lines of text
    const padding = 10;

    const qrX = canvas.width - qrSize - 20;
    const qrY = canvas.height - 15 - qrSize - textHeight;

    // 7. Draw white background box for QR code
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(qrX - padding, qrY - padding, qrSize + padding * 2, qrSize + padding * 2);

    // 8. Draw QR code
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // 9. Draw voucher code text (WHITE, BOLD)
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(voucherData.code, qrX + qrSize / 2, qrY + qrSize + 25);

    // 10. Draw expiry date text (WHITE)
    const expiryDate = new Date(voucherData.expired_at);
    const formattedExpiry = `HSD: ${expiryDate.getDate().toString().padStart(2, "0")}/${(expiryDate.getMonth() + 1).toString().padStart(2, "0")}/${expiryDate.getFullYear().toString().slice(-2)}`;

    ctx.font = "16px Arial";
    ctx.fillText(formattedExpiry, qrX + qrSize / 2, qrY + qrSize + 45);

    // 11. Convert canvas to blob
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/png");
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsGenerating(true);
        
        // Load preview image
        const blob = await generateVoucherImage();
        const url = URL.createObjectURL(blob);
        setPreviewImage(url);
        
        // Load default template text
        const template = await voucherService.getDefaultTemplate();
        if (template?.template_text) {
          setTemplateText(template.template_text);
        }
      } catch (error) {
        console.error("Preview generation error:", error);
        // Silent fail - keep showing placeholder
      } finally {
        setIsGenerating(false);
      }
    };

    loadData();

    // Cleanup
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [voucherData.campaign_id, voucherData.code]);

  const handleCopyText = () => {
    let text: string;
    
    if (templateText) {
      // Replace template variables with actual data
      text = templateText
        .replace(/\{\{voucher_code\}\}/g, voucherData.code)
        .replace(/\{\{campaign_name\}\}/g, voucherData.campaign_code)
        .replace(/\{\{discount_display\}\}/g, '50K') // TODO: Get from campaign
        .replace(/\{\{expires_at\}\}/g, new Date(voucherData.expired_at).toLocaleString("vi-VN"))
        .replace(/\{\{recipient_phone\}\}/g, voucherData.recipient_phone);
    } else {
      // Fallback to hardcoded if no template
      text = `
🎁 MÃ VOUCHER: ${voucherData.code}
📋 Mã chiến dịch: ${voucherData.campaign_code}
📞 SĐT khách hàng: ${voucherData.recipient_phone}
👤 Loại khách: ${voucherData.customer_type === "new" ? "Khách mới" : "Khách cũ"}
📍 Nguồn: ${voucherData.customer_source}
⏰ Hết hạn: ${new Date(voucherData.expired_at).toLocaleString("vi-VN")}
📞 Hotline: 1900-xxx-xxx
      `.trim();
    }

    navigator.clipboard.writeText(text);
    toast.success("Đã copy nội dung voucher!");
  };

  const handleCopyImage = async () => {
    try {
      toast.loading("Đang copy ảnh...");

      const blob = await generateVoucherImage();

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      toast.dismiss();
      toast.success("Đã copy ảnh!");
    } catch (error: any) {
      console.error("[VoucherDisplay] Copy error:", error);
      toast.dismiss();
      
      // Fallback: Download if clipboard fails
      if (error.name === "NotAllowedError") {
        toast.error("Trình duyệt chặn copy ảnh. Vui lòng tải về.");
        handleDownloadImage();
      } else {
        toast.error(`Không thể copy ảnh: ${error.message}`);
      }
    }
  };

  const handleDownloadImage = async () => {
    try {
      toast.loading("Đang tạo ảnh...");
      
      const blob = await generateVoucherImage();
      
      // Upload to storage
      const fileName = `${voucherData.code}_${voucherData.recipient_phone}.png`;
      const { error: uploadError } = await supabase.storage.from("voucher-generated").upload(fileName, blob, {
        upsert: true,
        contentType: "image/png",
      });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Đã tải xuống ảnh!");
    } catch (error: any) {
      console.error("[VoucherDisplay] Download error:", error);
      toast.dismiss();
      toast.error(`Không thể tải ảnh: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin Voucher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voucher Visual Preview */}
        <div ref={voucherRef} className="relative">
          {isGenerating ? (
            <div className="aspect-[16/9] bg-muted rounded-lg border-2 border-dashed border-green-500 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Đang tạo voucher...</p>
              </div>
            </div>
          ) : previewImage ? (
            <div className="border-2 border-green-500 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={previewImage} 
                alt={`Voucher ${voucherData.code}`}
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-green-500">
              <div className="text-center space-y-3">
                <div className="text-sm text-muted-foreground">Mã chiến dịch: {voucherData.campaign_code}</div>
                <div className="text-3xl font-bold text-green-600">{voucherData.code}</div>
                <div className="text-lg font-semibold">
                  {voucherData.customer_type === "new" ? "🆕 Khách mới" : "🔄 Khách cũ"} • {voucherData.customer_source}
                </div>
                <div className="text-xs text-muted-foreground">
                  Hết hạn: {new Date(voucherData.expired_at).toLocaleString("vi-VN")}
                </div>
                <div className="text-xs text-muted-foreground">SĐT: {voucherData.recipient_phone}</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleCopyText} variant="outline" size="sm" className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            Copy Text
          </Button>
          <Button 
            onClick={handleCopyImage} 
            variant="default" 
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isGenerating}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Ảnh
          </Button>
          <Button 
            onClick={handleDownloadImage} 
            variant="outline" 
            size="sm"
            className="flex-1"
            disabled={isGenerating}
          >
            <Download className="w-4 h-4 mr-2" />
            Tải về
          </Button>
        </div>

        {/* Details */}
        <div className="text-sm text-muted-foreground space-y-1">
          <div>
            <strong>Trạng thái:</strong> {voucherData.activation_status}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
