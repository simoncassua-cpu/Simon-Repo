/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Copy, Check, FileCode, FolderGit, Database, Cpu, HelpCircle } from "lucide-react";
import { FLUTTER_FILES, BACKEND_FILES, DB_SCHEMA, INSTRUCTIONS_MD } from "../data/sourceCode";

export default function DeveloperHub() {
  const [activeTab, setActiveTab] = useState<"flutter" | "fastapi" | "database" | "ai" | "guide">("flutter");
  const [subTab, setSubTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    switch (activeTab) {
      case "flutter":
        return FLUTTER_FILES[subTab]?.code || "";
      case "fastapi":
        return BACKEND_FILES[subTab]?.code || "";
      case "database":
        return DB_SCHEMA;
      case "ai":
        return BACKEND_FILES.find(f => f.title === "ai_engine.py")?.code || BACKEND_FILES[2]?.code || "";
      case "guide":
        return INSTRUCTIONS_MD;
    }
  };

  const getActivePath = () => {
    switch (activeTab) {
      case "flutter":
        return FLUTTER_FILES[subTab]?.path || "";
      case "fastapi":
        return BACKEND_FILES[subTab]?.path || "";
      case "database":
        return "database/schema.sql";
      case "ai":
        return "backend/ai/ai_engine.py";
      case "guide":
        return "GUIDE.md";
    }
  };

  const currentCode = getActiveCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FolderGit className="h-5 w-5 text-emerald-400" />
            Workspace de Arquitetura & Código Fonte
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Código completo, higienizado e pronto para escalabilidade de engenharia civil.
          </p>
        </div>
        
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-800 rounded-lg border border-slate-700 transition"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-400" />
              <span>Copiar Código</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => { setActiveTab("flutter"); setSubTab(0); }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-medium cursor-pointer border-b-2 transition whitespace-nowrap ${
            activeTab === "flutter"
              ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileCode className="h-4 w-4 text-sky-400" />
          Dart / Flutter
        </button>
        <button
          onClick={() => { setActiveTab("fastapi"); setSubTab(0); }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-medium cursor-pointer border-b-2 transition whitespace-nowrap ${
            activeTab === "fastapi"
              ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="h-4 w-4 text-teal-400" />
          FastAPI / Python
        </button>
        <button
          onClick={() => setActiveTab("database")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-medium cursor-pointer border-b-2 transition whitespace-nowrap ${
            activeTab === "database"
              ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Database className="h-4 w-4 text-violet-400" />
          PostgreSQL DDL
        </button>
        <button
          onClick={() => { setActiveTab("ai"); setSubTab(0); }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-medium cursor-pointer border-b-2 transition whitespace-nowrap ${
            activeTab === "ai"
              ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="h-4 w-4 text-pink-400" />
          Detecção IA OpenCV
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-medium cursor-pointer border-b-2 transition whitespace-nowrap ${
            activeTab === "guide"
              ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <HelpCircle className="h-4 w-4 text-amber-500" />
          Manual de Execução
        </button>
      </div>

      {/* Sub-tabs if multiple files exist in selected context */}
      {activeTab === "flutter" && (
        <div className="bg-slate-900 border-b border-slate-800/80 p-2 flex gap-1.5 overflow-x-auto">
          {FLUTTER_FILES.map((file, i) => (
            <button
              key={i}
              onClick={() => setSubTab(i)}
              className={`px-3 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                subTab === i
                  ? "bg-slate-800 text-emerald-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              {file.title}
            </button>
          ))}
        </div>
      )}

      {activeTab === "fastapi" && (
        <div className="bg-slate-900 border-b border-slate-800/80 p-2 flex gap-1.5 overflow-x-auto">
          {BACKEND_FILES.map((file, i) => (
            <button
              key={i}
              onClick={() => setSubTab(i)}
              className={`px-3 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                subTab === i
                  ? "bg-slate-800 text-emerald-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              {file.title}
            </button>
          ))}
        </div>
      )}

      {/* Code Editor Viewport */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#0d1117] relative">
        {/* Terminal Header */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 px-4 py-1.5 bg-slate-950/40 select-none border-b border-slate-800/40">
          <span>{getActivePath()}</span>
          <span>UTF-8 • {currentCode.split("\n").length} linhas</span>
        </div>

        {/* Real Syntax Highlighted Scrollable Code */}
        <div className="flex-1 overflow-auto p-4 md:p-6 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-800">
          {activeTab === "guide" ? (
            <div className="prose prose-invert prose-emerald text-sm text-slate-300 max-w-none space-y-4">
              <div className="whitespace-pre-wrap font-sans">{currentCode}</div>
            </div>
          ) : (
            <pre className="whitespace-pre scrollbar-none">
              <code>{currentCode}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
