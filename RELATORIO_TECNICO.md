# Relatório Técnico de Engenharia de Software
## Sistema: Portal Pedagógico e Tecnológico do Colégio Exemplar
**Versão:** 1.0.0  
**Autor:** AI Coding Agent (Google AI Studio)  
**Data:** 27 de Maio de 2026

---

## 1. Visão Geral do Sistema

O **Portal Pedagógico e Tecnológico do Colégio Exemplar** é uma plataforma acadêmica integrada voltada para a gestão de boletins informativos, controle de matrículas escolares e curadoria tecnológica de arquitetura de softwares. O sistema foi projetado para atender de forma simplificada a três públicos-alvo fundamentais:
- **Discentes e Responsáveis:** Consulta em tempo real aos boletins educacionais consolidados (notas bimestrais, frequências do ano letivo de 2026 e resultados de aproveitamento global) com download oficial do boletim em formato PDF corporativo.
- **Corpo Docente:** Registro de notas de componentes curriculares (Língua Portuguesa, Matemática, História), controle de faltas acumuladas por discente e consolidação de desempenho com cálculos automáticos estritos.
- **Coordenação Executiva e Administração:** Controle do painel geral de estudantes matriculados, criação rápida de novas matrículas, controle de comunicados oficiais por segmento e emissão automatizada do Projeto Pedagógico Institucional em formato Word DOCX.

Além dos módulos operacionais, a plataforma incorpora um **Portal do Desenvolvedor (Developer Hub)** contendo planos de arquitetura técnica multiplataforma para replicação imediata do ecossistema, abrangendo códigos de aplicativos móveis em Flutter Dart, microsserviços em Python FastAPI com pre-laudos em ReportLab, e modelagem relacional de banco de dados SQL para PostgreSQL.

---

## 2. Arquitetura do Software (Full-Stack)

O sistema foi estruturado adotando o padrão de microsserviços integrados de forma monolítica para o ambiente do contêiner, garantindo isolamento total na camada de dados e interfaces desacopladas:

```
[ FRONTEND React SPA (Vite) ] <────── (REQUISITIONS) ──────> [ BACKEND Express Server ]
              │                                                        │
              ├─ Painel Discente (StudentDashboard)                    ├─ Autenticação de Usuários / Sessão
              ├─ Lançador Docente (TeacherDashboard)                   ├─ Gerenciamento In-Memory de Notas
              ├─ Controle de Matrículas (AdminDashboard)               ├─ Gerador de Boletins em PDF
              ├─ Developer Code Explorer (DeveloperHub)                ├─ Gerador de Projeto em Word DOCX
              └─ Layout Responsivo Tailwind v4                         └─ Middleware Estático do Vite SPA
```

### 2.1. Frontend (Interface do Usuário com Micro-Segmentação)
*   **Vite + React (TypeScript):** Inicialização instantânea sem lentidão por compilação agressiva, empregando tipos e interfaces robustas (`src/types.ts`) de dados acadêmicos para assegurar integridade no código do cliente.
*   **Tailwind CSS (v4):** Estilização baseada em utilitários visuais modernos, aplicando variações sutis no contraste com uma paleta corporativa de cor azul marinho (`indigo-900`/`indigo-950`) e accents verdes de aprovação (`emerald-500`).
*   **Motion (Framer Motion):** Micro-interações nativas para transições suaves, efeitos hover em botões, carregamentos dinâmicos de dados e expansões de componentes.
*   **Lucide React:** Ícones elegantes integrados para todas as métricas, arquivos de download e categorias acadêmicas.

### 2.2. Backend (Servidor de Aplicação Integrado)
*   **Express (Node.js) em TypeScript (`tsx`):** Gerencia todas as APIs de consulta escolar, persistindo dados em memória (*In-Memory Database*) de forma reativa para testes imediatos.
*   **Vite Development Middleware:** Rodando em modo de middleware integrado em desenvolvimento. Toda a comunicação do cliente se direciona para a porta central `3000` de forma contígua, contornando gargalos de política CORS.

---

## 3. Estruturação do Armazenamento de Dados (In-Memory)

Para propiciar agilidade extrema, o portal implementa estruturas de dados em memória que emulam perfeitamente um banco relacional:

### 3.1. Coleções de Entidades Acadêmicas
- `usersDb`: Registro de credenciais com e-mail, senha digital e papéis regulamentados (`admin`, `teacher`, `student`). Facilita o logon imediato com segurança.
- `studentsDb`: Dados pessoais discentes contendo CPF, responsável financeiro, data de nascimento e identificador da turma.
- `classesDb`: Quadro de turmas integradas (ex: 3º Ano EM).
- `teachersDb` & `disciplinesDb`: Corpo acadêmico regente mapeado para cada disciplina correspondente.
- `noticesDb`: Comunicados institucionais com categorização (Geral, Pedagógico, Financeiro) e rastro de autor responsável.

### 3.2. Mecanismo de Consolidação de Notas e Cálculo Acadêmico
O cálculo das médias finais obedece a regras de avaliação ponderada em conformidade com as diretrizes educacionais:
*   **Avaliação 1 (Av1):** Peso de 40%
*   **Avaliação 2 (Av2):** Peso de 40%
*   **Projeto Semestral:** Peso de 20%
*   **Fórmula:** $\text{Nota Final} = (Av1 \times 0.4) + (Av2 \times 0.4) + (\text{Projeto} \times 0.2)$
*   Aprovação por componente é conferida mediante média igual ou superior a **7.0** e total de faltas inferior a **20 faltas** ao longo do ano corrente de 2026.

---

## 4. Geração Dinâmica de Documentos Corporativos (PDF & DOCX)

### 4.1. PDFKit - Boletim Oficial do Aluno (Server-Side)
A geração do documento PDF do boletim é executada no endpoint `/api/academic/student/:id/pdf` usando a biblioteca `pdfkit`. O relatório calcula e exibe coordenadas precisas das disciplinas, médias bimestrais, faltas e situação final de aprovação do ano. Possui cabeçalho customizado com a identidade visual do Colégio Exemplar.

### 4.2. DOCX Generator - Projeto Pedagógico (Office Open XML)
Na rota `/api/report/docx`, o microsserviço utiliza a biblioteca `docx` para formatar e empacotar um documento Word `.docx` profissional no padrão Office Open XML:
*   Criação de páginas de introdução com numeração dinâmica de páginas.
*   Tabelas customizadas com alinhamentos automáticos, cabeçalhos sombreados e bordas pontilhadas finas de altíssima fidelidade.
*   Parágrafos formatados com fontes estritamente configuradas (Segoe UI/Arial) para evitar quebras de layouts comuns fora de sistemas operacionais nativos.

---

## 5. Central de Códigos do Desenvolvedor (Developer Hub)

A aba de tecnologia fornece um repositório interativo com os pilares técnicos para replicar e escalar o ecossistema do Colégio Exemplar:
*   **Mobile Flutter Dart:** Componentes para visualização do boletim com gerenciamento de estado via Providers no app nativo para iOS e Android.
*   **Backend Python FastAPI:** APIs assíncronas com tratamento escalável de dados.
*   **PostgreSQL DDL Schema:** Criação e indexação rápida das tabelas do banco relacional de alunos, docentes e boletins oficiais.

---

## 6. Procedimentos de Implantação e Execução

### 6.1. Execução no Ambiente Local de Desenvolvimento
1. **Instalar Dependências:**
   ```bash
   npm install
   ```
2. **Rodar Dev Server (com Vite e tsx):**
   ```bash
   npm run dev
   ```
   *Nota: O servidor escuta obrigatoriamente na porta `3000` de forma unificada.*

### 6.2. Compilação para Produção
1. **Gerar builds otimizados:**
   ```bash
   npm run build
   ```
   *Este comando compila o frontend do React gerando páginas estáticas otimizadas dentro de `/dist`. O backend TypeScript é compilado simultaneamente em CommonJS via esbuild no destino `dist/server.cjs` com sourcemaps ativos.*
2. **Executar o App Compilado:**
   ```bash
   npm run start
   ```
