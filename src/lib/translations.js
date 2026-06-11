const LANG_NAMES = {
  en: "English", ar: "العربية", de: "Deutsch", es: "Español",
  fr: "Français", it: "Italiano", ko: "한국어", ms: "Bahasa Melayu",
  nl: "Nederlands", pt: "Português", ru: "Русский", uk: "Українська",
};

const LANG_LIST = Object.keys(LANG_NAMES);

const T = {
  "say it once. then it's gone.": {
    en: "say it once. then it's gone.",
    ar: "قلها مرة. ثم تختفي.",
    de: "Sag es einmal. Dann ist es weg.",
    es: "Dilo una vez. Luego desaparece.",
    fr: "Dis-le une fois. Puis il disparaît.",
    it: "Dillo una volta. Poi scompare.",
    ko: "한 번 말하면 사라집니다.",
    ms: "katakan sekali. kemudian ia hilang.",
    nl: "Zeg het een keer. Dan is het weg.",
    pt: "Diga uma vez. Depois desaparece.",
    ru: "Скажи один раз. Затем исчезает.",
    uk: "Скажи один раз. Потім зникає.",
  },
  ENTER: {
    en: "ENTER", ar: "دخول", de: "EINTRITT", es: "ENTRAR",
    fr: "ENTRER", it: "ENTRA", ko: "입장", ms: "MASUK",
    nl: "BINNEN", pt: "ENTRAR", ru: "ВОЙТИ", uk: "УВІЙТИ",
  },
  "Create my WISP": {
    en: "Create my WISP", ar: "إنشاء WISP", de: "WISP erstellen",
    es: "Crear mi WISP", fr: "Créer mon WISP", it: "Crea il mio WISP",
    ko: "WISP 생성", ms: "Cipta WISP saya", nl: "Maak mijn WISP",
    pt: "Criar meu WISP", ru: "Создать WISP", uk: "Створити WISP",
  },
  "Log in": {
    en: "Log in", ar: "تسجيل الدخول", de: "Anmelden",
    es: "Iniciar sesión", fr: "Se connecter", it: "Accedi",
    ko: "로그인", ms: "Log masuk", nl: "Inloggen",
    pt: "Entrar", ru: "Войти", uk: "Увійти",
  },
  Back: {
    en: "Back", ar: "رجوع", de: "Zurück",
    es: "Atrás", fr: "Retour", it: "Indietro",
    ko: "뒤로", ms: "Kembali", nl: "Terug",
    pt: "Voltar", ru: "Назад", uk: "Назад",
  },
  "Your 24 words": {
    en: "Your 24 words", ar: "كلماتك الـ24", de: "Deine 24 Wörter",
    es: "Tus 24 palabras", fr: "Vos 24 mots", it: "Le tue 24 parole",
    ko: "24개의 단어", ms: "24 patah kata anda", nl: "Uw 24 woorden",
    pt: "Suas 24 palavras", ru: "Ваши 24 слова", uk: "Ваші 24 слова",
  },
  "These words are your only way back. There's no name, email or phone tied to your WISP — so if you lose these, no one can recover it. Keep them offline.": {
    en: "These words are your only way back. There's no name, email or phone tied to your WISP — so if you lose these, no one can recover it. Keep them offline.",
    ar: "هذه الكلمات هي طريقتك الوحيدة للعودة. لا يوجد اسم أو بريد إلكتروني أو هاتف مرتبط بـ WISP — لذا إذا فقدتها، لا يمكن لأحد استعادتها. احتفظ بها دون اتصال.",
    de: "Diese Wörter sind dein einziger Weg zurück. Es gibt keinen Namen, keine E-Mail oder Telefonnummer, die mit deinem WISP verbunden sind — wenn du sie verlierst, kann sie niemand wiederherstellen. Bewahre sie offline auf.",
    es: "Estas palabras son tu única manera de volver. No hay nombre, correo electrónico ni teléfono vinculado a tu WISP — si las pierdes, nadie puede recuperarlas. Mantenlas fuera de línea.",
    fr: "Ces mots sont votre seul moyen de revenir. Aucun nom, e-mail ou téléphone n'est lié à votre WISP — si vous les perdez, personne ne peut les récupérer. Gardez-les hors ligne.",
    it: "Queste parole sono il tuo unico modo per tornare. Non ci sono nome, email o telefono legati al tuo WISP — se le perdi, nessuno può recuperarle. Tienile offline.",
    ko: "이 단어들이 당신이 돌아올 수 있는 유일한 방법입니다. WISP에 이름, 이메일 또는 전화번호가 연결되어 있지 않습니다 — 분실하면 아무도 복구할 수 없습니다. 오프라인으로 보관하세요.",
    ms: "Kata-kata ini adalah satu-satunya cara anda untuk kembali. Tiada nama, e-mel atau telefon yang dikaitkan dengan WISP anda — jika anda kehilangannya, tiada siapa yang boleh memulihkannya. Simpan di luar talian.",
    nl: "Deze woorden zijn uw enige weg terug. Er is geen naam, e-mail of telefoon gekoppeld aan uw WISP — als u ze verliest, kan niemand ze herstellen. Bewaar ze offline.",
    pt: "Estas palavras são a sua única maneira de voltar. Não há nome, e-mail ou telefone vinculado ao seu WISP — se você as perder, ninguém pode recuperá-las. Mantenha-as offline.",
    ru: "Эти слова — ваш единственный способ вернуться. К вашему WISP не привязаны имя, email или телефон — если вы их потеряете, никто не сможет их восстановить. Храните их офлайн.",
    uk: "Ці слова — ваш єдиний спосіб повернутися. До вашого WISP не прив'язані ім'я, email або телефон — якщо ви їх втратите, ніхто не зможе їх відновити. Зберігайте їх офлайн.",
  },
  Reveal: {
    en: "Reveal words", ar: "إظهار الكلمات", de: "Wörter anzeigen",
    es: "Revelar palabras", fr: "Révéler les mots", it: "Rivela le parole",
    ko: "단어 공개", ms: "Mendedahkan kata", nl: "Toon woorden",
    pt: "Revelar palavras", ru: "Показать слова", uk: "Показати слова",
  },
  "I have safely written down my 24 words and understand they cannot be recovered.": {
    en: "I have safely written down my 24 words and understand they cannot be recovered.",
    ar: "لقد كتبت كلماتي الـ24 بأمان وأتفهم أنها لا يمكن استعادتها.",
    de: "Ich habe meine 24 Wörter sicher notiert und verstehe, dass sie nicht wiederhergestellt werden können.",
    es: "He anotado mis 24 palabras de forma segura y entiendo que no se pueden recuperar.",
    fr: "J'ai noté mes 24 mots en toute sécurité et je comprends qu'ils ne peuvent pas être récupérés.",
    it: "Ho annotato le mie 24 parole in modo sicuro e capisco che non possono essere recuperate.",
    ko: "24개의 단어를 안전하게 기록했으며 복구할 수 없음을 이해합니다.",
    ms: "Saya telah menulis 24 patah kata saya dengan selamat dan faham ia tidak boleh dipulihkan.",
    nl: "Ik heb mijn 24 woorden veilig genoteerd en begrijp dat ze niet kunnen worden hersteld.",
    pt: "Anotei minhas 24 palavras com segurança e entendo que elas não podem ser recuperadas.",
    ru: "Я безопасно записал свои 24 слова и понимаю, что их невозможно восстановить.",
    uk: "Я безпечно записав свої 24 слова та розумію, що їх неможливо відновити.",
  },

  Restore: {
    en: "Restore WISP",
    ar: "استعادة WISP",
    de: "WISP wiederherstellen",
    es: "Restaurar WISP",
    fr: "Restaurer WISP",
    it: "Ripristina WISP",
    ko: "WISP 복원",
    ms: "Pulihkan WISP",
    nl: "Herstel WISP",
    pt: "Restaurar WISP",
    ru: "Восстановить WISP",
    uk: "Відновити WISP",
  },
  "Expected 24 words, got": {
    en: "Expected 24 words, got",
    ar: "توقع 24 كلمة، حصل على",
    de: "Erwartet 24 Wörter, erhalten",
    es: "Se esperaban 24 palabras, se obtuvieron",
    fr: "24 mots attendus, reçus",
    it: "Previste 24 parole, ricevute",
    ko: "24단어가 필요합니다, 입력됨",
    ms: "Dijangka 24 patah kata, mendapat",
    nl: "Verwacht 24 woorden, kreeg",
    pt: "Esperava 24 palavras, recebeu",
    ru: "Ожидалось 24 слова, получено",
    uk: "Очікувалося 24 слів, отримано",
  },

  "WISP restored. Welcome back.": {
    en: "WISP restored. Welcome back.",
    ar: "تمت استعادة WISP. مرحبًا بعودتك.",
    de: "WISP wiederhergestellt. Willkommen zurück.",
    es: "WISP restaurado. Bienvenido de nuevo.",
    fr: "WISP restauré. Bon retour.",
    it: "WISP ripristinato. Bentornato.",
    ko: "WISP가 복원되었습니다. 다시 오신 것을 환영합니다.",
    ms: "WISP dipulihkan. Selamat kembali.",
    nl: "WISP hersteld. Welkom terug.",
    pt: "WISP restaurado. Bem-vindo de volta.",
    ru: "WISP восстановлен. С возвращением.",
    uk: "WISP відновлено. З поверненням.",
  },
  "Set up your identity": {
    en: "Set up your identity",
    de: "Richte dein Profil ein",
  },

  "Create a Wisp": {
    en: "Create a Wisp", de: "Wisp erstellen",
  },

  "Hive channel created.": {
    en: "Hive channel created.", de: "Hive-Channel erstellt.",
  },
  "Name updated.": {
    en: "Name updated.", de: "Name aktualisiert.",
  },
  Username: {
    en: "Username",
    de: "Benutzername",
  },
  "the name people see": {
    en: "the name people see",
    de: "der Name, den andere sehen",
  },

  Continue: {
    en: "Continue",
    de: "Weiter",
  },
  "Pick a username with at least 3 characters.": {
    en: "Pick a username with at least 3 characters.",
    de: "Wähle einen Benutzernamen mit mindestens 3 Zeichen.",
  },
  "Your password needs at least 4 characters.": {
    en: "Your password needs at least 4 characters.",
    de: "Dein Kennwort braucht mindestens 4 Zeichen.",
  },
  "No WISP found with that id.": {
    en: "No WISP found with that id.",
    de: "Kein WISP mit dieser ID gefunden.",
  },

  "Wrong message key — you can't open a cell with them.": {
    en: "Wrong message key — you can't open a cell with them.",
    de: "Falscher Nachrichten-Key — du kannst keine Zelle mit ihnen öffnen.",
  },
  "Wrong message key — you can't reply yet.": {
    en: "Wrong message key — you can't reply yet.",
    de: "Falscher Nachrichten-Key — du kannst noch nicht antworten.",
  },
  "Choose a name to chat under and a password to log back in. You'll get a WISP id and a 6-digit message key right after.": {
    en: "Choose a name to chat under and a password to log back in. You'll get a WISP id and a 6-digit message key right after.",
    de: "Wähle einen Namen, unter dem du chattest, und ein Passwort zum erneuten Anmelden. Direkt danach bekommst du eine WISP-ID und einen 6-stelligen Nachrichten-Key.",
  },
  "Login password": {
    en: "Login password", de: "Login-Passwort",
  },
  "you'll log in with your id + this password": {
    en: "you'll log in with your id + this password",
    de: "du meldest dich mit deiner ID + diesem Passwort an",
  },
  "Keep this password safe — a free WISP has no 24-word key to fall back on.": {
    en: "Keep this password safe — a free WISP has no 24-word key to fall back on.",
    de: "Bewahre dieses Passwort gut auf — eine freie WISP hat keinen 24-Wörter-Key als Rückfallebene.",
  },
  "Create a Wisp. Log in if you already have one.": {
    en: "Create a Wisp. Log in if you already have one.",
    de: "Wisp erstellen. Melde dich an, wenn du bereits einen hast.",
  },
  "Your free WISP is ready.": {
    en: "Your free WISP is ready.", de: "Deine gratis WISP ist bereit.",
  },
  "You're WISP Pro now. Videos, files and your own Hive are unlocked.": {
    en: "You're WISP Pro now. Videos, files and your own Hive are unlocked.",
    de: "Du bist jetzt WISP Pro. Videos, Dateien und dein eigener Hive sind freigeschaltet.",
  },
  "Only WISP Pro can change its name.": {
    en: "Only WISP Pro can change its name.",
    de: "Nur WISP Pro kann seinen Namen ändern.",
  },
  "Enter your WISP id, then your password (free WISP) or your 24 words (WISP Pro).": {
    en: "Enter your WISP id, then your password (free WISP) or your 24 words (WISP Pro).",
    de: "Gib deine WISP-ID ein, dann dein Passwort (freie WISP) oder deine 24 Wörter (WISP Pro).",
  },
  "WISP id": {
    en: "WISP id", de: "WISP-ID",
  },
  Password: {
    en: "Password", de: "Passwort",
  },
  "24 words": {
    en: "24 words", de: "24 Wörter",
  },
  "your login password": {
    en: "your login password", de: "dein Login-Passwort",
  },
  "Enter a WISP id like WISP-204913.": {
    en: "Enter a WISP id like WISP-204913.",
    de: "Gib eine WISP-ID wie WISP-204913 ein.",
  },
};

export function t(lang, key) {
  const entry = T[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}

export { LANG_NAMES, LANG_LIST, T };
