const calculette = document.querySelector("#calculette");
const affichageSaisi = calculette.querySelector("#saisi");
const affichageResultat = calculette.querySelector("#resultat");
const virgule = calculette.querySelector("#virgule");
const parenthese = calculette.querySelector("#parenthese");
const efface = calculette.querySelector("#effacer");
const clear = calculette.querySelector("#clear");
const egal = calculette.querySelector("#egal");

let operation = "";
let resultat = 0;
let virgulePresent = false;
let operateurPresent = false;
let chiffrePresent = false;
let parenthesePresent = false;
let premierParenthese = true;
let estOperation = false;

calculette.addEventListener("click", recupChiffre);
virgule.addEventListener("click", recupVirgule);
calculette.addEventListener("click", recupOperateur);
parenthese.addEventListener("click", recupParenthese);
efface.addEventListener("click", effacer);
clear.addEventListener("click", clearOpe);
egal.addEventListener("click", donneResultat);

function recupChiffre(event) {
  if (!event.target.closest("button")) return;
  const boutonClicke = event.target.closest("button");
  const valeurClicke = boutonClicke.dataset.ope;

  if (boutonClicke.classList.contains("chiffre") && boutonClicke !== virgule) {
    operation += valeurClicke;
    virgulePresent = false;
    operateurPresent = false;
    chiffrePresent = true;
    parenthesePresent = false;
    affichageSaisi.innerText = operation;
    estOperationValide(operation);
  }
}

function recupVirgule(event) {
  const boutonClicke = event.target.closest("button");
  const valeurClicke = boutonClicke.dataset.ope;
  if (boutonClicke === virgule && !virgulePresent) {
    operateurPresent
      ? operation + "0" + valeurClicke
      : (operation += valeurClicke);
    affichageSaisi.innerText = operation;
    virgulePresent = true;
    operateurPresent = false;
    chiffrePresent = false;
    parenthesePresent = false;
    estOperationValide(operation);
  }
}

function recupOperateur(event) {
  if (!event.target.closest("button")) return;
  const boutonClicke = event.target.closest("button");
  const valeurClicke = boutonClicke.dataset.ope;
  if (
    boutonClicke.classList.contains("operateur") &&
    boutonClicke !== parenthese
  ) {
    virgulePresent || operateurPresent
      ? (operation = operation.slice(0, -1) + valeurClicke)
      : (operation += valeurClicke);
    virgulePresent = false;
    operateurPresent = true;
    chiffrePresent = false;
    parenthesePresent = false;
    affichageSaisi.innerText = operation;
    estOperationValide(operation);
  }
}

function recupParenthese(event) {
  if (!event.target.closest("button")) return;
  const boutonClicke = event.target.closest("button");
  if (boutonClicke === parenthese) {
    if (premierParenthese) {
      virgulePresent
        ? (operation = operation.slice(0, -1) + "(")
        : (operation = operation + "(");
      premierParenthese = false;
    } else {
      virgulePresent
        ? (operation = operation.slice(0, -1) + ")")
        : (operation = operation + ")");
      premierParenthese = true;
    }

    virgulePresent = false;
    operateurPresent = false;
    chiffrePresent = false;
    parenthesePresent = true;

    affichageSaisi.innerText = operation;
    estOperationValide(operation);
  }
}

function effacer(event) {
  if (!event.target.closest("button")) return;
  const boutonClicke = event.target.closest("button");

  if (boutonClicke === efface) {
    parenthesePresent
      ? premierParenthese
        ? (premierParenthese = false)
        : (premierParenthese = true)
      : "";

    operation = toString(operation.slice(0, -1));
    affichageSaisi.innerText = operation;
    estOperationValide(operation);
  }
}

function clearOpe(event) {
  if (!event.target.closest("button")) return;
  const boutonClicke = event.target.closest("button");

  if (boutonClicke === clear) {
    operation = "";
    affichageSaisi.innerText = operation;
    estOperationValide(operation);
  }
}

function donneResultat(event) {
  if (!event.target.closest("button")) return;
  const boutonClicke = event.target.closest("button");

  if (boutonClicke === egal) {
    if (!estOperation) {
      affichageResultat.innerText = "Erreur de format";
      affichageResultat.classList.add("erreur");
    } else {
      resultat = eval(operation);
      affichageSaisi.innerText = resultat;
      affichageResultat.innerText = "";
      operation = resultat;
    }
  }
}

function estOperationValide(ope) {
  ope = ope.replace(/\s+/g, "");
  estOperation = /^-?\d+(?:\.\d+)?(?:[+\-*/]-?\d+(?:\.\d+)?)*$/.test(ope);
  if (estOperation && operation.length > 1) {
    affichageResultat.innerText = eval(operation);
  }
}
