/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, BookOpen, Users, Award, Calendar, Bell, ChevronRight, 
  Download, FileText, CheckCircle, User, Shield, Book, Plus, Trash2, 
  Search, Lock, Check, Mail, Phone, MapPin, School, ArrowRight, ExternalLink, RefreshCw
} from "lucide-react";
import DeveloperHub from "./components/DeveloperHub";
import StudentDashboard from "./components/portal/StudentDashboard";
import TeacherDashboard from "./components/portal/TeacherDashboard";
import AdminDashboard from "./components/portal/AdminDashboard";

// Definições de Interfaces de acordo com src/types.ts
import { Aluno, Professor, Turma, Comunicado } from "./types";

export default function App() {
  // Navigation States
  const [activeSection, setActiveSection] = useState<"public" | "portal" | "techHub">("public");
  
  // Portal Role States
  const [portalView, setPortalView] = useState<"login" | "student" | "teacher" | "admin">("login");
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  // Auth Inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [authError, setAuthError] = useState("");

  // Academic DB States (Fechados pela API)
  const [students, setStudents] = useState<Aluno[]>([]);
  const [teachers, setTeachers] = useState<Professor[]>([]);
  const [classes, setClasses] = useState<Turma[]>([]);
  const [notices, setNotices] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(false);

  // Selected Data and Forms
  const [selectedStudentId, setSelectedStudentId] = useState<string>("aluno-1");
  const [studentBoletim, setStudentBoletim] = useState<any>(null);
  const [boletimLoading, setBoletimLoading] = useState(false);

  // Form para novas matrículas
  const [studentForm, setStudentForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    turmaId: "turma-3a",
    nomeResponsavel: "",
    contatoResponsavel: ""
  });
  const [studentFormSuccess, setStudentFormSuccess] = useState(false);

  // Form para lançamento de notas
  const [gradeForm, setGradeForm] = useState({
    alunoId: "aluno-1",
    disciplinaId: "disc-pt",
    periodo: "Bimestre 1",
    notaAvaliadora1: "8.0",
    notaAvaliadora2: "8.5",
    notaProjeto: "9.0",
    totalFaltas: "0"
  });
  const [gradeFormSuccess, setGradeFormSuccess] = useState(false);

  // Form para postar avisos
  const [noticeForm, setNoticeForm] = useState({
    titulo: "",
    conteudo: "",
    destinatario: "Todos",
    categoria: "Geral"
  });
  const [noticeFormSuccess, setNoticeFormSuccess] = useState(false);

  // Search filter
  const [studentSearch, setStudentSearch] = useState("");

  // Load Initial Academic Catalogues
  const loadAcademicData = async () => {
    setLoading(true);
    try {
      const [resStud, resTeach, resClass, resNot] = await Promise.all([
        fetch("/api/academic/students").then(r => r.json()),
        fetch("/api/academic/teachers").then(r => r.json()),
        fetch("/api/academic/classes").then(r => r.json()),
        fetch("/api/academic/notices").then(r => r.json())
      ]);
      setStudents(resStud);
      setTeachers(resTeach);
      setClasses(resClass);
      setNotices(resNot);

      // Defina primeiro aluno carregado se disponível
      if (resStud && resStud.length > 0) {
        setSelectedStudentId(resStud[0].id);
      }
    } catch (e) {
      console.error("Falha ao sincronizar dados do colégio:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcademicData();
  }, []);

  // Fetch Bulletin of Selected Student
  const fetchSelectedStudentBoletim = async (id: string) => {
    if (!id) return;
    setBoletimLoading(true);
    try {
      const res = await fetch(`/api/academic/student/${id}/boletim`);
      if (res.ok) {
        const data = await res.json();
        setStudentBoletim(data);
      }
    } catch (err) {
      console.error("Erro ao carregar boletim pedagógico:", err);
    } finally {
      setBoletimLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedStudentBoletim(selectedStudentId);
  }, [selectedStudentId, students]);

  // Auth Submit Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPwd })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Tentativa de login recusada pelo sistema.");
      }

      const data = await res.json();
      setLoggedInUser(data.user);
      
      // Direcionar para a visualização correta
      if (data.user.role === "admin") {
        setPortalView("admin");
      } else if (data.user.role === "teacher") {
        setPortalView("teacher");
        // Ajustar gradeForm para registrar notas recomendadas
        setGradeForm(prev => ({ ...prev, alunoId: students[0]?.id || "aluno-1" }));
      } else {
        setPortalView("student");
        // Forçar exibição do próprio boletim do aluno Ricardo Cassua
        const matchStudent = students.find(s => s.email.toLowerCase() === data.user.email.toLowerCase());
        if (matchStudent) {
          setSelectedStudentId(matchStudent.id);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Erro de login");
    }
  };

  // Helper de login rápido simulado (Frictionless login)
  const executeQuickLogin = (role: "admin" | "teacher" | "student") => {
    setAuthError("");
    let email = "";
    let pwd = "123";

    if (role === "admin") {
      email = "simoncassua@gmail.com";
    } else if (role === "teacher") {
      email = "professor@exemplar.com";
    } else {
      email = "aluno@exemplar.com";
    }

    setLoginEmail(email);
    setLoginPwd(pwd);

    // Auto-submeter no próximo tick
    setTimeout(() => {
      const mockForm = {
        preventDefault: () => {}
      };
      // Chamada direta do login
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pwd })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setAuthError(data.error);
            return;
          }
          setLoggedInUser(data.user);
          if (data.user.role === "admin") setPortalView("admin");
          else if (data.user.role === "teacher") setPortalView("teacher");
          else {
            setPortalView("student");
            const match = students.find(s => s.email.toLowerCase() === data.user.email.toLowerCase());
            if (match) setSelectedStudentId(match.id);
          }
        });
    }, 150);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setPortalView("login");
    setLoginEmail("");
    setLoginPwd("");
    setAuthError("");
  };

  // Form Submissions
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.nome || !studentForm.email) return;

    try {
      const res = await fetch("/api/academic/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm)
      });

      if (res.ok) {
        setStudentFormSuccess(true);
        setStudentForm({
          nome: "",
          email: "",
          cpf: "",
          dataNascimento: "",
          turmaId: "turma-3a",
          nomeResponsavel: "",
          contatoResponsavel: ""
        });
        loadAcademicData();
        setTimeout(() => setStudentFormSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm("Deseja realmente remover esta matrícula de aluno?")) return;
    try {
      const res = await fetch(`/api/academic/student/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadAcademicData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/academic/grades/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gradeForm)
      });

      if (res.ok) {
        setGradeFormSuccess(true);
        fetchSelectedStudentBoletim(gradeForm.alunoId);
        setTimeout(() => setGradeFormSuccess(false), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/academic/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...noticeForm,
          autor: loggedInUser ? loggedInUser.name : "Coordenador"
        })
      });

      if (res.ok) {
        setNoticeFormSuccess(true);
        setNoticeForm({ titulo: "", conteudo: "", destinatario: "Todos", categoria: "Geral" });
        loadAcademicData();
        setTimeout(() => setNoticeFormSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtragem da lista para administrador
  const filteredStudents = students.filter(s => 
    s.nome.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.matricula.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/85 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection("public")}>
            <div className="h-10 w-10 bg-indigo-650 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/10">
              <School className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-indigo-900 tracking-tight block">
                COLÉGIO EXEMPLAR
              </span>
              <span className="text-[10px] font-bold text-emerald-650 uppercase tracking-widest block -mt-1">
                Portal Intelectual IA
              </span>
            </div>
          </div>

          {/* Core Navigation Selector */}
          <nav className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSection("public")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSection === "public"
                  ? "bg-white text-indigo-750 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <School className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
              Institucional
            </button>
            <button
              onClick={() => {
                setActiveSection("portal");
                if (loggedInUser) {
                  // Restaurar view correta
                  if (loggedInUser.role === "admin") setPortalView("admin");
                  else if (loggedInUser.role === "teacher") setPortalView("teacher");
                  else setPortalView("student");
                } else {
                  setPortalView("login");
                }
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSection === "portal"
                  ? "bg-white text-indigo-750 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Users className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
              Painel Escolar
            </button>
            <button
              onClick={() => setActiveSection("techHub")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSection === "techHub"
                  ? "bg-white text-indigo-750 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
              Portal do Desenvolvedor
            </button>
          </nav>

          {/* Quick Actions / Log Status */}
          <div className="flex items-center gap-3">
            {loggedInUser ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800">{loggedInUser.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{loggedInUser.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-100 rounded-lg transition"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setActiveSection("portal"); setPortalView("login"); }}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg shadow-sm transition"
              >
                Acessar Área Restrita
              </button>
            )}
          </div>

        </div>
      </header>

      {/* VIEW PRINCIPAL DO CONTEÚDO */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ======================= SECTION 1: PUBLIC INSTITUTIONAL PAGE ======================= */}
        {activeSection === "public" && (
          <div className="space-y-12">
            
            {/* Hero Banner Section */}
            <div className="relative bg-slate-900 rounded-3xl overflow-hidden p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl border border-slate-850">
              <div className="absolute inset-0 opacity-15 overflow-hidden">
                {/* Geométricos sutis decorativos */}
                <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-indigo-550 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-emerald-550 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 max-w-xl space-y-6">
                <span className="px-3.5 py-1.5 text-[10px] font-bold text-indigo-200 bg-indigo-500/20 border border-indigo-500/30 rounded-full uppercase tracking-wider">
                  Matrículas Abertas Letivo 2026
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Formação de Excelência da <span className="text-indigo-400">Infância</span> à Preparação <span className="text-emerald-450">Global</span>.
                </h1>
                <p className="text-slate-350 text-base leading-relaxed">
                  Tradição de colégio de elite aliada aos mais inovadores laboratórios de tecnologia de software, robótica aplicada e acompanhamento pedagógico individualizado permanente.
                </p>

                <div className="flex flex-wrap gap-3.5 pt-2">
                  <button
                    onClick={() => { setActiveSection("portal"); setPortalView("login"); }}
                    className="px-5 py-3 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-350 active:bg-emerald-400 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-400/20"
                  >
                    <span>Entrar no Portal do Aluno</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href="/api/report/docx"
                    download="Projeto_Pedagogico_Colegio_Exemplar_2026.docx"
                    className="px-5 py-3 text-sm font-bold text-white bg-slate-800 hover:bg-slate-750 active:bg-slate-800 rounded-xl transition flex items-center gap-2 border border-slate-700"
                  >
                    <Download className="h-4 w-4 text-emerald-400" />
                    <span>Baixar Projeto Pedagógico (DOCX)</span>
                  </a>
                </div>
              </div>

              <div className="relative z-10 w-full md:w-auto flex-shrink-0 flex justify-center">
                <div className="relative max-w-xs w-full bg-slate-850/80 backdrop-blur border border-slate-750 rounded-2xl p-6 shadow-2xl">
                  {/* Foto Ilustrativa de Escola de Altíssimo Nível */}
                  <img
                    alt="Colegio"
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80"
                    className="w-full h-44 object-cover rounded-xl border border-slate-700"
                  />
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-indigo-455 font-bold uppercase tracking-wider">Unidade São Paulo Centro</p>
                    <p className="text-sm font-bold text-white">Campus Unificado de Especialização</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      <span>Al. Jaú, 1044 - Jardim Paulista</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* School Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "100%", label: "Aprovação no Vestibular", desc: "Resultados comprovados", icon: Award, color: "text-indigo-650" },
                { value: "1.200+", label: "Alunos Registrados", desc: "No fundamental e médio", icon: Users, color: "text-sky-500" },
                { value: "35", label: "Professores Mestres", desc: "Equipe especializada", icon: GraduationCap, color: "text-emerald-500" },
                { value: "15", label: "Laboratórios Conectados", desc: "Tecnologia de ponta", icon: BookOpen, color: "text-pink-500" }
              ].map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <div className="p-2.5 rounded-lg bg-slate-50 w-fit">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 mt-2">{item.value}</p>
                  <p className="text-xs font-bold text-slate-850">{item.label}</p>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Educational Segments / Cards Section */}
            <div className="space-y-4">
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Nossos Segmentos de Ensino</h2>
                <p className="text-sm text-slate-500">Desenvolvimento com metodologias específicas em todas as fases da vida escolar.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Ensino Fundamental II", desc: "Do 6º ao 9º ano. Consolidação dos hábitos de estudo sistemático e iniciação científica prática.", cover: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=350&q=85" },
                  { title: "Ensino Médio e Itinerários", desc: "Preparo robusto para as principais universidades, olimpíadas acadêmicas e trilhas em programação de computadores.", cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=350&q=85" },
                  { title: "Vestibular e Formação Global", desc: "Aprofundamento de conteúdos vestibulares de excelência na unidade técnica de suporte extensivo pós-aula.", cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=350&q=85" }
                ].map((seg, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                    <img src={seg.cover} alt={seg.title} className="w-full h-40 object-cover border-b border-sidebar-divider" />
                    <div className="p-5 space-y-2">
                      <h3 className="text-base font-bold text-slate-900">{seg.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{seg.desc}</p>
                      <button 
                        onClick={() => { setActiveSection("portal"); setPortalView("login"); }}
                        className="text-xs font-bold text-indigo-650 hover:text-indigo-800 flex items-center gap-1 cursor-pointer pt-2"
                      >
                        <span>Saber mais</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* School Latest Board (Comunicados) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Notice list */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-indigo-900 flex items-center gap-2">
                    <Bell className="h-4.5 w-4.5 text-indigo-600" />
                    Mural de Comunicados Oficiais
                  </h3>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-semibold text-slate-500">Atualizado</span>
                </div>

                <div className="space-y-4 divider-y divide-slate-100">
                  {notices.map((not, i) => (
                    <div key={i} className="pt-3 first:pt-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[8.5px] font-bold rounded ${
                          not.categoria === "Pedagógico" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : not.categoria === "Financeiro" 
                            ? "bg-amber-100 text-amber-800" 
                            : "bg-indigo-100 text-indigo-800"
                        }`}>
                          {not.categoria}
                        </span>
                        <span className="text-[9.5px] font-mono text-slate-400">
                          {new Date(not.data).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="text-[10px] text-slate-405 ml-auto">Para: <strong className="font-bold">{not.destinatario}</strong></span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{not.titulo}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{not.conteudo}</p>
                      <div className="text-[10px] text-slate-405 text-right italic">— Publicado por {not.autor}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações de Contato / Atendimento */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Calendar className="h-4.5 w-4.5 text-indigo-650" />
                  Atendimento Escolar
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Para sanar dúvidas sobre boletins, matrículas presenciais ou suporte técnico da nossa plataforma inteligente, utilize nossos canais oficiais:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-indigo-500 mt-0.5" />
                    <div>
                      <li className="list-none text-xs font-bold text-slate-800">Secretaria Unificada</li>
                      <span className="text-[10px] text-slate-450 block">Atendimento Segunda a Sexta: 07:30 às 18:30</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Mail className="h-4 w-4 text-emerald-500 mt-0.5" />
                    <div>
                      <li className="list-none text-xs font-bold text-slate-800">Ouvidoria Geral</li>
                      <span className="text-[10px] text-slate-450 block font-semibold text-indigo-650 hover:underline cursor-pointer">simoncassua@gmail.com</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone className="h-4 w-4 text-sky-500 mt-0.5" />
                    <div>
                      <li className="list-none text-xs font-bold text-slate-800">Telefone e WhatsApp</li>
                      <span className="text-[10px] text-slate-450 block">+55 (11) 98888-7777</span>
                    </div>
                  </div>
                </div>

                {/* Escola Digital Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 mt-4">
                  <p className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Shield className="h-3.5 w-3.5 text-indigo-500" />
                    Acesso Seguro
                  </p>
                  <p className="text-[10.5px] text-slate-505 leading-normal">
                    Seus dados acadêmicos e notas escolares são confidenciais e auditados sob a Lei Geral de Proteção de Dados (LGPD).
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================= SECTION 2: PORTAL AREA (RESTRICTED) ======================= */}
        {activeSection === "portal" && (
          <div>
            
            {/* SCREEN 2.1: AUTHENTICATION / LOGIN FORM */}
            {portalView === "login" && (
              <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg p-6 lg:p-8 space-y-6">
                
                {/* Auth Screen Header */}
                <div className="text-center space-y-1.5">
                  <div className="h-12 w-12 bg-indigo-55/60 rounded-full flex items-center justify-center text-indigo-600 mx-auto">
                    <Lock className="h-5.5 w-5.5" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Portal de Comunicação Escolar
                  </h2>
                  <p className="text-xs text-slate-500">
                    Insira as credenciais acadêmicas de aluno, professor ou orientador.
                  </p>
                </div>

                {/* Pre-configured Roles Helper Accordion (VERY RELEVANT UX FEATURE!) */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Award className="h-4 w-4 text-indigo-500" />
                    Modo Avaliação Rápida (Clique para Logar):
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => executeQuickLogin("student")}
                      className="text-left px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-indigo-50 hover:text-indigo-750 active:bg-slate-100 border border-slate-250 hover:border-indigo-250 rounded-xl transition flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-blue-500" />
                        <span>Aluno: Ricardo Cassua (Boletim)</span>
                      </span>
                      <ChevronRight className="h-3 w-3 text-slate-450" />
                    </button>

                    <button
                      onClick={() => executeQuickLogin("teacher")}
                      className="text-left px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-emerald-50 hover:text-emerald-850 active:bg-slate-100 border border-slate-250 hover:border-emerald-250 rounded-xl transition flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Professor: Lançar Notas / Mural</span>
                      </span>
                      <ChevronRight className="h-3 w-3 text-slate-455" />
                    </button>

                    <button
                      onClick={() => executeQuickLogin("admin")}
                      className="text-left px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-violet-50 hover:text-violet-850 active:bg-slate-100 border border-slate-250 hover:border-violet-250 rounded-xl transition flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-violet-550" />
                        <span>Admin/Coord: Matrículas / Estatísticas</span>
                      </span>
                      <ChevronRight className="h-3 w-3 text-slate-455" />
                    </button>
                  </div>
                </div>

                {/* Form Input Submit */}
                <form onSubmit={handleLogin} className="space-y-4">
                  {authError && (
                    <div className="p-3 text-xs font-bold text-red-808 bg-red-50 border border-red-200 rounded-xl">
                      ❌ {authError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-650">Identificação (E-mail)</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="ex: aluno@exemplar.com"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-250 focus:border-indigo-500 focus:bg-white rounded-xl text-sm transition outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-650">Senha Digital</label>
                    <input
                      type="password"
                      required
                      value={loginPwd}
                      onChange={e => setLoginPwd(e.target.value)}
                      placeholder="Sua senha"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-250 focus:border-indigo-500 focus:bg-white rounded-xl text-sm transition outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-sm font-bold text-white bg-indigo-650 hover:bg-indigo-600 active:bg-indigo-650 rounded-xl tracking-tight transition shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    Efetuar Logon Seguro
                  </button>
                </form>
              </div>
            )}

            {/* SCREEN 2.2: STUDENT / PARENT DASHBOARD */}
            {loggedInUser && portalView === "student" && (
              <StudentDashboard
                loggedInUser={loggedInUser}
                boletimLoading={boletimLoading}
                studentBoletim={studentBoletim}
                selectedStudentId={selectedStudentId}
              />
            )}

            {/* SCREEN 2.3: TEACHER / DOCENTE DASHBOARD */}
            {loggedInUser && portalView === "teacher" && (
              <TeacherDashboard
                students={students}
                gradeForm={gradeForm}
                setGradeForm={setGradeForm}
                setSelectedStudentId={setSelectedStudentId}
                gradeFormSuccess={gradeFormSuccess}
                handleGradeSubmit={handleGradeSubmit}
                selectedStudentId={selectedStudentId}
                studentBoletim={studentBoletim}
              />
            )}

            {/* SCREEN 2.4: EXECUTIVE COORDINATOR / ADMIN DASHBOARD */}
            {loggedInUser && portalView === "admin" && (
              <AdminDashboard
                students={students}
                teachers={teachers}
                filteredStudents={filteredStudents}
                studentSearch={studentSearch}
                setStudentSearch={setStudentSearch}
                setSelectedStudentId={setSelectedStudentId}
                handleDeleteStudent={handleDeleteStudent}
                studentFormSuccess={studentFormSuccess}
                studentForm={studentForm}
                setStudentForm={setStudentForm}
                handleAddStudent={handleAddStudent}
                noticeFormSuccess={noticeFormSuccess}
                noticeForm={noticeForm}
                setNoticeForm={setNoticeForm}
                handleNoticeSubmit={handleNoticeSubmit}
              />
            )}

          </div>
        )}

        {/* ======================= SECTION 3: DEVELOPER ARCHITECTURE WORKSPACE ======================= */}
        {activeSection === "techHub" && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-indigo-650" />
                Workspace e Repositório Escolar Multi-Plataforma
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
                O Portal Colégio Exemplar foi concebido com altos padrões de design de software e escalabilidade. Confira as DDL do banco de dados relacional PostgreSQL, o software nativo mobile em Flutter do Aluno, a API rest em Python FastAPI e as regras descritas no guia de implantação.
              </p>
            </div>

            {/* Renderizar componente de visualização de códigos */}
            <div className="h-[600px] min-h-[500px]">
              <DeveloperHub />
            </div>
          </div>
        )}

      </main>

      {/* FOOTER DO APP */}
      <footer className="bg-slate-900 border-t border-slate-850 mt-16 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-1.5">
              <p className="text-white font-extrabold text-md tracking-tight">COLÉGIO EXEMPLAR EDUCACIONAL</p>
              <p className="text-xs text-slate-450 leading-relaxed max-w-md">
                Metodologia inovadora para formar líderes pensadores atuantes na ciência e tecnologia cívico-global.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs font-bold text-white">
              <span className="hover:text-indigo-400 cursor-pointer transition" onClick={() => setActiveSection("public")}>Página Inicial</span>
              <span className="hover:text-indigo-400 cursor-pointer transition" onClick={() => { setActiveSection("portal"); setPortalView("login"); }}>Boletim Online</span>
              <span className="hover:text-indigo-400 cursor-pointer transition" onClick={() => setActiveSection("techHub")}>Arquitetura de Softwares</span>
              <a href="/api/report/docx" className="hover:text-indigo-400 flex items-center gap-1 transition">
                <span>Manual PDF DOCX</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between text-[11px] text-slate-500 gap-4">
            <p>© 2026 Colégio Exemplar. Todos os direitos reservados. Conectado ao Portal Escolar de Notas e Frequência.</p>
            <p>Criado e Assinado por Google's AI Coding Agent</p>
          </div>

        </div>
      </footer>
    </div>
  );
}
