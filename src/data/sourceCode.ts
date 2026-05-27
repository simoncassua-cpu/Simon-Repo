import { SourceFile } from "../types";

export const FLUTTER_FILES: SourceFile[] = [
  {
    title: "main.dart",
    path: "lib/main.dart",
    language: "dart",
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/student_provider.dart';
import 'screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ColegioExemplarApp());
}

class ColegioExemplarApp extends StatelessWidget {
  const ColegioExemplarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => StudentProvider()),
      ],
      child: MaterialApp(
        title: 'Colégio Exemplar',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.indigo,
            brightness: Brightness.light,
          ),
          fontFamily: 'Inter',
        ),
        home: const SplashScreen(),
      ),
    );
  }
}`
  },
  {
    title: "boletim_view.dart",
    path: "lib/screens/boletim_view.dart",
    language: "dart",
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/student_provider.dart';

class BoletimView extends StatelessWidget {
  const BoletimView({super.key});

  @override
  Widget build(BuildContext context) {
    final studentProv = Provider.of<StudentProvider>(context);
    final boletim = studentProv.boletim;

    if (studentProv.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Meu Boletim Acadêmico'),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: boletim.disciplinas.length,
        itemBuilder: (context, idx) {
          final disc = boletim.disciplinas[idx];
          return Card(
            elevation: 2,
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              title: Text(disc.nome, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('Professor: \${disc.professor} | Faltas: \${disc.faltas}'),
              trailing: CircleAvatar(
                backgroundColor: disc.mediaFinal >= 7.0 ? Colors.green : Colors.orange,
                child: Text(
                  disc.mediaFinal.toStringAsFixed(1),
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}`
  }
];

export const BACKEND_FILES: SourceFile[] = [
  {
    title: "main.py",
    path: "backend/app/main.py",
    language: "python",
    code: `from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database

app = FastAPI(title="Colégio Exemplar API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/academic/students", response_model=List[schemas.StudentOut])
def list_students(db: Session = Depends(database.get_db)):
    return db.query(models.Student).filter(models.Student.active == True).all()

@app.get("/api/academic/student/{student_id}/boletim")
def get_student_boletim(student_id: int, db: Session = Depends(database.get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    grades = db.query(models.GradeRecord).filter(models.GradeRecord.student_id == student_id).all()
    # Logic to format and aggregate boletim bimestres
    return {"student": student, "grades": grades}
`
  }
];

export const DB_SCHEMA: SourceFile[] = [
  {
    title: "schema.sql",
    path: "database/schema.sql",
    language: "sql",
    code: `-- Banco de Dados PostgreSQL - Colégio Exemplar

CREATE TABLE turmas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ano_letivo VARCHAR(4) NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    sala VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(250) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    data_nascimento DATE NOT NULL,
    turma_id INT REFERENCES turmas(id) ON DELETE SET NULL,
    nome_responsavel VARCHAR(250),
    contato_responsavel VARCHAR(150),
    situacao VARCHAR(20) DEFAULT 'Ativo'
);

CREATE TABLE professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(250) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    disciplina VARCHAR(100) NOT NULL,
    telefone VARCHAR(30)
);

CREATE TABLE lancamentos_notas (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES alunos(id) ON DELETE CASCADE,
    disciplina_id VARCHAR(50) NOT NULL,
    periodo VARCHAR(50) NOT NULL, -- Ex: 'Bimestre 1'
    nota_avaliadora_1 NUMERIC(4,2) DEFAULT 0.00,
    nota_avaliadora_2 NUMERIC(4,2) DEFAULT 0.00,
    nota_projeto NUMERIC(4,2) DEFAULT 0.00,
    nota_final NUMERIC(4,2) DEFAULT 0.00,
    total_faltas INT DEFAULT 0
);
`
  }
];

export const INSTRUCTIONS_MD: SourceFile[] = [
  {
    title: "GUIA_IMPLANTACAO.md",
    path: "docs/GUIA_IMPLANTACAO.md",
    language: "markdown",
    code: `# Portal Digital Colégio Exemplar — Guia de Implantação

Este documento detalha o processo de produção e implantação da aplicação completa para o **Colégio Exemplar**.

## Arquitetura Sugerida

1. **Frontend**: Aplicação React estruturada via TypeScript, estilizada com Tailwind CSS. Micro-animações e renderizadores com \`motion\` e \`lucide-react\` para máxima usabilidade.
2. **Backend**: Servidor Express com Node.js ou FastAPI em Python para gerenciar persistência, dados de matrículas e geração dinâmica de relatórios em PDF e Word (.docx).
3. **Persistência**: PostgreSQL recomendado para ambiente de produção devido ao controle rigoroso de chaves estrangeiras entre alunos, turmas, notas e boletins.

## Funcionalidades Principais do Portal

- **Ficha de Matrícula e Turmas**: Cadastro unificado de alunos com dados de responsáveis pedagógicos e de contato.
- **Lançamento de Notas**: Sistema decimal dinâmico para professores consolidarem notas avaliadoras e projetos por bimestre.
- **Relatório PDF**: Boletim Acadêmico Oficial estilizado pronto para download direto pelo responsável pedagógico.
- **Relatório Word (.docx)**: Projeto Pedagógico Institucional do Colégio estruturado via biblioteca \`docx\`.
`
  }
];
