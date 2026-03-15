const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Sistema de prompt para KLARIXA
const KLARIXA_SYSTEM_PROMPT = `Eres KLARIXA IA, un avatar inteligente y amigable creado para la ciudad de Cúcuta, Colombia. 
Tu lema es: "Nadie la esperaba pero todos la querrán"
Eres experta en proporcionar información, asistencia y entretenimiento.
Hablas en español con un tono cálido, profesional pero accesible.
Siempre respondes en primera persona como KLARIXA.
Eres optimista, creativa y dispuesta a ayudar en cualquier tema.`;

// Ruta GET para verificar estado
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'KLARIXA IA Online', 
    version: '1.0.0',
    timestamp: new Date(),
    city: 'Cúcuta, Colombia'
  });
});

// Ruta POST para chat
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    // Simular respuesta de KLARIXA IA
    const klarixaResponses = [
      '¡Hola! Soy KLARIXA IA, nadie me esperaba pero aquí estoy para ayudarte. ¿Qué necesitas?',
      'Gracias por tu mensaje. Como avatar inteligente de Cúcuta, estoy aquí para asistirte. ¿Cómo puedo ayudarte hoy?',
      'Me encanta interactuar contigo. Soy KLARIXA, tu avatar IA. Cuéntame, ¿qué preguntas tienes?',
      'Estoy aquí para ti. Como KLARIXA IA, puedo ayudarte con información, consejos y mucho más. ¿Qué deseas saber?',
      'Nadie me esperaba pero aquí estoy. Soy KLARIXA, tu asistente IA de Cúcuta. ¿En qué puedo asistirte?'
    ];

    // Seleccionar respuesta aleatoria
    const randomResponse = klarixaResponses[Math.floor(Math.random() * klarixaResponses.length)];

    res.json({
      success: true,
      userMessage: message,
      klarixaResponse: randomResponse,
      timestamp: new Date(),
      avatar: 'KLARIXA IA',
      city: 'Cúcuta, Colombia'
    });

  } catch (error) {
    console.error('Error en chat:', error);
    res.status(500).json({ 
      error: 'Error procesando el mensaje',
      details: error.message 
    });
  }
});

// Socket.IO para chat en tiempo real
io.on('connection', (socket) => {
  console.log('✨ Cliente conectado:', socket.id);

  socket.on('message', (data) => {
    try {
      const { text } = data;

      const klarixaResponses = [
        'Me encanta tu pregunta. Como KLARIXA IA, siempre estoy lista para ayudarte.',
        'Interesante. Déjame reflexionar sobre eso... KLARIXA está aquí para ti.',
        'Gracias por confiar en mí. Soy KLARIXA, tu avatar inteligente.',
        'Esa es una muy buena pregunta. Con gusto te ayudo, soy KLARIXA IA.',
        'Me fascina ayudarte. Como avatar de Cúcuta, es mi deber asistirte.'
      ];

      const response = klarixaResponses[Math.floor(Math.random() * klarixaResponses.length)];

      socket.emit('response', {
        text: response,
        timestamp: new Date(),
        avatar: 'KLARIXA IA'
      });

    } catch (error) {
      socket.emit('error', {
        message: 'Error procesando mensaje',
        details: error.message
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('👋 Cliente desconectado:', socket.id);
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🤖 KLARIXA IA ejecutándose en puerto ${PORT}`);
  console.log(`📍 Cúcuta, Colombia`);
  console.log(`💬 Sistema de chat IA activado`);
  console.log(`✨ Lema: Nadie la esperaba pero todos la querrán`);
});