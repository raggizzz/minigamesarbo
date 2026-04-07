// ============================================
// ArboGame â€” Level Configurations
// ============================================

import { LevelConfig } from '../types/game';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Perigo em Casa',
    subtitle: 'Nivel 1',
    emoji: '🏠',
    district: 'Residencial Primavera',
    threatLevel: 'Baixa',
    description: 'Encontre e elimine os focos do mosquito dentro e ao redor da casa.',
    briefing:
      'Os primeiros alertas vieram de uma casa com rotina desorganizada. Identifique rapido os focos domesticos antes que o mosquito ganhe terreno.',
    supportTip:
      'Comece pelos recipientes mais obvios e proteja suas vidas. Uma operacao limpa aqui garante ritmo para o restante da campanha.',
    timeLimit: 90,
    lives: 3,
    objective: 'Eliminar 4 focos em ate 90 segundos',
    mechanic: 'tap_action',
    educationalMessage:
      'Agua parada em recipientes pequenos ja pode virar foco do mosquito. Verifique sua casa regularmente!',
    bonusObjective: {
      type: 'preserve_lives',
      title: 'Operacao Limpa',
      description: 'Conclua a missao sem perder nenhuma vida.',
      rewardText: 'Insignia Casa Blindada',
      target: 3,
    },
    badge: {
      id: 'casa_blindada',
      name: 'Casa Blindada',
      icon: '🛡️',
      description: 'Voce neutralizou os focos domesticos sem cometer erros.',
    },
    maxScore: 1400,
  },
  {
    id: 2,
    name: 'Mutirao de Limpeza',
    subtitle: 'Nivel 2',
    emoji: '🧹',
    district: 'Setor das Oficinas',
    threatLevel: 'Media',
    description: 'Remova criadouros de mosquitos nas areas externas.',
    briefing:
      'O risco saiu de dentro das casas e agora esta espalhado pela rua. Ferramentas erradas atrasam o mutirao e deixam a infestacao crescer.',
    supportTip:
      'Leia a cena antes de agir. Ferramenta certa, local certo e rapidez vao te colocar na frente da liga local.',
    timeLimit: 80,
    lives: 3,
    objective: 'Resolver todos os problemas antes do tempo acabar',
    mechanic: 'drag_drop',
    educationalMessage:
      'Manter quintais e ruas limpos ajuda a evitar surtos de doencas transmitidas por mosquitos.',
    bonusObjective: {
      type: 'finish_fast',
      title: 'Resposta Relampago',
      description: 'Finalize o mutirao com pelo menos 25 segundos sobrando.',
      rewardText: 'Insignia Equipe Turbo',
      target: 25,
    },
    badge: {
      id: 'equipe_turbo',
      name: 'Equipe Turbo',
      icon: '⚡',
      description: 'Seu mutirao foi rapido o bastante para conter a rua antes da chuva.',
    },
    maxScore: 1600,
  },
  {
    id: 3,
    name: 'Sinais de Alerta',
    subtitle: 'Nivel 3',
    emoji: '🏥',
    district: 'Posto Sentinela',
    threatLevel: 'Media',
    description: 'Identifique os sintomas das arboviroses.',
    briefing:
      'Agora o desafio e clinico. A cidade precisa de agentes que saibam orientar a comunidade e reconhecer sinais de risco com precisao.',
    supportTip:
      'Mantenha a calma e mire em alta precisao. O posto quer respostas confiaveis, nao apenas velocidade.',
    timeLimit: 120,
    lives: 3,
    objective: 'Acertar pelo menos 80% das respostas',
    mechanic: 'quiz',
    educationalMessage:
      'Febre, dor no corpo e manchas podem ser sinais importantes. Procure orientacao de saude!',
    bonusObjective: {
      type: 'accuracy',
      title: 'Triagem de Elite',
      description: 'Feche a rodada com 90% ou mais de precisao.',
      rewardText: 'Insignia Radar Clinico',
      target: 0.9,
    },
    badge: {
      id: 'radar_clinico',
      name: 'Radar Clinico',
      icon: '🩺',
      description: 'Voce conduziu uma triagem de alta confianca.',
    },
    maxScore: 1800,
  },
  {
    id: 4,
    name: 'Proteja a Comunidade',
    subtitle: 'Nivel 4',
    emoji: '🏘️',
    district: 'Bairro Novo Horizonte',
    threatLevel: 'Alta',
    description: 'Ajude o bairro inteiro a eliminar focos do mosquito.',
    briefing:
      'A infestacao ja comecou a avancar entre os setores do bairro. Escolha prioridades com inteligencia e reduza a pressao antes que a situacao saia do controle.',
    supportTip:
      'Nao deixe a barra de infestacao subir demais. Cada acerto importa e cada erro custa caro para a comunidade.',
    timeLimit: 100,
    lives: 3,
    objective: 'Salvar o bairro antes da infestacao crescer',
    mechanic: 'map_missions',
    educationalMessage:
      'O combate as arboviroses depende de toda a comunidade. Cada pessoa faz a diferenca!',
    bonusObjective: {
      type: 'infestation_cap',
      title: 'Bairro Estavel',
      description: 'Conclua mantendo a infestacao final abaixo de 45%.',
      rewardText: 'Insignia Defesa Coletiva',
      target: 45,
    },
    badge: {
      id: 'defesa_coletiva',
      name: 'Defesa Coletiva',
      icon: '🏘️',
      description: 'O bairro se manteve funcional mesmo sob alta pressao.',
    },
    maxScore: 2000,
  },
  {
    id: 5,
    name: 'Missao Dengue Zero',
    subtitle: 'Nivel 5',
    emoji: '🦟',
    district: 'Zona de Contencao Central',
    threatLevel: 'Critica',
    description: 'Enfrente a missao final com tudo que aprendeu!',
    briefing:
      'Toda a cidade esta olhando para sua equipe. Essa operacao mistura campo e conhecimento e define quem vai liderar a resposta contra o surto.',
    supportTip:
      'Encaixe uma boa sequencia de acertos e use o combo para virar a partida. Aqui voce precisa jogar como comandante.',
    timeLimit: 120,
    lives: 3,
    objective: 'Controlar o surto e zerar a infestacao',
    mechanic: 'mixed',
    educationalMessage:
      'Prevenir e sempre melhor do que remediar. Voce e um verdadeiro Agente Mirim da Saude!',
    bonusObjective: {
      type: 'combo',
      title: 'Ofensiva Perfeita',
      description: 'Atinja combo maximo de pelo menos x5 na operacao final.',
      rewardText: 'Insignia Dengue Zero',
      target: 5,
    },
    badge: {
      id: 'dengue_zero',
      name: 'Dengue Zero',
      icon: '🏆',
      description: 'Voce liderou a operacao final com consistencia de elite.',
    },
    maxScore: 2500,
  },
];

export const getLevelConfig = (id: number): LevelConfig | undefined => {
  return LEVELS.find((level) => level.id === id);
};
