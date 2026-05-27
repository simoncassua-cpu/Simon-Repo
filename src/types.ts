/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Tipos de Escola para o Portal Colégio Exemplar

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "teacher" | "student" | "parent";
  avatar_url?: string;
  created_at: string;
}

export interface Aluno {
  id: string;
  matricula: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  turmaId: string;
  nomeResponsavel: string;
  contatoResponsavel: string;
  situacao: "Ativo" | "Trancado" | "Cancelado";
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
  disciplina: string;
  telefone: string;
  cargaHoraria: number;
}

export interface Turma {
  id: string;
  nome: string; // Ex: "3º ano A", "9º ano B"
  anoLetivo: string; // Ex: "2026"
  periodo: "Matutino" | "Vespertino" | "Noturno";
  sala: string;
}

export interface LancamentoNota {
  id: string;
  alunoId: string;
  disciplinaId: string;
  periodo: "Bimestre 1" | "Bimestre 2" | "Bimestre 3" | "Bimestre 4";
  notaAvaliadora1: number;
  notaAvaliadora2: number;
  notaProjeto: number;
  notaFinal: number;
  totalFaltas: number;
}

export interface Disciplina {
  id: string;
  nome: string; // Ex: "Matemática", "Física"
  professorId: string;
}

export interface BoletimCompleto {
  aluno: Aluno;
  turma: Turma;
  notasPorDisciplina: {
    disciplinaNome: string;
    professorNome: string;
    bimestres: {
      [key: string]: {
        n1: number;
        n2: number;
        proj: number;
        media: number;
        faltas: number;
      };
    };
    mediaFinalAno: number;
    faltasTotaisAno: number;
    resultado: "Aprovado" | "Recuperação" | "Reprovado";
  }[];
  mediaGeralFrequencia: number;
  statusResultadoFinal: "Aprovado" | "Em Recuperação" | "Reprovado";
}

export interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  data: string;
  destinatario: "Todos" | "Professores" | "Responsáveis" | "Alunos";
  autor: string;
  categoria: "Geral" | "Pedagógico" | "Financeiro" | "Evento";
}

export interface SourceFile {
  title: string;
  path: string;
  language: string;
  code: string;
}
