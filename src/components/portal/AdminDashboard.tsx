/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Download, Search, FileText, Trash2, Plus } from "lucide-react";
import { Aluno, Professor } from "../../types";

interface AdminDashboardProps {
  students: Aluno[];
  teachers: Professor[];
  filteredStudents: Aluno[];
  studentSearch: string;
  setStudentSearch: (val: string) => void;
  setSelectedStudentId: (id: string) => void;
  handleDeleteStudent: (id: string) => void;
  studentFormSuccess: boolean;
  studentForm: any;
  setStudentForm: React.Dispatch<React.SetStateAction<any>>;
  handleAddStudent: (e: React.FormEvent) => void;
  noticeFormSuccess: boolean;
  noticeForm: any;
  setNoticeForm: React.Dispatch<React.SetStateAction<any>>;
  handleNoticeSubmit: (e: React.FormEvent) => void;
}

export default function AdminDashboard({
  students,
  teachers,
  filteredStudents,
  studentSearch,
  setStudentSearch,
  setSelectedStudentId,
  handleDeleteStudent,
  studentFormSuccess,
  studentForm,
  setStudentForm,
  handleAddStudent,
  noticeFormSuccess,
  noticeForm,
  setNoticeForm,
  handleNoticeSubmit,
}: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Analytics Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md shadow-indigo-950/10 space-y-2">
          <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Matrículas Totais Ativas</p>
          <p className="text-3xl font-extrabold">{students.length} Estudantes</p>
          <p className="text-[10.5px] text-indigo-300">Unidade Geral Consolidada 2026</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-1.5">
          <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Corpo Docente Ativo</p>
          <p className="text-3xl font-extrabold text-slate-900">{teachers.length} Professores</p>
          <p className="text-[10.5px] text-slate-400">Total de 12 turmas integradas</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-1.5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Documentos do Colégio</p>
            <p className="text-sm font-bold text-slate-800 mt-1">Projeto Pedagógico & Regras 2026</p>
          </div>
          <a
            href="/api/report/docx"
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Baixar Manual Word (.docx)</span>
          </a>
        </div>
      </div>

      {/* Main section Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Manage Enrollments / Matrículas */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Painel de Controle de Matrículas ({students.length})
            </h3>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou matrícula..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-250 focus:border-indigo-550 rounded-xl text-xs transition outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-5 border-b border-slate-150 text-slate-800 font-bold">
                  <th className="py-2.5 px-3">MATRÍCULA / NOME</th>
                  <th className="py-2.5 px-3">E-MAIL DO ALUNO</th>
                  <th className="py-2.5 px-3">RESPONSÁVEL (CPF)</th>
                  <th className="py-2.5 px-3 text-center">TURMA</th>
                  <th className="py-2.5 px-3 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedStudentId(row.id)}>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-black">{row.matricula}</span>
                          <span>{row.nome}</span>
                        </p>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">{row.email}</td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-800">{row.nomeResponsavel}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{row.cpf}</p>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-indigo-750 bg-indigo-50 border border-indigo-100 uppercase">
                          3º Ano A
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/api/academic/student/${row.id}/pdf`}
                            title="Imprimir Boletim"
                            className="p-1 text-indigo-650 hover:text-indigo-900 hover:bg-slate-100 rounded transition"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteStudent(row.id)}
                            title="Excluir Matrícula"
                            className="p-1 text-red-500 hover:text-red-750 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center italic text-slate-400">Nenhum estudante localizado com estes termos de busca.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Matricular Novo Aluno Form */}
        <div className="space-y-6">
          
          {/* Add student form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Nova Matrícula Integrada
            </h3>

            <form onSubmit={handleAddStudent} className="space-y-3.5">
              {studentFormSuccess && (
                <div className="p-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
                  ✔ Aluno cadastrado e matriculado com sucesso!
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Nome do Aluno</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo do discente"
                  value={studentForm.nome}
                  onChange={e => setStudentForm((prev: any) => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">E-mail do Aluno</label>
                <input
                  type="email"
                  required
                  placeholder="ex: ricardo@exemplar.com"
                  value={studentForm.email}
                  onChange={e => setStudentForm((prev: any) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">CPF Aluno</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={studentForm.cpf}
                    onChange={e => setStudentForm((prev: any) => ({ ...prev, cpf: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Nascimento</label>
                  <input
                    type="date"
                    value={studentForm.dataNascimento}
                    onChange={e => setStudentForm((prev: any) => ({ ...prev, dataNascimento: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Nome do Responsável</label>
                <input
                  type="text"
                  placeholder="Responsável Financeiro"
                  value={studentForm.nomeResponsavel}
                  onChange={e => setStudentForm((prev: any) => ({ ...prev, nomeResponsavel: e.target.value }))}
                  className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">E-mail Responsável</label>
                <input
                  type="email"
                  placeholder="ex: pai@email.com"
                  value={studentForm.contatoResponsavel}
                  onChange={e => setStudentForm((prev: any) => ({ ...prev, contatoResponsavel: e.target.value }))}
                  className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Selecione a Turma Letiva</label>
                <select
                  value={studentForm.turmaId}
                  onChange={e => setStudentForm((prev: any) => ({ ...prev, turmaId: e.target.value }))}
                  className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none"
                >
                  <option value="turma-3a">3º Ano EM - Turma A (Matutino)</option>
                  <option value="turma-9b">9º Ano EF - Turma B (Vespertino)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5 shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Efetuar Matrícula e Gerar Contrato</span>
              </button>
            </form>
          </div>

          {/* Criar Comunicado Rastro */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Novo Comunicado Institucional
            </h3>

            <form onSubmit={handleNoticeSubmit} className="space-y-3.5">
              {noticeFormSuccess && (
                <div className="p-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
                  ✔ Comunicado publicado no mural!
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Título do Aviso</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Entrega dos boletins"
                  value={noticeForm.titulo}
                  onChange={e => setNoticeForm((prev: any) => ({ ...prev, titulo: e.target.value }))}
                  className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Conteúdo Detalhado</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva o comunicado oficial de forma clara..."
                  value={noticeForm.conteudo}
                  onChange={e => setNoticeForm((prev: any) => ({ ...prev, conteudo: e.target.value }))}
                  className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Destinatário</label>
                  <select
                    value={noticeForm.destinatario}
                    onChange={e => setNoticeForm((prev: any) => ({ ...prev, destinatario: e.target.value }))}
                    className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Alunos">Apenas Alunos</option>
                    <option value="Responsáveis">Apenas Pais</option>
                    <option value="Professores">Apenas Docentes</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Categoria</label>
                  <select
                    value={noticeForm.categoria}
                    onChange={e => setNoticeForm((prev: any) => ({ ...prev, categoria: e.target.value }))}
                    className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-250 rounded-xl text-xs outline-none"
                  >
                    <option value="Geral">Circular Geral</option>
                    <option value="Pedagógico">Pedagógico</option>
                    <option value="Financeiro">Financeiro / Administrativo</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-750 rounded-xl cursor-pointer transition"
              >
                Publicar no Mural Geral
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
