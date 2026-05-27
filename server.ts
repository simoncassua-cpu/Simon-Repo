import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import PDFDocument from "pdfkit";
import { Packer } from "docx";
import { generateTechnicalReportDocx } from "./src/utils/docxReport";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ========================== MOCK DATABASE ESCOLAR ==========================

const usersDb: any[] = [
  {
    id: "user-admin",
    name: "Coord. Gabriel Silva",
    email: "simoncassua@gmail.com",
    phone: "+55 (11) 98888-7777",
    password: "123",
    role: "admin",
    created_at: new Date().toISOString()
  },
  {
    id: "user-teacher",
    name: "Prof. Marcos Oliveira",
    email: "professor@exemplar.com",
    phone: "+55 (11) 97777-6666",
    password: "123",
    role: "teacher",
    created_at: new Date().toISOString()
  },
  {
    id: "user-student",
    name: "Ricardo Cassua",
    email: "aluno@exemplar.com",
    phone: "+55 (11) 96666-5555",
    password: "123",
    role: "student",
    created_at: new Date().toISOString()
  }
];

const classesDb: any[] = [
  { id: "turma-3a", nome: "3º Ano EM - Turma A", anoLetivo: "2026", periodo: "Matutino", sala: "Sala 204" },
  { id: "turma-9b", nome: "9º Ano EF - Turma B", anoLetivo: "2026", periodo: "Vespertino", sala: "Sala 105" }
];

const studentsDb: any[] = [
  {
    id: "aluno-1",
    matricula: "MAT-202601",
    nome: "Ricardo Cassua",
    email: "aluno@exemplar.com",
    cpf: "123.456.789-00",
    dataNascimento: "2008-05-14",
    turmaId: "turma-3a",
    nomeResponsavel: "Simon Cassua",
    contatoResponsavel: "simoncassua@gmail.com",
    situacao: "Ativo"
  },
  {
    id: "aluno-2",
    matricula: "MAT-202602",
    nome: "Ana Beatriz Souza",
    email: "anabeatriz@exemplar.com",
    cpf: "234.567.890-11",
    dataNascimento: "2009-11-20",
    turmaId: "turma-3a",
    nomeResponsavel: "Carla Souza",
    contatoResponsavel: "carla.souza@gmail.com",
    situacao: "Ativo"
  },
  {
    id: "aluno-3",
    matricula: "MAT-202603",
    nome: "Guilherme Santos",
    email: "guilherme.santos@gmail.com",
    cpf: "345.678.901-22",
    dataNascimento: "2008-02-28",
    turmaId: "turma-3a",
    nomeResponsavel: "Jose Santos",
    contatoResponsavel: "jose.santos@gmail.com",
    situacao: "Ativo"
  }
];

const teachersDb: any[] = [
  { id: "prof-1", nome: "Prof. Marcos Oliveira", email: "professor@exemplar.com", disciplina: "Língua Portuguesa", telefone: "+55 (11) 91111-1111", cargaHoraria: 40 },
  { id: "prof-2", nome: "Prof. Eliane Costa", email: "eliane.costa@exemplar.com", disciplina: "Matemática", telefone: "+55 (11) 92222-2222", cargaHoraria: 32 },
  { id: "prof-3", nome: "Prof. Roberto Mendes", email: "roberto.mendes@exemplar.com", disciplina: "História", telefone: "+55 (11) 93333-3333", cargaHoraria: 24 }
];

const disciplinesDb: any[] = [
  { id: "disc-pt", nome: "Língua Portuguesa", professorId: "prof-1" },
  { id: "disc-mat", nome: "Matemática", professorId: "prof-2" },
  { id: "disc-hist", nome: "História", professorId: "prof-3" },
  { id: "disc-fis", nome: "Física", professorId: "prof-2" }
];

// Lançamento de notas simuladas
let gradeRecordsDb: any[] = [
  { id: "nota-1", alunoId: "aluno-1", disciplinaId: "disc-pt", periodo: "Bimestre 1", notaAvaliadora1: 8.5, notaAvaliadora2: 9.0, notaProjeto: 9.5, notaFinal: 9.0, totalFaltas: 2 },
  { id: "nota-2", alunoId: "aluno-1", disciplinaId: "disc-pt", periodo: "Bimestre 2", notaAvaliadora1: 7.0, notaAvaliadora2: 8.0, notaProjeto: 9.0, notaFinal: 8.0, totalFaltas: 3 },
  { id: "nota-3", alunoId: "aluno-1", disciplinaId: "disc-pt", periodo: "Bimestre 3", notaAvaliadora1: 9.0, notaAvaliadora2: 8.5, notaProjeto: 10.0, notaFinal: 9.1, totalFaltas: 1 },
  { id: "nota-4", alunoId: "aluno-1", disciplinaId: "disc-pt", periodo: "Bimestre 4", notaAvaliadora1: 8.0, notaAvaliadora2: 9.0, notaProjeto: 9.5, notaFinal: 8.8, totalFaltas: 0 },
  
  { id: "nota-5", alunoId: "aluno-1", disciplinaId: "disc-mat", periodo: "Bimestre 1", notaAvaliadora1: 9.5, notaAvaliadora2: 10.0, notaProjeto: 9.0, notaFinal: 9.6, totalFaltas: 4 },
  { id: "nota-6", alunoId: "aluno-1", disciplinaId: "disc-mat", periodo: "Bimestre 2", notaAvaliadora1: 6.5, notaAvaliadora2: 8.0, notaProjeto: 8.5, notaFinal: 7.7, totalFaltas: 2 },
  { id: "nota-7", alunoId: "aluno-1", disciplinaId: "disc-mat", periodo: "Bimestre 3", notaAvaliadora1: 8.0, notaAvaliadora2: 8.0, notaProjeto: 9.0, notaFinal: 8.3, totalFaltas: 1 },
  { id: "nota-8", alunoId: "aluno-1", disciplinaId: "disc-mat", periodo: "Bimestre 4", notaAvaliadora1: 9.0, notaAvaliadora2: 9.5, notaProjeto: 9.5, notaFinal: 9.3, totalFaltas: 0 },

  { id: "nota-9", alunoId: "aluno-1", disciplinaId: "disc-hist", periodo: "Bimestre 1", notaAvaliadora1: 7.0, notaAvaliadora2: 7.5, notaProjeto: 8.0, notaFinal: 7.5, totalFaltas: 0 },
  { id: "nota-10", alunoId: "aluno-1", disciplinaId: "disc-hist", periodo: "Bimestre 2", notaAvaliadora1: 8.5, notaAvaliadora2: 9.0, notaProjeto: 9.0, notaFinal: 8.8, totalFaltas: 1 },
  { id: "nota-11", alunoId: "aluno-1", disciplinaId: "disc-hist", periodo: "Bimestre 3", notaAvaliadora1: 6.0, notaAvaliadora2: 7.0, notaProjeto: 8.0, notaFinal: 7.0, totalFaltas: 2 },
  { id: "nota-12", alunoId: "aluno-1", disciplinaId: "disc-hist", periodo: "Bimestre 4", notaAvaliadora1: 9.0, notaAvaliadora2: 8.5, notaProjeto: 9.5, notaFinal: 9.0, totalFaltas: 1 },

  { id: "nota-13", alunoId: "aluno-2", disciplinaId: "disc-pt", periodo: "Bimestre 1", notaAvaliadora1: 6.0, notaAvaliadora2: 7.0, notaProjeto: 7.5, notaFinal: 6.8, totalFaltas: 3 },
  { id: "nota-14", alunoId: "aluno-2", disciplinaId: "disc-mat", periodo: "Bimestre 1", notaAvaliadora1: 5.5, notaAvaliadora2: 6.0, notaProjeto: 7.0, notaFinal: 6.1, totalFaltas: 5 },
  { id: "nota-15", alunoId: "aluno-3", disciplinaId: "disc-pt", periodo: "Bimestre 1", notaAvaliadora1: 9.0, notaAvaliadora2: 9.5, notaProjeto: 10.0, notaFinal: 9.5, totalFaltas: 1 },
  { id: "nota-16", alunoId: "aluno-3", disciplinaId: "disc-mat", periodo: "Bimestre 1", notaAvaliadora1: 4.0, notaAvaliadora2: 4.5, notaProjeto: 6.0, notaFinal: 4.8, totalFaltas: 6 }
];

const noticesDb: any[] = [
  {
    id: "not-1",
    titulo: "Inscrições Abertas para a Olimpíada de Programação",
    conteudo: "Estão abertas as inscrições para a 5ª Olimpíada de Programação e Tecnologia do Colégio Exemplar. Podem participar alunos do 9º ano EF ao 3º ano EM. Prêmios incluem tablets e bolsas de estudos adicionais.",
    data: "2026-05-20T08:00:00Z",
    destinatario: "Alunos",
    autor: "Coord. Gabriel Silva",
    categoria: "Pedagógico"
  },
  {
    id: "not-2",
    titulo: "Reunião de Pais e Mestres do 2º Bimestre",
    conteudo: "Prezados de responsabilidade, convidamos para a nossa Reunião de Planejamento e Entrega de Notas do 2º Bimestre, que será realizada no Auditório Principal no dia 30/05, às 19h00.",
    data: "2026-05-24T14:30:00Z",
    destinatario: "Responsáveis",
    autor: "Direção Pedagógica",
    categoria: "Geral"
  },
  {
    id: "not-3",
    titulo: "Lançamento do Novo Portal Digital Escolar",
    conteudo: "Sejam bem-vindos ao novo Portal Digital do Colégio Exemplar! Uma solução tecnológica integrada e veloz desenvolvida para facilitar o fluxo acadêmico e visualização de notas em tempo real.",
    data: "2026-05-27T10:00:00Z",
    destinatario: "Todos",
    autor: "Coord. de Tecnologia",
    categoria: "Geral"
  }
];

// Helper para compilar boletim completo estrutural
function getBoletimCompleto(alunoId: string) {
  const aluno = studentsDb.find(a => a.id === alunoId);
  if (!aluno) return null;
  const turma = classesDb.find(t => t.id === aluno.turmaId);

  const list: any[] = [];
  let gpaSoma = 0;
  let totalAnualFaltas = 0;

  for (const disc of disciplinesDb) {
    const prof = teachersDb.find(p => p.id === disc.professorId);
    const bimestres: any = {};
    const notasDisc = gradeRecordsDb.filter(g => g.alunoId === alunoId && g.disciplinaId === disc.id);

    let somaMedias = 0;
    let totalFaltasDisc = 0;
    const bimestresNomes = ["Bimestre 1", "Bimestre 2", "Bimestre 3", "Bimestre 4"];

    for (const b of bimestresNomes) {
      const g = notasDisc.find(item => item.periodo === b);
      if (g) {
        bimestres[b] = {
          n1: g.notaAvaliadora1,
          n2: g.notaAvaliadora2,
          proj: g.notaProjeto,
          media: g.notaFinal,
          faltas: g.totalFaltas
        };
        somaMedias += g.notaFinal;
        totalFaltasDisc += g.totalFaltas;
      } else {
        bimestres[b] = { n1: 0, n2: 0, proj: 0, media: 0, faltas: 0 };
      }
    }

    const mFinal = notasDisc.length > 0 ? parseFloat((somaMedias / notasDisc.length).toFixed(1)) : 0;
    gpaSoma += mFinal;
    totalAnualFaltas += totalFaltasDisc;

    list.push({
      disciplinaNome: disc.nome,
      professorNome: prof ? prof.nome : "A Designar",
      bimestres,
      mediaFinalAno: mFinal,
      faltasTotaisAno: totalFaltasDisc,
      resultado: mFinal >= 7.0 ? "Aprovado" : mFinal >= 5.0 ? "Recuperação" : "Reprovado"
    });
  }

  const mediaGeral = list.length > 0 ? parseFloat((gpaSoma / list.length).toFixed(1)) : 0;
  const statusGeral = mediaGeral >= 7.0 && totalAnualFaltas <= 20 ? "Aprovado" : mediaGeral >= 5.0 ? "Em Recuperação" : "Reprovado";

  return {
    aluno,
    turma,
    notasPorDisciplina: list,
    mediaGeralFrequencia: mediaGeral,
    statusResultadoFinal: statusGeral,
    totalFaltasAcumuladas: totalAnualFaltas
  };
}

// ========================== API ROUTES ==========================

// Auth - Register
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
  }

  const existing = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "Este e-mail já está cadastrado." });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone: phone || "",
    password,
    role: role || "student",
    created_at: new Date().toISOString()
  };

  usersDb.push(newUser);
  res.status(201).json({
    message: "Cadastro efetuado com sucesso!",
    user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role }
  });
});

// Auth - Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são necessários." });
  }

  const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Credenciais de acesso incorretas." });
  }

  res.json({
    message: "Autenticação bem-sucedida!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

// Academic - Core data lists
app.get("/api/academic/students", (req, res) => {
  res.json(studentsDb);
});

app.get("/api/academic/student/:id/boletim", (req, res) => {
  const data = getBoletimCompleto(req.params.id);
  if (!data) return res.status(404).json({ error: "Boletim acadêmico do aluno não localizado." });
  res.json(data);
});

app.get("/api/academic/teachers", (req, res) => {
  res.json(teachersDb);
});

app.get("/api/academic/classes", (req, res) => {
  res.json(classesDb);
});

app.get("/api/academic/notices", (req, res) => {
  res.json(noticesDb);
});

// Lançar ou Atualizar Nota (Professor/Admin)
app.post("/api/academic/grades/submit", (req, res) => {
  const { alunoId, disciplinaId, periodo, notaAvaliadora1, notaAvaliadora2, notaProjeto, totalFaltas } = req.body;
  
  if (!alunoId || !disciplinaId || !periodo) {
    return res.status(400).json({ error: "Parâmetros obrigatórios incompletos." });
  }

  const n1 = parseFloat(notaAvaliadora1) || 0;
  const n2 = parseFloat(notaAvaliadora2) || 0;
  const proj = parseFloat(notaProjeto) || 0;
  const media = parseFloat(((n1 * 0.4) + (n2 * 0.4) + (proj * 0.2)).toFixed(1));

  // Verificar se lançamento já existe para atualizar, senão criar
  const idx = gradeRecordsDb.findIndex(
    g => g.alunoId === alunoId && g.disciplinaId === disciplinaId && g.periodo === periodo
  );

  if (idx !== -1) {
    gradeRecordsDb[idx] = {
      ...gradeRecordsDb[idx],
      notaAvaliadora1: n1,
      notaAvaliadora2: n2,
      notaProjeto: proj,
      notaFinal: media,
      totalFaltas: parseInt(totalFaltas) || 0
    };
  } else {
    gradeRecordsDb.push({
      id: `nota-${Date.now()}`,
      alunoId,
      disciplinaId,
      periodo,
      notaAvaliadora1: n1,
      notaAvaliadora2: n2,
      notaProjeto: proj,
      notaFinal: media,
      totalFaltas: parseInt(totalFaltas) || 0
    });
  }

  res.json({ message: "Notas e frequência consolidadas com sucesso." });
});

// Criar Comunicado
app.post("/api/academic/notices", (req, res) => {
  const { titulo, conteudo, destinatario, autor, categoria } = req.body;
  if (!titulo || !conteudo) {
    return res.status(400).json({ error: "Título e Conteúdo do comunicado são compulsórios." });
  }

  const newNotice = {
    id: `not-${Date.now()}`,
    titulo,
    conteudo,
    data: new Date().toISOString(),
    destinatario: destinatario || "Todos",
    autor: autor || "Sistema Escolar",
    categoria: categoria || "Geral"
  };

  noticesDb.unshift(newNotice);
  res.status(201).json(newNotice);
});

// Criar Aluno (Admin)
app.post("/api/academic/students", (req, res) => {
  const { nome, email, cpf, dataNascimento, turmaId, nomeResponsavel, contatoResponsavel } = req.body;
  
  if (!nome || !email || !turmaId) {
    return res.status(400).json({ error: "Nome, e-mail e turma do aluno são obrigatórios." });
  }

  const newStudent = {
    id: `aluno-${Date.now()}`,
    matricula: `MAT-2026${String(studentsDb.length + 1).padStart(2, "0")}`,
    nome,
    email,
    cpf: cpf || "---.---.----00",
    dataNascimento: dataNascimento || "2008-01-01",
    turmaId,
    nomeResponsavel: nomeResponsavel || "Não Cadastrado",
    contatoResponsavel: contatoResponsavel || email,
    situacao: "Ativo"
  };

  studentsDb.push(newStudent);
  res.status(201).json(newStudent);
});

// Excluir Aluno (Admin)
app.delete("/api/academic/student/:id", (req, res) => {
  const idx = studentsDb.findIndex(a => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Estudante não localizado para exclusão." });
  }
  
  studentsDb.splice(idx, 1);
  gradeRecordsDb = gradeRecordsDb.filter(g => g.alunoId !== req.params.id);
  res.json({ message: "Matrícula do estudante desativada de forma integral." });
});

// ========================== COMPATIBILITY ENDPOINTS ==========================
// Reta de fallback de análise (reused to handle uploads if any old components call it)
app.post("/api/analysis/create", (req, res) => {
  res.json({ id: "analysis-simulated", score: 100 });
});

app.get("/api/analysis/list", (req, res) => {
  // Convert standard elements to analysis records for historical page compatibility
  const compat = studentsDb.map(student => {
    const b = getBoletimCompleto(student.id);
    return {
      id: student.id,
      user_id: "user-admin",
      image_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80",
      latitude: -23.5505,
      longitude: -46.6333,
      score: b ? Math.round(b.mediaGeralFrequencia * 10) : 80,
      classification: b && b.mediaGeralFrequencia >= 7.0 ? "Alta" : "Moderada",
      slope: "Plano",
      soil_type: student.nome,
      soil_firmness: "Firme",
      erosion: "Ausente",
      water_accumulation: "Sem Água",
      vegetation: student.matricula,
      obstacles: student.matricula,
      accessibility: student.situacao,
      created_at: new Date().toISOString()
    };
  });
  res.json(compat);
});

app.delete("/api/analysis/:id", (req, res) => {
  const idx = studentsDb.findIndex(a => a.id === req.params.id);
  if (idx !== -1) {
    studentsDb.splice(idx, 1);
  }
  res.json({ message: "Excluído." });
});

// PDF bulletin rendering endpoint
app.get("/api/analysis/:id/pdf", (req, res) => {
  renderStudentBulletinPDF(req, res);
});

app.get("/api/academic/student/:id/pdf", (req, res) => {
  renderStudentBulletinPDF(req, res);
});

function renderStudentBulletinPDF(req: any, res: any) {
  const { id } = req.params;
  const data = getBoletimCompleto(id);
  if (!data) {
    return res.status(404).send("Boletim escolar não encontrado para o ID fornecido.");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=Boletim_Colégio_Exemplar_${id}.pdf`);

  const doc = new PDFDocument({ margin: 45, size: "A4" });
  doc.pipe(res);

  // Fundo do cabeçalho oficial (Azul Marinho)
  doc.rect(0, 0, 595.28, 95).fill("#1e3a8a");

  // Logo da Escola "CE"
  doc.fillColor("#10b981").rect(35, 30, 36, 36).fill();
  doc.fillColor("#ffffff").fontSize(15).font("Helvetica-Bold").text("CE", 35, 41, { width: 36, align: "center" });

  doc.fillColor("#ffffff").fontSize(18).font("Helvetica-Bold").text("COLÉGIO EXEMPLAR", 85, 33);
  doc.fillColor("#93c5fd").fontSize(8.5).font("Helvetica").text("COORDENAÇÃO PEDAGÓGICA • SISTEMA DE GESTÃO ESCOLAR INTEGRADO", 85, 54);

  // Metadados do Lauto
  doc.fillColor("#bfdbfe").fontSize(7.5).text(`EMISSÃO DIÁRIA: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 380, 32, { align: "right", width: 180 });
  doc.text(`REGISTRO MATRÍCULA: ${data.aluno.matricula}`, 380, 44, { align: "right", width: 180 });
  doc.text(`ANO LETIVO: 2026 • PORTAL DO ALUNO`, 380, 56, { align: "right", width: 180 });

  doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(45, 115).lineTo(550, 115).stroke();

  // Seção 1: DADOS CADASTRAIS DO ALUNO
  doc.y = 125;
  doc.fillColor("#1e3a8a").fontSize(11).font("Helvetica-Bold").text("1. DADOS DE IDENTIFICAÇÃO E MATRÍCULA DO DISCENTE", 45);

  const cardY = doc.y + 6;
  doc.roundedRect(45, cardY, 505, 54, 6).fillAndStroke("#f8fafc", "#e2e8f0");
  
  doc.fillColor("#475569").fontSize(8).font("Helvetica-Bold").text("ALUNO(A):", 55, cardY + 10);
  doc.fillColor("#0f172a").fontSize(9.5).font("Helvetica").text(data.aluno.nome, 110, cardY + 9);

  doc.fillColor("#475569").fontSize(8).font("Helvetica-Bold").text("E-MAIL DISCENTE:", 55, cardY + 24);
  doc.fillColor("#0f172a").fontSize(8.5).font("Helvetica").text(data.aluno.email, 150, cardY + 23);

  doc.fillColor("#475569").fontSize(8).font("Helvetica-Bold").text("TURMA REGISTRADA:", 55, cardY + 38);
  doc.fillColor("#10b981").fontSize(9).font("Helvetica-Bold").text(`${data.turma.nome} (${data.turma.periodo}) - ${data.turma.sala}`, 160, cardY + 37);

  // Seção de Status e Notas Médias
  doc.fillColor("#475569").fontSize(8).font("Helvetica-Bold").text("RESPONSÁVEL:", 295, cardY + 10);
  doc.fillColor("#0f172a").fontSize(8.5).font("Helvetica").text(data.aluno.nomeResponsavel, 375, cardY + 9);

  doc.fillColor("#475569").fontSize(8).font("Helvetica-Bold").text("CONTATO RESP.:", 295, cardY + 24);
  doc.fillColor("#0f172a").fontSize(8.5).font("Helvetica").text(data.aluno.contatoResponsavel, 380, cardY + 23);

  doc.fillColor("#475569").fontSize(8).font("Helvetica-Bold").text("SITUAÇÃO GERAL:", 295, cardY + 38);
  const colorStatus = data.statusResultadoFinal === "Aprovado" ? "#10b981" : data.statusResultadoFinal === "Em Recuperação" ? "#f59e0b" : "#ef4444";
  doc.fillColor(colorStatus).fontSize(9).font("Helvetica-Bold").text(data.statusResultadoFinal.toUpperCase(), 390, cardY + 37);

  // Seção 2: BOLETIM DETALHADO POR DISCIPLINA
  doc.y = cardY + 75;
  doc.fillColor("#1e3a8a").fontSize(11).font("Helvetica-Bold").text("2. RENDIMENTO ACADÊMICO E CONTROLE DE PRESENÇAS", 45);

  const tHeaderY = doc.y + 6;
  doc.fillColor("#efefef").rect(45, tHeaderY, 505, 18).fill();
  doc.fillColor("#e2e8f0").rect(45, tHeaderY, 505, 18).stroke();

  doc.fillColor("#1e3a8a").fontSize(7.5).font("Helvetica-Bold");
  doc.text("MATÉRIA / COMPONENTE CURRICULAR", 52, tHeaderY + 5);
  doc.text("PROFESSOR", 155, tHeaderY + 5);
  doc.text("B1", 285, tHeaderY + 5);
  doc.text("B2", 315, tHeaderY + 5);
  doc.text("B3", 345, tHeaderY + 5);
  doc.text("B4", 375, tHeaderY + 5);
  doc.text("MÉDIA ANUAL", 405, tHeaderY + 5);
  doc.text("FALTAS", 480, tHeaderY + 5);
  doc.text("RESULTADO", 512, tHeaderY + 5);

  let curY = tHeaderY + 18;

  data.notasPorDisciplina.forEach((disc: any) => {
    // Zebra background
    doc.fillColor("#fcfcfc").rect(45, curY, 505, 20).fill();
    doc.strokeColor("#f1f5f9").rect(45, curY, 505, 20).stroke();

    doc.fillColor("#0f172a").fontSize(8.5).font("Helvetica-Bold").text(disc.disciplinaNome, 52, curY + 6, { width: 100 });
    doc.fillColor("#475569").fontSize(7.5).font("Helvetica").text(disc.professorNome, 155, curY + 6, { width: 120 });
    
    doc.fillColor("#0f172a").fontSize(8.5);
    doc.text(disc.bimestres["Bimestre 1"].media ? disc.bimestres["Bimestre 1"].media.toFixed(1) : "-", 285, curY + 6);
    doc.text(disc.bimestres["Bimestre 2"].media ? disc.bimestres["Bimestre 2"].media.toFixed(1) : "-", 315, curY + 6);
    doc.text(disc.bimestres["Bimestre 3"].media ? disc.bimestres["Bimestre 3"].media.toFixed(1) : "-", 345, curY + 6);
    doc.text(disc.bimestres["Bimestre 4"].media ? disc.bimestres["Bimestre 4"].media.toFixed(1) : "-", 375, curY + 6);

    const mStyleColor = disc.mediaFinalAno >= 7.0 ? "#10b981" : disc.mediaFinalAno >= 5.0 ? "#f59e0b" : "#ef4444";
    doc.fillColor(mStyleColor).font("Helvetica-Bold").text(disc.mediaFinalAno.toFixed(1), 415, curY + 6);
    
    doc.fillColor("#0f172a").font("Helvetica").text(disc.faltasTotaisAno ? String(disc.faltasTotaisAno) : "0", 488, curY + 6);
    
    // Status text
    const cellStatusColor = disc.resultado === "Aprovado" ? "#10b981" : disc.resultado === "Recuperação" ? "#f59e0b" : "#ef4444";
    doc.fillColor(cellStatusColor).fontSize(7).font("Helvetica-Bold").text(disc.resultado.toUpperCase(), 512, curY + 6);

    curY += 20;
  });

  // Caixa de Resumo no rodapé do boletim
  const infoBlockY = curY + 15;
  doc.roundedRect(45, infoBlockY, 505, 58, 6).fillAndStroke("#eff6ff", "#bfdbfe");

  doc.fillColor("#1e3a8a").fontSize(8).font("Helvetica-Bold").text("MÉDIA GERAL FINAL:", 55, infoBlockY + 12);
  doc.fillColor("#1e3a8a").fontSize(14).text(`${data.mediaGeralFrequencia}`, 55, infoBlockY + 23);

  doc.fillColor("#1e3a8a").fontSize(8).font("Helvetica-Bold").text("PRESENÇA GLOBAL ESTIMADA / FALTAS GERAIS:", 200, infoBlockY + 12);
  const totalPresenca = parseFloat((100 - (data.totalFaltasAcumuladas / 120 * 100)).toFixed(1));
  doc.fillColor("#0f172a").fontSize(10).font("Helvetica").text(`${totalPresenca}% de presença de Frequências (${data.totalFaltasAcumuladas} faltas acumuladas)`, 200, infoBlockY + 23);
  doc.fontSize(7.5).font("Helvetica-Oblique").text("Presença mínima permitida para aprovação: 75%", 200, infoBlockY + 36);

  doc.fillColor("#1e3a8a").fontSize(8).font("Helvetica-Bold").text("DECISÃO COORDENAÇÃO:", 415, infoBlockY + 12);
  doc.fillColor(colorStatus).fontSize(11).font("Helvetica-Bold").text(data.statusResultadoFinal.toUpperCase(), 415, infoBlockY + 23);

  // Termo De Notas Finais com assinaturas
  const signY = infoBlockY + 95;
  doc.strokeColor("#bfdbfe").lineWidth(0.5).moveTo(65, signY).lineTo(235, signY).stroke();
  doc.strokeColor("#bfdbfe").lineWidth(0.5).moveTo(315, signY).lineTo(485, signY).stroke();

  doc.fillColor("#475569").fontSize(8).font("Helvetica").text("Carimbo e Direção Escolar Geral", 65, signY + 6, { align: "center", width: 170 });
  doc.text("Assinatura da Orientação Pedagógica", 315, signY + 6, { align: "center", width: 170 });

  // Rodapé Oficial
  doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(45, 760).lineTo(550, 760).stroke();
  doc.fillColor("#94a3b8").fontSize(7.5).font("Helvetica-Bold").text("PORTAL DO ALUNO COLÉGIO EXEMPLAR INTERATIVO IA", 45, 768);
  doc.text("DOCUMENTO IMPRESSO PELO SISTEMA OFICIAL DE ACADÊMICOS", 45, 777);
  doc.text("Página 1 de 1", 380, 768, { align: "right", width: 170 });

  doc.end();
}

// Generate docx report
app.get("/api/report/docx", async (req, res) => {
  try {
    const doc = generateTechnicalReportDocx();
    const buffer = await Packer.toBuffer(doc);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", "attachment; filename=Projeto_Pedagogico_Colegio_Exemplar_2026.docx");
    res.send(buffer);
  } catch (error: any) {
    console.error("Erro ao gerar documento Word do colégio:", error);
    res.status(500).send("Falha ao gerar documento Word do colégio: " + error.message);
  }
});

// ========================== VITE BOOTSTRAP ==========================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n=============================================================`);
    console.log(`✔ Colégio Exemplar Server inicializado com sucesso!`);
    console.log(`✔ Escutando na porta: ${PORT}`);
    console.log(`✔ Link de teste: http://localhost:${PORT}`);
    console.log(`=============================================================\n`);
  });
}

startServer();
