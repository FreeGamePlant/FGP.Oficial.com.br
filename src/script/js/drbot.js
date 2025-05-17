import { evaluateExpression } from '../../utils/math.js';

// Botões e storage para ensinar o bot
document.getElementById('teach-btn').addEventListener('click', () => {
  const question = prompt('Digite a pergunta que você quer ensinar ao bot:');
  const answer   = prompt('Digite a resposta para essa pergunta:');
  if (question && answer) {
    teachBot(question, answer);
    alert('Pergunta e resposta ensinadas com sucesso!');
  } else {
    alert('Pergunta ou resposta inválida. Tente novamente.');
  }
});

let customResponses = JSON.parse(localStorage.getItem('customResponses')) || {};

function teachBot(question, answer) {
  customResponses[question.toLowerCase()] = answer;
  localStorage.setItem('customResponses', JSON.stringify(customResponses));
}

// Inicializa o chat
function initializeChat() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) {
    console.error('Elemento chat-box não encontrado.');
    return;
  }
  const botMessage = createMessage(
    'Dr. Bot Plant: Olá! Bem-vindo ao universo da nossa franquia! Pergunte sobre personagens, jogos, animações ou qualquer outra coisa!',
    'bot-message'
  );
  chatBox.appendChild(botMessage);
}

// Efeito typewriter
function typeWriter(element, text, speed = 50) {
  element.textContent = '';
  let i = 0;
  (function addChar() {
    if (i < text.length) {
      element.textContent += text.charAt(i++);
      setTimeout(addChar, speed);
    }
  })();
}

// Cria um elemento de mensagem
function createMessage(text, className) {
  const message = document.createElement('div');
  message.textContent = text; 
  message.classList.add(className);
  return message;
}

// Captura o input do usuário
async function handleUserInput() {
  const inputEl = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const text    = inputEl.value.trim();
  if (!text || !chatBox) return;

  // Mensagem do usuário
  const userMsg = createMessage(`Você: ${text}`, 'user-message');
  chatBox.appendChild(userMsg);
  inputEl.value = '';

  // Placeholder do bot
  const botMsg = createMessage('', 'bot-message');
  chatBox.appendChild(botMsg);
  chatBox.scrollTop = chatBox.scrollHeight;
  botMsg.classList.add('typing-animation');

  // Obter resposta
  const reply = await getBotResponse(text);
  botMsg.classList.remove('typing-animation');
  typeWriter(botMsg, `Dr. Bot Plant: ${reply}`, 50);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Resposta do bot (única função)
async function getBotResponse(input) {
  const lowerInput = input.toLowerCase();

  // 0) Checa customResponses ensinadas pelo usuário
  if (customResponses[lowerInput]) {
    return customResponses[lowerInput];
  }

  // 1) Expressão matemática?
  if (/^[0-9+\-*/().\s]+$/.test(lowerInput)) {
    try {
      const result = evaluateExpression(lowerInput);
      return `O resultado é: ${result}`;
    } catch {
      return 'Desculpe, não foi possível calcular essa expressão, veja se não há erro de digitação, por favor.';
    }
  }

  // 2) Dicionário geral
  const dictionary = {
    personagens: "Nossa franquia reúne personagens únicos: Ovynay, Iales e Dinoelai, cada um com uma história fascinante. Qual deles você gostaria de explorar mais?",
    jogos:        "Desenvolvemos jogos que combinam ação, aventura e enigmas históricos. Explore os nossos títulos para uma experiência imersiva e inovadora!",
    animações:    "Nossas animações dão vida a narrativas envolventes e visuais surpreendentes. Qual história animada você deseja conhecer?",
    lançamento:   "Estamos sempre lançando novidades! Fique atento às nossas redes sociais e à área de lançamentos para não perder nada.",
    história:     "A nossa franquia surgiu a partir de uma ideia visionária que evoluiu para um multiverso de aventuras. Cada capítulo guarda segredos para descobrir!",
    curiosidade:  "Sabia que cada personagem foi inspirado em elementos da história, ciência e cultura pop? Nosso universo é cheio de detalhes incríveis.",
    tecnologia:   "Utilizamos tecnologia de ponta para criar experiências imersivas, integrando narrativas emocionantes a mecânicas inovadoras.",
    universo:     "O universo da nossa franquia é vasto e interligado, onde jogos, animações e histórias se encontram para formar um todo surpreendente."
  };
  for (const key in dictionary) {
    if (lowerInput.includes(key)) {
      return dictionary[key];
    }
  }

  // 2.1) Sobre o criador/franquia
  if (lowerInput.includes('quem criou') || lowerInput.includes('criador') || lowerInput.includes('programador')) {
    return 'Dr. Bot Plant foi criado pelo Programador Elai Leonel Figueroa, da franquia FGP!';
  }
  if (lowerInput.includes('quando') && lowerInput.includes('fgp')) {
    return 'A franquia FGP foi criada em 2022!';
  }

  // 3) Respostas específicas de personagem
  if (lowerInput.includes('ovynay')) {
    const ovynay = [
      "Ovynay é o viajante do tempo que desafia as barreiras do espaço e tempo para restaurar a ordem em planetas como Marte, Vênus, Mercúrio e Terra. Ele mergulha em enigmas históricos enquanto corrige paradoxo por paradoxo.",
      "Ovynay transita por eras para corrigir dissonâncias temporais. Sua jornada mistura ciência e misticismo, transformando eventos históricos e prevenindo catástrofes futuras.",
      "Você sabia que Ovynay utiliza conhecimento científico avançado aliado à sabedoria ancestral para manter o fluxo do tempo em perfeito equilíbrio? Cada salto temporal dele abre uma nova aventura."
    ];
    return ovynay[Math.floor(Math.random() * ovynay.length)];
  }
  if (lowerInput.includes('iales')) {
    const iales = [
      "Iales é um universo místico onde a luz e a escuridão se encontram em um delicado equilíbrio. Suas narrativas profundas fazem deste universo um cenário enigmático e encantador.",
      "No reino de Iales, cada sombra revela uma história e cada brilho indica um enigma. Um lugar de magia e mistério ancestrais.",
      "Se você quer explorar os mistérios de Iales, prepare-se para adentrar um reino onde tradições místicas se entrelaçam com a inovação."
    ];
    return iales[Math.floor(Math.random() * iales.length)];
  }
  if (lowerInput.includes('dinoelai')) {
    const dinoelai = [
      "Dinoelai resgata a era dos dinossauros com toda a sua força e adrenalina. Ele traz de volta a nostalgia pré-histórica em batalhas épicas.",
      "No universo de Dinoelai, imagine encontros com criaturas imponentes em cenários que misturam o passado distante com uma energia renovada.",
      "Dinoelai é coragem e resiliência: o espírito ancestral manifestado em tempos modernos!"
    ];
    return dinoelai[Math.floor(Math.random() * dinoelai.length)];
  }

  // 4) Saudações e formas de cortesia
  const generic = [
    { keys: ['olá','oi'],        text: "Olá! Estou aqui para ajudar em tudo sobre o nosso universo. O que você gostaria de saber hoje?" },
    { keys: ['tudo bem','como vai'], text: "Estou ótimo, obrigado por perguntar! E você, como está?" },
    { keys: ['bom dia'],         text: "Bom dia! Espero que seu dia seja incrível! O que posso fazer por você hoje?" },
    { keys: ['boa tarde'],       text: "Boa tarde! Espero que sua tarde esteja sendo produtiva! O que posso fazer por você hoje?" },
    { keys: ['boa noite'],       text: "Boa noite! Espero que sua noite seja tranquila e cheia de sonhos! O que posso fazer por você hoje?" },
    { keys: ['obrigado','obrigada'], text: "De nada! Fico feliz em poder ajudar." },
  ];
  for (const item of generic) {
    if (item.keys.some(k => lowerInput.includes(k))) {
      return item.text;
    }
  }

  // 5) Perguntas sobre o bot
  if (lowerInput.includes('seu nome')      || lowerInput.includes('qual é o seu nome') ||
      lowerInput.includes('quem é você')) {
    return "Eu sou o Dr. Bot Plant, seu assistente virtual inspirado no personagem Dr. Plant da franquia FGP.";
  }
  if (lowerInput.includes('o que você faz') || lowerInput.includes('qual é sua função')) {
    return "Estou aqui para responder suas dúvidas sobre personagens, jogos, animações e curiosidades da FGP.";
  }
  if (lowerInput.includes('que horas são')) {
    const now = new Date();
    return `Agora são ${now.getHours()}:${now.getMinutes().toString().padStart(2,'0')}.`;
  }

  // Fallback final
  return "Desculpe, não posso falar sobre isso. Fale sobre algum aspecto do nosso universo!";
}

// Eventos de clique e teclado
document.getElementById('send-btn').addEventListener('click',  handleUserInput);
document.getElementById('user-input').addEventListener('keypress', e => {
  if (e.key === 'Enter') handleUserInput();
});

// Inicia o chat ao carregar
window.addEventListener('load', initializeChat);
