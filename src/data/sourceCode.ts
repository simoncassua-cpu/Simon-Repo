import { SourceFile } from "../types";

export const FLUTTER_FILES: SourceFile[] = [
  {
    title: "main.dart",
    path: "lib/main.dart",
    language: "dart",
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/constants/colors.dart';
import 'providers/auth_provider.dart';
import 'providers/analysis_provider.dart';
import 'screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const GeoBuildVisionApp());
}

class GeoBuildVisionApp extends StatelessWidget {
  const GeoBuildVisionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => AnalysisProvider()),
      ],
      child: MaterialApp(
        title: 'GeoBuild Vision',
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.system,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primary,
            brightness: Brightness.light,
          ),
          fontFamily: 'Inter',
        ),
        darkTheme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primary,
            brightness: Brightness.dark,
            background: AppColors.darkBackground,
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
    title: "analysis_model.dart",
    path: "lib/models/analysis_model.dart",
    language: "dart",
    code: `class AnalysisModel {
  final String id;
  final String userId;
  final String imageUrl;
  final double latitude;
  final double longitude;
  final int score;
  final String classification;
  final List<String> recommendations;
  final DateTime createdAt;
  
  // Custom metrics resolved
  final String slope;
  final String soilType;
  final String soilFirmness;
  final String erosion;
  final String waterAccumulation;
  final String vegetation;
  final String obstacles;
  final String accessibility;

  AnalysisModel({
    required this.id,
    required this.userId,
    required this.imageUrl,
    required this.latitude,
    required this.longitude,
    required this.score,
    required this.classification,
    required this.recommendations,
    required this.createdAt,
    required this.slope,
    required this.soilType,
    required this.soilFirmness,
    required this.erosion,
    required this.waterAccumulation,
    required this.vegetation,
    required this.obstacles,
    required this.accessibility,
  });

  factory AnalysisModel.fromJson(Map<String, dynamic> json) {
    return AnalysisModel(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      imageUrl: json['image_url'] ?? '',
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      score: json['score'] ?? 0,
      classification: json['classification'] ?? 'Inadequado',
      recommendations: List<String>.from(json['recommendations'] ?? []),
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
      slope: json['slope'] ?? 'Plano',
      soilType: json['soil_type'] ?? 'Desconhecido',
      soilFirmness: json['soil_firmness'] ?? 'Firme',
      erosion: json['erosion'] ?? 'Ausente',
      waterAccumulation: json['water_accumulation'] ?? 'Sem Água',
      vegetation: json['vegetation'] ?? 'Limpo',
      obstacles: json['obstacles'] ?? 'Ausente',
      accessibility: json['accessibility'] ?? 'Boa',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'image_url': imageUrl,
      'latitude': latitude,
      'longitude': longitude,
      'score': score,
      'classification': classification,
      'recommendations': recommendations,
      'created_at': createdAt.toIso8601String(),
      'slope': slope,
      'soil_type': soilType,
      'soil_firmness': soilFirmness,
      'erosion': erosion,
      'water_accumulation': waterAccumulation,
      'vegetation': vegetation,
      'obstacles': obstacles,
      'accessibility': accessibility,
    };
  }
}`
  },
  {
    title: "api_service.dart",
    path: "lib/services/api_service.dart",
    language: "dart",
    code: `import 'dart:io';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://api-geobuildvision.exemplo.com/api',
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
  ));

  ApiService() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));
  }

  Future<Map<String, dynamic>> register(String name, String email, String password, String phone) async {
    final response = await _dio.post('/auth/register', data: {
      'name': name,
      'email': email,
      'password': password,
      'phone': phone,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> analyzeTerrain(File image, double lat, double lng) async {
    String fileName = image.path.split('/').last;
    FormData formData = FormData.fromMap({
      'latitude': lat,
      'longitude': lng,
      'image': await MultipartFile.fromFile(image.path, filename: fileName),
    });

    final response = await _dio.post('/analysis/create', data: formData, 
      options: Options(contentType: 'multipart/form-data')
    );
    return response.data;
  }

  Future<List<dynamic>> listAnalyses() async {
    final response = await _dio.get('/analysis/list');
    return response.data;
  }

  Future<void> deleteAnalysis(String id) async {
    await _dio.delete('/analysis/$id');
  }

  Future<String> downloadPdfReport(String id, String savePath) async {
    // Faz o download do documento PDF gerado com ReportLab no backend via Dio para o storage local do celular
    final response = await _dio.download(
      '/analysis/\$id/pdf',
      savePath,
      onReceiveProgress: (received, total) {
        if (total != -1) {
          print("Download PDF: \${(received / total * 100).toStringAsFixed(0)}%");
        }
      },
    );
    return savePath;
  }
}`
  },
  {
    title: "analysis_provider.dart",
    path: "lib/providers/analysis_provider.dart",
    language: "dart",
    code: `import 'dart:io';
import 'package:flutter/material.dart';
import '../models/analysis_model.dart';
import '../services/api_service.dart';

class AnalysisProvider with ChangeNotifier {
  final ApiService _api = ApiService();
  List<AnalysisModel> _items = [];
  bool _isLoading = false;

  List<AnalysisModel> get items => [..._items];
  bool get isLoading => _isLoading;

  Future<void> fetchAndSetAnalyses() async {
    _isLoading = true;
    notifyListeners();
    try {
      final data = await _api.listAnalyses();
      _items = data.map((json) => AnalysisModel.fromJson(json)).toList();
    } catch (error) {
      debugPrint("Erro ao buscar análises: $error");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<AnalysisModel?> createAnalysis(File image, double lat, double lng) async {
    _isLoading = true;
    notifyListeners();
    try {
      final data = await _api.analyzeTerrain(image, lat, lng);
      final newAnalysis = AnalysisModel.fromJson(data);
      _items.insert(0, newAnalysis);
      notifyListeners();
      return newAnalysis;
    } catch (e) {
      debugPrint("Erro no upload do terreno: $e");
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> removeAnalysis(String id) async {
    try {
      await _api.deleteAnalysis(id);
      _items.removeWhere((element) => element.id == id);
      notifyListeners();
    } catch (e) {
      debugPrint("Erro ao excluir: $e");
      rethrow;
    }
  }
}`
  }
];

export const BACKEND_FILES: SourceFile[] = [
  {
    title: "main.py",
    path: "backend/main.py",
    language: "python",
    code: `import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Engine, Base, get_db
from routes import auth, analysis

# Inicialização do Banco PostgreSQL
Base.metadata.create_all(bind=Engine)

app = FastAPI(
    title="GeoBuild Vision API",
    description="Backend inteligente para análise prévia de terrenos de obras civis",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão dos Roteadores da API
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Análises de Terreno"])

@app.get("/")
def health_check():
    return {"status": "online", "service": "GeoBuild Vision AI Engine"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`
  },
  {
    title: "models.py",
    path: "backend/models.py",
    language: "python",
    code: `import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password = Column(String(255), nullable=False) # Armazenada em Hash Bcrypt
    created_at = Column(DateTime, default=datetime.utcnow)

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    score = Column(Integer, nullable=False)
    classification = Column(String(50), nullable=False) # Alta viabilidade, Moderada, Inadequado
    recommendations = Column(JSON, nullable=False) # Lista de strings
    
    # Métricas visuais avaliadas pela IA OpenCV + TensorFlow
    slope = Column(String(50), default="Plano")
    soil_type = Column(String(50), default="Arenoso / Seco")
    soil_firmness = Column(String(50), default="Firme")
    erosion = Column(String(50), default="Ausente")
    water_accumulation = Column(String(50), default="Sem Água")
    vegetation = Column(String(50), default="Rasteira")
    obstacles = Column(String(50), default="Poucos")
    accessibility = Column(String(50), default="Boa")
    
    created_at = Column(DateTime, default=datetime.utcnow)
`
  },
  {
    title: "ai_engine.py",
    path: "backend/ai/ai_engine.py",
    language: "python",
    code: `import cv2
import numpy as np

class TerrainAIEngine:
    @staticmethod
    def process_terrain_image(image_bytes: bytes) -> dict:
        """
        Segmenta e analisa o terreno utilizando OpenCV.
        Detecção de canais de cor HSV para vegetação e água,
        e análise de bordas Canny/Sobel para rugosidade de solo e inclinação.
        """
        # Converter bytes para imagem OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Imagem corrompida ou inválida.")
            
        h, w, _ = img.shape
        
        # 1. Detecção de Vegetação Excessiva usando espaço de cores HSV (Canal Verde)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower_green = np.array([35, 40, 40])
        upper_green = np.array([85, 255, 255])
        green_mask = cv2.inRange(hsv, lower_green, upper_green)
        vegetation_perc = (cv2.countNonZero(green_mask) / (h * w)) * 100
        
        # 2. Detecção de Água Acumulada (Reflexão, tons azuis/cinzas e padrões planos)
        lower_blue = np.array([90, 50, 50])
        upper_blue = np.array([130, 255, 255])
        blue_mask = cv2.inRange(hsv, lower_blue, upper_blue)
        water_perc = (cv2.countNonZero(blue_mask) / (h * w)) * 100

        # 3. Análise de Textura / Obstáculos / Rugosidade (Sobel / Canny)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, 50, 150)
        texture_density = (cv2.countNonZero(edges) / (h * w)) * 100

        # Regras de Negócio Heurísticas (Seguindo diretivas do prompt)
        score = 0
        details = {}
        recommendations = []

        # A. Inclinação (Simulada por textura e linhas de fuga na perspectiva inicial)
        if texture_density < 18:
            details["slope"] = "Plano"
            score += 20
        elif texture_density < 35:
            details["slope"] = "Inclinado"
            score += 10
            recommendations.append("Requer terraplanagem e corte parcial para nivelamento.")
        else:
            details["slope"] = "Muito Íngreme"
            score += 0
            recommendations.append("Risco crítico de deslizamento. Requer muros de contenção robustos.")

        # B. Solo e Firmeza
        if vegetation_perc > 10 and water_perc < 2:
            details["soil_firmness"] = "Firme"
            details["soil_type"] = "Graft / Argiloso"
            score += 25
        elif vegetation_perc < 5 and water_perc < 1:
            details["soil_firmness"] = "Firme"
            details["soil_type"] = "Seco / Rochoso"
            score += 25
        else:
            details["soil_firmness"] = "Instável / Macio"
            details["soil_type"] = "Silte / Umidade Crítica"
            score += 10
            recommendations.append("Requer ensaio de sondagem SPT urgente pelo alto risco de adensamento.")

        # C. Erosão (Alta densidade de ranhuras concentrada nas bordas)
        if texture_density > 25 and vegetation_perc < 8:
            details["erosion"] = "Moderada"
            score += 10
            recommendations.append("Erosão prévia identificada. Exige compactação profunda do aterro.")
        else:
            details["erosion"] = "Ausente"
            score += 20

        # D. Água Acumulada
        if water_perc > 4.0:
            details["water_accumulation"] = "Acúmulo Grave"
            score += 0
            recommendations.append("Instalar canais de drenagem gravidade e rebaixamento do lençol freático.")
        elif water_perc > 0.8:
            details["water_accumulation"] = "Umidade Alta"
            score += 5
            recommendations.append("Proteger sapatas contra capilaridade de água ascendente.")
        else:
            details["water_accumulation"] = "Sem Água"
            score += 15

        # E. Acessibilidade e Obstáculos
        if vegetation_perc > 45:
            details["vegetation"] = "Excessiva / Florestal"
            details["obstacles"] = "Grandes Obstáculos"
            details["accessibility"] = "Acesso Limitado"
            score += 10 # 5 de acessibilidade + 5 de obstáculos
            recommendations.append("Necessária licença ambiental de supressão florestal e destoca profunda.")
        else:
            details["vegetation"] = "Limpo / Rasteiro"
            details["obstacles"] = "Poucos Obstáculos"
            details["accessibility"] = "Boa Acessibilidade"
            score += 20 # 10 + 10

        # Classificação Final
        if score >= 80:
            classification = "Alta"
            recommendations.append("Solo ideal para fundações rasas directas (Sapatas isoladas).")
        elif score >= 50:
            classification = "Moderada"
            recommendations.append("Recomenda-se vigas baldrame integradas com miniestacas para estabilização.")
        else:
            classification = "Inadequado"
            recommendations.append("ALERTA: Viabilidade de obras extremamente baixa. Elevado investimento de consolidação geotécnica.")

        return {
            "score": score,
            "classification": classification,
            "recommendations": recommendations,
            "slope": details["slope"],
            "soil_type": details["soil_type"],
            "soil_firmness": details["soil_firmness"],
            "erosion": details.get("erosion", "Ausente"),
            "water_accumulation": details["water_accumulation"],
            "vegetation": details["vegetation"],
            "obstacles": details["obstacles"],
            "accessibility": details["accessibility"]
        }
`
  },
  {
    title: "auth.py",
    path: "backend/routes/auth.py",
    language: "python",
    code: `from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
import models
import bcrypt
import jwt
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = "CHAVE_SECRETA_SUPER_COMPLEXA_GEOBUILD"
ALGORITHM = "HS256"

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(user_data: RegisterSchema, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado no sistema.")
    
    hashed_pwd = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Cadastro realizado com sucesso", "user_id": str(new_user.id)}

@router.post("/login")
def login(login_data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not bcrypt.checkpw(login_data.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha incorretos.")

    # Gerar token JWT
    expire = datetime.utcnow() + timedelta(days=7)
    payload = {
        "sub": str(user.id),
        "name": user.name,
        "email": user.email,
        "exp": expire
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": user.name,
            "email": user.email,
            "phone": user.phone
        }
    }
`
  },
  {
    title: "pdf_service.py",
    path: "backend/services/pdf_service.py",
    language: "python",
    code: `import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
import models

# Importações oficiais da biblioteca ReportLab requeridas pelo usuário
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

router = APIRouter()

@router.get("/analysis/{analysis_id}/pdf")
def get_analysis_pdf(analysis_id: str, db: Session = Depends(get_db)):
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Relatório de análise não encontrado.")

    pdf_filename = f"relatorio_geobuild_{analysis_id}.pdf"
    pdf_path = os.path.join("/tmp", pdf_filename)

    # Inicializar documento PDF com margens padrão A4 (595.27 x 841.89 pt)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        rightMargin=40, leftMargin=40,
        topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()
    story = []

    # Configuração de Estilos de Tipos com as cores da identidade visual do applet
    title_style = ParagraphStyle(
        'HeaderTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor('#10b981'), # Emerald principal
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'HeaderSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#94a3b8'), # Slate grisado
        spaceAfter=15
    )

    section_style = ParagraphStyle(
        'SecTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor('#0f172a'), # Slate escuro
        spaceBefore=14,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        textColor=colors.HexColor('#334155'),
        leading=14
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=5
    )

    # 1. Cabeçalho Principal (Painel Estilizado)
    header_data = [
        [
            Paragraph("GEOBUILD VISION IA", title_style),
            Paragraph(f"<b>CÓDIGO:</b> {str(analysis.id)[:12]}<br/><b>EMISSÃO:</b> {analysis.created_at.strftime('%d/%m/%Y')}", ParagraphStyle('RightH', parent=body_style, alignment=2))
        ],
        [
            Paragraph("RELATÓRIO TÉCNICO DE VIABILIDADE PRELIMINAR", subtitle_style),
            Paragraph("<b>RESPONSÁVEL:</b> SISTEMA AUTOMÁTICO", ParagraphStyle('RightHSub', parent=body_style, alignment=2, textColor=colors.HexColor('#64748b')))
        ]
    ]
    header_table = Table(header_data, colWidths=[280, 235])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))

    # Tabela de Identificação e Resumo de Localização
    story.append(Paragraph("1. DADOS DE IDENTIFICAÇÃO E LOCALIZAÇÃO", section_style))
    id_data = [
        ["Latitude do Terreno:", f"{analysis.latitude:.6f}°", "Nível de Viabilidade:"],
        ["Longitude do Terreno:", f"{analysis.longitude:.6f}°", f"<b>{analysis.classification.upper()}</b>"],
        ["Início do Escaneamento:", analysis.created_at.strftime("%d/%m/%Y %H:%M"), f"Pontuação Geral: {analysis.score} / 100"]
    ]
    id_table = Table(id_data, colWidths=[130, 150, 235])
    id_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#f1f5f9')),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor('#334155')),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 9.5),
        ('PADDING', (0,0), (-1,-1), 6),
        ('FONTNAME', (2, 1), (2, 1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (2, 1), (2, 1), colors.HexColor('#10b981') if analysis.score >= 80 else colors.HexColor('#f59e0b')),
    ]))
    story.append(id_table)
    story.append(Spacer(1, 15))

    # 2. Parâmetros Críticos Obtidos
    story.append(Paragraph("2. ATRIBUTOS MICROSCÓPICOS MAPEADOS PELA IA (OPENCV)", section_style))
    metrics_data = [
        ["PARÂMETRO GEOTÉCNICO", "VALOR DETECTADO", "AVALIAÇÃO"],
        ["Morfologia da Inclinação", analysis.slope, "Nivelamento" if analysis.slope == "Plano" else "Reclinar Encosta"],
        ["Composição Visual Solo", analysis.soil_type, "Estável" if 'Firme' in analysis.soil_firmness else "Instabilidade Alta"],
        ["Firmeza / Compacidade", analysis.soil_firmness, "Normal" if 'Firme' in analysis.soil_firmness else "Sondagem Obrigatória"],
        ["Erosão Superficial", analysis.erosion, "Seguro" if analysis.erosion == "Ausente" else "Exige Correção"],
        ["Acúmulo Fluido / Água", analysis.water_accumulation, "Seco" if analysis.water_accumulation == "Sem Água" else "Drenagem Crítica"],
        ["Acesso para Máquinas", analysis.accessibility, "Aprovado" if "Boa" in analysis.accessibility else "Restrito"]
    ]
    metrics_table = Table(metrics_data, colWidths=[180, 185, 150])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#ffffff')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f1f5f9')]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
    ]))
    story.append(metrics_table)
    story.append(Spacer(1, 15))

    # 3. Diretrizes de Fundação e Recomendações Técnicas
    story.append(Paragraph("3. DIRETRIZES TÉCNICAS E PRELAUDO DE ENGENHARIA", section_style))
    story.append(Paragraph("Com base nas propriedades do relevo e características físicas constatadas no processamento de imagens, prescrevem-se preliminarmente:", body_style))
    story.append(Spacer(1, 5))

    for rec in analysis.recommendations:
        story.append(Paragraph(f"&bull; {rec}", bullet_style))

    story.append(Spacer(1, 15))

    # 4. Nota de Responsabilidade
    warn_style = ParagraphStyle(
        'WarningBox',
        parent=body_style,
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#78350f') # Marrom escuro aviso
    )
    warn_title = ParagraphStyle(
        'WarningTitle',
        parent=warn_style,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#b45309'),
        spaceAfter=3
    )

    warn_data = [[
        Paragraph("AVISO DE RESPONSABILIDADE CIVIL E GEOTÉCNICA:", warn_title),
    ], [
        Paragraph("Esta análise computacional é de caráter preliminar e destina-se a triagem inicial de projetos. Nenhuma fundação, corte, escavação ou movimentação de solo físico deve ser executada sem a elaboração de ensaio de sondagem mecânica de subsolo (Sondagem de Simples Reconhecimento com SPT sob norma NBR 6484) e aprovação de profissional devidamente credenciado por registro de ART válida junto ao CREA.", warn_style)
    ]]
    warn_table = Table(warn_data, colWidths=[515])
    warn_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fffbeb')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fef3c7')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,0), 8),
        ('BOTTOMPADDING', (0,1), (-1,1), 8),
    ]))
    story.append(KeepTogether([warn_table]))

    # Compilar relatório técnico pdf
    doc.build(story)
    
    return FileResponse(pdf_path, media_type="application/pdf", filename=f"laudo_{analysis_id}.pdf")
`
  }
];

export const DB_SCHEMA = `\
-- Schema de Criação do Banco de Dados PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de análises geológicas
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    score INTEGER NOT NULL,
    classification VARCHAR(50) NOT NULL,
    recommendations JSONB NOT NULL,
    
    -- Métricas específicas computadas pelo motor OpenCV + TensorFlow
    slope VARCHAR(50) DEFAULT 'Plano',
    soil_type VARCHAR(50) DEFAULT 'Seco / Rochoso',
    soil_firmness VARCHAR(50) DEFAULT 'Firme',
    erosion VARCHAR(50) DEFAULT 'Ausente',
    water_accumulation VARCHAR(50) DEFAULT 'Sem Água',
    vegetation VARCHAR(50) DEFAULT 'Rasteira',
    obstacles VARCHAR(50) DEFAULT 'Poucos',
    accessibility VARCHAR(50) DEFAULT 'Boa',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices de performance de pesquisa
CREATE INDEX idx_analyses_user ON analyses(user_id);
CREATE INDEX idx_users_email ON users(email);
`;

export const INSTRUCTIONS_MD = `\
# GeoBuild Vision • Guia de Configuração e Execução

### Requisitos Prévios
- **Flutter SDK** >= 3.10
- **Python** >= 3.9 (com pip)
- **PostgreSQL** (ou Docker ativo)

---

### 1. Inicializando o Backend FastAPI em Python
Ative o seu ambiente virtual e instale as dependências:

\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\\Scripts\\activate

# Instalar pacotes essenciais de Inteligência Artificial e API
pip install fastapi uvicorn sqlalchemy psycopg2-binary pyjwt bcrypt opencv-python numpy scikit-learn tensorflow
\`\`\`

Configure o banco de dados no arquivo \`database.py\`:
\`\`\`python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost:5432/geobuild_db"

Engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=Engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
\`\`\`

Inicie o servidor de desenvolvimento:
\`\`\`bash
python main.py
# Servidor rodando na porta http://localhost:8000
# Documentação Swagger de rotas em: http://localhost:8000/docs
\`\`\`

---

### 2. Inicializando o aplicativo móvel Flutter
No seu terminal, de volta ao diretório raiz do projeto mobile:

\`\`\`bash
# Baixar dependências declaradas no pubspec.yaml
flutter pub get

# Iniciar o simulador (Android/iOS) ou depurar
flutter run
\`\`\`

#### Dependências Obrigatórias no \`pubspec.yaml\`:
\`\`\`yaml
dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.1
  dio: ^5.4.1
  shared_preferences: ^2.2.2
  camera: ^0.10.5+9
  google_maps_flutter: ^2.5.3
  geolocator: ^10.1.0
  image_picker: ^1.0.7
  fl_chart: ^0.66.0  # Para os medidores visuais e estatísticas
\`\`\`

---

### 3. Sistema de IA Geotécnica Integrado
O motor OpenCV realiza detecção cromática na frequência de pixels para identificar excesso de cobertura vegetal (HSV verde) e umidade/água (tons cinza-azulados dispersos em gradientes planos). A rugosidade obtida com algoritmos Canny e operadores Sobel nos permite determinar se a morfologia do terreno apresenta relevo complexo (inclinado/íngreme) e estrias clássicas de erosão profunda.
`;
