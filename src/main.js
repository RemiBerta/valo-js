import './style.css'

async function fetchAllAgents() {
  //Requete
  let response = await fetch(
    'https://valorant-api.com/v1/agents?language=fr-FR&isPlayableCharacter=true'
  );

  //Récuperation data JSON
  response = await response.json();

  return response;
}

let response = await fetchAllAgents();
//Tableau de données contenu dans la réponse
//TOujours regarder les data JSON pour acceder a la partie qui vous intéresse
let agents = response.data;

let addDiv = document.getElementById('app');

addDiv.innerHTML = '';

let agentList = document.createElement("div");
agentList.id = "agentList"; 
agentList.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-5";
addDiv.appendChild(agentList);

displayAgents();

function displayAgents() {
  agents.forEach((agent) => {
    // Carte de l'agent
    const agentCard = document.createElement("div");
    agentCard.className =
      "bg-white rounded-2xl shadow-md overflow-hidden aspect-square flex flex-col items-center justify-center text-center p-4 group cursor-pointer";
      agentCard.style.background = getGradient(agent.backgroundGradientColors);

    // Image de l'agent
    const iconAgent = document.createElement("img");
    iconAgent.src = agent.displayIcon;
    iconAgent.alt = agent.displayName;
    iconAgent.className =
      "w-24 h-24 object-cover rounded-full mb-2 transition-transform duration-300 ease-in-out group-hover:scale-110";
    agentCard.appendChild(iconAgent);

    // Nom de l'agent
    const nameAgent = document.createElement("h2");
    nameAgent.textContent = agent.displayName;
    nameAgent.className = "text-lg font-semibold";
    agentCard.appendChild(nameAgent);

    // Conteneur des détails (caché par défaut)
    const agentDetails = document.createElement("div");
    agentDetails.className = "hidden mt-4 text-left text-sm space-y-2";
    agentCard.appendChild(agentDetails);

    // Portrait
    const portraitAgent = document.createElement("img");
    portraitAgent.src = agent.fullPortraitV2;
    portraitAgent.className = "w-full max-h-60 object-contain mx-auto";
    agentDetails.appendChild(portraitAgent);

    // Description
    const descripAgent = document.createElement("p");
    descripAgent.textContent = agent.description;
    agentDetails.appendChild(descripAgent);

    // Rôle
    const nameRole = document.createElement("h3");
    nameRole.textContent = `Rôle : ${agent.role.displayName}`;
    nameRole.className = "font-semibold";
    agentDetails.appendChild(nameRole);

    const descripRole = document.createElement("p");
    descripRole.textContent = agent.role.description;
    agentDetails.appendChild(descripRole);

    const iconRole = document.createElement("img");
    iconRole.src = agent.role.displayIcon;
    iconRole.className = "w-6 h-6";
    agentDetails.appendChild(iconRole);

    // Capacités
    agent.abilities.forEach((ability) => {
      if (!ability.displayIcon || !ability.displayName) return;

      const infoAbilities = document.createElement("div");
      infoAbilities.className = "pt-2 border-t border-gray-200";

      const nameAbility = document.createElement("h4");
      nameAbility.textContent = ability.displayName;
      nameAbility.className = "font-medium";
      infoAbilities.appendChild(nameAbility);

      const descripAbility = document.createElement("p");
      descripAbility.textContent = ability.description;
      infoAbilities.appendChild(descripAbility);

      const iconAbility = document.createElement("img");
      iconAbility.src = ability.displayIcon;
      iconAbility.className = "w-6 h-6";
      infoAbilities.appendChild(iconAbility);

      agentDetails.appendChild(infoAbilities);
    });

    // Toggle des détails
    agentCard.addEventListener("click", () => {
      agentDetails.classList.toggle("hidden");
    });

    agentList.appendChild(agentCard);
  });
}

function getGradient(colors) {
  if (!colors || colors.length < 4) {
    return 'linear-gradient(to bottom right, #1f2937, #111827)';
  }
  return `linear-gradient(135deg, #${colors[0]}, #${colors[1]}, #${colors[2]}, #${colors[3]})`;
}