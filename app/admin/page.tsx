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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                  <TableCell>{quiz.id}</TableCell>
                  <TableCell>{quiz.createdAt}</TableCell>

                  <TableCell
                    className="text-right space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/quiz/${quiz.id}`)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => console.log("Excluir", quiz.id)}
                    >
                      Excluir
                    </Button>
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
