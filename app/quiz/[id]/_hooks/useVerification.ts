import { useQuery } from "@tanstack/react-query";
import { joinQuiz, verificationQuiz } from "@/lib/api/userControl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useUserIP } from "@/hooks/useUserIP";

export const useVerifyQuiz = (id: string) => {
  const router = useRouter();
  const { ip, isLoading: isLoadingIP } = useUserIP();

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["quiz", "verify", id],
    queryFn: () => verificationQuiz(id),
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    enabled: !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  const fetchOptions = useMemo(
    () => ({
      auto: false,
      defaultArgs: ip ? [id, ip] : [],
    }),
    [id, ip],
  );

  const {
    execute: executeJoin,
    data: joinData,
    isLoading: isJoining,
    error: joinError,
  } = useFetch(joinQuiz, fetchOptions);

  useEffect(() => {
    if (!isLoading && !isLoadingIP && data?.success && ip) {
      const status = data.data?.status;

      if (status === "WAITING" || status === "STARTED") {
        executeJoin(id, ip);
      }
    }
  }, [
    data?.success,
    data?.data?.status,
    isLoading,
    isLoadingIP,
    ip,
    id,
    executeJoin,
  ]);

  useEffect(() => {
    if (!isLoading && data) {
      const status = data.data?.status;

      if (status === "PAUSED" || status === "FINISHED" || !data.success) {
        router.push("/");
      }
    }
  }, [data?.data?.status, data?.success, isLoading, router]);

  return {
    data: data?.data || null,
    isLoading: isLoading || isLoadingIP || isJoining,
    isFetching,
    error: error?.message || data?.message || joinError || null,
    isAvailable: data?.success || false,
    joinData,
    userIP: ip,
  };
};
