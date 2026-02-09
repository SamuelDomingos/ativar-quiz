"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleProceed = () => {
    if (!code.trim()) return;
    router.push(`/quiz/${code}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">
            Acessar Quiz
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Digite o código do quiz"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleProceed}
            disabled={!code.trim()}
          >
            Prosseguir
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
