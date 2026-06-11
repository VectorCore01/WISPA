import { FNS } from "./constants.js";

export function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return "Error";
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function parse(tokens, deg) {
  let i = 0;
  const peek = () => tokens[i];
  const consume = () => tokens[i++];
  const trigScale = deg ? Math.PI / 180 : 1;

  const sinFn = (x) => Math.sin(x * trigScale);
  const cosFn = (x) => Math.cos(x * trigScale);
  const tanFn = (x) => Math.tan(x * trigScale);

  function expr() {
    let a = term();
    while (peek() && peek().t === "op" && (peek().v === "+" || peek().v === "-")) {
      const op = consume().v; const b = term();
      a = op === "+" ? a + b : a - b;
    }
    return a;
  }

  function term() {
    let a = pow();
    while (peek() && peek().t === "op" && (peek().v === "*" || peek().v === "/" || peek().v === "mod")) {
      const op = consume().v; const b = pow();
      if (op === "mod") a = a % b;
      else a = op === "*" ? a * b : (b !== 0 ? a / b : "Error");
    }
    return a;
  }

  function pow() {
    let a = unary();
    while (peek() && peek().t === "op" && peek().v === "^") {
      consume(); a = Math.pow(a, unary());
    }
    return a;
  }

  function unary() {
    if (peek() && peek().t === "op" && peek().v === "-") { consume(); return -unary(); }
    return atom();
  }

  function atom() {
    if (!peek()) return 0;
    if (peek().t === "num") {
      const v = consume().v;
      if (peek() && peek().t === "fact") { consume(); return factorial(v); }
      return v;
    }
    if (peek().t === "fact") { consume(); return 0; }
    if (peek().t === "lp") {
      consume(); const v = expr();
      if (peek() && peek().t === "rp") consume();
      if (peek() && peek().t === "fact") { consume(); return factorial(v); }
      return v;
    }
    if (peek().t === "fn") {
      const f = consume().v;
      if (peek() && peek().t === "lp") consume();
      const arg = expr();
      if (peek() && peek().t === "rp") consume();
      let v;
      if (f === "sin") v = sinFn(arg);
      else if (f === "cos") v = cosFn(arg);
      else if (f === "tan") v = tanFn(arg);
      else v = FNS[f](arg);
      if (peek() && peek().t === "fact") { consume(); return factorial(v); }
      return v;
    }
    return 0;
  }

  const r = expr();
  return isNaN(r) || !isFinite(r) ? "Error" : r;
}
