import { FNS, trig } from "./constants.js";

export function tokenize(s) {
  const t = [];
  let i = 0;
  while (i < s.length) {
    if (" \t".indexOf(s[i]) !== -1) { i++; continue; }
    if ("0123456789.".indexOf(s[i]) !== -1) {
      let n = "";
      while (i < s.length && "0123456789.".indexOf(s[i]) !== -1) n += s[i++];
      t.push({ t: "num", v: parseFloat(n) });
    } else if ("+-*/×÷^".indexOf(s[i]) !== -1) {
      t.push({ t: "op", v: s[i] === "×" ? "*" : s[i] === "÷" ? "/" : s[i] });
      i++;
    } else if (s[i] === "(" || s[i] === ")") {
      t.push({ t: s[i] === "(" ? "lp" : "rp" }); i++;
    } else if (s[i] === "π") { t.push({ t: "num", v: Math.PI }); i++; }
    else if (s[i] === "!") { t.push({ t: "fact" }); i++; }
    else {
      let w = "";
      while (i < s.length && /[a-z]/i.test(s[i])) w += s[i++];
      if (w === "pi" || w === "π") t.push({ t: "num", v: Math.PI });
      else if (w === "e") t.push({ t: "num", v: Math.E });
      else if (w === "rand") t.push({ t: "num", v: Math.random() });
      else if (FNS[w]) t.push({ t: "fn", v: w });
      else if (w === "mod") t.push({ t: "op", v: "mod" });
      else if (w === "deg") t.push({ t: "num", v: parseFloat(trig) });
      else if (w === "rad") t.push({ t: "num", v: 1 });
      else return null;
    }
  }
  return t;
}

export function needsMul(expr) {
  return expr.length > 0 && /[0-9.)πe!]/.test(expr[expr.length - 1]);
}
