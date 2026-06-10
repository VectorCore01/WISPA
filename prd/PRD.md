# WISPA — Product Requirements Document

## Concept

Like Telegram, but anonymous and ephemeral. A communication platform where identity is a number (WISP), messages disappear on read, and privacy is the default.

## Core Principles

1. **Anonymity by default** — no names, emails, or phone numbers. Your WISP is a random ID.
2. **Ephemeral messaging** — every message self-destructs the moment it is opened. A voice that vanishes.
3. **Monochrome design** — near-black + near-white, fine grey lines, honeycomb geometry. Orange lives only on the wasp.
4. **No metadata, no logs, no accounts.**

## Personas

- **The Whisperer** — wants one-to-one chats that leave no trace. Uses Cells.
- **The Broadcaster** — wants to reach many followers anonymously. Runs a Hive.
- **The Paranoid** — wants the highest trust signals. Looks for xchacha20, x25519, zero-knowledge proof.

## Features

### Landing (radically minimalist)
- Centered layout, full viewport
- Animated WaspLock logo (drift)
- One line: "say it once. then it's gone."
- ENTER button
- Footer: crypto trust signature (xchacha20-poly1305 · x25519 · zero-knowledge / no logs · no metadata · no accounts)

### Onboarding
- Generate 24-word seed phrase
- Blurred seed grid, reveal on click
- Confirmation checkbox + create button

### Cells (1:1 chats)
- Walkie-talkie model: one message visible at a time
- Replying replaces your last message
- Self-destruct 90s after last activity (demo mode)
- Unread indicator for incoming messages
- Countdown timer per cell
- Attachments: photo (free), video & file (Hive only)

### Hive (paid broadcast channel)
- €4.99/month subscription (demo)
- Keeps all cells alive (no self-destruct)
- Unlocks video & file attachments
- Broadcast channel: one voice to many followers
- Posts show read count

### Account
- Display WISP ID
- Hive subscription status
- Demo notice

## Design System

- **Fonts:** SF Mono / Consolas (mono), Helvetica Neue (display)
- **Colors:** Near-black `#0A0A0A`, near-white `#FAFAF7`, accent orange `#E8861E`
- **Shapes:** Hexagon clip paths, honeycomb background pattern
- **Motion:** Drift (logo), blink (cursor), rise (toast), pulse, burn
- **Logo:** WaspLock — wasp whose striped abdomen is a padlock body, with shackle arch and keyhole

## Technical Notes

- Browser-only simulation (Vite + React)
- No server, no encryption, no payment
- All state in-memory with React state hooks
- 90s demo cell lifetime for visible expiry
- Responsive layout, max-width 760px

## Future Considerations

- Real xchacha20-poly1305 encryption
- x25519 key exchange
- Zero-knowledge proofs for subscription verification
- Persistent storage (encrypted local/indexedDB)
- P2P transport (WebRTC / libp2p)

---

> *say it once. then it's gone.*
