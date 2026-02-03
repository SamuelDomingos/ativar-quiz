"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import QRCode from "qrcode";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface WaitingScreenProps {
  quizTitle: string;
  quizDescription: string;
  participantsCount: number;
}

export default function WaitingScreenPage({
  quizTitle,
  quizDescription,
  participantsCount,
}: WaitingScreenProps) {
  const params = useParams();
  const id = params.id as string;
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
    <div className="min-h-screen bg-linear-to-br from-background via-background to-background flex items-center justify-center">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
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
          </motion.div>

          {/* Coluna Direita - Informações e Contador */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <Card className="border-border shadow-2xl w-full max-w-sm">
              <CardHeader className="space-y-4 text-center pb-8">
                <div className="flex justify-center">
                  <Spinner className="w-16 h-16" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">
                    {quizTitle}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {quizDescription}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Status */}
                <div className="space-y-3">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                      Aguardando começar...
                    </span>
                  </motion.div>
                </div>

                {/* Contador de Participantes */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Participantes
                  </h3>
                  <div className="p-6 rounded-lg bg-secondary/50 border border-border">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className="text-center"
                    >
                      <p className="text-4xl font-bold text-foreground">
                        {participantsCount}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        pessoa{participantsCount !== 1 ? "s" : ""} aguardando
                      </p>
                    </motion.div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
