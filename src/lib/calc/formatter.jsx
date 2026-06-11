export function fmtDisplay(s, showFrac) {
  if (showFrac && /^-?\d+\/\d+$/.test(s)) {
    const [n, d] = s.split("/");
    return (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", lineHeight: 1.1 }}>
        <span>{n}</span>
        <span style={{ borderTop: "2px solid #1A1A1A", paddingTop: 2, marginTop: 1 }}>{d}</span>
      </span>
    );
  }
  if (!s.includes("^") && !s.includes("√")) return s;

  const out = [];
  let i = 0;
  let key = 0;

  const flushPlain = (end) => {
    if (end > i) out.push(s.slice(i, end));
    i = end;
  };

  while (i < s.length) {
    const hat = s.indexOf("^", i);
    const root = s.indexOf("√(", i);
    let next = -1;
    if (hat !== -1 && (next === -1 || hat < next)) next = hat;
    if (root !== -1 && (next === -1 || root < next)) next = root;

    if (next === -1) { flushPlain(s.length); break; }

    if (next === hat) {
      flushPlain(hat);
      const rest = s.slice(hat + 1);
      const md = rest.match(/^(\d+)/);
      if (md) {
        out.push(<sup key={key++} style={{ fontSize: "0.65em", verticalAlign: "super", lineHeight: 1 }}>{md[1]}</sup>);
        i = hat + 1 + md[1].length;
      } else if (rest[0] === "(") {
        let d = 0, j = 0;
        for (; j < rest.length; j++) {
          if (rest[j] === "(") d++;
          if (rest[j] === ")") d--;
          if (d === 0) { j++; break; }
        }
        out.push(<sup key={key++} style={{ fontSize: "0.65em", verticalAlign: "super", lineHeight: 1 }}>{rest.slice(0, j)}</sup>);
        i = hat + 1 + j;
      } else {
        out.push("^");
        i = hat + 1;
      }
    } else {
      flushPlain(root);
      const rest = s.slice(root + 2);
      let d = 0, j = 0;
      for (; j < rest.length; j++) {
        if (rest[j] === "(") d++;
        if (rest[j] === ")") d--;
        if (d === 0) { j++; break; }
      }
      out.push(
        <span key={key++} style={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle" }}>
          <span style={{ fontSize: "1.4em", lineHeight: 1 }}>√</span>
          <span style={{ borderTop: "2px solid #1A1A1A", padding: "0 4px", marginLeft: 2 }}>{rest.slice(0, j - 1)}</span>
        </span>
      );
      i = root + 2 + j;
    }
  }
  return out.length ? out : s;
}
