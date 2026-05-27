import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  HeadingLevel, 
  AlignmentType, 
  WidthType, 
  BorderStyle,
  Header,
  Footer
} from "docx";

// Paleta de cores corporativa baseada no Colégio Exemplar
const COLORS = {
  primary: "1E3A8A",      // Azul Marinho Imperial (Slate/Blue 900)
  secondary: "2563EB",    // Azul Real Francês
  accent: "10B981",       // Verde Esmeralda (Sucesso/Aprovado)
  lightBg: "F8FAFC",      // Slate 50 (Fundo suave para tabelas)
  darkBg: "1E3A8A",       // Fundo Marinho
  textDark: "334155",     // Cinza Escuro (Texto secundário)
  textMain: "0F172A",     // Preto Azulado (Texto principal)
  border: "E2E8F0",       // Cinza claro para bordas
  white: "FFFFFF"
};

// Tamanhos de fonte em meias-unidades (half-points / Pt * 2)
const FONTS = {
  title: 52,        // 26 pt
  subtitle: 36,     // 18 pt
  h1: 28,           // 14 pt
  h2: 24,           // 12 pt
  body: 21,         // 10.5 pt
  caption: 16,      // 8 pt
  mono: 18          // 9 pt
};

// Helper para criar margem de parágrafo consistente (em dxa / twips)
const spacingHelper = (before: number = 120, after: number = 120) => ({
  before,
  after,
  line: 276 // Espaçamento entre linhas (~1.15)
});

// Helper para gerar parágrafos comuns de texto
function createParagraph(text: string, options: { bold?: boolean; italics?: boolean; color?: string; size?: number; align?: any; spaceBefore?: number; spaceAfter?: number } = {}) {
  return new Paragraph({
    alignment: options.align || AlignmentType.LEFT,
    spacing: spacingHelper(options.spaceBefore, options.spaceAfter),
    children: [
      new TextRun({
        text,
        bold: options.bold,
        italics: options.italics,
        color: options.color || COLORS.textMain,
        size: options.size || FONTS.body,
        font: "Segoe UI"
      })
    ]
  });
}

// Helper para gerar parágrafos estilo título
function createHeading(text: string, level: any, spaceBefore: number = 240, spaceAfter: number = 120) {
  let size = FONTS.h1;
  let color = COLORS.primary;
  
  if (level === HeadingLevel.HEADING_2) {
    size = FONTS.h2;
    color = COLORS.secondary;
  }
  
  return new Paragraph({
    heading: level,
    spacing: spacingHelper(spaceBefore, spaceAfter),
    children: [
      new TextRun({
        text,
        bold: true,
        color: color,
        size: size,
        font: "Segoe UI"
      })
    ]
  });
}

// Helper para criar "Bullet Points"
function createBulletPoint(text: string, boldPrefix?: string) {
  const children: TextRun[] = [];
  
  if (boldPrefix) {
    children.push(new TextRun({
      text: boldPrefix,
      bold: true,
      color: COLORS.primary,
      size: FONTS.body,
      font: "Segoe UI"
    }));
  }
  
  children.push(new TextRun({
    text: text,
    color: COLORS.textDark,
    size: FONTS.body,
    font: "Segoe UI"
  }));

  return new Paragraph({
    bullet: {
      level: 0
    },
    spacing: spacingHelper(60, 60),
    children: children
  });
}

// Helper para encapsular código ou blocos destacados
function createQuoteBlock(lines: string[]) {
  const cells = lines.map(line => {
    return new TableRow({
      children: [
        new TableCell({
          shading: { fill: COLORS.lightBg },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [
            new Paragraph({
              spacing: { before: 0, after: 0, line: 240 },
              children: [
                new TextRun({
                  text: line,
                  font: "Segoe UI",
                  italics: true,
                  size: FONTS.body,
                  color: "1E3A8A"
                })
              ]
            })
          ]
        })
      ]
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border },
      left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.primary }, // borda azul marinho estilosa na esquerda
      right: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border }
    },
    rows: cells
  });
}

// Função principal que monta o documento Word do Portal Colégio Exemplar
export function generateTechnicalReportDocx(): Document {
  return new Document({
    title: "Projeto Pedagógico e Manual do Aluno - Colégio Exemplar",
    description: "Orientações Oficiais de Diretrizes Pedagógicas, Calendário Acadêmico e Manual Institucional",
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 120 },
                children: [
                  new TextRun({
                    text: "Colégio Exemplar — Projeto Pedagógico e Manual Institucional 2026 ",
                    bold: true,
                    size: FONTS.caption,
                    color: COLORS.primary,
                    font: "Segoe UI"
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120, after: 0 },
                children: [
                  new TextRun({
                    text: "Documento Oficial • Colégio Exemplar • Direção e Planejamento Pedagógico",
                    size: FONTS.caption,
                    color: "94A3B8",
                    font: "Segoe UI"
                  })
                ]
              })
            ]
          })
        },
        children: [
          // Banner Título Principal
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            children: [
              new TextRun({
                text: "PROJETO PEDAGÓGICO INSTITUCIONAL",
                bold: true,
                color: COLORS.primary,
                size: FONTS.title,
                font: "Segoe UI"
              })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 300 },
            children: [
              new TextRun({
                text: "COLÉGIO EXEMPLAR (ANO LETIVO 2026)",
                bold: true,
                color: COLORS.secondary,
                size: FONTS.subtitle,
                font: "Segoe UI"
              })
            ]
          }),

          // Box de Metadados / Versão / Autor
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 12, color: COLORS.primary },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: COLORS.primary },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: COLORS.lightBg },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 0, after: 0 },
                        children: [
                          new TextRun({
                            text: "Elaborado por: Direção Geral e Equipe de Orientação Pedagógica   |   São Paulo, SP   |   Documento de Referência",
                            italics: true,
                            bold: true,
                            size: 18,
                            color: COLORS.textDark,
                            font: "Segoe UI"
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 300, after: 0 } }),

          // 1. VISÃO GERAL DO COLEGIO
          createHeading("1. Apresentação e Missão do Colégio Exemplar", HeadingLevel.HEADING_1, 240, 100),
          createParagraph(
            "O Colégio Exemplar é uma instituição de ensino de referência, dedicada ao desenvolvimento integral de crianças e jovens desde a educação básica até o ensino médio técnico e humanista. Nosso compromisso fundamental reside em proporcionar uma educação de alta excelência acadêmica que estimula o pensamento crítico, a inovação científica, a responsabilidade ambiental e social, e a cidadania ativa e atuante.",
            { spaceBefore: 60, spaceAfter: 100 }
          ),
          createParagraph(
            "Nosso projeto pedagógico moderno contempla a articulação entre as teorias científicas tradicionais e laboratórios integrados de desenvolvimento lógico-tecnológico, arte, esporte, bem como apoio emocional e psicológico individualizado aos discentes através de psicopedagogas seniores.",
            { spaceBefore: 60, spaceAfter: 200 }
          ),

          // 2. FILOSOFIA DIDÁTICA E PILARES
          createHeading("2. Nossos Quatro Pilares Educacionais", HeadingLevel.HEADING_1, 240, 100),
          createParagraph(
            "Para guiar nossas práticas discentes e o trabalho do corpo docente, as atividades acadêmicas do Colégio Exemplar são enquadradas na estrutura de quatro pilares didáticos fundamentais:",
            { spaceBefore: 60, spaceAfter: 120 }
          ),

          createQuoteBlock([
            "Pilar I - Investigação Científica Proativa: Ensinamos o aluno a formular hipóteses e buscar soluções concretas.",
            "Pilar II - Tecnologia Aplicada: Integração ativa com sistemas computacionais, laboratório de programação mecânica e robótica.",
            "Pilar III - Inteligência Emocional: Orientação humanitária constante, psicopedagogia ativa e respeito mútuo.",
            "Pilar IV - Liderança Cívica e Global: Preparação de jovens empreendedores conscientes de seu papel de impacto no mundo."
          ]),

          new Paragraph({ spacing: { before: 180, after: 0 } }),

          createHeading("2.1. Organização Curricular Integrada", HeadingLevel.HEADING_2, 180, 80),
          createBulletPoint("Projetos Multidisciplinares: Feiras científicas e olimpíadas de programação, matemática e oratória ao longo do semestre.", "•  "),
          createBulletPoint("Grade Curricular Flexível: Inserção de itinerários informativos e trilhas de aprendizagem personalizáveis.", "•  "),
          createBulletPoint("Avaliação Multidimensional: Composta por provas cognitivas, projetos de inovação social e atitude colaborativa.", "•  "),

          // 3. CALENDÁRIO ACADÊMICO
          createHeading("3. Cronograma e Calendário Acadêmico 2026", HeadingLevel.HEADING_1, 240, 100),
          createParagraph(
            "A seguir é exposta a matriz cronológica oficial das atividades administrativas e letivas de nossa instituição do Ensino Fundamental e Ensino Médio:",
            { spaceAfter: 100 }
          ),

          // Tabela Descritiva dos Bimestres
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border },
              left: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border },
              right: { style: BorderStyle.SINGLE, size: 8, color: COLORS.border }
            },
            rows: [
              // Cabeçalho da Tabela
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: COLORS.primary },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    children: [new Paragraph({ children: [new TextRun({ text: "Período Letivo", bold: true, color: COLORS.white, size: FONTS.mono, font: "Segoe UI" })] })]
                  }),
                  new TableCell({
                    shading: { fill: COLORS.primary },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    children: [new Paragraph({ children: [new TextRun({ text: "Início / Fim", bold: true, color: COLORS.white, size: FONTS.mono, font: "Segoe UI" })] })]
                  }),
                  new TableCell({
                    shading: { fill: COLORS.primary },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                    children: [new Paragraph({ children: [new TextRun({ text: "Atividade Principal", bold: true, color: COLORS.white, size: FONTS.mono, font: "Segoe UI" })] })]
                  })
                ]
              }),
              // Linhas de dados
              new TableRow({
                children: [
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "1º Bimestre", bold: true, size: FONTS.mono, font: "Segoe UI" })] })] }),
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "Fev 02 a Abr 17", size: FONTS.mono, font: "Segoe UI" })] })] }),
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "Acolhimento discente, exames diagnósticos, planejamento escolar.", size: FONTS.mono, font: "Segoe UI" })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "2º Bimestre", bold: true, size: FONTS.mono, font: "Segoe UI" })] })] }),
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "Abr 22 a Jun 26", size: FONTS.mono, font: "Segoe UI" })] })] }),
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "Mostras de ciências integradas, exames bimestrais e entrega de boletins.", size: FONTS.mono, font: "Segoe UI" })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "3º Bimestre", bold: true, size: FONTS.mono, font: "Segoe UI" })] })] }),
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "Jul 21 a Out 02", size: FONTS.mono, font: "Segoe UI" })] })] }),
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "Intercâmbio cultural interno, gincanas de empreendedorismo, olimpíadas de robótica.", size: FONTS.mono, font: "Segoe UI" })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "4º Bimestre", bold: true, size: FONTS.mono, font: "Segoe UI" })] })] }),
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "Out 06 a Dez 11", size: FONTS.mono, font: "Segoe UI" })] })] }),
                  new TableCell({ margins: { top: 80, bottom: 80, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text: "Avaliações finais integradas, conselho de classe pedagógico, encerramento letivo.", size: FONTS.mono, font: "Segoe UI" })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 200, after: 0 } }),

          // 4. MANUAL DO ALUNO / REGULAMENTO ESCREITO
          createHeading("4. Manual do Aluno e Normas de Convivência", HeadingLevel.HEADING_1, 240, 100),
          createParagraph(
            "Visando preservar um espaço saudável, empático de segurança mútua, estabelecem-se as seguintes regras fundamentais de convivência no campus acadêmico:",
            { spaceAfter: 120 }
          ),

          createBulletPoint("Frequência Mínima Exigida: Conforme a legislação pedagógica LDB brasileira, é preciso cumprir frequência em no mínimo 75% das aulas presenciais.", "✔ "),
          createBulletPoint("Uso do Uniforme Escolar: Obrigatório em todas as dependências físicas da instituição ou participações externas oficiais do Colégio.", "✔ "),
          createBulletPoint("Pontualidade com Aulas e Ensaios: Entrada em sala permitida em no máximo 10 minutos de tolerância após sinal oficial.", "✔ "),
          createBulletPoint("Manuseio Tecnológico Responsável: Dispositivos eletrônicos pessoais devem estar guardados ou silenciados durante exposições docentes.", "✔ "),

          new Paragraph({ spacing: { before: 180, after: 0 } }),

          // 5. APRECIADOR E CONCLUSÃO
          createHeading("5. Compromisso com a Educação Contemporânea", HeadingLevel.HEADING_1, 240, 100),
          createParagraph(
            "Acreditamos que a parceria mútua entre família e instituição escolar constitui o verdadeiro motor do aprendizado exemplar. Disponibilizamos para os pais e alunos nossos canais digitais ativos integrados de ouvidoria para que cada estudante construa sua história de forma exemplar no ano letivo corrente.",
            { spaceAfter: 120 }
          ),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 0 },
            children: [
              new TextRun({
                text: "--- FIM DA APRESENTAÇÃO OFICIAL • COLÉGIO EXEMPLAR EDUCACIONAL ---",
                bold: true,
                size: 16,
                color: COLORS.primary,
                font: "Segoe UI"
              })
            ]
          })
        ]
      }
    ]
  });
}
