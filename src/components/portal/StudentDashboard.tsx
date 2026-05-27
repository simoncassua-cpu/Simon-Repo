/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Download, FileText, Book, CheckCircle, RefreshCw } from "lucide-react";

interface StudentDashboardProps {
  loggedInUser: any;
  boletimLoading: boolean;
  studentBoletim: any;
  selectedStudentId: string;
}

export default function StudentDashboard({
  loggedInUser,
  boletimLoading,
  studentBoletim,
  selectedStudentId,
}: StudentDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-indigo-900">
        <div className="space-y-1.5 max-w-lg">
          <span className="px-3.5 py-1 text-[9px] font-bold text-indigo-200 bg-indigo-500/30 border border-indigo-500/20 rounded-full uppercase tracking-wider">
            Área do Discente • Boletim Corrente
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Olá, {loggedInUser.name}!
          </h2>
          <p className="text-indigo-200 text-xs leading-relaxed">
            Bem-vindo à sua central escolar de boletim informativo integrado. Veja abaixo suas notas oficiais consolidadas, total acadêmico de frequência e relatórios em PDF do ano corrente de 2026.
          </p>
        </div>

        {/* Actions for student */}
        {selectedStudentId && (
          <div className="flex flex-col gap-2">
            <a
              href={`/api/academic/student/${selectedStudentId}/pdf`}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-350 active:bg-emerald-400 rounded-xl shadow-lg shadow-emerald-400/20 transition flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Baixar Boletim Oficial (PDF)</span>
            </a>
            <a
              href="/api/report/docx"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-750 hover:bg-indigo-700 active:bg-indigo-750 border border-indigo-805 rounded-xl transition flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4 text-indigo-400" />
              <span>Projeto Pedagógico (DOCX)</span>
            </a>
          </div>
        )}
      </div>

      {/* Boletim Content Wrapper */}
      {boletimLoading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-2">
          <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800">Buscando notas do banco de dados...</p>
          <p className="text-xs text-slate-400">Consolidando bimestres e frequências discentes.</p>
        </div>
      ) : studentBoletim ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tabela de Notas */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Book className="h-4.5 w-4.5 text-indigo-650" />
                Quadro de Desempenho Escolar
              </h3>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {studentBoletim.turma?.nome}
              </span>
            </div>

            {/* Tabela Responsiva */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-450 border-b border-slate-100">
                    <th className="py-2.5 px-3 font-bold text-slate-800">DISCIPLINA / DOCENTE</th>
                    <th className="py-2.5 px-2 text-center font-bold text-slate-800">B1</th>
                    <th className="py-2.5 px-2 text-center font-bold text-slate-800">B2</th>
                    <th className="py-2.5 px-2 text-center font-bold text-slate-800">B3</th>
                    <th className="py-2.5 px-2 text-center font-bold text-slate-800">B4</th>
                    <th className="py-2.5 px-3 text-center font-bold text-slate-800">MÉDIA</th>
                    <th className="py-2.5 px-2 text-center font-bold text-slate-800">FALTAS</th>
                    <th className="py-2.5 px-3 text-right font-bold text-slate-800">SITUAÇÃO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-105">
                  {studentBoletim.notasPorDisciplina.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-indigo-50/20 transition">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900">{row.disciplinaNome}</p>
                        <p className="text-[10px] text-slate-400">{row.professorNome}</p>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-slate-800">{row.bimestres["Bimestre 1"].media ? row.bimestres["Bimestre 1"].media.toFixed(1) : "-"}</td>
                      <td className="py-3 px-2 text-center font-bold text-slate-800">{row.bimestres["Bimestre 2"].media ? row.bimestres["Bimestre 2"].media.toFixed(1) : "-"}</td>
                      <td className="py-3 px-2 text-center font-bold text-slate-800">{row.bimestres["Bimestre 3"].media ? row.bimestres["Bimestre 3"].media.toFixed(1) : "-"}</td>
                      <td className="py-3 px-2 text-center font-bold text-slate-800">{row.bimestres["Bimestre 4"].media ? row.bimestres["Bimestre 4"].media.toFixed(1) : "-"}</td>
                      <td className={`py-3 px-3 text-center font-extrabold ${row.mediaFinalAno >= 7 ? "text-emerald-600" : row.mediaFinalAno >= 5 ? "text-amber-600" : "text-red-500"}`}>{row.mediaFinalAno ? row.mediaFinalAno.toFixed(1) : "-"}</td>
                      <td className="py-3 px-2 text-center text-slate-700">{row.faltasTotaisAno}</td>
                      <td className="py-3 px-3 text-right font-bold">
                        <span className={`px-2 py-0.5 rounded text-[9px] ${
                          row.resultado === "Aprovado" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : row.resultado === "Recuperação" 
                            ? "bg-amber-100 text-amber-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {row.resultado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Resumos com Gráfico e Conclusão */}
          <div className="space-y-6">
            
            {/* Resumo Boletim card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider border-b border-slate-100 pb-2">
                <CheckCircle className="h-4.5 w-4.5 text-indigo-500" />
                Resultado de Aproveitamento
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-5 w-full p-4 rounded-2xl border border-slate-150 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">Média Geral</span>
                  <span className="text-3xl font-extrabold text-indigo-750 block mt-1">{studentBoletim.mediaGeralFrequencia}</span>
                </div>
                <div className="bg-slate-5 w-full p-4 rounded-2xl border border-slate-150 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">Total Faltas</span>
                  <span className="text-3xl font-extrabold text-slate-800 block mt-1">{studentBoletim.totalFaltasAcumuladas}</span>
                </div>
              </div>

              {/* Status Bar */}
              <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-2xl space-y-1 text-center">
                <span className="text-[10px] font-bold text-indigo-800 tracking-wider block uppercase">Aproveitamento Global</span>
                <span className={`text-sm font-extrabold block ${
                  studentBoletim.statusResultadoFinal === "Aprovado" 
                    ? "text-emerald-600" 
                    : studentBoletim.statusResultadoFinal === "Em Recuperação" 
                    ? "text-amber-500" 
                    : "text-red-500"
                }`}>
                  {studentBoletim.statusResultadoFinal.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 text-[10.5px] text-slate-500 leading-normal">
                <p>
                  • A média geral de aprovação é de no mínimo <strong>7.0</strong> por disciplina.
                </p>
                <p>
                  • O limite regulamentar permitido de faltas é de <strong>20 faltas individuais</strong> no acumulado do ano letivo de 2026.
                </p>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-sm font-semibold">
          Boletim não localizado.
        </div>
      )}
    </div>
  );
}
