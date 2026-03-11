"use strict"; // Active le mode strict

import { api_url } from "./config.js"; // URL de l'API (proxy)

const plantsContainer = document.querySelector(".plants-container");
const loadMoreBtn = document.querySelector(".loadmore-btn");
const searchPlantBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const searchBar = document.querySelector(".search-bar");
const suggestionsContainer = document.getElementById("suggestionsContainer");
const plantCard = document.querySelector(".plant-card");

function displayPlants(data) {
    let html = "";
    data.forEach((plant) => {
        if (plant.image_url)
            html += `<div class="plant-card">
                <h2 class="plant-name">${plant.common_name || "Nom inconnu"}</h2>
                <a href="plants_details.html?id=${plant.id}">
                    <img src="${plant.image_url}" alt="${plant.common_name || "Plante"}">
                </a>
            </div>`;
    });
    plantsContainer.insertAdjacentHTML("beforeend", html);
}

// 🔹 Fonction robuste pour récupérer les plantes
async function getPlants() {
    try {
        const response = await fetch(`${api_url}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
     
        

        if (!json || !json.data) {
            console.warn("⚠️ Pas de données reçues :", json);
            plantsContainer.innerHTML = `<p class="error">Impossible de charger les plantes (erreur API).</p>`;
            return;
        }

        console.log("Plantes reçues :", json.data);
        displayPlants(json.data);
    } catch (error) {
        console.error("Erreur getPlants:", error);
        plantsContainer.innerHTML = `<p class="error">Erreur lors du chargement des plantes : ${error.message}</p>`;
    }
}

getPlants(); // Au chargement de la page

let currentPage = 1;

// 🔹 Pagination avec gestion des erreurs
async function getMorePlants() {
    currentPage++;
    try {
        const response = await fetch(`${api_url}?page=${currentPage}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();

        if (!json || !json.data) {
            console.warn("⚠️ Pas de données reçues :", json);
            return;
        }

        console.log("Plantes page suivante :", json.data);
        displayPlants(json.data);
    } catch (error) {
        console.error("Erreur getMorePlants:", error);
        plantsContainer.insertAdjacentHTML(
            "beforeend",
            `<p class="error">Impossible de charger plus de plantes : ${error.message}</p>`
        );
    }
}

loadMoreBtn.addEventListener("click", getMorePlants);






// Fonction pour afficher les suggestions
function displaySuggestions(plants) {
    suggestionsContainer.innerHTML = ''; // Vide le conteneur
    plants.forEach(plant => {
        const div = document.createElement('div');
        div.classList.add('suggestion');
        div.textContent = plant.common_name || "Nom inconnu";

        // Quand on clique sur la suggestion
        div.onclick = () => {
            searchInput.value = plant.common_name;
            suggestionsContainer.innerHTML = '';
        };

        suggestionsContainer.appendChild(div);
    });
}

// Fonction pour rechercher les plantes
async function searchPlants(query) {
    if (!query) {
        suggestionsContainer.innerHTML = '';
        return;
    }

    console.log("📤 Envoi de la requête pour :", query); // 🔹 log

    try {
        const response = await fetch(`${api_url}/search?q=${encodeURIComponent(query)}`);
        console.log("✅ Requête envoyée, statut :", response.status); // 🔹 log du statut

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const json = await response.json();
        console.log("Résultats de la recherche:", json);

        if (json.data && json.data.length > 0) {
            displaySuggestions(json.data);
        } else {
            suggestionsContainer.innerHTML = '<p>Aucune suggestion</p>';
        }
    } catch (error) {
        console.error("Erreur searchPlants:", error);
        suggestionsContainer.innerHTML = '<p>Erreur lors de la recherche</p>';
    }
}


// Écouteur pour chaque frappe dans le champ de recherche
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    searchPlants(query);
});



