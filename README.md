# All in Sport Bonusprogramm

Dieses Repository enthält eine einfache statische Website, die das Scrum‑Konzept und den Testbericht für das „All in Sport Bonusprogramm“ darstellt. Sie basiert auf den bereitgestellten PDF‑ und DOCX‑Dateien und ist so strukturiert, dass sie direkt auf GitHub gespeichert und mit Plattformen wie Vercel oder GitHub Pages veröffentlicht werden kann.

## Struktur

- **index.html** – fasst das Scrum‑Konzept des Bonusprogramms zusammen. Enthält die Produktvision, Rollen, das Product Backlog mit allen EPICs und User Stories, die Sprint‑Planung, Definition of Done und die Kommunikationsstrategie.
- **testreport.html** – enthält einen vollständigen Testbericht der Webapplikation (Stand 25. August 2025) mit Einleitung, Zusammenfassung der getesteten Funktionen, einer Bug‑Analyse inklusive Ranking‑Tabelle, einem Product Backlog in Tabellenform sowie Empfehlungen für die nächsten Schritte.
- **README.md** – diese Datei mit Informationen zur Verwendung und Bereitstellung.

## Verwendung

1. **Lokale Vorschau:** Öffne `index.html` oder `testreport.html` in einem Browser deiner Wahl. Es ist keine zusätzliche Build‑Umgebung erforderlich.
2. **Bereitstellung auf GitHub Pages oder Vercel:**
   - Lege ein neues Repository auf GitHub an und lade den Inhalt des Ordners `project/` hoch.
   - Für GitHub Pages genügt es, unter den Repository‑Einstellungen GitHub Pages auf die `main`‑Branch zu schalten; die Website wird automatisch unter `https://<username>.github.io/<repository>/` erreichbar sein.
   - Für Vercel kannst du ein neues Projekt erstellen und das GitHub‑Repository importieren. Vercel erkennt statische Websites automatisch und stellt sie ohne zusätzliche Konfiguration bereit.

## Hinweise

Die Website ist rein statisch und enthält keine serverseitige Logik. Alle Inhalte stammen aus den hochgeladenen Dokumenten. Wenn du Änderungen an den Texten oder dem Layout vornehmen möchtest, passe einfach die entsprechenden HTML‑Dateien an.