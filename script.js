const calculette = document.querySelector("#calculette");
const affichageSaisi = calculette.querySelector("#saisi");
const affichageResult = calculette.querySelector("#resultat");
const virguleButton = calculette.querySelector("#virgule");
const parentheseButton = calculette.querySelector("#parenthese");
const effaceButton = calculette.querySelector("#effacer");
const clearButton = calculette.querySelector("#clear");
const egalButton = calculette.querySelector("#egal");

let state = {
  screenOpe: "",
  calcOpe: "",
  result: 0,
  lastItem: "start", // number || dot || ope || open || close || result ||
  openCount: 0,
  dotInCurrentNumber: false,
};

window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (/^\d$/.test(e.key)) {
    inputNumber(e.key);
  }
  if (e.key === ".") inputDot(e.key);
  if ("/*-+%".includes(e.key)) inputOperateur(e.key);
  if (e.key === "(") inputParenthese("open");
  if (e.key === ")") inputParenthese("close");
  if (e.key === "Backspace") effacer();
  if (e.key === "Delete") clear();
  if (e.key === "Enter") calcul();

  affichageSaisi.textContent = state.screenOpe;
});

calculette.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  const clickValue = btn.dataset.ope;
  if (!btn) return;
  if (btn.classList.contains("chiffre") && btn !== virguleButton)
    inputNumber(clickValue);
  if (btn === virguleButton) inputDot(clickValue);
  if (btn.classList.contains("operateur") && btn !== parentheseButton)
    inputOperateur(clickValue);
  if (btn === parentheseButton) inputParenthese("auto");
  if (btn === effaceButton) effacer();
  if (btn === clearButton) clear();
  if (btn === egalButton) calcul();

  affichageSaisi.textContent = state.screenOpe;
});

function inputNumber(item) {
  if (state.lastItem === "result") {
    state.calcOpe = "";
    state.screenOpe = "";
  }
  state.screenOpe += item;
  state.calcOpe += item;
  state.lastItem = "number";
}

function inputDot(item) {
  if (state.dotInCurrentNumber) return;
  state.lastItem !== "number"
    ? (state.calcOpe = state.calcOpe + "0" + item)
    : (state.calcOpe += item);
  state.screenOpe += item;
  state.lastItem = "dot";
  state.dotInCurrentNumber = true;
}

function inputOperateur(item) {
  state.lastItem === "dot" ||
  state.lastItem === "ope" ||
  state.lastItem === "open"
    ? ((state.screenOpe = state.screenOpe.slice(0, -1) + item),
      (state.calcOpe = state.calcOpe.slice(0, -1) + item))
    : ((state.screenOpe += item), (state.calcOpe += item));
  state.lastItem = "ope";
  state.dotInCurrentNumber = false;
}

function inputParenthese(side = "auto") {
  if (side === "auto") {
    if (
      state.openCount > 0 &&
      (state.lastItem === "number" || state.lastItem === "close")
    ) {
      side = "close";
    } else {
      side = "open";
    }
  }
  if (side === "close") {
    if (
      state.openCount > 0 &&
      (state.lastItem === "number" || state.lastItem === "close")
    ) {
      state.screenOpe = state.screenOpe + ")";
      state.calcOpe = state.calcOpe + ")";
      state.openCount--;
      state.lastItem = "close";
      state.dotInCurrentNumber = false;
    }
    return;
  }
  if (["start", "ope", "open", "number", "close"].includes(state.lastItem)) {
    if (state.lastItem === "number" || state.lastItem === "close") {
      state.calcOpe += "*(";
    } else {
      state.calcOpe += "(";
    }
  }
  state.screenOpe += "(";
  state.openCount++;
  state.lastItem = "open";
  state.dotInCurrentNumber = false;
}

function effacer() {
  state.screenOpe = state.screenOpe.slice(0, -1);
  state.calcOpe = state.calcOpe.slice(0, -1);
}

function clear() {
  state.calcOpe = "";
  state.screenOpe = "";
  state.result = "";
  state.lastItem = "debut";
  state.openCount = 0;
  state.dotInCurrentNumber = false;
}

function calcul() {
  state.result = eval(state.calcOpe);
  affichageSaisi.textContent = state.calcOpe;
  affichageResult.textContent = "";
  state.screenOpe = state.result;
  state.calcOpe = state.result;
  state.lastItem = "result";
  state.dotInCurrentNumber = false;
}

// function estOperationValide(ope) {
//   const s = (ope || "").replace(/\s+/g, "");
//   let open = 0; // nb de "(" ouvertes
//   let last = "start"; // start|number|op|open|close
//   let dotInNumber = false; // un seul "." par nombre

//   for (let i = 0; i < s.length; i++) {
//     const c = s[i];

//     // ----- chiffre -----
//     if (c >= "0" && c <= "9") {
//       last = "number";
//       continue;
//     }

//     // ----- point décimal -----
//     if (c === ".") {
//       // autoriser ".5" en début / après op / après "("
//       if (last === "start" || last === "op" || last === "open") {
//         if (dotInNumber) return invalide();
//         dotInNumber = true;
//         last = "number";
//         continue;
//       }
//       // au milieu d'un nombre : une seule fois
//       if (last === "number" && !dotInNumber) {
//         dotInNumber = true;
//         continue;
//       }
//       return invalide();
//     }

//     // on quitte un nombre → reset du point
//     if (last === "number") dotInNumber = false;

//     // ----- parenthèse ouvrante -----
//     if (c === "(") {
//       // ici on refuse la multiplication implicite dans la validation,
//       // car tu l'insères déjà côté "operationACalculer"
//       if (last === "number" || last === "close") return invalide();
//       open++;
//       last = "open";
//       continue;
//     }

//     // ----- parenthèse fermante -----
//     if (c === ")") {
//       if (open === 0) return invalide();
//       if (!(last === "number" || last === "close")) return invalide();
//       open--;
//       last = "close";
//       continue;
//     }

//     // ----- opérateurs -----
//     if ("+-*/%".includes(c)) {
//       // autoriser "-" unaire: en début, après "(" ou après un autre opérateur
//       if (c === "-" && (last === "start" || last === "open" || last === "op")) {
//         last = "op"; // on attend un nombre derrière (géré par règles ci-dessus)
//         continue;
//       }
//       // sinon, opérateur binaire normal : doit suivre un nombre ou ")"
//       if (!(last === "number" || last === "close")) return invalide();
//       last = "op";
//       continue;
//     }

//     // caractère inconnu
//     return invalide();
//   }

//   const ok = open === 0 && (last === "number" || last === "close");
//   estOperation = ok;
//   if (ok && s.length > 1) {
//     try {
//       affichageResultat.textContent = eval(s);
//     } catch {
//       /* noop */
//     }
//   } else {
//     affichageResultat.textContent = "";
//   }
//   return ok;

//   function invalide() {
//     estOperation = false;
//     affichageResultat.textContent = "";
//     return false;
//   }
// }

// function scanOperation(ope) {
//   nbParentheseOuverte = 0;
//   lastValeur = "debut";
//   let nombrePresent = false;

//   for (const c of ope.replace(/\s+/g, "")) {
//     if ((c >= "0" && c <= "9") || c === ".") {
//       nombrePresent = true;
//       lastValeur = "chiffre";
//       continue;
//     }
//     nombrePresent = false;
//     if (c === "(") {
//       nbParentheseOuverte++;
//       lastValeur = "parentheseOuverte";
//     } else if (c === ")") {
//       nbParentheseOuverte = Math.max(0, nbParentheseOuverte - 1);
//       lastValeur = "parentheseFermee";
//     } else if ("+-*/%".includes(c)) {
//       lastValeur = "operateur";
//     }
//   }
//   return { nbParentheseOuverte, lastValeur };
// }
