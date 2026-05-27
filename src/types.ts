/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  image_url: string;
  latitude: number;
  longitude: number;
  score: number;
  classification: "Alta" | "Moderada" | "Inadequado";
  recommendations: string[];
  created_at: string;
  
  // Detalhes da Análise Visual de Terreno
  slope: "Plano" | "Inclinado" | "Muito Íngreme";
  soil_type: string;
  soil_firmness: "Firme" | "Instável / Macio";
  erosion: "Ausente" | "Moderada" | "Grave";
  water_accumulation: "Sem Água" | "Umidade Alta" | "Acúmulo Grave";
  vegetation: "Limpo / Rasteiro" | "Média" | "Excessiva / Florestal";
  obstacles: "Ausente / Poucos" | "Moderados" | "Grandes Obstáculos";
  accessibility: "Boa Acessibilidade" | "Acesso Limitado" | "Sem Acesso";
  
  // Pontuações parciais calculadas
  scores: {
    slope: number;
    soil: number;
    erosion: number;
    water: number;
    accessibility: number;
    obstacles: number;
  };
}

export interface SourceFile {
  title: string;
  path: string;
  language: string;
  code: string;
}
