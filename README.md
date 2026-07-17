# mmv-HKS 2026 Kardihooaaja Edetabel 🏁

See on iganädalaste hobikardivõistluste edetabeli veebirakendus, mis laeb andmed reaalajas Google Sheetsi avalikustatud CSV-lõpppunktist ja esitleb neid interaktiivsel kujul.

## 🚀 Esiletõstetud funktsioonid

1.  **Reaalajas andmed:** Kliendipoolne laadimine tagab, et iga kord, kui korraldajad Google Sheetsi tabelit uuendavad, kajastub uus punktiseis veebilehel koheselt.
2.  **Carbon Racing Theme:** Tume, võidusõiduhõnguline esteetika neoon-aktsentide ja spetsiaalsete kuld/hõbe/pronks poodiumikohade esiletõstmisega.
3.  **Täielik sorteerimine ja otsing:** Tabelit saab reaalajas sorteerida koha, nime, üksikute etappide tulemuste või kogupunktide järgi. Sõitjaid saab otsida nime järgi.
4.  **Sõitja profiili detailvaade:** Klõpsates sõitja reale, avaneb detailne modal-aken, mis näitab:
    *   Sõitja võtmenäitajaid (keskmine skoor, parim etapp, toimunud ringide arv).
    *   **Kumulatiivne joongraafik:** SVG graafik, mis visualiseerib sõitja punktide kasvamist läbi etappide.
    *   Iga etapi punktide jaotust.
5.  **Korraldajate etapi kommentaarid:** Lehe allosas on kokkuvolditav sektsioon, mis kuvab iga etapi kohta sisestatud märkmed kardi käitumise või rajaolude kohta.

## 🛠️ Tehniline pinuvirn (Stack)

*   **Vite + React** (üheleheline veebirakendus, SPA)
*   **Vanilla CSS** (disainisüsteem CSS-muutujatega)
*   **Custom SVG graafik** (efektiivne ja ilma raskete väliste teekideta)
*   **GitHub Actions** (automaatne juurutus GitHub Pages'ile)

## 📂 Projekti struktuur

*   `index.html` — Lehe algne struktuur, SEO meta-tähised ja Google Fonts laadimine.
*   `src/main.jsx` — Rakenduse sisenemispunkt.
*   `src/App.jsx` — Peamine loogika ja riistakast (päring Sheetsist, laadimis- ja veaseisud, statistika arvutamine).
*   `src/index.css` — Disainisüsteem ja kõik stiilid (Carbon Racing).
*   `src/utils/csvParser.js` — CSV parsimise loogika, mis tuvastab ja eraldab sõitjad, etapid ning kommentaarid.
*   `src/components/`
    *   [Leaderboard.jsx](file:///workspaces/sturdy-robot_tmp/src/components/Leaderboard.jsx) — Sorteeritav ja filtreeritav edetabel.
    *   [PlayerModal.jsx](file:///workspaces/sturdy-robot_tmp/src/components/PlayerModal.jsx) — Detailvaate aken koos statistika ja graafikutega.
    *   [ProgressionChart.jsx](file:///workspaces/sturdy-robot_tmp/src/components/ProgressionChart.jsx) — Sõitja kumulatiivne SVG graafik.
    *   [TrackComments.jsx](file:///workspaces/sturdy-robot_tmp/src/components/TrackComments.jsx) — Etappide kommentaaride akordion.
*   `.github/workflows/deploy.yml` — GitHub Actions automatiseeritud Pages juurutus.

## 💻 Kohalik käivitamine

Rakenduse käivitamiseks oma arvutis tee järgmist:

1.  Paigalda sõltuvused:
    ```bash
    npm install
    ```
2.  Käivita arendusserver:
    ```bash
    npm run dev
    ```
3.  Ehita veebileht tootmiskõlblikuks:
    ```bash
    npm run build
    ```

## 🌐 Juurutamine (GitHub Pages)

Rakendus on valmis automaatseks avaldamiseks GitHub Pages platvormil.
Selleks:
1.  Loo GitHubis uus repositoorium ja laadi need failid sinna üles.
2.  GitHub Actions hakkab automaatselt tööle (seadistatud `.github/workflows/deploy.yml` failis), ehitab projekti ja salvestab selle repositooriumi `gh-pages` harru.
3.  Ava repositooriumi seaded (**Settings -> Pages**) ja vali allikaks (**Source**) haru `gh-pages`.
4.  Sinu edetabel on veebis kättesaadav!
