const calculette = document.querySelector("#calculette");
const body = document.querySelector("#body");
const clavier = document.querySelector("#clavier");
const historique = document.querySelector("#historique");
const affichage = calculette.querySelector("#affichage");
const affichageSaisi = calculette.querySelector("#saisi");
const affichageResult = calculette.querySelector("#resultat");
const virguleButton = calculette.querySelector("#virgule");
const parentheseButton = calculette.querySelector("#parenthese");
const pourcentButton = calculette.querySelector("#pourcent");
const racineCarreButton = calculette.querySelector("#racineCarre");
const piButton = calculette.querySelector("#pi");
const exposantButton = calculette.querySelector("#exposant");
const factorielleButton = calculette.querySelector("#factorielle");
const sinusButton = calculette.querySelector("#sinus");
const cosinusButton = calculette.querySelector("#cosinus");
const tangeanteButton = calculette.querySelector("#tangeante");
const exponentielleButton = calculette.querySelector("#exponentielle");
const effaceButton = calculette.querySelector("#effacer");
const clearButton = calculette.querySelector("#clear");
const egalButton = calculette.querySelector("#egal");
const expandButton = calculette.querySelector("#expand");
const opeSpecifique = calculette.querySelector("#specifique");
const saisi = calculette.querySelector("#saisi");
const menu = calculette.querySelector("#menu-parameter");
const overlay = calculette.querySelector("#overlay");
const overlayDark = calculette.querySelector("#overlayDark");
const buttons = calculette.querySelectorAll(".bouton");
const historyButton = calculette.querySelector("#historyButton");
const themeButton = calculette.querySelector("#theme");
const confirmModal = document.querySelector("#confirmModal");
const effacerHistoriqueButton = calculette.querySelector("#eraseHist");
const fermerButton = document.querySelector("#fermerModal");
const eraseButton = document.querySelector("#erase");
const parameterButton = calculette.querySelector("#parameter");
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

const svgDarkMode = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="currentColor"
  >
    <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
  </svg>`;

const svgLightMode = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="currentColor"
  >
    <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" />
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
let hist = [];

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
  if (btn === historyButton) afficherHistory();
  if (btn === parameterButton) afficherMenu();
  if (btn === effacerHistoriqueButton) effacerHistorique();
  if (btn === themeButton) changeTheme();

  const clickValue = btn.dataset.ope;
  if (btn.classList.contains("chiffre") && btn !== virguleButton)
    inputNumber(clickValue);
  if (btn === virguleButton) inputDot(clickValue);
  if (
    btn.classList.contains("operateur") &&
    btn !== parentheseButton &&
    btn !== pourcentButton &&
    btn !== racineCarreButton &&
    btn !== piButton &&
    btn !== exposantButton &&
    btn !== factorielleButton &&
    btn !== sinusButton &&
    btn !== cosinusButton &&
    btn !== tangeanteButton &&
    btn !== exponentielleButton
  )
    inputOperateur(clickValue);
  if (btn === parentheseButton) inputParenthese("auto");
  if (btn === pourcentButton) inputPourcent(clickValue);
  if (btn === racineCarreButton) inputRacineCarre();
  if (btn === piButton) inputPi(clickValue);
  if (btn === exposantButton) inputExposant(clickValue);
  if (btn === factorielleButton) inputFactorielle(clickValue);
  if (btn === sinusButton) inputSin();
  if (btn === cosinusButton) inputCos();
  if (btn === tangeanteButton) inputTan();
  if (btn === exponentielleButton) inputExp(clickValue);
  if (btn === effaceButton) effacer();
  if (btn === clearButton) clear();
  if (btn === egalButton) calcul();
  syncScanOpe();
  directResult();

  console.log(state);
  console.log(hist);

  affichageSaisi.textContent = state.screenOpe;
});

overlay.addEventListener("click", () => {
  overlay.classList.add("is-hidden");
  menu.classList.add("is-hidden");
});

overlayDark.addEventListener("click", () => {
  fermerModal();
});

fermerButton.addEventListener("click", () => {
  fermerModal();
});

eraseButton.addEventListener("click", () => {
  confirmerSuppr();
});

function factorielle(n) {
  if (n < 0) return "";
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

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
function inputPi(item) {
  if (state.lastItem === "percent") return;
  if (state.lastItem === "result") {
    state.calcOpe = "";
    state.screenOpe = "";
    state.firstNumber = true;
  }
  if (state.lastItem === "close" || state.lastItem === "number") {
    state.calcOpe += "*";
    state.firstNumber = false;
  }
  state.screenOpe += item;
  state.calcOpe += 3.141592653589793;
  state.lastItem = "number";
  state.dotInCurrentNumber = true;
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

function inputExposant(item) {
  if (state.lastItem === "number" || state.lastItem === "close")
    state.screenOpe += item;
  state.calcOpe += "**";
  state.dotInCurrentNumber = false;
  state.lastItem = "ope";
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
      state.lastItem === "result" ||
      state.lastItem === "percent"
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

function inputRacineCarre() {
  const needMulti = ["number", "close", "result", "percent"].includes(
    state.lastItem
  );
  if (state.lastItem !== "dot") {
    state.calcOpe += needMulti ? "*Math.sqrt(" : "Math.sqrt(";
    state.screenOpe += "√(";
    state.openCount++;
    state.lastItem = "open";
    state.dotInCurrentNumber = false;
    state.firstNumber = false;
  }
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function inputExp() {
  const needMulti = ["number", "close", "result", "percent"].includes(
    state.lastItem
  );
  if (state.lastItem !== "dot") {
    state.calcOpe += needMulti ? "*Math.exp(" : "Math.exp(";
    state.screenOpe += "e^(";
    state.openCount++;
    state.lastItem = "open";
    state.dotInCurrentNumber = false;
    state.firstNumber = false;
  }
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function inputSin() {
  const needMulti = ["number", "close", "result", "percent"].includes(
    state.lastItem
  );
  if (state.lastItem !== "dot") {
    state.calcOpe += needMulti ? "*Math.sin(" : "Math.sin(";
    state.screenOpe += "sin(";
    state.openCount++;
    state.lastItem = "open";
    state.dotInCurrentNumber = false;
    state.firstNumber = false;
  }
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function inputCos() {
  const needMulti = ["number", "close", "result", "percent"].includes(
    state.lastItem
  );
  if (state.lastItem !== "dot") {
    state.calcOpe += needMulti ? "*Math.cos(" : "Math.cos(";
    state.screenOpe += "cos(";
    state.openCount++;
    state.lastItem = "open";
    state.dotInCurrentNumber = false;
    state.firstNumber = false;
  }
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function inputTan() {
  const needMulti = ["number", "close", "result", "percent"].includes(
    state.lastItem
  );
  if (state.lastItem !== "dot") {
    state.calcOpe += needMulti ? "*Math.tan(" : "Math.tan(";
    state.screenOpe += "tan(";
    state.openCount++;
    state.lastItem = "open";
    state.dotInCurrentNumber = false;
    state.firstNumber = false;
  }
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function inputFactorielle(item) {
  if (state.lastItem === "number" || state.lastItem === "result") {
    state.screenOpe += item;

    const lastNumberMatch = state.calcOpe.match(/(\d+)$|(\))$/);
    if (lastNumberMatch) {
      const index = state.calcOpe.lastIndexOf(lastNumberMatch[0]);
      state.calcOpe =
        state.calcOpe.slice(0, index) +
        "factorielle(" +
        lastNumberMatch[0] +
        ")";
    }

    state.lastItem = "number";
    state.dotInCurrentNumber = false;
    state.firstNumber = false;
  }
  affichageSaisi.classList.remove("result");
  affichageResult.classList.remove("erreur");
}

function effacer() {
  if (state.calcOpe.endsWith("*0.01") && state.screenOpe.endsWith("%")) {
    state.screenOpe = state.screenOpe.slice(0, -1);
    state.calcOpe = state.calcOpe.slice(0, -5);
  } else if (state.screenOpe.endsWith("√(")) {
    state.screenOpe = state.screenOpe.slice(0, -2);
    if (
      state.screenOpe.endsWith("*") &&
      state.calcOpe.endsWith("*Math.sqrt(")
    ) {
      state.calcOpe = state.calcOpe.slice(0, -10);
    } else if (state.calcOpe.endsWith("*Math.sqrt(")) {
      state.calcOpe = state.calcOpe.slice(0, -11);
    } else if (state.calcOpe.endsWith("Math.sqrt(")) {
      state.calcOpe = state.calcOpe.slice(0, -10);
    }
  } else if (state.screenOpe.endsWith("e^(")) {
    state.screenOpe = state.screenOpe.slice(0, -3);
    if (state.screenOpe.endsWith("*") && state.calcOpe.endsWith("*Math.exp(")) {
      state.calcOpe = state.calcOpe.slice(0, -9);
    } else if (state.calcOpe.endsWith("*Math.exp(")) {
      state.calcOpe = state.calcOpe.slice(0, -10);
    } else if (state.calcOpe.endsWith("Math.exp(")) {
      state.calcOpe = state.calcOpe.slice(0, -9);
    }
  } else if (
    state.screenOpe.endsWith("sin(") ||
    state.screenOpe.endsWith("cos(") ||
    state.screenOpe.endsWith("tan(")
  ) {
    state.screenOpe = state.screenOpe.slice(0, -4);
    if (
      state.screenOpe.endsWith("*") &&
      (state.calcOpe.endsWith("*Math.sin(") ||
        state.calcOpe.endsWith("*Math.cos(") ||
        state.calcOpe.endsWith("*Math.tan("))
    ) {
      state.calcOpe = state.calcOpe.slice(0, -9);
    } else if (
      state.calcOpe.endsWith("*Math.sin(") ||
      state.calcOpe.endsWith("*Math.cos(") ||
      state.calcOpe.endsWith("*Math.tan(")
    ) {
      state.calcOpe = state.calcOpe.slice(0, -10);
    } else if (
      state.calcOpe.endsWith("Math.sin(") ||
      state.calcOpe.endsWith("Math.cos(") ||
      state.calcOpe.endsWith("Math.tan(")
    ) {
      state.calcOpe = state.calcOpe.slice(0, -9);
    }
  } else if (state.screenOpe.endsWith("π")) {
    state.screenOpe = state.screenOpe.slice(0, -1);
    if (
      state.screenOpe.endsWith("*") &&
      state.calcOpe.endsWith("*3.141592653589793")
    ) {
      state.calcOpe = state.calcOpe.slice(0, -17);
    } else if (state.calcOpe.endsWith("*3.141592653589793")) {
      state.calcOpe = state.calcOpe.slice(0, -18);
    }
  } else if (state.screenOpe.endsWith("^") && state.calcOpe.endsWith("**")) {
    state.screenOpe = state.screenOpe.slice(0, -1);
    state.calcOpe = state.calcOpe.slice(0, -2);
  } else if (state.screenOpe.endsWith("!")) {
    state.screenOpe = state.screenOpe.slice(0, -1);

    const match = state.calcOpe.match(/factorielle\((\d+(\.\d+)?)\)$/);
    if (match) {
      const originalNumber = match[1];
      state.calcOpe = state.calcOpe.replace(
        /factorielle\((\d+(\.\d+)?)\)$/,
        originalNumber
      );
    }
  } else {
    state.screenOpe = state.screenOpe.slice(0, -1);
    state.calcOpe = state.calcOpe.slice(0, -1);
    affichageSaisi.classList.remove("result");
    affichageResult.classList.remove("erreur");
  }
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
      state.result = Number(
        Number(affichageResult.textContent).toPrecision(5)
      ).toString();
      affichageSaisi.textContent = state.calcOpe;
      affichageResult.textContent = "";
      hist.push({ ope: state.screenOpe, res: state.result });
      hist.forEach((entry) => {
        const line = document.createElement("div");
        line.classList.add("hist-entry");
        line.innerHTML = `<span class="ope">${entry.ope} = </span><span class="res">${entry.res}</span`;
        historique.appendChild(line);
        historique.scrollTop = historique.scrollHeight;
      });
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
  if (state.firstNumber) {
    state.result = "";
    affichageResult.textContent = "";
    return;
  }

  try {
    let operationTemporaire = state.calcOpe;

    if (state.openCount > 0) {
      operationTemporaire = operationTemporaire + ")".repeat(state.openCount);
    }
    state.result = Number(
      Number(eval(operationTemporaire)).toPrecision(14)
    ).toString();
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

  if (
    (state.calcOpe.includes("Math.sqrt(") &&
      state.screenOpe.includes("√(") &&
      state.screenOpe !== "√(") ||
    state.screenOpe.includes("!") ||
    (state.calcOpe.includes("Math.sin(") &&
      state.screenOpe.includes("sin(") &&
      state.screenOpe !== "sin(") ||
    (state.calcOpe.includes("Math.cos(") &&
      state.screenOpe.includes("cos(") &&
      state.screenOpe !== "cos(") ||
    (state.calcOpe.includes("Math.tan(") &&
      state.screenOpe.includes("tan(") &&
      state.screenOpe !== "tan(") ||
    (state.calcOpe.includes("Math.exp(") &&
      state.screenOpe.includes("e^(") &&
      state.screenOpe !== "e^(")
  ) {
    a.seenOperateur = true;
  }

  state.firstNumber = !a.seenOperateur;
  state.validOperation = a.valid;
  return a;
}

let toggleSpec = false;
let toggleHist = false;

function afficherOpeSpe() {
  opeSpecifique.classList.toggle("is-hidden");
  buttons.forEach((button) => {
    button.classList.toggle("spec-actif");
  });
  toggleSpec = !toggleSpec;
  calculette.dataset.spec = toggleSpec ? "open" : "close";

  expandButton.innerHTML = toggleSpec ? svgCollapse : svgExpand;
}

function afficherHistory() {
  historique.classList.toggle("is-hidden");
  toggleHist = !toggleHist;
  calculette.dataset.history = toggleHist ? "open" : "close";
  historique.scrollTop = historique.scrollHeight;
}

function afficherMenu() {
  menu.classList.toggle("is-hidden");
  overlay.classList.toggle("is-hidden");
}

function effacerHistorique() {
  confirmModal.classList.toggle("is-hidden");
  overlayDark.classList.toggle("is-hidden");
  overlay.classList.add("is-hidden");
  menu.classList.add("is-hidden");
}

function fermerModal() {
  overlayDark.classList.add("is-hidden");
  confirmModal.classList.add("is-hidden");
}

function confirmerSuppr() {
  hist = [];
  historique.innerHTML = "";
  overlayDark.classList.add("is-hidden");
  confirmModal.classList.add("is-hidden");
}

let toggleTheme = false;

function changeTheme() {
  toggleTheme = !toggleTheme;
  body.dataset.theme = toggleTheme ? "dark" : "light";
  themeButton.innerHTML = toggleTheme
    ? svgLightMode + "Thème clair"
    : svgDarkMode + "Thème sombre";
  overlay.classList.add("is-hidden");
  menu.classList.add("is-hidden");
}
