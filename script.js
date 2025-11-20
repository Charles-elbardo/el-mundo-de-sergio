document.addEventListener("DOMContentLoaded", () => {
  const ui = {
    overlay: document.getElementById("welcome-overlay"),
    btnStart: document.getElementById("start-button"),
    screen: document.getElementById("display-area"),
    placeholder: document.getElementById("placeholder-text"),
    emojiContainer: document.getElementById("emoji-display"),
    imageContainer: document.getElementById("real-image-display"),
    caption: document.getElementById("caption-text"),
    mic: document.getElementById("mic-button"),
    status: document.getElementById("status-text"),
    grid: document.querySelector(".bento-grid")
  };

  let synth = window.speechSynthesis;
  let voices = [];
  let englishTimeout = null; 

  // ===========================================================
  // BASE DE DATOS
  // ===========================================================
  const DATABASE = [
    // --- TRÁFICO (Según tu imagen) ---
    // Prioridad: img/signals/nombre_archivo.png -> Emoji
    { cat: "traffic", es: "Adelantamiento Prohibido", en: "No Overtaking", emoji: "🚗", image: "img/signals/adelantamiento.png" },
    { cat: "traffic", es: "Ceda el Paso", en: "Yield", emoji: "▽", image: "img/signals/ceda.png" },
    { cat: "traffic", es: "Circulación en dos sentidos", en: "Two-way traffic", emoji: "⬆️⬇️", image: "img/signals/dos_sentidos.png" },
    { cat: "traffic", es: "Curva a la derecha", en: "Right Curve", emoji: "↪️", image: "img/signals/curva_derecha.png" },
    { cat: "traffic", es: "Curva a la izquierda", en: "Left Curve", emoji: "↩️", image: "img/signals/curva_izquierda.png" },
    { cat: "traffic", es: "Curvas Peligrosas", en: "Winding Road", emoji: "〰️", image: "img/signals/curvas_derecha.png" }, // Usamos genérico si no distinguimos dcha/izq en voz
    { cat: "traffic", es: "Prohibido Ciclomotores", en: "No Mopeds", emoji: "🛵🚫", image: "img/signals/prohibido_motos.png" },
    { cat: "traffic", es: "Prohibido Bicicletas", en: "No Bicycles", emoji: "🚳", image: "img/signals/prohibido_bicis.png" },
    { cat: "traffic", es: "Entrada Prohibida Peatones", en: "No Pedestrians", emoji: "🚷", image: "img/signals/prohibido_peatones.png" },
    { cat: "traffic", es: "Entrada Prohibida", en: "No Entry", emoji: "⛔", image: "img/signals/prohibido_entrada.png" },
    { cat: "traffic", es: "Estacionamiento Prohibido", en: "No Parking", emoji: "🚫", image: "img/signals/prohibido_estacionar.png" },
    { cat: "traffic", es: "Estrechamiento de calzada", en: "Road Narrows", emoji: "⚠️", image: "img/signals/estrechamiento.png" },
    { cat: "traffic", es: "Giro derecha prohibido", en: "No Right Turn", emoji: "🚫↪️", image: "img/signals/no_giro_derecha.png" },
    { cat: "traffic", es: "Giro izquierda prohibido", en: "No Left Turn", emoji: "🚫↩️", image: "img/signals/no_giro_izquierda.png" },
    { cat: "traffic", es: "Intersección con prioridad", en: "Intersection priority", emoji: "⚠️", image: "img/signals/interseccion.png" },
    { cat: "traffic", es: "Obras", en: "Roadworks", emoji: "🚧", image: "img/signals/obras.png" },
    { cat: "traffic", es: "Prohibido Parar", en: "No Stopping", emoji: "❌", image: "img/signals/prohibido_parar.png" },
    { cat: "traffic", es: "Parking", en: "Parking", emoji: "🅿️", image: "img/signals/parking.png" },
    { cat: "traffic", es: "Paso a nivel con barreras", en: "Level crossing with gates", emoji: "🚧🚂", image: "img/signals/tren_barreras.png" },
    { cat: "traffic", es: "Paso a nivel sin barreras", en: "Level crossing", emoji: "🚂", image: "img/signals/tren.png" },
    { cat: "traffic", es: "Animales en libertad", en: "Wild Animals", emoji: "🦌", image: "img/signals/animales.png" },
    { cat: "traffic", es: "Paso de Peatones", en: "Pedestrian Crossing", emoji: "🚶", image: "img/signals/peatones.png" },
    { cat: "traffic", es: "Prioridad sentido contrario", en: "Oncoming priority", emoji: "⬆️⬇️", image: "img/signals/prioridad_contrario.png" },
    { cat: "traffic", es: "Rotonda", en: "Roundabout", emoji: "🔄", image: "img/signals/rotonda.png" },
    { cat: "traffic", es: "Sentido Obligatorio", en: "Mandatory Direction", emoji: "➡", image: "img/signals/sentido_obligatorio.png" },
    { cat: "traffic", es: "Señal de STOP", en: "Stop Sign", emoji: "🛑", image: "img/signals/stop.png" },
    { cat: "traffic", es: "Viento Transversal", en: "Crosswind", emoji: "🌬️", image: "img/signals/viento.png" },
    
    // --- INSTRUMENTOS ---
    { cat: "instrument", es: "Guitarra", en: "Guitar", emoji: "🎸" },
    { cat: "instrument", es: "Piano", en: "Piano", emoji: "🎹" },
    { cat: "instrument", es: "Batería", en: "Drums", emoji: "🥁" },
    { cat: "instrument", es: "Violín", en: "Violin", emoji: "🎻" },
    { cat: "instrument", es: "Trompeta", en: "Trumpet", emoji: "🎺" },
    { cat: "instrument", es: "Saxofón", en: "Saxophone", emoji: "🎷" },
    { cat: "instrument", es: "Flauta", en: "Flute", emoji: "🪈" },
    { cat: "instrument", es: "Acordeón", en: "Accordion", emoji: "🪗" },
    { cat: "instrument", es: "Micrófono", en: "Microphone", emoji: "🎤" },
    { cat: "instrument", es: "Auriculares", en: "Headphones", emoji: "🎧" },
    { cat: "instrument", es: "Xilófono", en: "Xylophone", emoji: "🎹" },

    // --- VEHÍCULOS ---
    { cat: "vehicle", es: "Coche", en: "Car", emoji: "🚗" },
    { cat: "vehicle", es: "Coche de Policía", en: "Police Car", emoji: "🚓" },
    { cat: "vehicle", es: "Camión de Bomberos", en: "Fire Truck", emoji: "🚒" },
    { cat: "vehicle", es: "Ambulancia", en: "Ambulance", emoji: "🚑" },
    { cat: "vehicle", es: "Coche de Carreras", en: "Race Car", emoji: "🏎️" },
    { cat: "vehicle", es: "Moto", en: "Motorcycle", emoji: "🏍️" },
    { cat: "vehicle", es: "Tren", en: "Train", emoji: "🚆" },
    { cat: "vehicle", es: "Avión", en: "Airplane", emoji: "✈️" },
    { cat: "vehicle", es: "Cohete", en: "Rocket", emoji: "🚀" },
    { cat: "vehicle", es: "Helicóptero", en: "Helicopter", emoji: "🚁" },
    { cat: "vehicle", es: "Barco", en: "Boat", emoji: "🚢" },
    { cat: "vehicle", es: "Submarino", en: "Submarine", emoji: "🌊" }, 
    { cat: "vehicle", es: "Tractor", en: "Tractor", emoji: "🚜" },
    { cat: "vehicle", es: "Autobús", en: "Bus", emoji: "🚌" },
    { cat: "vehicle", es: "Camión", en: "Truck", emoji: "🚚" },

    // --- ANIMALES ---
    { cat: "animal", es: "León", en: "Lion", emoji: "🦁" },
    { cat: "animal", es: "Tigre", en: "Tiger", emoji: "🐯" },
    { cat: "animal", es: "Dinosaurio", en: "Dinosaur", emoji: "🦖" },
    { cat: "animal", es: "Dragón", en: "Dragon", emoji: "🐉" },
    { cat: "animal", es: "Tiburón", en: "Shark", emoji: "🦈" },
    { cat: "animal", es: "Perro", en: "Dog", emoji: "🐶" },
    { cat: "animal", es: "Gato", en: "Cat", emoji: "🐱" },
    { cat: "animal", es: "Oso", en: "Bear", emoji: "🐻" },
    { cat: "animal", es: "Gorila", en: "Gorilla", emoji: "🦍" },
    { cat: "animal", es: "Mono", en: "Monkey", emoji: "🐵" },
    { cat: "animal", es: "Serpiente", en: "Snake", emoji: "🐍" },
    { cat: "animal", es: "Araña", en: "Spider", emoji: "🕷️" },
    { cat: "animal", es: "Elefante", en: "Elephant", emoji: "🐘" },
    { cat: "animal", es: "Jirafa", en: "Giraffe", emoji: "🦒" },
    { cat: "animal", es: "Unicornio", en: "Unicorn", emoji: "🦄" },
    { cat: "animal", es: "Vaca", en: "Cow", emoji: "🐮" },
    { cat: "animal", es: "Cerdo", en: "Pig", emoji: "🐷" },
    { cat: "animal", es: "Caballo", en: "Horse", emoji: "🐴" },
    { cat: "animal", es: "Pingüino", en: "Penguin", emoji: "🐧" },
    { cat: "animal", es: "Rana", en: "Frog", emoji: "🐸" },
    { cat: "animal", es: "Ballena", en: "Whale", emoji: "🐳" },

    // --- ESPACIO ---
    { cat: "space", es: "Luna", en: "Moon", emoji: "🌙" },
    { cat: "space", es: "Sol", en: "Sun", emoji: "☀️" },
    { cat: "space", es: "Planeta Tierra", en: "Earth", emoji: "🌍" },
    { cat: "space", es: "Saturno", en: "Saturn", emoji: "🪐" },
    { cat: "space", es: "Estrella", en: "Star", emoji: "⭐" },
    { cat: "space", es: "Astronauta", en: "Astronaut", emoji: "👨‍🚀" },
    { cat: "space", es: "Alienígena", en: "Alien", emoji: "👽" },
    { cat: "space", es: "Meteorito", en: "Comet", emoji: "☄️" },
    { cat: "space", es: "Telescopio", en: "Telescope", emoji: "🔭" },

    // --- NATURALEZA ---
    { cat: "nature", es: "Volcán", en: "Volcano", emoji: "🌋" },
    { cat: "nature", es: "Rayo", en: "Lightning", emoji: "⚡" },
    { cat: "nature", es: "Fuego", en: "Fire", emoji: "🔥" },
    { cat: "nature", es: "Ola gigante", en: "Wave", emoji: "🌊" },
    { cat: "nature", es: "Arcoíris", en: "Rainbow", emoji: "🌈" },
    { cat: "nature", es: "Árbol", en: "Tree", emoji: "🌳" },
    { cat: "nature", es: "Flor", en: "Flower", emoji: "🌻" },
    { cat: "nature", es: "Nieve", en: "Snow", emoji: "❄️" },

    // --- COMIDA ---
    { cat: "food", es: "Pizza", en: "Pizza", emoji: "🍕" },
    { cat: "food", es: "Hamburguesa", en: "Burger", emoji: "🍔" },
    { cat: "food", es: "Patatas Fritas", en: "Fries", emoji: "🍟" },
    { cat: "food", es: "Helado", en: "Ice Cream", emoji: "🍦" },
    { cat: "food", es: "Chocolate", en: "Chocolate", emoji: "🍫" },
    { cat: "food", es: "Manzana", en: "Apple", emoji: "🍎" },
    { cat: "food", es: "Plátano", en: "Banana", emoji: "🍌" },
    { cat: "food", es: "Sandía", en: "Watermelon", emoji: "🍉" },
    { cat: "food", es: "Fresa", en: "Strawberry", emoji: "🍓" },

    // --- TV / PERSONAJES (Tus PNGs) ---
    { cat: "tv", es: "Robot", en: "Robot", emoji: "🤖" },
    { cat: "tv", es: "Fantasma", en: "Ghost", emoji: "👻" },
    { cat: "tv", es: "Ninja", en: "Ninja", emoji: "🥷" },
    { cat: "tv", es: "Pirata", en: "Pirate", emoji: "🏴‍☠️" },
    
    // IMÁGENES REALES (Personajes)
    { cat: "tv", es: "Bing", en: "Bing", emoji: "🐰", image: "img/bing.png" },
    { cat: "tv", es: "Chase", en: "Chase", emoji: "👮🐕", image: "img/chase.png" },
    { cat: "tv", es: "Marshall", en: "Marshall", emoji: "🚒🐕", image: "img/paw_marshall.png" }
  ];

  // ===========================================================
  // LÓGICA
  // ===========================================================

  function playSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    } else {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    }
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  function loadVoices() { voices = synth.getVoices(); }
  if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;

  function speak(text, lang = "es-ES") {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.9; 
    utter.pitch = 1.05;
    const preferred = voices.find(v => v.lang.includes(lang) && v.name.includes("Google"));
    if (preferred) utter.voice = preferred;
    synth.speak(utter);
  }

  function normalize(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function findItem(text) {
    const t = normalize(text);
    
    // 1. CASO ESPECIAL: Reconocimiento de voz para "Chase"
    if (t.includes("cheis") || t.includes("cheys") || t.includes("chays") || t.includes("chase")) {
      return DATABASE.find(i => i.en === "Chase");
    }

    // 2. Búsqueda exacta
    const exact = DATABASE.find(item => normalize(item.es).includes(t) || normalize(item.en).includes(t));
    if (exact) return exact;

    // 3. Búsqueda por categoría
    const catMap = {
      "animal": "animal", "bicho": "animal",
      "vehiculo": "vehicle", "coche": "vehicle",
      "instrumento": "instrument", "musica": "instrument", "guitarra": "instrument",
      "comida": "food", "fruta": "food",
      "espacio": "space", "planeta": "space",
      "cuerpo": "body", "ropa": "body",
      "naturaleza": "nature", "planta": "nature",
      "tele": "tv", "dibujo": "tv", "personaje": "tv",
      "trafico": "traffic", "señal": "traffic"
    };
    
    for (const [key, catID] of Object.entries(catMap)) {
      if (t.includes(key)) {
        const items = DATABASE.filter(i => i.cat === catID);
        return items[Math.floor(Math.random() * items.length)];
      }
    }
    return null;
  }

  function renderItem(item) {
    if (englishTimeout) { clearTimeout(englishTimeout); englishTimeout = null; }
    synth.cancel();

    ui.placeholder.classList.add("hidden");
    ui.emojiContainer.classList.add("hidden");
    ui.imageContainer.classList.add("hidden");
    ui.caption.classList.add("hidden");

    const showData = () => {
      ui.caption.innerHTML = `${item.es.toUpperCase()} <span style='color:#aaa; margin:0 8px'>|</span> ${item.en.toUpperCase()}`;
      ui.caption.classList.remove("hidden");
      
      playSound("success");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      
      speak(item.es, "es-ES");
      englishTimeout = setTimeout(() => {
        speak(item.en, "en-US");
      }, 1100);
    };

    // Lógica de Imagen con Fallback a Emoji
    if (item.image) {
      const img = new Image();
      img.onload = () => {
        ui.imageContainer.src = item.image;
        ui.imageContainer.classList.remove("hidden");
        showData();
      };
      img.onerror = () => {
        console.log("No se encontró imagen, usando emoji para: " + item.es);
        ui.emojiContainer.textContent = item.emoji;
        ui.emojiContainer.classList.remove("hidden");
        showData();
      };
      img.src = item.image;
    } else {
      ui.emojiContainer.textContent = item.emoji;
      ui.emojiContainer.classList.remove("hidden");
      showData();
    }
  }

  ui.grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".card-btn");
    if (!btn) return;
    
    btn.style.transform = "scale(0.9)";
    setTimeout(() => btn.style.transform = "", 150);
    playSound("click");

    const cat = btn.dataset.category;
    const items = DATABASE.filter(i => i.cat === cat);
    if (items.length > 0) renderItem(items[Math.floor(Math.random() * items.length)]);
  });

  ui.btnStart.addEventListener("click", () => {
    ui.overlay.style.opacity = 0;
    setTimeout(() => ui.overlay.style.display = "none", 500);
    loadVoices();
    playSound("success");
    setTimeout(() => speak("¡Hola Sergio! ¿A qué jugamos?"), 300);
  });

  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";

    recognition.onstart = () => {
      ui.mic.classList.add("listening");
      ui.status.textContent = "Te escucho...";
      if (englishTimeout) clearTimeout(englishTimeout);
      synth.cancel();
    };
    recognition.onend = () => {
      ui.mic.classList.remove("listening");
      ui.status.textContent = "¿Qué quieres ver?";
    };
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const item = findItem(text);
      if (item) renderItem(item);
      else speak("No te entendí, Sergio.");
    };
    ui.mic.addEventListener("click", () => {
      try { recognition.start(); } catch(e) { recognition.stop(); }
    });
  } else {
    ui.status.textContent = "Sin micrófono 🚫";
  }
});