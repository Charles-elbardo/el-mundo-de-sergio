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

  // ===========================================================
  // MEGA BASE DE DATOS (Categorías expandidas)
  // ===========================================================
  const DATABASE = [
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
    { cat: "vehicle", es: "Grúa", en: "Crane", emoji: "🏗️" },
    { cat: "vehicle", es: "Autobús", en: "Bus", emoji: "🚌" },
    { cat: "vehicle", es: "Patinete", en: "Scooter", emoji: "🛴" },
    { cat: "vehicle", es: "Bicicleta", en: "Bicycle", emoji: "🚲" },
    { cat: "vehicle", es: "Taxi", en: "Taxi", emoji: "🚕" },
    { cat: "vehicle", es: "Camión de Basura", en: "Garbage Truck", emoji: "🚛" },
    { cat: "vehicle", es: "Camión", en: "Truck", emoji: "🚚" },
    { cat: "vehicle", es: "Canoa", en: "Canoe", emoji: "🛶" },
    { cat: "vehicle", es: "Velero", en: "Sailboat", emoji: "⛵" },
    { cat: "vehicle", es: "Paracaídas", en: "Parachute", emoji: "🪂" },

    // --- ANIMALES ---
    { cat: "animal", es: "León", en: "Lion", emoji: "🦁" },
    { cat: "animal", es: "Tigre", en: "Tiger", emoji: "🐯" },
    { cat: "animal", es: "Dinosaurio", en: "Dinosaur", emoji: "🦖" },
    { cat: "animal", es: "Dragón", en: "Dragon", emoji: "🐉" },
    { cat: "animal", es: "Tiburón", en: "Shark", emoji: "🦈" },
    { cat: "animal", es: "Perro", en: "Dog", emoji: "🐶" },
    { cat: "animal", es: "Gato", en: "Cat", emoji: "🐱" },
    { cat: "animal", es: "Lobo", en: "Wolf", emoji: "🐺" },
    { cat: "animal", es: "Oso", en: "Bear", emoji: "🐻" },
    { cat: "animal", es: "Oso Panda", en: "Panda", emoji: "🐼" },
    { cat: "animal", es: "Gorila", en: "Gorilla", emoji: "🦍" },
    { cat: "animal", es: "Mono", en: "Monkey", emoji: "🐵" },
    { cat: "animal", es: "Serpiente", en: "Snake", emoji: "🐍" },
    { cat: "animal", es: "Araña", en: "Spider", emoji: "🕷️" },
    { cat: "animal", es: "Águila", en: "Eagle", emoji: "🦅" },
    { cat: "animal", es: "Búho", en: "Owl", emoji: "🦉" },
    { cat: "animal", es: "Pulpo", en: "Octopus", emoji: "🐙" },
    { cat: "animal", es: "Elefante", en: "Elephant", emoji: "🐘" },
    { cat: "animal", es: "Jirafa", en: "Giraffe", emoji: "🦒" },
    { cat: "animal", es: "Unicornio", en: "Unicorn", emoji: "🦄" },
    { cat: "animal", es: "Murciélago", en: "Bat", emoji: "🦇" },
    { cat: "animal", es: "Mariposa", en: "Butterfly", emoji: "🦋" },
    { cat: "animal", es: "Abeja", en: "Bee", emoji: "🐝" },
    { cat: "animal", es: "Vaca", en: "Cow", emoji: "🐮" },
    { cat: "animal", es: "Cerdo", en: "Pig", emoji: "🐷" },
    { cat: "animal", es: "Caballo", en: "Horse", emoji: "🐴" },
    { cat: "animal", es: "Pollito", en: "Chick", emoji: "🐥" },
    { cat: "animal", es: "Pingüino", en: "Penguin", emoji: "🐧" },
    { cat: "animal", es: "Rana", en: "Frog", emoji: "🐸" },
    { cat: "animal", es: "Tortuga", en: "Turtle", emoji: "🐢" },
    { cat: "animal", es: "Ballena", en: "Whale", emoji: "🐳" },
    { cat: "animal", es: "Delfín", en: "Dolphin", emoji: "🐬" },
    { cat: "animal", es: "Cangrejo", en: "Crab", emoji: "🦀" },

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
    { cat: "space", es: "Galaxia", en: "Galaxy", emoji: "🌌" },
    { cat: "space", es: "Satélite", en: "Satellite", emoji: "🛰️" },

    // --- NATURALEZA ---
    { cat: "nature", es: "Volcán", en: "Volcano", emoji: "🌋" },
    { cat: "nature", es: "Rayo", en: "Lightning", emoji: "⚡" },
    { cat: "nature", es: "Fuego", en: "Fire", emoji: "🔥" },
    { cat: "nature", es: "Ola gigante", en: "Wave", emoji: "🌊" },
    { cat: "nature", es: "Arcoíris", en: "Rainbow", emoji: "🌈" },
    { cat: "nature", es: "Árbol", en: "Tree", emoji: "🌳" },
    { cat: "nature", es: "Cactus", en: "Cactus", emoji: "🌵" },
    { cat: "nature", es: "Flor", en: "Flower", emoji: "🌻" },
    { cat: "nature", es: "Rosa", en: "Rose", emoji: "🌹" },
    { cat: "nature", es: "Nieve", en: "Snow", emoji: "❄️" },
    { cat: "nature", es: "Muñeco de Nieve", en: "Snowman", emoji: "⛄" },
    { cat: "nature", es: "Lluvia", en: "Rain", emoji: "🌧️" },
    { cat: "nature", es: "Tornado", en: "Tornado", emoji: "🌪️" },
    { cat: "nature", es: "Montaña", en: "Mountain", emoji: "🏔️" },
    { cat: "nature", es: "Desierto", en: "Desert", emoji: "🏜️" },

    // --- CUERPO / OBJETOS / ROPA ---
    { cat: "body", es: "Ojo", en: "Eye", emoji: "👁️" },
    { cat: "body", es: "Oreja", en: "Ear", emoji: "👂" },
    { cat: "body", es: "Nariz", en: "Nose", emoji: "👃" },
    { cat: "body", es: "Boca", en: "Mouth", emoji: "👄" },
    { cat: "body", es: "Mano", en: "Hand", emoji: "✋" },
    { cat: "body", es: "Pie", en: "Foot", emoji: "🦶" },
    { cat: "body", es: "Cerebro", en: "Brain", emoji: "🧠" },
    { cat: "body", es: "Corazón", en: "Heart", emoji: "❤️" },
    { cat: "body", es: "Hueso", en: "Bone", emoji: "🦴" },
    { cat: "body", es: "Músculo", en: "Muscle", emoji: "💪" },
    { cat: "body", es: "Gafas", en: "Glasses", emoji: "👓" },
    { cat: "body", es: "Camiseta", en: "T-Shirt", emoji: "👕" },
    { cat: "body", es: "Zapatillas", en: "Sneakers", emoji: "👟" },
    { cat: "body", es: "Gorra", en: "Cap", emoji: "🧢" },
    { cat: "body", es: "Pantalones", en: "Jeans", emoji: "👖" },
    { cat: "body", es: "Reloj", en: "Watch", emoji: "⌚" },
    { cat: "body", es: "Corona", en: "Crown", emoji: "👑" },
    { cat: "body", es: "Mochila", en: "Backpack", emoji: "🎒" },

    // --- COMIDA ---
    { cat: "food", es: "Pizza", en: "Pizza", emoji: "🍕" },
    { cat: "food", es: "Hamburguesa", en: "Burger", emoji: "🍔" },
    { cat: "food", es: "Patatas Fritas", en: "Fries", emoji: "🍟" },
    { cat: "food", es: "Perrito Caliente", en: "Hot Dog", emoji: "🌭" },
    { cat: "food", es: "Huevo Frito", en: "Fried Egg", emoji: "🍳" },
    { cat: "food", es: "Taco", en: "Taco", emoji: "🌮" },
    { cat: "food", es: "Helado", en: "Ice Cream", emoji: "🍦" },
    { cat: "food", es: "Donut", en: "Donut", emoji: "🍩" },
    { cat: "food", es: "Chocolate", en: "Chocolate", emoji: "🍫" },
    { cat: "food", es: "Palomitas", en: "Popcorn", emoji: "🍿" },
    { cat: "food", es: "Manzana", en: "Apple", emoji: "🍎" },
    { cat: "food", es: "Plátano", en: "Banana", emoji: "🍌" },
    { cat: "food", es: "Sandía", en: "Watermelon", emoji: "🍉" },
    { cat: "food", es: "Fresa", en: "Strawberry", emoji: "🍓" },
    { cat: "food", es: "Uvas", en: "Grapes", emoji: "🍇" },
    { cat: "food", es: "Zanahoria", en: "Carrot", emoji: "🥕" },
    { cat: "food", es: "Queso", en: "Cheese", emoji: "🧀" },
    { cat: "food", es: "Tarta", en: "Cake", emoji: "🍰" },
    { cat: "food", es: "Caramelo", en: "Candy", emoji: "🍬" },

    // --- TRÁFICO (y tus PNGs) ---
    { cat: "traffic", es: "Semáforo", en: "Traffic Light", emoji: "🚦" },
    { cat: "traffic", es: "Señal de STOP", en: "Stop Sign", emoji: "🛑" },
    { cat: "traffic", es: "Obras", en: "Construction", emoji: "🚧" },
    { cat: "traffic", es: "Prohibido", en: "No Entry", emoji: "⛔" },
    { cat: "traffic", es: "Aparcamiento", en: "Parking", emoji: "🅿️" },
    { cat: "traffic", es: "Paso de Peatones", en: "Crossing", emoji: "🚸" },
    { cat: "traffic", es: "Ceda el Paso", en: "Yield", emoji: "⚠️" },
    { cat: "traffic", es: "Prohibido Bicicletas", en: "No Bikes", emoji: "🚳" },
    // Tu rotonda PNG (si existe el archivo)
    { cat: "traffic", es: "Rotonda", en: "Roundabout", emoji: "🔄", image: "img/rotonda.png" },

    // --- TV / PERSONAJES (Tus PNGs) ---
    { cat: "tv", es: "Robot", en: "Robot", emoji: "🤖" },
    { cat: "tv", es: "Fantasma", en: "Ghost", emoji: "👻" },
    { cat: "tv", es: "Ninja", en: "Ninja", emoji: "🥷" },
    { cat: "tv", es: "Calavera", en: "Skull", emoji: "💀" },
    { cat: "tv", es: "Payaso", en: "Clown", emoji: "🤡" },
    { cat: "tv", es: "Princesa", en: "Princess", emoji: "👸" },
    { cat: "tv", es: "Príncipe", en: "Prince", emoji: "🤴" },
    { cat: "tv", es: "Papá Noel", en: "Santa Claus", emoji: "🎅" },
    { cat: "tv", es: "Superhéroe", en: "Superhero", emoji: "🦸" },
    { cat: "tv", es: "Mago", en: "Mage", emoji: "🧙" },
    { cat: "tv", es: "Genio", en: "Genie", emoji: "🧞" },
    { cat: "tv", es: "Zombi", en: "Zombie", emoji: "🧟" },
    
    // Tus imágenes de personajes (asegúrate que los archivos existan)
    { cat: "tv", es: "Bing", en: "Bing", emoji: "🐰", image: "img/bing.png" },
    { cat: "tv", es: "Chase", en: "Chase", emoji: "👮🐕", image: "img/chase.png" },
    { cat: "tv", es: "Marshall", en: "Marshall", emoji: "🚒🐕", image: "img/paw_marshall.png" }
  ];

  // ===========================================================
  // LÓGICA DE SONIDO Y VOZ
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
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.95; 
    utter.pitch = 1.05;
    // Intentar usar voz de Google si existe
    const preferred = voices.find(v => v.lang.includes(lang) && v.name.includes("Google"));
    if (preferred) utter.voice = preferred;
    synth.speak(utter);
  }

  function normalize(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // --- Buscador Inteligente ---
  function findItem(text) {
    const t = normalize(text);
    
    // 1. Búsqueda exacta (por español o inglés)
    const exact = DATABASE.find(item => normalize(item.es).includes(t) || normalize(item.en).includes(t));
    if (exact) return exact;

    // 2. Búsqueda por categoría (mapeo de palabras clave a categorías de botones)
    const catMap = {
      "animal": "animal", "bicho": "animal", "mascota": "animal",
      "vehiculo": "vehicle", "coche": "vehicle", "transporte": "vehicle",
      "comida": "food", "fruta": "food", "comer": "food",
      "espacio": "space", "planeta": "space", "cielo": "space",
      "cuerpo": "body", "ropa": "body", "objeto": "body",
      "naturaleza": "nature", "planta": "nature", "tiempo": "nature",
      "tele": "tv", "dibujo": "tv", "personaje": "tv", "miedo": "tv",
      "trafico": "traffic", "señal": "traffic", "calle": "traffic"
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
    ui.placeholder.classList.add("hidden");
    ui.emojiContainer.classList.add("hidden");
    ui.imageContainer.classList.add("hidden");
    ui.caption.classList.add("hidden");

    // Función para mostrar datos y hablar
    const showData = () => {
      // Muestra ES | EN
      ui.caption.innerHTML = `${item.es.toUpperCase()} <span style='color:#aaa; margin:0 8px'>|</span> ${item.en.toUpperCase()}`;
      ui.caption.classList.remove("hidden");
      
      playSound("success");
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      
      // Habla en español, espera, habla en inglés
      speak(item.es, "es-ES");
      setTimeout(() => speak(item.en, "en-US"), 1800);
    };

    // Lógica imagen vs emoji
    if (item.image) {
      const img = new Image();
      img.onload = () => {
        ui.imageContainer.src = item.image;
        ui.imageContainer.classList.remove("hidden");
        showData();
      };
      img.onerror = () => {
        // Si falla la carga (ej: no está el archivo), usa emoji
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

  // --- Eventos ---
  
  // Click en botones de categoría
  ui.grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".card-btn");
    if (!btn) return;
    
    // Efecto visual click
    btn.style.transform = "scale(0.9)";
    setTimeout(() => btn.style.transform = "", 150);
    playSound("click");

    // Buscar aleatorio de esa categoría
    const cat = btn.dataset.category;
    const items = DATABASE.filter(i => i.cat === cat);
    if (items.length > 0) {
      renderItem(items[Math.floor(Math.random() * items.length)]);
    }
  });

  // Click en Empezar (Bienvenida con Voz)
  ui.btnStart.addEventListener("click", () => {
    ui.overlay.style.opacity = 0;
    setTimeout(() => ui.overlay.style.display = "none", 500);
    
    loadVoices();
    playSound("success");
    
    // SALUDO NATURAL POR VOZ
    setTimeout(() => {
      speak("¡Hola Sergio! Bienvenido a tu mundo. ¿A qué vamos a jugar hoy?");
    }, 300);
  });

  // Micrófono
  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";

    recognition.onstart = () => {
      ui.mic.classList.add("listening");
      ui.status.textContent = "Te escucho...";
    };
    recognition.onend = () => {
      ui.mic.classList.remove("listening");
      ui.status.textContent = "¿Qué quieres ver?";
    };
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const item = findItem(text);
      if (item) renderItem(item);
      else speak("No te he entendido bien, Sergio. Prueba otra vez.");
    };

    ui.mic.addEventListener("click", () => {
      try { recognition.start(); } catch(e) { recognition.stop(); }
    });
  } else {
    ui.status.textContent = "Sin micrófono 🚫";
  }
});