"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QrCodeProps {
  id: string;
}

export default function QrCode({ id }: QrCodeProps) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const qrCodeOptions: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: "H",
      type: "image/webp",
      quality: 0.95,
      margin: 2,
      width: 300,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
    };

    QRCode.toDataURL(`${baseUrl}/quiz/${id}`, qrCodeOptions).then(
      (url: string) => {
        setQrCodeUrl(url);
      },
    );
  }, [id, baseUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}/quiz/${id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          Compartilhar Quiz
        </CardTitle>
        <CardDescription>
          Compartilhe com participantes via QR code ou link direto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* QR Code */}
        <div className="flex flex-col items-center p-8 bg-linear-to-br from-secondary to-secondary/80 rounded-xl border border-border">
          {qrCodeUrl ? (
            <>
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                width={300}
                height={300}
                className="w-64 h-64 p-4 bg-background rounded-lg shadow-md border border-border"
                priority
              />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Aponte a câmera para acessar o quiz
              </p>
            </>
          ) : (
            <div className="w-64 h-64 bg-muted rounded-lg animate-pulse" />
          )}
        </div>

        {/* Link Copy */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Link do Quiz
          </label>
          <div className="flex gap-2">
            <Input
              value={`${baseUrl}/quiz/${id}`}
              readOnly
              className="bg-secondary border-border text-foreground text-sm"
            />
            <Button
              onClick={handleCopyLink}
              variant={copied ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
            >
              <Copy className="w-4 h-4 mr-1" />
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
