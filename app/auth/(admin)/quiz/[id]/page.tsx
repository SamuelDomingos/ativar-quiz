"use client";

import { useEffect, useState } from "react";
import { Copy, Play, Pause, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import QRCode from "qrcode";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EditQuizPage() {
  const params = useParams();
  const id = params.id as string;

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [quizLink, setQuizLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [quizRunning, setQuizRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const quizData = {
    title: "Quiz de Conhecimento Geral",
    description: "Teste seus conhecimentos em diversos assuntos",
  };

  useEffect(() => {
    if (!id) return;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const fullLink = `${baseUrl}/quiz/${id}`;

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

    QRCode.toDataURL(fullLink, qrCodeOptions).then((url: string) => {
      setQuizLink(fullLink);
      setQrCodeUrl(url);
      setLoading(false);
    });
  }, [id]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(quizLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {quizData.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {quizData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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
                <div className="flex flex-col items-center p-8 bg-linear-to-br from-secondary to-secondary/80 rounded-xl border border-border">
                  {loading ? (
                    <div className="w-80 h-80 bg-muted rounded-lg animate-pulse" />
                  ) : (
                    <>
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code"
                        width={320}
                        height={320}
                        className="w-80 h-80 p-4 bg-background rounded-lg shadow-md border border-border"
                      />
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        Aponte a câmera para acessar o quiz
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Link do Quiz
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={quizLink}
                      readOnly
                      className="bg-secondary border-border text-foreground"
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
          </div>

          <div className="space-y-6">
            <Card className="border-border shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Controles</CardTitle>
                <CardDescription>Gerenciar status do quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Status</p>
                  <Badge
                    variant={quizRunning ? "default" : "secondary"}
                    className="w-full justify-center py-1.5 text-sm"
                  >
                    {quizRunning ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Em andamento
                      </span>
                    ) : (
                      "Pausado"
                    )}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="lg" title="Abrir Quiz">
                        <DoorOpen className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Abrir Quiz</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="lg">
                        <Play className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Iniciar Quiz</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="lg">
                        <Pause className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Fechar Quiz</TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
