import { api_url } from "./config.js";

const plantDetails = document.querySelector(".plant-details");

function displayDetailsPlants(data) {
    let html = `
        <section class="plant-details-section">
            <h1 class="page-title">Détails de la plante</h1>
            <div class="plant-details-container">
    `;
    data.forEach(plant => {
        if (plant.image_url) {
            const commonName = plant.common_name || "Nom commun indisponible";
            const scientificName = plant.scientific_name || "Nom scientifique indisponible";
            const familyName = plant.family?.name || "Famille indisponible";
            const genusName = plant.genus?.name || "Genre indisponible";
            const commonNamesFr = plant.main_species?.common_names?.fra || [];
            const commonNameFrString = Array.isArray(commonNamesFr) ? commonNamesFr.join(", ") : commonNamesFr;

            // Met à jour le titre de l'onglet et le titre de la page avec le nom de la plante
            const titleName = commonNameFrString || commonName;
            if (titleName) {
                document.title = `Détails - ${titleName}`;
            }

            html += `
                <article class="plant-card-details modern-card">
                    <div class="plant-image-wrapper">
                        <img src="${plant.image_url}" alt="${commonName}" class="plant-image">
                    </div>
                    <div class="plant-info">
                        <h2 class="plant-names"> Nom : ${titleName}</h2>
                        <p><span class="label">Nom scientifique :</span> ${scientificName}</p>
                        <p><span class="label">Famille :</span> ${familyName}</p>
                        <p><span class="label">Genre :</span> ${genusName}</p>
                        <p><span class="label">Observations :</span> ${plant.observations || "Aucune observation disponible."}</p>
                        <p><span class="label">Année :</span> ${plant.year || "Année inconnue."}</p>
                    </div>
                </article>
            `;
        }
    });
    html += `
            </div>
        </section>
    `;
    plantDetails.innerHTML = html;
}

async function getPlantMoreDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const plantId = urlParams.get("id");
        console.log("Plant id:",plantId);
        

        if (plantId) {
            const response = await fetch(`${api_url}/${plantId}`, {
                // headers: {
                //     Authorization: `Bearer ${key_api}`
                // }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const { data } = await response.json();
            displayDetailsPlants([data]);
        }
    } catch (error) {
        console.error("Error: ", error);
    }
}

getPlantMoreDetails();