"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, LogOut, MoreVertical } from "lucide-react";
import { signOut } from "next-auth/react";
import { useGetAllQuizzes } from "../_hooks/useAdmin";

export default function AdminPage() {
  const router = useRouter();

  const { data } = useGetAllQuizzes();

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/auth",
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            className="ml-auto block"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sair</TooltipContent>
      </Tooltip>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Administração de Quizzes</CardTitle>

          <Button onClick={() => router.push("/auth/quiz/new")}>
            Criar Quiz
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data && data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Nenhum quiz criado ainda.
                  </TableCell>
                </TableRow>
              )}
              {data?.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/auth/quiz/${quiz.id}`)}
                >
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(quiz.id);
                          }}
                          variant="outline"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copiar código</TooltipContent>
                    </Tooltip>
                  </TableCell>

                  <TableCell
                    className="text-right space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/quiz/${quiz.id}`)
                            }
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />{" "}
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => console.log("Excluir", quiz.id)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
