import { useState, useEffect } from "react";
import { HONEY } from "../theme.js";

// All Honey-currency state and operations in one place. Pro keeps Honey forever;
// free Honey expires 24h after it was last topped up. `tier` and `notify` come
// from the host component; the raw values (honey/honeyGifted/honeyExpiry) are
// returned so the host can persist them in its session.
export function useHoney({ tier, notify, saved }) {
  const [honey, setHoney] = useState(saved.honey || 0);
  const [honeyGifted, setHoneyGifted] = useState(!!saved.honeyGifted);
  const [honeyExpiry, setHoneyExpiry] = useState(saved.honeyExpiry || null);

  // Free Honey evaporates after 24h — clear it on load if the window has passed.
  useEffect(() => {
    if (tier !== "pro" && honeyExpiry && Date.now() > honeyExpiry) {
      setHoney(0);
      setHoneyExpiry(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Adding Honey to a free account (re)starts its 24h clock; Pro never expires.
  function addHoney(amount) {
    setHoney((h) => h + amount);
    if (tier !== "pro") setHoneyExpiry(Date.now() + HONEY.freeTtlMs);
  }

  function buyHoney(pack) {
    addHoney(pack.honey);
    notify(`+${pack.honey} Honey added · demo payment €${pack.price.toFixed(2)}.`);
  }

  function spendHoney(amount) {
    if (honey < amount) { notify("Not enough Honey."); return false; }
    setHoney((h) => h - amount);
    return true;
  }

  function giftHoney(toWisp, amount) {
    if (tier !== "pro") { notify("Only WISP Pro can gift Honey."); return false; }
    const id = (toWisp || "").trim().toUpperCase();
    if (!/^WISP-[A-Z0-9]{6}$/.test(id)) { notify("Enter a WISP id like WISP-7K2X9A."); return false; }
    const amt = Math.floor(Number(amount) || 0);
    if (amt <= 0) { notify("Enter how much Honey to send."); return false; }
    if (!spendHoney(amt)) return false;
    notify(`Sent ${amt} Honey to ${id}.`);
    return true;
  }

  // One-time welcome gift on sign-up.
  function grantWelcomeHoney() {
    setHoney(HONEY.gift);
    setHoneyGifted(true);
    setHoneyExpiry(Date.now() + HONEY.freeTtlMs);
  }

  // On Pro upgrade, Honey stops expiring.
  function makeHoneyPermanent() { setHoneyExpiry(null); }

  // On logout, wipe the wallet.
  function resetHoney() { setHoney(0); setHoneyGifted(false); setHoneyExpiry(null); }

  return {
    honey, honeyGifted, honeyExpiry,
    addHoney, buyHoney, spendHoney, giftHoney,
    grantWelcomeHoney, makeHoneyPermanent, resetHoney,
  };
}
