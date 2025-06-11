

import "./style.css";

let currentLanguage = "fr-FR"; 
let currentRole = "all";

async function fetchAllAgents() {
  const response = await fetch(
    `https://valorant-api.com/v1/agents?language=${currentLanguage}&isPlayableCharacter=true`
  );
  return (await response.json()).data;
}

let agents = await fetchAllAgents(); 

const app = document.getElementById("app");


const rolesDiv = document.createElement("div");
rolesDiv.id = "rolesDiv";
rolesDiv.className = "mb-5 p-2";
app.appendChild(rolesDiv);


const roleSelector = document.createElement("select");
roleSelector.name = "roleSelector";
roleSelector.id = "roleSelector";
rolesDiv.appendChild(roleSelector);


const langDiv = document.getElementById("languageSelectorDiv");


const languages = [
  { code: "fr-FR", label: "🇫🇷" },
  { code: "en-US", label: "🇬🇧" },
  { code: "es-ES", label: "🇪🇸" },
  { code: "de-DE", label: "🇩🇪" },
  { code: "it-IT", label: "🇮🇹" },
  { code: "ja-JP", label: "🇯🇵" },
  { code: "ar-AE", label: "ᴀʀ" },
];


const langSelector = document.createElement("select");
langSelector.id = "languageSelector";
langSelector.style.color = "white";

languages.forEach((lang) => {
  const option = document.createElement("option");
  option.value = lang.code;
  option.textContent = lang.label;
  option.style.color = "black";
  langSelector.appendChild(option);
});

langSelector.value = currentLanguage;
langDiv.appendChild(langSelector);


langSelector.addEventListener("change", async (e) => {
  currentLanguage = e.target.value;
  await updateAgents(); 
});


async function updateAgents() {
  agents = await fetchAllAgents(); 
  updateRoleSelector(agents); 
  displayAgents(agents); 
}

function updateRoleSelector(agents) {
  const roleMap = new Map();

  agents.forEach((agent) => {
    if (
      agent.role?.uuid &&
      agent.role?.displayName &&
      agent.role?.displayIcon
    ) {
      roleMap.set(agent.role.uuid, {
        uuid: agent.role.uuid,
        displayName: agent.role.displayName,
        displayIcon: agent.role.displayIcon,
      });
    }
  });

  const uniqueRoles = Array.from(roleMap.values());

  roleSelector.innerHTML = ""; 

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.innerText = "All";
  roleSelector.appendChild(defaultOption);

  uniqueRoles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.uuid;
    option.innerText = role.displayName;
    roleSelector.appendChild(option);
  });

  roleSelector.value = "all";
}


const agentList = document.createElement("div");
agentList.className = "gap-5 p-5";
app.appendChild(agentList);


updateRoleSelector(agents);
displayAgents(agents);

roleSelector.addEventListener("change", (e) => {
  const selectedUUID = e.target.value;
  filterAgentsByRole(selectedUUID);
});

function filterAgentsByRole(roleUUID) {
  if (roleUUID === "all") {
    displayAgents(agents);
  } else {
    const filtered = agents.filter((agent) => agent.role?.uuid === roleUUID);
    displayAgents(filtered);
  }
}

function displayAgents(agentArray) {
  agentList.innerHTML = "";

  agentArray.forEach((agent, index) => {
    const agentCard = document.createElement("div");
    agentCard.className =
      "agent-card rounded-3xl shadow-md aspect-square p-7 mb-1 group cursor-pointer w-370 filter grayscale hover:grayscale-0 transition duration-300 agent-collapse";
    agentCard.style.background = getGradient(agent.backgroundGradientColors);

    const agentIntro = document.createElement("div");
    agentIntro.className =
      "agent-intro text-center flex items-center justify-between";

    const imgIconRole = document.createElement("div");
    imgIconRole.className = "flex items-center gap-10";

    const iconAgent = document.createElement("img");
    iconAgent.src = agent.displayIcon;
    iconAgent.className =
      "w-60 h-60 object-cover mb-2 pl-7 group-hover:scale-110 transition-transform";

    const iconRoleBig = document.createElement("img");
    iconRoleBig.src = agent.role.displayIcon;
    iconRoleBig.className = "w-45 h-45 opacity-10";

    const nameAgent = document.createElement("h2");
    nameAgent.textContent = agent.displayName;
    nameAgent.className = "text-[10rem] font-bold text-white opacity-40";

    if (index % 2 === 0) {
      imgIconRole.appendChild(iconAgent);
      imgIconRole.appendChild(iconRoleBig);
      agentIntro.appendChild(imgIconRole);
      agentIntro.appendChild(nameAgent);
    } else {
      imgIconRole.appendChild(iconRoleBig);
      imgIconRole.appendChild(iconAgent);
      agentIntro.appendChild(nameAgent);
      agentIntro.appendChild(imgIconRole);
    }

    agentCard.appendChild(agentIntro);

    const agentDetails = document.createElement("div");
    agentDetails.className =
      "agent-details hidden mt-4 text-left flex text-sm space-y-2 opacity-0 transition-opacity duration-500";

    const agentPortDesc = document.createElement("div");
    const bgWrapper = document.createElement("div");
    bgWrapper.className =
      "relative w-full h-140 flex items-center justify-center rounded-2xl overflow-hidden";

    const bgAgent = document.createElement("img");
    bgAgent.src = agent.background;
    bgAgent.className =
      "absolute inset-0 w-full h-full object-cover z-0 opacity-20";
    bgWrapper.appendChild(bgAgent);

    const portraitAgent = document.createElement("img");
    portraitAgent.src = agent.fullPortraitV2;
    portraitAgent.className =
      "relative z-10 w-full h-140 object-contain mx-auto mt-[-100px]";
    bgWrapper.appendChild(portraitAgent);

    agentPortDesc.appendChild(bgWrapper);
    const description = document.createElement("p");
    description.textContent = agent.description;
    agentPortDesc.appendChild(description);
    agentDetails.appendChild(agentPortDesc);

    const divDescri = document.createElement("div");
    divDescri.className = "divDescri";
    agentDetails.appendChild(divDescri);

    const iconNameRole = document.createElement("div");
    iconNameRole.className = "flex items-center gap-6";

    const iconRole = document.createElement("img");
    iconRole.src = agent.role.displayIcon;
    iconRole.className = "w-12 h-12";

    const nameRole = document.createElement("h3");
    nameRole.textContent = `Rôle : ${agent.role.displayName}`;
    nameRole.className = "font-semibold text-2xl";

    iconNameRole.appendChild(iconRole);
    iconNameRole.appendChild(nameRole);
    divDescri.appendChild(iconNameRole);

    const descripRole = document.createElement("p");
    descripRole.textContent = agent.role.description;
    divDescri.appendChild(descripRole);

    agent.abilities.forEach((ability) => {
      if (!ability.displayIcon || !ability.displayName) return;
      const infoAbilities = document.createElement("div");
      infoAbilities.className = "pt-2 border-t border-gray-200";

      const iconNameAbi = document.createElement("div");
      iconNameAbi.className = "flex items-center gap-6";

      const iconAbility = document.createElement("img");
      iconAbility.src = ability.displayIcon;
      iconAbility.className = "w-12 h-12";

      const nameAbility = document.createElement("h4");
      nameAbility.textContent = ability.displayName;
      nameAbility.className = "font-medium text-xl";

      iconNameAbi.appendChild(iconAbility);
      iconNameAbi.appendChild(nameAbility);
      infoAbilities.appendChild(iconNameAbi);

      const descripAbility = document.createElement("p");
      descripAbility.textContent = ability.description;
      infoAbilities.appendChild(descripAbility);

      divDescri.appendChild(infoAbilities);
    });

    agentCard.appendChild(agentDetails);

    agentCard.addEventListener("click", () => {
      const isCollapsed = agentCard.classList.contains("agent-collapse");

      if (isCollapsed) {
        agentCard.classList.remove("agent-collapse");
        agentCard.classList.add("agent-expand");

        agentIntro.classList.add("hidden");
        agentDetails.classList.remove("hidden");
        setTimeout(() => {
          agentDetails.classList.add("opacity-100");
        }, 10);
      } else {
        agentCard.classList.remove("agent-expand");
        agentCard.classList.add("agent-collapse");

        agentDetails.classList.remove("opacity-100");
        setTimeout(() => {
          agentDetails.classList.add("hidden");
          agentIntro.classList.remove("hidden");
        }, 500);
      }
    });

    agentList.appendChild(agentCard);
  });
}

function getGradient(colors) {
  if (!colors || colors.length < 4)
    return "linear-gradient(to bottom right, #1f2937, #111827)";
  return `linear-gradient(135deg, #${colors[0]}, #${colors[1]}, #${colors[2]}, #${colors[3]})`;
}