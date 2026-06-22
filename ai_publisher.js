const SUPABASE_URL = "https://qtgrtiqtnjvblalzxobz.supabase.co";
// Utilisez une variable d'environnement pour la clé secrète sur GitHub
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const WHATSAPP_URL = "https://chat.whatsapp.com/J7r4OBafUWOKviJTeoVkWI";

// Fonction pour envoyer des données à Supabase
async function insertToSupabase(table, data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Fonction pour appeler l'IA
async function generateWithAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Économique et performant
      response_format: { type: "json_object" }, // Force le format JSON
      messages: [{ role: "user", content: prompt }]
    })
  });
  const result = await response.json();
  return JSON.parse(result.choices[0].message.content);
}

// --- GENERATION PRONOSTICS ---
async function publishMatch() {
  console.log("Génération du pronostic de demain...");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const prompt = `Agis en tant qu'expert en paris sportifs et pronostics football. Génère un pronostic réaliste au format JSON pour un match de football majeur ayant lieu le ${dateStr}.
  Tu dois STRICTEMENT respecter cette structure JSON :
  {
    "sport": "football",
    "league": "Nom de la compétition (ex: UEFA Champions League)",
    "match_date": "${dateStr}",
    "match_time": "Heure du match (ex: 21:00)",
    "home_team": "Nom équipe domicile",
    "away_team": "Nom équipe extérieur",
    "home_odds": 2.10,
    "draw_odds": 3.40,
    "away_odds": 3.20,
    "prediction": "Ta prédiction courte (ex: Victoire Real Madrid)",
    "predicted_score": "Score exact estimé (ex: 2-1)",
    "confidence": 85,
    "reasoning": "Une analyse attractive de 3-4 lignes maximum expliquant pourquoi ce choix.",
    "tip": "Conseil de pari alternatif",
    "stars": 4
  }`;

  const matchData = await generateWithAI(prompt);
  await insertToSupabase("matches", matchData);
  console.log(`✅ Match inséré avec succès : ${matchData.home_team} vs ${matchData.away_team}`);
}

// --- GENERATION ARTICLES ---
async function publishArticle() {
  console.log("Génération d'un article captivant...");
  
  const prompt = `Rédige un article de blog captivant et percutant sur l'actualité brûlante du football mondial (actu mercato, débrief de match de haut niveau, ou preview d'un choc à venir). 
  Le ton doit être dynamique, vendeur, orienté parieur (style "PicsousBet").
  Tu dois obligatoirement inclure subtilement à la fin de la conclusion une invitation forte (CTA) à rejoindre le groupe WhatsApp via ce lien précis : ${WHATSAPP_URL}
  
  Respecte STRICTEMENT cette structure JSON :
  {
    "title": "Titre accrocheur et sensationnel",
    "sport": "football",
    "intro": "Paragraphe d'accroche très percutant pour donner envie de lire.",
    "body": "Développement de l'article avec des paragraphes séparés par des sauts de ligne. Analyse tactique ou détails croustillants.",
    "conclusion": "Conclusion ouverte se terminant par un appel à l'action chaud pour rejoindre le groupe WhatsApp : ${WHATSAPP_URL}",
    "tags": ["football", "actu", "pronos"],
    "read_time": 3,
    "status": "published"
  }`;

  const articleData = await generateWithAI(prompt);
  await insertToSupabase("articles", articleData);
  console.log(`✅ Article inséré avec succès : ${articleData.title}`);
}

// Gestion des arguments de la tâche planifiée
const action = process.argv[2];
if (action === "match") {
  publishMatch().catch(console.error);
} else if (action === "article") {
  publishArticle().catch(console.error);
}
