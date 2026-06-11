export function capPerSender(msgs, n) {
  const counts = {};
  const kept = [];
  for (let i = msgs.length - 1; i >= 0; i--) {
    const from = msgs[i].from;
    counts[from] = (counts[from] || 0) + 1;
    if (counts[from] <= n) kept.unshift(msgs[i]);
  }
  return kept;
}

export const CELL_MSG_PER_SENDER = 2;
