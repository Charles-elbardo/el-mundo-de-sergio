// netlify/functions/generateImage.js

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pickRandom(list) {
  if (!list || !list.length) return null;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

// ---- CATALOGO LOCAL DE DIBUJOS Y SONIDOS ----
// IMPORTANTE: estas rutas son relativas a /public
//   /public/img/...    -> se sirve como /img/...
//   /public/sounds/... -> se sirve como /sounds/...

const FRUITS = [
  {
    es: "manzana",
    en: "apple",
    image: "/img/fruit_manzana.png",
    keywords: ["manzana", "apple"],
  },
  {
    es: "plátano",
    en: "banana",
    image: "/img/fruit_platano.png",
    keywords: ["platano", "plátano", "banana"],
  },
  {
    es: "fresa",
    en: "strawberry",
    image: "/img/fruit_fresa.png",
    keywords: ["fresa", "strawberry"],
  },
  {
    es: "naranja",
    en: "orange",
    image: "/img/fruit_naranja.png",
    keywords: ["naranja", "orange"],
  },
  {
    es: "pera",
    en: "pear",
    image: "/img/fruit_pera.png",
    keywords: ["pera", "pear"],
  },
];

const INSTRUMENTS = [
  {
    es: "piano",
    en: "piano",
    image: "/img/inst_piano.png",
    keywords: ["piano"],
    sound: "/sounds/piano.mp3",
  },
  {
    es: "guitarra",
    en: "guitar",
    image: "/img/inst_guitarra.png",
    keywords: ["guitarra", "guitar"],
    sound: "/sounds/guitarra.mp3",
  },
  {
    es: "batería",
    en: "drums",
    image: "/img/inst_bateria.png",
    keywords: ["bateria", "batería", "tambor", "drums", "drum"],
    sound: "/sounds/bateria.mp3",
  },
  {
    es: "violín",
    en: "violin",
    image: "/img/inst_violin.png",
    keywords: ["violin", "violín"],
    sound: "/sounds/violin.mp3",
  },
  {
    es: "flauta",
    en: "flute",
    image: "/img/inst_flauta.png",
    keywords: ["flauta", "flute"],
    sound: "/sounds/flauta.mp3",
  },
  {
    es: "trompeta",
    en: "trumpet",
    image: "/img/inst_trompeta.png",
    keywords: ["trompeta", "trumpet"],
    sound: "/sounds/trompeta.mp3",
  },
  {
    es: "saxofón",
    en: "saxophone",
    image: "/img/inst_saxofon.png",
    keywords: ["saxofon", "saxofón", "saxophone"],
    sound: "/sounds/saxofon.mp3",
  },
];

const TRAFFIC_SIGNS = [
  {
    es: "señal de STOP",
    en: "stop sign",
    image: "/img/sign_stop.png",
    keywords: ["stop", "senal de stop", "señal de stop"],
  },
  {
    es: "semáforo",
    en: "traffic light",
    image: "/img/sign_semaforo.png",
    keywords: ["semaforo", "semáforo"],
  },
  {
    es: "señal de ceda el paso",
    en: "yield sign",
    image: "/img/sign_ceda.png",
    keywords: ["ceda", "ceda el paso", "yield"],
  },
  {
    es: "señal de paso de peatones",
    en: "pedestrian crossing sign",
    image: "/img/sign_peatones.png",
    keywords: ["peatones", "paso de peatones", "zebra crossing"],
  },
];

// Aquí usamos tus imágenes de Bing / Chase que ya tenías
const BING_CHARACTERS = [
  {
    es: "Bing",
    en: "Bing",
    image: "/img/bing.png",
    keywords: ["bing", "conejo bing"],
  },
  {
    es: "Sula",
    en: "Sula",
    image: "/img/bing_sula.png",
    keywords: ["sula"],
  },
];

const PAW_PATROL_CHARACTERS = [
  {
    es: "Chase",
    en: "Chase",
    image: "/img/chase.png",
    keywords: [
      "chase",
      "patrulla canina",
      "paw patrol",
      "perro policia",
      "perrito policia",
    ],
  },
  {
    es: "Marshall",
    en: "Marshall",
    image: "/img/paw_marshall.png",
    keywords: ["marshall", "bombero", "perro bombero"],
  },
  {
    es: "Skye",
    en: "Skye",
    image: "/img/paw_skye.png",
    keywords: ["skye"],
  },
];

function findMatch(list, text) {
  const t = normalize(text);
  for (const item of list) {
    if (item.keywords.some((kw) => t.includes(normalize(kw)))) {
      return item;
    }
  }
  return null;
}

function classifyPrompt(prompt) {
  const t = normalize(prompt);

  let item = findMatch(FRUITS, t);
  if (item) return { category: "fruit", item };

  item = findMatch(INSTRUMENTS, t);
  if (item) return { category: "instrument", item };

  item = findMatch(TRAFFIC_SIGNS, t);
  if (item) return { category: "traffic", item };

  item = findMatch(BING_CHARACTERS, t);
  if (item) return { category: "bing", item };

  item = findMatch(PAW_PATROL_CHARACTERS, t);
  if (item) return { category: "paw", item };

  // Botones genéricos tipo "Fruta", "Instrumento musical", etc.
  if (t.includes("fruta")) {
    return { category: "fruit", item: pickRandom(FRUITS) };
  }

  if (t.includes("instrumento") || t.includes("musica") || t.includes("musical")) {
    return { category: "instrument", item: pickRandom(INSTRUMENTS) };
  }

  if (t.includes("senal") || t.includes("señal") || t.includes("trafico") || t.includes("tráfico")) {
    return { category: "traffic", item: pickRandom(TRAFFIC_SIGNS) };
  }

  if (t.includes("bing")) {
    return { category: "bing", item: pickRandom(BING_CHARACTERS) };
  }

  if (t.includes("patrulla canina") || t.includes("paw patrol")) {
    return { category: "paw", item: pickRandom(PAW_PATROL_CHARACTERS) };
  }

  return null;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const promptRaw =
      event.queryStringParameters && event.queryStringParameters.prompt;
    const prompt = (promptRaw || "").trim();

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt parameter." }),
      };
    }

    const match = classifyPrompt(prompt);

    if (!match || !match.item) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Aún no sé dibujar eso. Prueba con una fruta, un instrumento, una señal, Bing o la Patrulla Canina.",
        }),
      };
    }

    const { category, item } = match;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: item.image,
        esName: item.es,
        enName: item.en,
        category,
        soundUrl: item.sound || null,
      }),
    };
  } catch (error) {
    console.error("generateImage error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
