export type TrainingModeId = 'classificar' | 'responder' | 'triagem';

export interface TrainingChoice {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface TrainingPrompt {
  id: string;
  prompt: string;
  context: string;
  lesson: string;
  choices: TrainingChoice[];
}

export interface TrainingMode {
  id: TrainingModeId;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  deck: TrainingPrompt[];
}

export const TRAINING_MODES: TrainingMode[] = [
  {
    id: 'classificar',
    title: 'Classificar focos',
    subtitle: 'Leitura rapida de risco',
    description: 'Analise a cena e decida se o item representa foco real ou situacao segura.',
    accent: '#5B7F63',
    deck: [
      {
        id: 'c1',
        prompt: 'Prato de planta com agua acumulada depois da chuva.',
        context: 'Sala de casa com pouco sol e agua parada por dois dias.',
        lesson: 'Pratos e recipientes rasos precisam ficar secos para nao virarem criadouros.',
        choices: [
          { id: 'c1_a', label: 'Risco', isCorrect: true, feedback: 'Ha agua parada e potencial de criadouro.' },
          { id: 'c1_b', label: 'Seguro', isCorrect: false, feedback: 'Nao esta seguro: agua acumulada favorece o mosquito.' },
        ],
      },
      {
        id: 'c2',
        prompt: 'Caixa d agua bem fechada e sem rachaduras.',
        context: 'Residencia com manutencao em dia.',
        lesson: 'Recipientes bem vedados e sem aculo de agua exposta ajudam a bloquear o mosquito.',
        choices: [
          { id: 'c2_a', label: 'Risco', isCorrect: false, feedback: 'Nao ha exposicao de agua nesse caso.' },
          { id: 'c2_b', label: 'Seguro', isCorrect: true, feedback: 'Correto: recipiente vedado nao oferece criadouro.' },
        ],
      },
      {
        id: 'c3',
        prompt: 'Pneu velho no quintal sem cobertura.',
        context: 'Material esquecido perto do muro.',
        lesson: 'Pneus acumulam agua facilmente e devem ser descartados ou mantidos cobertos.',
        choices: [
          { id: 'c3_a', label: 'Risco', isCorrect: true, feedback: 'Pneus expostos sao focos frequentes.' },
          { id: 'c3_b', label: 'Seguro', isCorrect: false, feedback: 'Nao esta seguro: o pneu retem agua da chuva.' },
        ],
      },
      {
        id: 'c4',
        prompt: 'Garrafa vazia virada para baixo e guardada em local coberto.',
        context: 'Area de servico organizada.',
        lesson: 'Recipientes virados e protegidos da chuva reduzem o risco de agua parada.',
        choices: [
          { id: 'c4_a', label: 'Risco', isCorrect: false, feedback: 'Nessa condicao, a garrafa nao acumula agua.' },
          { id: 'c4_b', label: 'Seguro', isCorrect: true, feedback: 'Correto: recipiente seco e invertido esta protegido.' },
        ],
      },
    ],
  },
  {
    id: 'responder',
    title: 'Resposta rapida',
    subtitle: 'Decisao de campo',
    description: 'Receba um alerta e escolha a medida preventiva mais adequada para a situacao.',
    accent: '#486B7B',
    deck: [
      {
        id: 'r1',
        prompt: 'Morador relata balde com agua no quintal.',
        context: 'O recipiente precisa continuar no local para uso da familia.',
        lesson: 'Quando o recipiente precisa permanecer, a melhor acao e tampar corretamente.',
        choices: [
          { id: 'r1_a', label: 'Tampar recipiente', isCorrect: true, feedback: 'A cobertura impede novos ovos e protege o uso do balde.' },
          { id: 'r1_b', label: 'Ignorar', isCorrect: false, feedback: 'Ignorar mantem a agua exposta ao mosquito.' },
          { id: 'r1_c', label: 'Apenas reportar', isCorrect: false, feedback: 'Aqui ha uma acao imediata melhor antes do reporte.' },
        ],
      },
      {
        id: 'r2',
        prompt: 'Calha com folhas, barro e agua acumulada.',
        context: 'Casa em rua com risco de nova chuva.',
        lesson: 'Desobstruir e limpar a calha restaura o escoamento da agua.',
        choices: [
          { id: 'r2_a', label: 'Limpar o foco', isCorrect: true, feedback: 'Remover folhas e barro resolve a agua parada.' },
          { id: 'r2_b', label: 'Tampar calha', isCorrect: false, feedback: 'Tampar nao resolve o entupimento nem o escoamento.' },
          { id: 'r2_c', label: 'Esvaziar manualmente', isCorrect: false, feedback: 'So retirar a agua nao impede novo acumulo.' },
        ],
      },
      {
        id: 'r3',
        prompt: 'Piscina abandonada com agua verde.',
        context: 'Area externa sem manutencao ha semanas.',
        lesson: 'Locais amplos com agua suja exigem limpeza adequada e tratamento do foco.',
        choices: [
          { id: 'r3_a', label: 'Limpar o foco', isCorrect: true, feedback: 'Correto: o foco precisa de limpeza e tratamento.' },
          { id: 'r3_b', label: 'Tampar recipiente', isCorrect: false, feedback: 'Nao ha como resolver com tampa nesse caso.' },
          { id: 'r3_c', label: 'Ignorar', isCorrect: false, feedback: 'Ignorar amplia o risco para toda a vizinhanca.' },
        ],
      },
      {
        id: 'r4',
        prompt: 'Terreno baldio com muitos recipientes espalhados.',
        context: 'O local exige apoio de adultos e servico publico.',
        lesson: 'Quando o risco ultrapassa a acao imediata de uma pessoa, o reporte faz parte da resposta correta.',
        choices: [
          { id: 'r4_a', label: 'Reportar risco', isCorrect: true, feedback: 'Correto: o local precisa de acao coordenada.' },
          { id: 'r4_b', label: 'Esvaziar um unico recipiente', isCorrect: false, feedback: 'Isso ajuda pouco diante do risco amplo.' },
          { id: 'r4_c', label: 'Ignorar', isCorrect: false, feedback: 'Ignorar deixa a comunidade desprotegida.' },
        ],
      },
    ],
  },
  {
    id: 'triagem',
    title: 'Triagem sentinela',
    subtitle: 'Leitura de sintomas',
    description: 'Ouça o caso e escolha a orientacao mais prudente para a familia e para a comunidade.',
    accent: '#8A6A3E',
    deck: [
      {
        id: 't1',
        prompt: 'Pessoa com febre alta, dores no corpo e manchas vermelhas.',
        context: 'Os sintomas surgiram de forma rapida.',
        lesson: 'Sinais combinados exigem avaliacao profissional e nao devem ser minimizados.',
        choices: [
          { id: 't1_a', label: 'Procurar unidade de saude', isCorrect: true, feedback: 'Correto: ha sinais que merecem avaliacao adequada.' },
          { id: 't1_b', label: 'Esperar varios dias sem observar', isCorrect: false, feedback: 'Esperar sem orientacao pode agravar o quadro.' },
          { id: 't1_c', label: 'Focar apenas em limpar o quintal', isCorrect: false, feedback: 'Combater focos importa, mas a pessoa precisa de orientacao clinica.' },
        ],
      },
      {
        id: 't2',
        prompt: 'Pessoa com febre leve e boa hidratacao, sem sinais de gravidade.',
        context: 'A familia ja eliminou focos em casa e esta observando o quadro.',
        lesson: 'Acompanhamento, hidratacao e observacao dos sinais sao importantes quando nao ha agravamento imediato.',
        choices: [
          { id: 't2_a', label: 'Hidratar e monitorar sinais', isCorrect: true, feedback: 'Correto: siga atento a mudancas e busque atendimento se piorar.' },
          { id: 't2_b', label: 'Suspender toda observacao', isCorrect: false, feedback: 'Mesmo quadros leves pedem acompanhamento.' },
          { id: 't2_c', label: 'Ignorar os sintomas', isCorrect: false, feedback: 'Ignorar atrasa a percepcao de piora.' },
        ],
      },
      {
        id: 't3',
        prompt: 'Morador com dor intensa e fraqueza apos varios dias de febre.',
        context: 'A familia esta insegura sobre o que fazer.',
        lesson: 'Persistencia ou agravamento dos sintomas aumenta a necessidade de buscar atendimento.',
        choices: [
          { id: 't3_a', label: 'Procurar unidade de saude', isCorrect: true, feedback: 'Correto: ha sinal de agravamento do quadro.' },
          { id: 't3_b', label: 'Manter a rotina sem orientacao', isCorrect: false, feedback: 'Nesse caso a familia nao deve apenas esperar.' },
          { id: 't3_c', label: 'Pensar so na limpeza da rua', isCorrect: false, feedback: 'Prevenir continua importante, mas o morador precisa de atencao agora.' },
        ],
      },
      {
        id: 't4',
        prompt: 'Familia pergunta se combater focos ainda importa quando alguem ja esta doente.',
        context: 'Ha criadouros pequenos no quintal.',
        lesson: 'Cuidar da pessoa e eliminar criadouros sao acoes complementares para reduzir novos casos.',
        choices: [
          { id: 't4_a', label: 'Cuidar da pessoa e eliminar focos', isCorrect: true, feedback: 'Correto: saude e prevencao caminham juntas.' },
          { id: 't4_b', label: 'Ignorar o quintal', isCorrect: false, feedback: 'O risco para outros moradores continua existindo.' },
          { id: 't4_c', label: 'Pensar so no quintal', isCorrect: false, feedback: 'A pessoa com sintomas tambem precisa de cuidado.' },
        ],
      },
    ],
  },
];
