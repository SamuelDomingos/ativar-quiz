import { useQuery } from '@tanstack/react-query';
import { verificationQuiz } from '@/lib/api/userControl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useVerifyQuiz = (id: string) => {
  const router = useRouter();

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['quiz', 'verify', id],
    queryFn: () => verificationQuiz(id),
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    enabled: !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    if (!isLoading && data) {

      if (data.data?.status === 'PAUSED' || data.data?.status === 'FINISHED') {
        router.push('/');
      }

      if (!data.success) {
        router.push('/');
      }
    }
  }, [data?.data?.status, data?.success, isLoading, router]);

  return {
    data: data?.data || null,
    isLoading,
    isFetching,
    error: error?.message || data?.message || null,
    isAvailable: data?.success || false,
  };
};