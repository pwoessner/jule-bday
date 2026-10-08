# 30 Jahre Jule

Eine statische Geburtstagsseite mit responsivem Editorial-Design, Bildergalerie,
Lightbox und einer Termin-Auswahl für das Überraschungswochenende.

## Technischer Aufbau

- reines HTML, CSS und JavaScript
- kein Build-Schritt und keine Laufzeit-Abhängigkeiten
- keine externen Schrift-, Script- oder Bild-CDNs
- relative Asset-Pfade für GitHub Project Pages
- WebP-Bilder mit JPEG-Fallback
- responsive und tastaturbedienbar
- Rücksicht auf `prefers-reduced-motion`

## Lokal starten

```bash
python3 -m http.server 8000
```

Danach <http://localhost:8000> öffnen.

## Termin-Auswahl und Google Forms

Die Seite sendet die Auswahl direkt an das öffentliche Google Formular
**„Jule Decisions“**. Die Konfiguration befindet sich am Anfang von `script.js`:

```js
const FORM_CONFIG = {
  actionUrl: "https://docs.google.com/forms/d/e/…/formResponse",
  entries: {
    date1: "entry.734973945",
    date2: "entry.1299717124",
    date3: "entry.1098130843",
    company: "entry.612866239",
  },
};
```

Google Forms liefert bei browserseitigen Cross-Origin-Anfragen keine lesbare
Antwort. Der Request wird daher mit `mode: "no-cors"` gesendet. Falls bereits
das Senden des Requests fehlschlägt, zeigt die Seite automatisch WhatsApp,
E-Mail und Kopieren als Alternativen an. Diese Optionen bleiben nach einer
erfolgreichen Übermittlung zusätzlich verfügbar.

Die Feldnummern wurden aus der öffentlichen `viewform`-Seite ausgelesen und
über eine vorausgefüllte URL gegen die vier Fragen geprüft. Es wurde dabei keine
Testantwort abgesendet.

## Auf GitHub Pages veröffentlichen

1. Dateien in den `main`-Branch pushen.
2. Im GitHub-Repository **Settings → Pages** öffnen.
3. Unter **Build and deployment** die Quelle **Deploy from a branch** wählen.
4. Branch `main` und Ordner `/ (root)` auswählen.
5. Nach der Veröffentlichung ist die Seite unter
   `https://<user>.github.io/<repository>/` erreichbar.

Alle Pfade funktionieren sowohl lokal als auch unter einem Repository-Unterpfad.
Die Datei `.nojekyll` sorgt dafür, dass GitHub Pages die Dateien unverändert
ausliefert.

## Inhalte anpassen

- Texte und Bildbeschreibungen: `index.html`
- Farben und Layout: Variablen am Anfang von `styles.css`
- Interaktionen und Teilen-Text: `script.js`
- optimierte Bilder: `images/web/`

Beim Austauschen eines Bildes sollten die JPEG- und WebP-Datei denselben
Basisnamen behalten. Die `width`- und `height`-Werte in `index.html` anschließend
an die neue Bildgröße anpassen.
