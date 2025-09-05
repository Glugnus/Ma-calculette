const calculette = document.querySelector("#calculette");
const affichageSaisi = calculette.querySelector("#saisi");
const affichageResult = calculette.querySelector("#resultat");
const virguleButton = calculette.querySelector("#virgule");
const parentheseButton = calculette.querySelector("#parenthese");
const pourcentButton = calculette.querySelector("#pourcent");
const effaceButton = calculette.querySelector("#effacer");
const clearButton = calculette.querySelector("#clear");
const egalButton = calculette.querySelector("#egal");
const expandButton = calculette.querySelector("#expand");
const opeSpecifique = calculette.querySelector("#specifique");
const buttons = calculette.querySelectorAll(".bouton");
const svgExpand = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="currentColor"
  >
    <path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z" />
  </svg>`;

const svgCollapse = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="currentColor"
  >
    <path d="m296-80-56-56 240-240 240 240-56 56-184-184L296-80Zm184-504L240-824l56-56 184 184 184-184 56 56-240 240Z" />
  </svg>`;
let state = {
  screenOpe: "",
  calcOpe: "",
  result: 0,
  lastItem: "start", // number || dot || ope || open || close || result || percent
  openCount: 0,
  dotInCurrentNumber: false,
  firstNumber: true,
  validOperation: false,
};

window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (/^\d$/.test(e.key)) {
    inputNumber(e.key);
  }
  if (e.key === ".") inputDot(e.key);
  if ("/*-+".includes(e.key)) inputOperateur(e.key);
  if (e.key === "(") inputParenthese("open");
  if (e.key === ")") inputParenthese("close");
  if (e.key === "%") inputPourcent(e.key);
  if (e.key === "Backspace") effacer();
  if (e.key === "Delete") clear();
  if (e.key === "Enter") calcul();
  syncScanOpe();
  directResult();

  affichageSaisi.textContent = String(state.screenOpe);
});

calculette.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn === expandButton) afficherOpeSpe();

  const clickValue = btn.dataset.ope;
  if (btn.classList.contains("chiffre") && btn !== virguleButton)
    inputNumber(clickValue);
  if (btn === virguleButton) inputDot(clickValue);
  if (
    btn.classList.contains("operateur") &&
    btn !== parentheseButton &&
    btn !== pourcentButton
  )
    inputOperateur(clickValue);
  if (btn === parentheseButton) inputParenthese("auto");
  if (btn === pourcentButton) inputPourcent(clickValue);
  if (btn === effaceButton) effacer();
  if (btn === clearButton) clear();
  if (btn === egalButton) calcul();
  syncScanOpe();
  directResult();

  affichageSaisi.textContent = state.screenOpe;
});

function inputNumber(item) {
  if (state.lastItem === "percent") return;
  if (state.lastItem === "result") {
    state.calcOpe = "";
    state.screenOpe = "";
    state.firstNumber = true;
  }
  if (state.lastItem === "close") {
    state.calcOpe += "*";
    state.firstNumber = false;
  }
  state.screenOpe += item;
  state.calcOpe += item;
  state.lastItem = "number";
  state.dotInCurrentNumber = false;
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function inputDot(item) {
  if (state.dotInCurrentNumber) return;
  state.lastItem !== "number"
    ? (state.calcOpe = state.calcOpe + "0" + item)
    : (state.calcOpe += item);
  state.screenOpe += item;
  state.lastItem = "dot";
  state.dotInCurrentNumber = true;
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function inputOperateur(item) {
  if (state.lastItem === "dot" || state.lastItem === "ope") {
    state.screenOpe = state.screenOpe.slice(0, -1) + item;
    state.calcOpe = state.calcOpe.slice(0, -1) + item;
  } else if (state.lastItem === "start" || state.lastItem === "open") {
    state.screenOpe += item;
    state.calcOpe = state.calcOpe + "0" + item;
  } else {
    state.screenOpe += item;
    state.calcOpe += item;
  }
  state.lastItem = "ope";
  state.dotInCurrentNumber = false;
  state.firstNumber = false;
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
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
    }
    return;
  }
  if (
    ["start", "ope", "open", "number", "close", "result"].includes(
      state.lastItem
    )
  ) {
    if (
      state.lastItem === "number" ||
      state.lastItem === "close" ||
      state.lastItem === "result"
    ) {
      state.calcOpe += "*(";
    } else {
      state.calcOpe += "(";
    }
  }
  state.screenOpe += "(";
  state.openCount++;
  state.lastItem = "open";
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function inputPourcent(item) {
  if (
    state.lastItem === "number" ||
    state.lastItem === "result" ||
    state.lastItem === "close"
  ) {
    state.calcOpe += "*0.01";
    state.screenOpe += item;
    state.lastItem = "percent";
    affichageSaisi.classList.remove("result");
    affichageResult.classList.remove("erreur");
  }
}

function effacer() {
  state.screenOpe = state.screenOpe.slice(0, -1);
  state.calcOpe = state.calcOpe.slice(0, -1);
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function clear() {
  state.calcOpe = "";
  state.screenOpe = "";
  state.result = "";
  state.lastItem = "start";
  state.openCount = 0;
  state.dotInCurrentNumber = false;
  state.firstNumber = true;
  affichageResult.textContent = "";
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function calcul() {
  if (affichageResult.textContent) {
    try {
      state.result = Number(affichageResult.textContent);
      affichageSaisi.textContent = state.calcOpe;
      affichageResult.textContent = "";
      state.screenOpe = String(state.result);
      state.calcOpe = String(state.result);
      state.lastItem = "result";
      state.dotInCurrentNumber = false;
      state.firstNumber = true;
      affichageSaisi.classList.add("result");
    } catch {
      affichageResult.classList.add("erreur");
      affichageResult.textContent = "Erreur de format";
    }
  }
}

function directResult() {
  if (state.firstNumber) return;

  try {
    let operationTemporaire = state.calcOpe;

    if (state.openCount > 0) {
      operationTemporaire = operationTemporaire + ")".repeat(state.openCount);
    }
    state.result = eval(operationTemporaire);
    affichageResult.textContent = state.result;
  } catch {
    affichageResult.textContent = "";
  }
}

function scanOpe(ope) {
  const operation = (ope ?? "").replace(/\s+/g, "");
  let open = 0;
  let last = "start";
  let dot = false;
  let seenOperateur = false;
  let validOperation = true;

  for (let i = 0; i < operation.length; i++) {
    const item = operation[i];

    if (item >= "0" && item <= "9") {
      last = "number";
      continue;
    }

    if (item === ".") {
      if (last === "start" || last === "open" || last === "ope") {
        dot = true;
        last = "dot";
        continue;
      }
      if (last === "number" && !dot) {
        dot = true;
        last = "dot";
        continue;
      }
      validOperation = false;
      continue;
    }

    if (last === "number" || last === "dot") {
      dot = false;
    }

    if (item === "(") {
      open++;
      last = "open";
      continue;
    }

    if (item === ")") {
      if (open === 0) validOperation = false;
      else open--;

      if (!(last === "number" || last === "close")) validOperation = false;
      last = "close";
      continue;
    }

    if ("+-*/%".includes(item)) {
      if (
        item === "-" &&
        (last === "start" || last === "open" || last === "ope")
      ) {
        last = "ope";
        continue;
      }
      if (last === "number" || last === "close") {
        seenOperateur = true;
        last = "ope";
        continue;
      }
      validOperation = false;
    }
  }
  const endOK = last === "number" || last === "close";
  if (!endOK || open > 0) validOperation = false;

  return {
    valid: validOperation,
    openCount: open,
    lastItem: last,
    dot: dot,
    seenOperateur: seenOperateur,
  };
}

function syncScanOpe() {
  const a = scanOpe(state.calcOpe);
  state.openCount = a.openCount;
  if (state.lastItem !== "result") state.lastItem = a.lastItem;
  state.dotInCurrentNumber = a.dot;
  state.firstNumber = !a.seenOperateur;
  state.validOperation = a.valid;
  return a;
}

let toggle = false;

function afficherOpeSpe() {
  opeSpecifique.classList.toggle("active");
  buttons.forEach((button) => {
    button.classList.toggle("expand");
  });
  toggle = !toggle;

  expandButton.innerHTML = toggle ? svgCollapse : svgExpand;
}
