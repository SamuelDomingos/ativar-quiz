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
import { Copy, MoreVertical } from "lucide-react";

const quizzes = [
  { id: "abc123", title: "Quiz JavaScript", createdAt: "10/01/2026" },
  { id: "xyz456", title: "Quiz React", createdAt: "12/01/2026" },
];

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Administração de Quizzes</CardTitle>

          <Button onClick={() => router.push("/admin/quiz/new")}>
            Criar Quiz
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/quiz/${quiz.id}`)}
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
                  <TableCell>{quiz.createdAt}</TableCell>

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
