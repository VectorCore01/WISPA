# WISPA — Product Requirements Document

> **Version:** 1.0 — Prototype / Demo
> **Letzte Aktualisierung:** Juni 2026

---

## 1. Konzept

WISPA ist eine anonyme, ephemere Kommunikationsplattform im Stil von Telegram – **ohne Identität, ohne Spuren, ohne Account**.

Deine Identität ist eine zufällige WISP-ID (z. B. `WISP-7K2X9A`).  
Nachrichten sind standardmäßig privat und verschwinden nicht automatisch, aber Zellen (1:1-Chats) sind auf **4 Nachrichten pro Gespräch begrenzt** (2 pro Person) – ein flüchtiges Fenster, kein Verlauf.

Das gesamte Erlebnis steckt hinter einem **getarnten wissenschaftlichen Taschenrechner** (CLCLTR v2.0). Nur wer den 4-stelligen Code kennt, kommt in WISPA.

---

## 2. Kernprinzipien

1. **Anonymität by Default** — Kein Name, keine E-Mail, keine Telefonnummer. Deine WISP-ID ist zufällig.
2. **Flüchtigkeit** — Zellen zeigen maximal 4 Nachrichten. Ältere werden still verworfen.
3. **Tarnung** — WISPA ist hinter einem funktionalen Taschenrechner versteckt. Ohne Code sieht man nichts.
4. **Monochromes Design** — Beinahe-schwarz `#0A0A0A`, beinahe-weiß `#FAFAF7`, feine graue Linien. Orange (`#FFB300` / `#E8861E`) lebt nur in der Wespe.
5. **No Metadata, No Logs** — Keine Speicherung von IPs, Zeitstempeln oder Nachrichteninhalten auf dem Server (Demo: lokal begrenzt).

---

## 3. Architektur

```
┌──────────────────────────────────────────────────┐
│                   Browser                         │
│  ┌────────────────────────────────────────────┐  │
│  │  Vite Dev Server (Port 5173)               │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  │  │
│  │  │  React 18 App    │  │  Service Worker  │  │  │
│  │  │  (JSX/ESM)       │  │  (optional)      │  │  │
│  │  └─────────────────┘  └─────────────────┘  │  │
│  │           │ proxy /api → localhost:3001      │  │
│  └───────────┼──────────────────────────────────┘  │
└──────────────┼─────────────────────────────────────┘
               │
┌──────────────▼─────────────────────────────────────┐
│  Express Server (Port 3001)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Auth    │  │  Cells   │  │  Hive            │ │
│  │  Routes  │  │  Routes  │  │  Routes          │ │
│  └────┬─────┘  └────┬─────┘  └───────┬──────────┘ │
│       │             │                │             │
│  ┌────▼─────────────▼────────────────▼──────────┐ │
│  │  SQLite (sql.js) — in-Memory + Disk-Persist  │ │
│  │  Tabellen: users, sessions, cells, messages,  │ │
│  │            hive_members, hive_posts           │ │
│  └───────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

### 3.1 Frontend (React 18 + Vite)
- **Einstieg:** `client/main.jsx` → `client/App.jsx` → `components/app/WispaPrototype.jsx`
- **State-Management:** Ein zentraler State via `useState` + `useRef` (kein Redux/Zustand)
- **Persistenz:** `sessionStorage` (flüchtig beim Tab-Schließen)
- **Routing:** Kein React Router – einfaches `screen`-State-Enum: `"landing"`, `"choice"`, `"profile"`, `"login"`, `"onboard"`, `"app"`

### 3.2 Backend (Express + SQLite)
- **Port:** 3001
- **DB:** sql.js (SQLite via WebAssembly) – bei jedem Write auf Disk persistiert
- **Session:** Cookie-basiert (`sid`)
- **API-Prefix:** `/api`

---

## 4. Screens & Flows

### 4.1 Taschenrechner-Tarnung (`calculator/Landing.jsx`)

**CLCLTR v2.0** – ein voll funktionsfähiger wissenschaftlicher Taschenrechner:
- Grundrechenarten (`+`, `−`, `×`, `÷`), Potenzen (`^`), Klammern
- Trigonometrie (sin, cos, tan), Logarithmen (log, ln), Wurzel (√)
- Fakultät (`!`), Betrag (`abs`), Modulo (`mod`), Zufall (`rand`)
- 2nd-Seite mit asin/acos/atan, floor/ceil, D/R-Umschaltung
- Bruchdarstellung (→Frac / →Dec)
- **Geheimer Einstieg:** 4-stellige Zahl eintippen → Honigwaben-Icon antippen → Code wird "gescharft" → `=` drücken bestätigt → WISPA öffnet sich
- **Panik-Modus:** Jederzeit über den Rechner-Button in der App schaltbar – kehrt sofort zur Rechner-Tarnung zurück
- **Verstecktes Reset:** Mülleimer auf der 2nd-Seite + `=` löscht den Access-Code und loggt aus

### 4.2 Einstiegs-Wahl (`auth/EntryChoice.jsx`)
- WISPA-Logo + Spruch "say it once. then it's gone."
- Zwei Buttons: **"Create a Wisp"** (neu) und **"Log in"** (bestehend)
- Sprachauswahl (12 Sprachen)
- Theme-Umschalter (Dark/Light)

### 4.3 Registrierung (`auth/Profile.jsx` + `auth/Onboard.jsx`)
- Benutzername (min. 3 Zeichen) + Passwort (min. 4 Zeichen) eingeben
- Bei Free-Tier: 1 WISP pro Gerät alle 24h (lokal begrenzt)
- Nach Registrierung: Willkommens-Honey (10 Honey) + Intro-Animation

### 4.4 Pro-Upgrade (`auth/Onboard.jsx`)
- 12-Wort-Seed-Phrase generieren (aus 24-Wort-Liste)
- Blurred Grid + "Reveal"-Button + Bestätigungs-Checkbox
- Nach Bestätigung: Tier wird zu "Pro", Honey wird permanent, eigener Hive freigeschaltet

### 4.5 Login (`auth/Login.jsx`)
- WISP-ID eingeben (`WISP-` Prefix + 6 Zeichen)
- Zwei Modi: **Passwort** (Free WISP) oder **12 Wörter** (Pro Recovery)

### 4.6 App-Shell (`app/AppShell.jsx`)
- Sticky-Header: WISPA-Logo + Panik-Button + Username/Tier + Theme-Toggle
- Fixed Bottom-Nav: **Cells** | **Hive** | **Swarm** | **Honey** | **Account**
- Responsive Layout, max-width 760px

---

## 5. Features

### 5.1 Cells (1:1-Chats) — `tabs/CellsTab.jsx` + `chat/CellChat.jsx`

| Aspekt | Beschreibung |
|--------|-------------|
| **Öffnen** | Neue Zelle via WISP-ID + 6-stelligem Message-Key des Gegenübers |
| **Authentifizierung** | Nach erstem Öffnen reicht der eigene 4-stellige PIN (Vault-Code) |
| **Nachrichten** | Text + Attachments (Bild/Video/Datei) |
| **Begrenzung** | Rolling Window von **4 Nachrichten, max. 2 pro Absender** |
| **Anhänge** | Foto (Free + Pro), Video & Datei (nur Pro) |
| **Zustand** | `authed` (PIN bestätigt) / nicht authentisiert → ReplyGate |
| **Unread** | visueller Indikator für ungelesene Zellen |

### 5.2 Hive (Broadcast-Channel) — `tabs/HiveTab.jsx` + `hive/HiveChannel.jsx`

| Aspekt | Beschreibung |
|--------|-------------|
| **Erstellen** | Nur WISP Pro, kostet 50 Honey |
| **Beitreten** | Jeder kann suchen/finden, Kosten: 5 Honey |
| **Posts** | Text (kostenlos) + Media (kostenpflichtig via Honey) |
| **Media-Kosten** | Bild: 1 Honey, Datei: 5 Honey, Video: 10 Honey |
| **Mitglieder** | Anfragen + Approve/Reject-System |
| **QR-Code** | Teilen der Hive-ID via QR |
| **Zerstören** | Hive kann vom Besitzer gelöscht werden |
| **Suchfunktion** | Nach Name oder HIVE-ID durchsuchbar, Ranking nach Honey-Wert |

### 5.3 Swarm (Gruppenchats) — `tabs/SwarmTab.jsx`
- **Status:** Platzhalter (Coming next)
- **Konzept:** Private Gruppenchats, jeder zahlt 5 Honey zum Beitreten

### 5.4 Honey (In-App-Währung) — `tabs/HoneyTab.jsx` + `hooks/useHoney.js`

| Aspekt | Beschreibung |
|--------|-------------|
| **Free-Tier** | Startguthaben 10 Honey, läuft nach 24h ab |
| **Pro-Tier** | Honey läuft nie ab |
| **Kaufen (Demo)** | 50 Honey für €4.99 / 150 Honey für €9.99 |
| **Ausgaben** | Hive erstellen (50), Hive beitreten (5), Media entsiegeln (1–10) |
| **Verschenken** | Nur Pro – sende Honey an andere WISP-IDs |

### 5.5 Account (`tabs/AccountTab.jsx`)

| Aspekt | Beschreibung |
|--------|-------------|
| **Tier-Anzeige** | WISP / WISP PRO |
| **Name ändern** | Mit Passwort-Bestätigung |
| **WISP-ID** | Geteilt via "Reveal"-Toggle + QR-Code |
| **Message Key** | 6-stelliger Schlüssel (nur einmal sichtbar) |
| **Hive-ID** | Nur bei Pro sichtbar |
| **Pro-Upgrade-Panel** | €4.99/Monat (Demo) |
| **Logout** | Löscht Vault-Code + Session |

### 5.6 Einloggen & Session
- **Session-Storage:** Alle Daten im `sessionStorage` (Tab-übergreifend beim Neuladen erhalten)
- **Vault-Code:** 4-stelliger Code, wird beim ersten Entsperren gesetzt, bleibt über Refresh erhalten
- **Account-Gate:** Beim Wechsel zum Account-Tab muss der Vault-Code erneut eingegeben werden
- **3 Fehlversuche:** Automatischer Logout + Code-Reset

### 5.7 Screenshot-Schutz (Best-Effort)
- Kontextmenü deaktiviert
- PrintScreen-Taste: Clipboard wird geleert
- **Obscured-Overlay:** Bei Fenster-Blur oder Tab-Wechsel wird ein "WISPA · HIDDEN"-Overlay eingeblendet

---

## 6. Design System

### 6.1 Farben

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `bg` | `#0A0A0A` | `#FAFAF7` |
| `surface` | `#141414` | `#FFFFFF` |
| `surface2` | `#1C1C1C` | `#F0F0EC` |
| `text` | `#EAEAEA` | `#1A1A1A` |
| `textDim` | `#9A9A9A` | `#6B6B6B` |
| `line` | `#2A2A2A` | `#E2E2DE` |
| `accent` | `#FFB300` | `#E8861E` |
| `onAccent` | `#0A0A0A` | `#FFFFFF` |
| `danger` | `#E0664A` | `#D9543A` |

### 6.2 Schriftarten
- **UI/Darstellung:** `Rajdhani`, `Helvetica Neue`, `Arial Narrow`, sans-serif
- **Monospace/Chat:** `JetBrains Mono`, `Fira Code`, `SF Mono`, `Consolas`, monospace

### 6.3 Shapes & Patterns
- **Hexagon-Clip-Path:** `polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)`
- **Hintergrund:** Generierte SVG-Honigwaben-Pattern (56×96px)
- **Hexagon-Button-Style:** 6-seitige Polygone für Zellen

### 6.4 Animationen
| Name | Typ | Dauer | Verwendung |
|------|-----|-------|------------|
| `drift` | Schweben | 7s | Logo auf Landing |
| `blink` | Blinken | 1.1s | Cursor in TermHead |
| `rise` | Aufsteigen | 0.25s | Toast-Benachrichtigung |
| `pulse` | Pulsieren | 1.5s | Lade-/Live-Indikatoren |
| `burn` | Verglühen | 0.3s | Nachrichten-Entfernung |
| `hexBurst` | Explosion | 0.66s | Code-Entsperr-Animation |
| `hexPop` | Aufpoppen | 0.5s | Cell-Entsperr-Animation |
| `ecRise` | Einstieg | 0.5s | EntryChoice-Elemente |
| `cbReveal` | Bloom | 1.05s | Rechner→WISPA-Übergang |
| `introVeil` | Ausblendung | 1.7–2s | Post-Login-Intro |
| `flyHome` | Einfliegen | 0.8s | Login-Intro-Logo |
| `logoPop` | Vergrößern | 0.45s | WispLanding-Klick |

### 6.5 Logo — WaspLock
Eine Wespe, deren gestreifter Hinterleib ein Vorhängeschloss ist – Bügel oben, Schlüsselloch im Körper. In einem hexagonalen Rahmen.
- SVG in `components/ui/WaspLock.jsx`
- Alternative: `CellLogo` in `components/app/shared.jsx` (zwei ineinanderliegende Sechsecke)

---

## 7. Datenmodell (Server)

### 7.1 Tabellen

#### `users`
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `id` | INTEGER PK | |
| `wisp_id` | TEXT UNIQUE | Format `WISP-XXXXXX` |
| `username` | TEXT | Anzeigename |
| `login_hash` | TEXT | bcrypt-Hash |
| `msg_key` | TEXT | 6-stelliger Nachrichten-Schlüssel |
| `tier` | TEXT | `"wisp"` oder `"pro"` |
| `hive_id` | TEXT | Eigene Hive-ID (nur Pro) |
| `created_at` | TEXT | ISO-Timestamp |

#### `sessions`
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `id` | TEXT PK | UUID |
| `user_id` | INTEGER FK | |
| `created_at` | TEXT | |

#### `cells`
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `id` | TEXT PK | UUID |
| `user_id` | INTEGER FK | Besitzer |
| `peer_id` | TEXT FK | WISP-ID des Gegenübers |
| `last_activity` | INTEGER | `Date.now()` |
| `seen` | INTEGER | 0/1 |

#### `messages`
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `id` | INTEGER PK | |
| `cell_id` | TEXT FK | |
| `from` | TEXT | `"me"` oder `"them"` |
| `kind` | TEXT | `"text"`, `"image"`, `"video"`, `"file"` |
| `content` | TEXT | |
| `time` | TEXT | |
| `opened` | INTEGER | 0/1 |

#### `hive_members`
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `id` | INTEGER PK | |
| `hive_id` | TEXT | |
| `wisp_id` | TEXT | |
| `name` | TEXT | |
| `status` | TEXT | `"pending"` oder `"approved"` |

#### `hive_posts`
| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| `id` | INTEGER PK | |
| `hive_id` | TEXT | |
| `content` | TEXT | |
| `time` | TEXT | |

### 7.2 API-Endpunkte

| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| POST | `/api/auth/register` | Registrierung |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/restore-pro` | Pro-Wiederherstellung |
| GET | `/api/auth/me` | Session-Info |
| POST | `/api/auth/logout` | Ausloggen |
| GET | `/api/cells` | Zellen auflisten |
| POST | `/api/cells` | Neue Zelle öffnen |
| GET | `/api/cells/:id/messages` | Nachrichten abrufen |
| POST | `/api/cells/:id/messages` | Nachricht senden |
| POST | `/api/cells/:id/unlock` | Zelle entsperren |
| POST | `/api/cells/:id/open` | Als gelesen markieren |
| GET | `/api/hive` | Hive-Info abrufen |
| POST | `/api/hive` | Hive erstellen |
| DELETE | `/api/hive` | Hive zerstören |
| POST | `/api/hive/join` | Beitrittsanfrage |
| POST | `/api/hive/approve` | Mitglied bestätigen |
| POST | `/api/hive/reject` | Mitglied ablehnen |
| POST | `/api/hive/posts` | Post erstellen |
| GET | `/api/health` | Health-Check |

---

## 8. Calculator-Mechanik

Der Taschenrechner ist keine UI-Attrappe – er ist **voll funktionsfähig**:

### 8.1 Lexer (`lib/calculator/lexer.js`)
- Tokenisiert Ausdrücke: Zahlen, Operatoren `+ - * / ^`, Klammern, Fakultät `!`
- Konstanten: `π`, `e`, `rand`, `deg`, `rad`
- Funktionen: sin, cos, tan, asin, acos, atan, log, ln, sqrt, abs, floor, ceil

### 8.2 Parser (`lib/calculator/parser.js`)
- Recursive-Descent: `expr → term → pow → unary → atom`
- Operator-Präzedenz: `+/-` < `*/mod` < `^` < unary `-`
- Grad/Bogenmaß-Umschaltung für trigonometrische Funktionen

### 8.3 Evaluator (`lib/calculator/evaluator.js`)
- `evalExpr(s, deg)` → Number oder `"Error"`
- `toFraction(v, maxD)` → Stern-Brocot-Suche für Bruchdarstellung

### 8.4 Geheimer Einstieg (Vault-Code)
1. 4-stellige Zahl eintippen → Honigwaben-Icon (CellMark) antippen → Display resettet sich auf 0
2. Dieselben 4 Ziffern erneut eintippen → `=` drücken
3. Bei Übereinstimmung: **CellBloom-Animation** → WISPA öffnet sich
4. **Panik-Modus:** Bereits entsperrt → Code erneut eingeben → direkt zu Cells

---

## 9. Personas

### The Whisperer
- Nutzt Cells für 1:1-Gespräche
- Schätzt die Nachrichtenbegrenzung (kein endloser Verlauf)
- Nutzt den Panik-Button zum schnellen Verstecken

### The Broadcaster
- Ist WISP Pro
- Betreibt einen Hive-Channel
- Verschickt Medien-Updates an Follower
- Sammelt Honey durch Spenden

### The Paranoid
- Prüft die Taschenrechner-Tarnung
- Nutzt den Obscured-Mode bei Tab-Wechsel
- Wünscht sich echte Ende-zu-Ende-Verschlüsselung

---

## 10. Technischer Stack

| Komponente | Technologie |
|-----------|-------------|
| **Frontend** | React 18, JSX, ESM |
| **Build-Tool** | Vite 5 + @vitejs/plugin-react |
| **Backend** | Node.js, Express 4 |
| **Datenbank** | sql.js (SQLite via WASM) |
| **Auth** | Session-Cookies, bcryptjs |
| **QR-Code** | qrcode (Generierung), jsQR (Scan) |
| **IDs** | uuid, Custom-Generatoren |
| **Dev-Server** | concurrently (Vite + Express) |

---

## 11. Future Roadmap

### Kurzfristig
- Echte Ende-zu-Ende-Verschlüsselung (xchacha20-poly1305)
- x25519 Key Exchange
- Swarm-Gruppenchats implementieren
- File-Upload (aktuell nur Object-URLs im Browser)

### Mittelfristig
- Zero-Knowledge-Proofs für Subscription-Verifikation
- Persistenter Speicher (IndexedDB / encryption at rest)
- Push-Benachrichtigungen

### Langfristig
- P2P-Transport (WebRTC / libp2p)
- Mobile Apps (React Native)
- Eigenes WISPA-Protokoll

---

## 12. Demo-Einschränkungen

| Bereich | Einschränkung |
|---------|--------------|
| **Server** | Läuft nur lokal (localhost:3001) |
| **DB** | sql.js ohne externes persistentes SQLite (nur Datei) |
| **Zahlungen** | Simuliert (kein Stripe/echtes Payment) |
| **Dateien** | Nur Object-URLs, kein echter Upload |
| **Honey** | Nur Client-seitiger State, kein Server-Balance |
| **Screenshot** | Best-Effort-Schutz (kann nicht wirklich blockiert werden) |
| **Seed** | 12 Wörter (Demo), Ziel: 24 Wörter |
| **Zellen-Timeout** | Kein automatischer Self-Destruct (90s war alte Version) |

---

> *say it once. then it's gone.*
