import { tokenize } from "./lexer.js";
import { parse } from "./parser.js";

export function evalExpr(s, deg) {
  if (s === "Error") return "Error";
  const t = tokenize(s);
  if (!t) return "Error";
  return parse(t, deg);
}

export function toFraction(v, maxD) {
  if (v === "Error" || !isFinite(v)) return null;
  if (Number.isInteger(v)) return { n: v, d: 1 };
  const sgn = v < 0 ? -1 : 1;
  v = Math.abs(v);
  let n1 = 0, d1 = 1, n2 = 1, d2 = 0, n = Math.floor(v), d = 1;
  while (d <= maxD) {
    const cand = n / d;
    if (Math.abs(v - cand) < 1e-10) return { n: sgn * n, d };
    const next = n1 + n2; const dnext = d1 + d2;
    if (dnext > maxD) break;
    if (v * dnext > next) { n = next; d = dnext; n1 = next; d1 = dnext; }
    else { n2 = next; d2 = dnext; }
    n = n1 + n2; d = d1 + d2;
  }
  return null;
}
