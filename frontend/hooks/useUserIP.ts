import { useEffect, useState } from "react";

export const useUserIP = () => {
  const [ip, setIp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error("Erro ao buscar IP:", error);
        setIp(`user-${Math.random().toString(36).substring(7)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIP();
  }, []);

  return { ip, isLoading };
};
