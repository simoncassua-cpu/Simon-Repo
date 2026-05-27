/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, MapPin, Camera, Image, CheckCircle, AlertTriangle, AlertOctagon, 
  Trash2, User, Phone, Key, HelpCircle, ArrowRight, LogIn, UserPlus, 
  FileText, TrendingUp, Sliders, Smartphone, Info, RefreshCw, Layers, Check, ChevronRight, Upload, Map
} from "lucide-react";
import DeveloperHub from "./components/DeveloperHub";
import { Analysis } from "./types";

// Tipagem do usuário simulado
interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
}

export default function App() {
  // Mobile Frame States
  const [mobileScreen, setMobileScreen] = useState<"splash" | "login" | "register" | "dashboard" | "camera" | "result" | "history" | "profile">("splash");
  const [splashCompleted, setSplashCompleted] = useState(false);
  
  // Auth Form State
  const [currentUser, setCurrentUser] = useState<MockUser | null>({
    id: "user-1",
    name: "Eng. Gabriel Silva",
    email: "simoncassua@gmail.com",
    phone: "+55 (11) 98888-7777"
  });
  const [authError, setAuthError] = useState("");
  const [loginEmail, setLoginEmail] = useState("simoncassua@gmail.com");
  const [loginPwd, setLoginPwd] = useState("123");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPwd, setRegPwd] = useState("");

  // Profiling Settings Form State
  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || "");
  const [profilePwd, setProfilePwd] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Analysis System States
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  
  // Custom camera parameters simulated
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number }>({ lat: -23.5505, lng: -46.6333 });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("preset-plano");
  const [customFileBase64, setCustomFileBase64] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState("");
  
  const [analysisError, setAnalysisError] = useState("");
  const [historySearch, setHistorySearch] = useState("");

  // Splash Screen Automator
  useEffect(() => {
    if (mobileScreen === "splash") {
      const timer = setTimeout(() => {
        setMobileScreen("login");
        setSplashCompleted(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [mobileScreen]);

  // Carregar histórico de análises da API no carregamento do app
  const fetchAnalyses = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/analysis/list");
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data);
      }
    } catch (e) {
      console.error("Erro ao carregar histórico:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  // Sync profile form states
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfilePhone(currentUser.phone);
    }
  }, [currentUser]);

  // Trigger GPS locator
  const triggerGPS = () => {
    if (!navigator.geolocation) {
      alert("GPS não é suportado pelo seu navegador.");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6))
        });
        setGettingLocation(false);
      },
      (error) => {
        console.warn("Erro ao ler coordenadas reais. Utilizando simulação realista.", error);
        // Gerar coordenadas plausíveis de engenharia
        setGpsCoords({
          lat: parseFloat((-23.55 + (Math.random() - 0.5) * 0.1).toFixed(6)),
          lng: parseFloat((-46.63 + (Math.random() - 0.5) * 0.1).toFixed(6))
        });
        setGettingLocation(false);
      }
    );
  };

  // Pre-loaded photo examples for simulation
  const PRESET_MAPPING: Record<string, { title: string; desc: string; url: string; presetRef: string }> = {
    "preset-plano": {
      title: "Terreno Plano Limpo",
      desc: "Solo firme, plano, boa iluminação e limpo de arbustos densos.",
      url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80",
      presetRef: "preset-plano"
    },
    "preset-inclinado": {
      title: "Encosta Suave Úmida",
      desc: "Presença de declive médio, solo argiloso e vegetação herbácea média.",
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
      presetRef: "preset-inclinado"
    },
    "preset-ingreme": {
      title: "Montanhoso com Obstáculo",
      desc: "Muito íngreme, rochoso, alta densidade de árvores e acesso restrito.",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
      presetRef: "preset-íngreme"
    }
  };

  const currentPresetData = PRESET_MAPPING[selectedPreset] || PRESET_MAPPING["preset-plano"];

  // Custom Image File Picker Parser
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Real-Time Analysis Dispatcher
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError("");
    
    // Preparar dados
    let imagePayload = currentPresetData.url;
    let presetRefValue = currentPresetData.presetRef;

    if (customFileBase64) {
      imagePayload = customFileBase64;
      presetRefValue = ""; // remove o preset se for customizado
    }

    try {
      const response = await fetch("/api/analysis/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePayload,
          latitude: gpsCoords.lat,
          longitude: gpsCoords.lng,
          userId: currentUser?.id || "user-1",
          presetId: presetRefValue
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Houve uma instabilidade no processador de Visão.");
      }

      const report: Analysis = await response.json();
      setCurrentAnalysis(report);
      
      // Atualizar lista local de análises
      setAnalyses(prev => [report, ...prev]);
      
      // Ir para tela de resultado
      setMobileScreen("result");
    } catch (err: any) {
      setAnalysisError(err.message || "Falha na conexão de inteligência geotécnica.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auth Submitters
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    // Simulação rápida para propósitos do MVP
    const match = usersDbSimulated().find(
      u => u.email.toLowerCase() === loginEmail.toLowerCase() && loginPwd === "123"
    );

    if (match || (loginEmail === "simoncassua@gmail.com" && loginPwd === "123")) {
      setCurrentUser({
        id: "user-1",
        name: "Eng. Gabriel Silva",
        email: loginEmail,
        phone: "+55 (11) 98888-7777"
      });
      setMobileScreen("dashboard");
    } else {
      setAuthError("Dados incorretos ou não cadastrados. Dica: Use simoncassua@gmail.com e senha 123");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!regName || !regEmail || !regPwd) {
      setAuthError("Nome, e-mail e senha são obrigatórios.");
      return;
    }

    setCurrentUser({
      id: `user-${Date.now()}`,
      name: regName,
      email: regEmail,
      phone: regPhone || "+55 (11) 99999-9999"
    });
    setMobileScreen("dashboard");
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: profileName,
        phone: profilePhone
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  // Delete specific geological report
  const handleDeleteAnalysis = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/analysis/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnalyses(prev => prev.filter(item => item.id !== id));
        if (currentAnalysis?.id === id) {
          setCurrentAnalysis(null);
        }
      }
    } catch (e) {
      console.error("Falha ao excluir registro:", e);
    }
  };

  // Totalized statistics helper calculations
  const totalAnalyses = analyses.length;
  const highViabilityCount = analyses.filter(a => a.score >= 80).length;
  const moderateViabilityCount = analyses.filter(a => a.score >= 50 && a.score < 80).length;
  const inadequateCount = analyses.filter(a => a.score < 50).length;
  const averageScore = totalAnalyses > 0 ? Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / totalAnalyses) : 0;

  // Static fallback list for quick sandbox usage
  function usersDbSimulated() {
    return [
      { id: "user-1", name: "Eng. Gabriel Silva", email: "simoncassua@gmail.com" }
    ];
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-12">
      {/* Top Header Workspace */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/10 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="h-5 w-5 text-emerald-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase">Geotech AI</span>
                <span className="text-xs text-slate-400">v1.2.0 • Pro</span>
              </div>
              <h1 className="text-xl font-black text-slate-100 tracking-tight">GeoBuild Vision™</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Engenheiro Logado</p>
              <p className="text-xs text-emerald-400 font-semibold">{currentUser ? currentUser.name : "Visitante"}</p>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
            <a 
              href="#app-simulator" 
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Smartphone className="h-3.5 w-3.5" />
              Testar Simulator
            </a>
          </div>
        </div>
      </header>

      {/* Main Dual Grid Core Workspace layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE MOBILE WRAPPER AND INFO PANEL (5 COLS) */}
        <section id="app-simulator" className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-slate-200">Dispositivo Móvel [iOS/Android Mock]</h3>
              </div>
              <p className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                Preview em Tempo Real
              </p>
            </div>

            {/* Smart Phone Simulator Shell */}
            <div className="w-full max-w-[360px] mx-auto bg-slate-950 border-8 border-slate-800 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col min-h-[640px] max-h-[680px]">
              {/* iPhone Notch Speaker */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-2xl z-30 flex items-center justify-center gap-2">
                <span className="w-12 h-1 bg-slate-900 rounded"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-900"></span>
              </div>

              {/* Simulated Device Top Bar Indicator */}
              <div className="h-8 bg-slate-900 flex justify-between items-center px-6 pt-2.5 text-[10px] font-semibold text-slate-400 select-none z-20">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px]">4G/LTE</span>
                  <Compass className="h-2.5 w-2.5 animate-spin-slow text-emerald-400" />
                  <span className="w-4 h-2.5 border border-slate-500 rounded-sm p-0.5 flex">
                    <span className="w-full h-full bg-emerald-400 rounded-2xs"></span>
                  </span>
                </div>
              </div>

              {/* ACTIVE MOBILE FRAME ROUTER VIEWPORT */}
              <div className="flex-1 overflow-y-auto bg-slate-950 flex flex-col relative text-slate-200 text-sm">
                
                {/* 1. SPLASH SCREEN */}
                {mobileScreen === "splash" && (
                  <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center animate-fade-in">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/10 mb-5 flex items-center justify-center">
                      <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <Compass className="h-9 w-9 text-emerald-400 animate-spin-slow" />
                      </div>
                    </div>
                    <h2 className="text-xl font-black text-white tracking-widest uppercase">GeoBuild Vision</h2>
                    <p className="text-xs text-emerald-400 mt-1.5 font-semibold tracking-wider">AI TERRAIN ASSESSMENT</p>
                    <div className="mt-12 flex justify-center">
                      <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-24">Processamento em Nuvem e Visão Computacional</p>
                  </div>
                )}

                {/* 2. LOGIN SCREEN */}
                {mobileScreen === "login" && (
                  <div className="flex-1 flex flex-col justify-between p-6">
                    <div className="mt-6">
                      <h3 className="text-lg font-black text-slate-100 flex items-center gap-1">
                        Olá Engenheiro!
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Insira suas credenciais corporativas de acesso ao GeoBuild.</p>
                      
                      {authError && (
                        <div className="mt-4 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex gap-1.5 items-start">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">E-mail corporativo</label>
                          <input 
                            type="email" 
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="ex: simoncassua@gmail.com"
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Senha Secreta</label>
                          <input 
                            type="password" 
                            required
                            value={loginPwd}
                            onChange={(e) => setLoginPwd(e.target.value)}
                            placeholder="Insira sua senha"
                            className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition flex items-center justify-center gap-1"
                        >
                          Entrar no App
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>

                    <div className="text-center pt-4 border-t border-slate-900">
                      <p className="text-xs text-slate-400">
                        Não possui credencial?{" "}
                        <button 
                          onClick={() => setMobileScreen("register")} 
                          className="text-emerald-400 font-bold hover:underline"
                        >
                          Cadastre-se
                        </button>
                      </p>
                      <button 
                        onClick={() => setMobileScreen("dashboard")} 
                        className="text-[10px] text-slate-500 font-bold hover:text-slate-400 block w-full mt-2"
                      >
                        Pular Login (Modo Demo)
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. REGISTER SCREEN */}
                {mobileScreen === "register" && (
                  <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
                    <div>
                      <h3 className="text-lg font-black text-slate-100">Criar Nova Conta</h3>
                      <p className="text-xs text-slate-400 mt-1">Crie sua conta para salvar relatórios de terrenos de obras.</p>

                      {authError && (
                        <div className="mt-4 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs">
                          {authError}
                        </div>
                      )}

                      <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400">Nome Completo</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Eng. Gabriel Silva"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400">E-mail Comercial</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="nome@empresa.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400">Telefone / CREA</label>
                          <input 
                            type="text" 
                            placeholder="+55 (11) 98888-7777"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400">Definir Senha</label>
                          <input 
                            type="password" 
                            required 
                            placeholder="Mínimo de 6 algarismos"
                            value={regPwd}
                            onChange={(e) => setRegPwd(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition mt-2"
                        >
                          Concluir Registro
                        </button>
                      </form>
                    </div>

                    <div className="text-center pt-3 border-t border-slate-900 mt-4">
                      <p className="text-xs text-slate-400">
                        Já tem conta?{" "}
                        <button 
                          onClick={() => setMobileScreen("login")} 
                          className="text-emerald-400 font-bold hover:underline"
                        >
                          Acesse sua conta
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. DASHBOARD */}
                {mobileScreen === "dashboard" && (
                  <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Top Header Mock App bar */}
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <div>
                          <p className="text-[10px] text-slate-500">Módulo Mobile Activo</p>
                          <h4 className="font-bold text-slate-200">Visão Geral GeoBuild</h4>
                        </div>
                        <button 
                          onClick={() => setMobileScreen("profile")}
                          className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700"
                          title="Ver Perfil"
                        >
                          <User className="h-4 w-4 text-emerald-400" />
                        </button>
                      </div>

                      {/* Summary Banner Stats */}
                      <div className="bg-gradient-to-tr from-emerald-950/40 to-slate-900 p-3 rounded-xl border border-emerald-900/40">
                        <p className="text-[10px] uppercase font-bold text-emerald-400">Estatísticas Geológicas</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-xl font-bold block text-slate-100">{totalAnalyses}</span>
                            <span className="text-[9px] text-slate-400">Total Analisados</span>
                          </div>
                          <div>
                            <span className="text-xl font-bold block text-emerald-400">{averageScore}%</span>
                            <span className="text-[9px] text-slate-400">Média Sanitária</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick launch interactive photo button */}
                      <button 
                        onClick={() => {
                          triggerGPS();
                          setMobileScreen("camera");
                        }}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                      >
                        <Camera className="h-4 w-4" />
                        NOVA ANÁLISE DE TERRENO
                      </button>

                      {/* List header */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Últimos Terrenos {totalAnalyses > 0 && `(${totalAnalyses})`}</span>
                        <button 
                          onClick={() => setMobileScreen("history")}
                          className="text-[10px] text-emerald-400 font-bold hover:underline"
                        >
                          Ver Todos
                        </button>
                      </div>

                      {/* Tiny horizontal card lists */}
                      <div className="space-y-2">
                        {loadingHistory ? (
                          <div className="py-6 text-center text-slate-500 text-xs">Atualizando histórico...</div>
                        ) : analyses.length === 0 ? (
                          <div className="py-8 text-center border border-dashed border-slate-900 rounded-xl bg-slate-950/20 p-4">
                            <Info className="h-5 w-5 text-slate-600 mx-auto mb-1.5" />
                            <p className="text-xs text-slate-400">Nenhum terreno fotografado ainda.</p>
                            <span className="text-[10px] text-slate-500">Toque no botão e inicie capturas automatizadas.</span>
                          </div>
                        ) : (
                          analyses.slice(0, 3).map((item) => (
                            <div 
                              key={item.id}
                              onClick={() => {
                                setCurrentAnalysis(item);
                                setMobileScreen("result");
                              }}
                              className="p-2.5 bg-slate-900 hover:bg-slate-800/80 rounded-xl border border-slate-800/60 flex items-center gap-3 transition cursor-pointer group"
                            >
                              <img 
                                src={item.image_url} 
                                alt="terreno" 
                                className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                                    item.score >= 80 ? "bg-emerald-500/10 text-emerald-400" :
                                    item.score >= 50 ? "bg-amber-500/10 text-amber-400" :
                                    "bg-rose-500/10 text-rose-400"
                                  }`}>
                                    {item.classification === "Alta" ? "Alta Viabilidade" : item.classification === "Moderada" ? "Moderada" : "Inadequado"}
                                  </span>
                                  <span className="text-[8px] text-slate-500 font-mono">
                                    {new Date(item.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                                  </span>
                                </div>
                                <h5 className="text-[11px] font-bold text-slate-200 truncate mt-0.5 mt-0.5 block">
                                  Terreno {item.slope} • {item.soil_type}
                                </h5>
                                <p className="text-[9px] text-slate-400 flex items-center gap-0.5 truncate">
                                  <MapPin className="h-2 w-2 text-rose-400 shrink-0" />
                                  {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                                </p>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400 transition" />
                            </div>
                          ))
                        )}
                      </div>

                    </div>

                    {/* App Bottom nav bar */}
                    <div className="border-t border-slate-900 pt-3 flex justify-around mt-4">
                      <button 
                        onClick={() => setMobileScreen("dashboard")}
                        className="flex flex-col items-center gap-1 text-emerald-400"
                      >
                        <Compass className="h-4 w-4" />
                        <span className="text-[8px] font-semibold">Início</span>
                      </button>
                      <button 
                        onClick={() => setMobileScreen("history")}
                        className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-[8px] font-semibold">Histórico</span>
                      </button>
                      <button 
                        onClick={() => setMobileScreen("profile")}
                        className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition"
                      >
                        <User className="h-4 w-4" />
                        <span className="text-[8px] font-semibold">Ajustes</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. CAMERA & UPLOAD FOR ASSESSMENT SCREEN */}
                {mobileScreen === "camera" && (
                  <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950">
                    <div className="space-y-4">
                      {/* Back to Dashboard bar */}
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <button 
                          onClick={() => setMobileScreen("dashboard")}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          ← Voltar
                        </button>
                        <span className="text-xs font-bold">Capturar Imagem</span>
                        <div className="w-8 h-8"></div>
                      </div>

                      {/* GPS coordinates simulated widget */}
                      <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold text-slate-500 block">GPS Integrado</span>
                            <span className="text-xs font-mono text-slate-300 block truncate">
                              LAT {gpsCoords.lat.toFixed(6)} | LNG {gpsCoords.lng.toFixed(6)}
                            </span>
                          </div>
                        </div>

                        <button 
                          type="button"
                          disabled={gettingLocation}
                          onClick={triggerGPS}
                          className="p-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 transition shrink-0"
                        >
                          {gettingLocation ? "Buscando..." : "Atualizar"}
                        </button>
                      </div>

                      {/* Tab toggle: Presets landscape vs Custom file upload */}
                      <div className="bg-slate-900 p-0.5 rounded-lg flex border border-slate-850">
                        <button
                          type="button"
                          onClick={() => setCustomFileBase64(null)}
                          className={`flex-1 py-1 rounded-md text-[10px] font-bold text-center transition ${
                            !customFileBase64 ? "bg-slate-800 text-white" : "text-slate-450 hover:text-white"
                          }`}
                        >
                          Cenários Locais (Presets)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!customFileBase64) {
                              // Trigger automatic preset mock structure
                              setCustomFileBase64("https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80");
                            }
                          }}
                          className={`flex-1 py-1 rounded-md text-[10px] font-bold text-center transition ${
                            customFileBase64 ? "bg-slate-800 text-white" : "text-slate-450 hover:text-white"
                          }`}
                        >
                          Enviar Minha Foto
                        </button>
                      </div>

                      {/* Preset selector landscape blocks */}
                      {!customFileBase64 ? (
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Selecione o cenário do solo:</span>
                          <div className="grid grid-cols-1 gap-2">
                            {Object.entries(PRESET_MAPPING).map(([key, data]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setSelectedPreset(key)}
                                className={`p-2 rounded-xl text-left border flex gap-3 transition ${
                                  selectedPreset === key 
                                    ? "bg-emerald-500/5 text-emerald-100 border-emerald-500/60" 
                                    : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                                }`}
                              >
                                <img src={data.url} alt="preset preview" className="w-12 h-12 object-cover rounded-lg bg-slate-850" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold block">{data.title}</p>
                                  <p className="text-[9px] text-slate-400 leading-tight mt-0.5 truncate">{data.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Sua fotografia do terreno:</span>
                          
                          <div className="border border-dashed border-slate-800 bg-slate-900/40 p-4 rounded-xl text-center space-y-2 relative">
                            <Upload className="h-6 w-6 text-emerald-400 mx-auto" />
                            <p className="text-xs text-slate-300">Selecione uma imagem do seu rolo de câmera</p>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageFileChange}
                              className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
                            />
                            {customFileName && (
                              <p className="text-[10px] text-emerald-400 font-bold font-mono text-center">
                                ✓ Carregado: {customFileName}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Display live terrain image in the camera preview */}
                      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                        <div className="relative aspect-video">
                          <img 
                            src={customFileBase64 && customFileBase64.startsWith("data:") ? customFileBase64 : currentPresetData.url} 
                            alt="Previsualização" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Viewfinder
                          </div>
                        </div>
                      </div>

                      {analysisError && (
                        <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs">
                          {analysisError}
                        </div>
                      )}

                      {/* Large assess button */}
                      <button
                        type="button"
                        onClick={handleStartAnalysis}
                        disabled={isAnalyzing}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-xl shadow-emerald-500/10 disabled:opacity-50"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            PROCESSANDO COMPILADOR IA...
                          </>
                        ) : (
                          <>
                            <Compass className="h-4 w-4 animate-spin-slow" />
                            SUBMETER AO LAUDO DE IA
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                )}

                {/* 6. TECHNICAL ANALYSIS RESULTS REPORT CARD SCREEN */}
                {mobileScreen === "result" && currentAnalysis && (
                  <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Nav header */}
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <button 
                          onClick={() => setMobileScreen("dashboard")}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          ← Painel
                        </button>
                        <span className="text-xs font-extrabold text-slate-100 uppercase tracking-widest">Relatório Técnico</span>
                        <button
                          onClick={(e) => {
                            handleDeleteAnalysis(currentAnalysis.id, e);
                            setMobileScreen("dashboard");
                          }}
                          className="text-slate-500 hover:text-rose-400 transition"
                          title="Excluir Registro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Image Thumbnail */}
                      <div className="relative h-32 rounded-xl overflow-hidden border border-slate-800 object-cover shrink-0">
                        <img 
                          src={currentAnalysis.image_url} 
                          alt="terreno analisado" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 text-xs rounded-full border border-slate-800 text-[10px] font-mono text-slate-300">
                          ID: {currentAnalysis.id.slice(0, 10)}...
                        </div>
                      </div>

                      {/* Header Gauge indicator with numeric score */}
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-500">Classificação Visual</p>
                          <h4 className={`text-lg font-black mt-0.5 ${
                            currentAnalysis.score >= 80 ? "text-emerald-400" :
                            currentAnalysis.score >= 50 ? "text-amber-400" :
                            "text-rose-400"
                          }`}>
                            {currentAnalysis.classification === "Alta" ? "Alta Viabilidade" : currentAnalysis.classification === "Moderada" ? "Viabilidade Moderada" : "Inadequado"}
                          </h4>
                          <span className="text-[9px] text-slate-400 mt-1 block">Avaliação Geomecânica Automática</span>
                        </div>

                        {/* Radial indicator numeric frame */}
                        <div className="h-16 w-16 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center relative">
                          <span className={`text-lg font-black ${
                            currentAnalysis.score >= 80 ? "text-emerald-400" :
                            currentAnalysis.score >= 50 ? "text-amber-400" :
                            "text-rose-400"
                          }`}>{currentAnalysis.score}</span>
                          <span className="text-[8px] text-slate-500 font-mono -mt-1">PONTOS</span>
                          {/* Accent arc simulation */}
                          <div className={`absolute -inset-1 border-2 rounded-full border-transparent animate-spin-slow ${
                            currentAnalysis.score >= 80 ? "border-t-emerald-400 border-r-emerald-400/20" :
                            currentAnalysis.score >= 50 ? "border-t-amber-400 border-r-amber-400/20" :
                            "border-t-rose-500 border-r-rose-500/20"
                          }`}></div>
                        </div>
                      </div>

                      {/* Geotech analysis metric list breakdown */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Parâmetros Microscópicos IA</span>
                        
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                            <span className="text-slate-500 block text-[9px]">Morfologia</span>
                            <span className="font-bold text-slate-200 mt-0.5 block">{currentAnalysis.slope} ({currentAnalysis.scores?.slope ?? 0} pont)</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                            <span className="text-slate-500 block text-[9px]">Solo Identificado</span>
                            <span className="font-bold text-slate-200 mt-0.5 block">{currentAnalysis.soil_type}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                            <span className="text-slate-500 block text-[9px]">Firmeza / Compacidade</span>
                            <span className="font-bold text-slate-200 mt-0.5 block">{currentAnalysis.soil_firmness}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                            <span className="text-slate-500 block text-[9px]">Erosões</span>
                            <span className="font-bold text-slate-200 mt-0.5 block">{currentAnalysis.erosion}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                            <span className="text-slate-500 block text-[9px]">Água Acumulada</span>
                            <span className="font-bold text-slate-200 mt-0.5 block">{currentAnalysis.water_accumulation}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                            <span className="text-slate-500 block text-[9px]">Acessibilidade Local</span>
                            <span className="font-bold text-slate-200 mt-0.5 block">{currentAnalysis.accessibility}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tactical Recommendations listed and framed */}
                      <div className="bg-slate-900 p-3 rounded-lg border border-emerald-900/30">
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                          <h5 className="text-[10px] font-bold text-emerald-400 uppercase">Prelaudo & Diretrizes de Fundação</h5>
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-300">
                          {currentAnalysis.recommendations && currentAnalysis.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Real-world Disclaimer banner */}
                      <div className="p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg flex gap-2 items-start text-[10px] text-amber-300 leading-tight">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                        <span>
                          <strong>Nota de Responsabilidade:</strong> Esta análise baseia-se em inteligência visual e não substitui os ensaios de campo de sondagem SPT ou relatórios de furos de sondagem geotécnica definitivos.
                        </span>
                      </div>

                      {/* Download PDF corporativo via ReportLab / PDF Kit */}
                      <a
                        href={`/api/analysis/${currentAnalysis.id}/pdf`}
                        download={`Relatorio_GeoBuild_${currentAnalysis.id}.pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-lg text-[10px] uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer mt-1"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Baixar Relatório PDF Técnica (ReportLab)
                      </a>

                    </div>
                  </div>
                )}

                {/* 7. FULL HISTORICAL RECORDS SCREEN */}
                {mobileScreen === "history" && (
                  <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Nav header */}
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <button 
                          onClick={() => setMobileScreen("dashboard")}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          ← Painel
                        </button>
                        <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">Histórico Geológico</span>
                        <div className="w-8 h-8"></div>
                      </div>

                      {/* Search box filters */}
                      <input 
                        type="text"
                        placeholder="Pesquisar por tipo de solo ou inclinação..."
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />

                      {/* Loop elements */}
                      <div className="space-y-2">
                        {loadingHistory ? (
                          <div className="text-center py-6 text-slate-500 text-xs">Atualizando banco...</div>
                        ) : analyses.length === 0 ? (
                          <div className="text-center py-8 text-slate-500 text-xs">Você não realizou nenhuma avaliação de terreno ainda.</div>
                        ) : (
                          analyses
                            .filter(a => 
                              a.slope.toLowerCase().includes(historySearch.toLowerCase()) || 
                              a.soil_type.toLowerCase().includes(historySearch.toLowerCase()) || 
                              a.classification.toLowerCase().includes(historySearch.toLowerCase())
                            )
                            .map((item) => (
                              <div 
                                key={item.id}
                                onClick={() => {
                                  setCurrentAnalysis(item);
                                  setMobileScreen("result");
                                }}
                                className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-850 flex items-center gap-3 transition cursor-pointer group"
                              >
                                <img src={item.image_url} alt="terreno" className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-800" />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                                      item.score >= 80 ? "bg-emerald-500/10 text-emerald-400" :
                                      item.score >= 50 ? "bg-amber-500/10 text-amber-400" :
                                      "bg-rose-500/10 text-rose-400"
                                    }`}>
                                      {item.classification === "Alta" ? "Alta" : item.classification === "Moderada" ? "Moderada" : "Inadequado"}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-mono">
                                      {new Date(item.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                                    </span>
                                  </div>
                                  <h4 className="text-[11px] font-bold text-slate-200 mt-1 truncate block">
                                    Terreno {item.slope} • {item.soil_type}
                                  </h4>
                                  <p className="text-[9px] text-slate-400 flex items-center gap-0.5 truncate">
                                    <MapPin className="h-2 w-2 text-rose-400 shrink-0" />
                                    {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteAnalysis(item.id, e)}
                                  className="p-1 px-1.5 text-slate-500 hover:text-rose-400 text-xs transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* 8. PROFILE / SETTINGS SET UP SCREEN */}
                {mobileScreen === "profile" && (
                  <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Nav header */}
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <button 
                          onClick={() => setMobileScreen("dashboard")}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          ← Painel
                        </button>
                        <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">Ajustes & Perfil</span>
                        <div className="w-8 h-8"></div>
                      </div>

                      {/* Current credentials details */}
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                        <div className="h-12 w-12 rounded-full bg-slate-800 border border-emerald-400/40 mx-auto flex items-center justify-center">
                          <User className="h-6 w-6 text-emerald-400" />
                        </div>
                        <h4 className="text-sm font-bold mt-2 text-slate-100">{currentUser?.name || "Engenheiro Simulador"}</h4>
                        <p className="text-[10px] text-emerald-400 font-medium tracking-wide">CREA-SP Ativo</p>
                        <p className="text-[11px] text-slate-500 mt-1">{currentUser?.email || "simoncassua@gmail.com"}</p>
                      </div>

                      {profileSuccess && (
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs text-center">
                          Perfil atualizado com sucesso!
                        </div>
                      )}

                      {/* Edit personal form settings */}
                      <form onSubmit={handleUpdateProfile} className="space-y-3">
                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400">Nome do Profissional</label>
                          <input 
                            type="text" 
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400">Contato Administrativo</label>
                          <input 
                            type="text" 
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase font-bold text-slate-400">Alterar Senha do App</label>
                          <input 
                            type="password" 
                            value={profilePwd}
                            onChange={(e) => setProfilePwd(e.target.value)}
                            placeholder="Deixe em branco para manter a atual"
                            className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs font-semibold hover:bg-emerald-400 transition"
                        >
                          Salvar Alterações
                        </button>
                      </form>

                      {/* Back logout action */}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentUser(null);
                          setMobileScreen("login");
                        }}
                        className="w-full py-1.5 border border-dashed border-rose-500/20 text-rose-400 text-xs hover:bg-rose-500/5 transition rounded-lg"
                      >
                        Encerrar Sessão
                      </button>

                    </div>
                  </div>
                )}

              </div>

              {/* Simulated Device Home Indicator pill */}
              <div className="h-6 bg-slate-900 flex items-center justify-center select-none pb-1 z-20">
                <span className="w-28 h-1 bg-slate-700 rounded-full cursor-pointer hover:bg-slate-500 transition" onClick={() => setMobileScreen("dashboard")}></span>
              </div>
            </div>
          </div>

          {/* Educational Geotechnical Information Card below simulator */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-xl">
            <h4 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1">
              <Info className="h-4 w-4" />
              Como a IA realiza o escaneamento?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nosso algoritmo de visão computacional analisa múltiplos descritores visuais na imagem fornecida. Ela segmenta canais de coloração <strong>HSV (Hue-Saturation-Value)</strong> para identificar cobertura biológica (densidade de mato e supressão vegetal) e detecta reflexão/plenaridade de pixels para apontar focos de água ou empoçamento.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Através de filtros diferenciais de borda como <strong>Sobel operadores</strong> e <strong>Canny</strong>, ela depara-se com texturas que indicam declividades acentuadas, escorregamentos passados ou ranhuras indicadoras de processos de erosão e deslizamento.
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN: DEVELOPER SOURCE HUB AND MANIFOLD (7 COLS) */}
        <section className="lg:col-span-7 h-full flex flex-col lg:sticky lg:top-28">
          <DeveloperHub />
        </section>

      </main>
    </div>
  );
}
