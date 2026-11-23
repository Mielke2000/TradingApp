# TradingApp

Gemeinsame Entwicklung einer mobilen Trading-App mit Expo, React Native und TypeScript. Der aktuelle Stand umfasst den Startbildschirm und das Entwicklungsgerüst. Die geplanten Funktionen stehen in der [Roadmap](docs/ROADMAP.md).

## Lokal starten

Voraussetzung ist Node.js 24 (ab 24.3.0).

```bash
npm ci
npm start
```

Mit `npm run web` startest du die Web-Version. Mit `npm run android` oder `npm run ios` öffnest du die App aus Metro auf einem verfügbaren Emulator oder Simulator. Der iOS-Simulator benötigt macOS.

## Projektstruktur

- `src/app/` enthält die Expo-Router-Routen und das gemeinsame Layout. Gemeinsame Komponenten und Fachlogik liegen bei Bedarf außerhalb des Routenordners.
- `assets/` enthält die App- und Web-Symbole.
- `docs/ROADMAP.md` beschreibt die nächsten Entwicklungsschritte.
- `.github/` enthält die CI sowie Vorlagen für Issues und Pull Requests.

## Vor dem Pull Request

```bash
npm run lint
npm run typecheck
npm run build:web
```

Die CI führt dieselben Prüfungen aus. Weitere Informationen zum [Beitragen](contributing.md).

## Kursdaten im Aktien-Tab

Der Tab zeigt eine feste Auswahl von zehn großen US-Unternehmen. Die Detailansicht bietet Tagesschlusskurse in USD für eine Woche, einen Monat, drei Monate, sechs Monate und ein Jahr.

Auf Android und iOS versucht die App den Abruf über den öffentlichen Chart-Endpunkt von Yahoo Finance. Im Web wird standardmäßig ein gekennzeichneter Beispielverlauf angezeigt. Mit `EXPO_PUBLIC_STOCK_CHART_URL` lässt sich für alle Plattformen eine andere Basis-URL setzen. Diese muss `/SYMBOL?range=1y&interval=1d` im Yahoo-Chart-Format liefern und im Web CORS für den App-Ursprung erlauben. Die Basis-URL ist öffentlich sichtbar. Wenn der Abruf scheitert, zeigt die App gekennzeichnete simulierte Kurse.
