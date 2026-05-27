/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { School, Download } from "lucide-react";
import { Aluno } from "../../types";

interface TeacherDashboardProps {
  students: Aluno[];
  gradeForm: any;
  setGradeForm: React.Dispatch<React.SetStateAction<any>>;
  setSelectedStudentId: (id: string) => void;
  gradeFormSuccess: boolean;
  handleGradeSubmit: (e: React.FormEvent) => void;
  selectedStudentId: string;
  studentBoletim: any;
}

export default function TeacherDashboard({
  students,
  gradeForm,
  setGradeForm,
  setSelectedStudentId,
  gradeFormSuccess,
  handleGradeSubmit,
  selectedStudentId,
  studentBoletim,
}: TeacherDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Banner Docente */}
      <div className="bg-indigo-950 text-white rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <span className="px-3.5 py-1 text-[9px] font-bold text-indigo-200 bg-indigo-500/20 border border-indigo-500/20 rounded-full uppercase tracking-wider">
            Perfil Docente • Ativo
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">Área do Professor</h2>
          <p className="text-indigo-200 text-xs">
            Registre notas, controle faltas discentes e contribua para o Mural Institucional de forma unificada.
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold">Disciplina Regente:</p>
          <p className="p-1 px-3 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[10px] uppercase mt-1 tracking-wider">
            Língua Portuguesa
          </p>
        </div>
      </div>

      {/* Form Lançamento Nota + Quadro alunos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulário de lançamento (API integrada) */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
            Lançar Rendimento/Presença
          </h3>

          <form onSubmit={handleGradeSubmit} className="space-y-3.5">
            {gradeFormSuccess && (
              <div className="p-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
                ✔ Notas consolidadas com êxito!
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Selecione o Aluno</label>
              <select
                value={gradeForm.alunoId}
                onChange={e => {
                  setGradeForm((prev: any) => ({ ...prev, alunoId: e.target.value }));
                  setSelectedStudentId(e.target.value);
                }}
                className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 focus:border-indigo-500 rounded-xl text-xs transition outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.nome} ({s.matricula})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Matéria / Componente</label>
              <select
                value={gradeForm.disciplinaId}
                onChange={e => setGradeForm((prev: any) => ({ ...prev, disciplinaId: e.target.value }))}
                className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 focus:border-indigo-500 rounded-xl text-xs transition outline-none"
              >
                <option value="disc-pt">Língua Portuguesa</option>
                <option value="disc-mat">Matemática</option>
                <option value="disc-hist">História</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Período Letivo</label>
              <select
                value={gradeForm.periodo}
                onChange={e => setGradeForm((prev: any) => ({ ...prev, periodo: e.target.value }))}
                className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 focus:border-indigo-500 rounded-xl text-xs transition outline-none"
              >
                <option value="Bimestre 1">1º Bimestre</option>
                <option value="Bimestre 2">2º Bimestre</option>
                <option value="Bimestre 3">3º Bimestre</option>
                <option value="Bimestre 4">4º Bimestre</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-600">Avaliação 1 (40%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={gradeForm.notaAvaliadora1}
                  onChange={e => setGradeForm((prev: any) => ({ ...prev, notaAvaliadora1: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-600">Avaliação 2 (40%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={gradeForm.notaAvaliadora2}
                  onChange={e => setGradeForm((prev: any) => ({ ...prev, notaAvaliadora2: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-600">Nota Projeto (20%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={gradeForm.notaProjeto}
                  onChange={e => setGradeForm((prev: any) => ({ ...prev, notaProjeto: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-600">Total Faltas</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={gradeForm.totalFaltas}
                  onChange={e => setGradeForm((prev: any) => ({ ...prev, totalFaltas: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer transition shadow-md shadow-indigo-600/10"
            >
              Consolidar Notas Letivas
            </button>
          </form>
        </div>

        {/* Visualização de Boletim Selecionado em Tempo Real */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-indigo-900 flex items-center gap-1">
              <School className="h-4.5 w-4.5" />
              <span>Visualização Acadêmica Rápida</span>
            </h3>
            {selectedStudentId && (
              <a
                href={`/api/academic/student/${selectedStudentId}/pdf`}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-450 hover:bg-emerald-400 active:bg-emerald-455 rounded-lg flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                <span>PDF</span>
              </a>
            )}
          </div>

          {studentBoletim ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-5 border border-slate-200 rounded-2xl flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">ALUNO(A) SELECIONADO(A):</p>
                  <p className="text-sm font-bold text-slate-950">{studentBoletim.aluno?.nome}</p>
                  <p className="text-[10.5px] text-slate-500">Matrícula: {studentBoletim.aluno?.matricula}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-semibold">MÉDIA GERAL DO PORTAL:</p>
                  <p className="text-lg font-extrabold text-indigo-700">{studentBoletim.mediaGeralFrequencia}</p>
                  <span className="text-[9.5px] px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold uppercase">{studentBoletim.statusResultadoFinal}</span>
                </div>
              </div>

              {/* Quadros simplificados de bimestres por matéria */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead>
                    <tr className="bg-slate-5 border-b border-slate-150">
                      <th className="py-2.5 px-3">COMPONENTE</th>
                      <th className="py-2.5 px-2 text-center">B1</th>
                      <th className="py-2.5 px-2 text-center">B2</th>
                      <th className="py-2.5 px-2 text-center">B3</th>
                      <th className="py-2.5 px-2 text-center">B4</th>
                      <th className="py-2.5 px-3 text-center">MÉDIA</th>
                      <th className="py-2.5 px-2 text-center">FALTAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentBoletim.notasPorDisciplina.map((r: any, i: number) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{r.disciplinaNome}</td>
                        <td className="py-2.5 px-2 text-center">{r.bimestres["Bimestre 1"].media || "-"}</td>
                        <td className="py-2.5 px-2 text-center">{r.bimestres["Bimestre 2"].media || "-"}</td>
                        <td className="py-2.5 px-2 text-center">{r.bimestres["Bimestre 3"].media || "-"}</td>
                        <td className="py-2.5 px-2 text-center">{r.bimestres["Bimestre 4"].media || "-"}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-indigo-700">{r.mediaFinalAno}</td>
                        <td className="py-2.5 px-2 text-center">{r.faltasTotaisAno}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-450 italic p-6 text-center">Selecione um aluno na coluna esquerda para conferir o boletim dinâmico.</p>
          )}

        </div>

      </div>
    </div>
  );
}
