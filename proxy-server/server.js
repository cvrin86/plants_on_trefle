


// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // npm install node-fetch@2
require('dotenv').config();

const app = express();
const PORT = 3001;

// Charger la clé API depuis .env
const apiKey = process.env.KEY_API;
if (!apiKey) {
  console.error("❌ ERREUR : Aucune clé API trouvée dans .env (KEY_API).");
  process.exit(1);
}

app.use(cors());

// Route pour récupérer les plantes
app.get('/api/plants', async (req, res) => {
  try {
    // Construire l'URL complète vers Trefle avec le token
    const page = req.query.page || 1;
    const url = `https://trefle.io/api/v1/plants?token=${apiKey}&page=${page}`;

    // console.log("➡️ Requête envoyée à Trefle :", url);

    // Envoi de la requête vers Trefle
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data); // renvoie directement le JSON au front
    // console.log(data);
    
  } catch (error) {
    console.error("❌ Erreur API Trefle :", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
});

//Route pour recuperer les détails d'une plante specisique par son ID
app.get('/api/plants/:id',async(req,res)=>{
//Récupere l'id de la plate depuis les parametres de l'URL
    const plantId = req.params.id;

    try {
//Compose l'url complet de l'API Trefle avec l'id de la plante et le token
const url = `https://trefle.io/api/v1/plants/${plantId}?token=${apiKey}`

// Envoie la requete à l'Api Trefle
const response = await fetch(url);

//Si y'a pas de reponse ok, lance une erreur
if(!response.ok){
    throw new Error(`Http error ! status: ${response.status}`);
}
//Sinon stocke la reponse en json
const data = await response.json();

//Renvoie les données au client
res.json(data);

        
    } catch (err) {
        res.status(500).json({error: "Erreur serveur",details:err.message})
        
    }

})



app.get('/api/plants/search',async(req,res)=>{

 console.log("[SERVER] Requête reçue :", req.originalUrl);
    const query = req.query.q;
    console.log("🔍 Paramètre reçu côté serveur :", query);

    
    
if(!query){

    return res.status(400).json({error:"Parametre de recherche manquant"});
}

try {

    const url = `https://trefle.io/api/v1/plants/search?token=${apiKey}&q=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if(!response.ok){
        throw new Error(`HTTP error! status:${response.status}`)
    }

    const data = await response.json();

    console.log(data);
    

    res.json(data);
    
} catch (err) {

    console.error("❌ Erreur API Trefle :", err);
        res.status(500).json({ error: err.message });
    
}


})





app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});




























// // server.js
// const express = require('express');
// const cors = require('cors');
// const { createProxyMiddleware } = require('http-proxy-middleware');
// require('dotenv').config();

// const app = express();
// const PORT = 3001;
// const apiUrl ='https://trefle.io/api/v1';

// // Charger la clé API depuis .env
// const apiKey = process.env.KEY_API;
// if (!apiKey) {
//   console.error("❌ ERREUR : Aucune clé API trouvée dans .env (KEY_API).");
//   process.exit(1);
// } else {
//   console.log("🔑 API KEY chargée :", apiKey);
// }

// // Autoriser toutes les origines (ou limiter à ton front si besoin)
// app.use(cors());

// // Log de toutes les requêtes qui arrivent
// // app.use('/api', (req, res, next) => {
// //   console.log(`[SERVER] Received request: ${req.method} ${req.originalUrl}`);
// //   next();
// // });

// // Proxy vers Trefle
// // Déclare un middleware pour toutes les routes commençant par "/api"
// app.use(
//   '/api', // toutes les requêtes vers /api/* passeront par ce middleware
//   createProxyMiddleware({ // crée le proxy vers l'API Trefle
//     target: apiUrl, // URL de destination du proxy (Trefle API)
//     changeOrigin: true, // modifie l'en-tête Host de la requête pour correspondre à la cible
//     pathRewrite: { '^/api': '' }, // supprime "/api" du chemin avant d'envoyer la requête à Trefle
    
//     // Fonction exécutée avant l'envoi de la requête au serveur cible
//     onProxyReq(proxyReq, req, res) {
//         const originalPath = req.originalUrl.replace(/^\/api/, '');
//         const url = new URL(originalPath, apiUrl);
//         console.log(apiUrl);

//   url.searchParams.set('token', apiKey);
// // 
//   // Toujours définir proxyReq.path pour compatibilité
//   proxyReq.path = url.pathname + url.search;

//   console.log("➡️ Forwarding to:", url.toString());
// }
// ,

//     // Gestion des erreurs du proxy
//     onError: (err, req, res) => {
//       // Affiche l'erreur dans le terminal
//       console.error("❌ Proxy error:", err.message);
//       // Renvoie un JSON d'erreur au client si le proxy échoue
//       res.status(500).json({ error: "Proxy error", details: err.message });
//     }
//   })
// );


// app.listen(PORT, () => {
//   console.log(`🚀 Proxy server is running on http://localhost:${PORT}`);
// });
