import { Providers } from "./_components/providers";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
