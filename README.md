# Demo NEN2660 Beheer app (asset management applicatie) - Linked Data

Voorbeeldimplementatie van asset management software op basis van Linked Open Data met NEN2660 ontologieen

## Introductie

[CROW](https://www.crow.nl/) is de initiator van dit project. De insteek was:

> "Maak een **Proof of Concept** dat aantoont dat het gemakkelijk is om een **beheerpakket** te maken voor het beheren van op **NEN2660-2** gebaseerde ontologieen.

Oftewel:

- Een (areaal)beheerpakket
- Voor het beheren van objecten + attributen
- Gebruik van NEN2660-2 LinkedData ontologie
- Eenvoudige uitwerking: Proof of Concept

## Over IMBOR

CROW beheert het **[IMBOR](https://www.crow.nl/imbor)**.

Het IMBOR uniformeert begrippen voor het vakgebied 'beheer openbare ruimte'.

## Over NEN2660-2

De **[NEN2660-2](https://docs.crow.nl/imbor/techdoc/#imbor-door-ontwikkeling-in-software)** standaardiseert het maken van ontologieën: informatie rondom de gebouwde omgeving kan hiermee worden vastgelegd en gedeeld.

## Voordelen gebruik NEN2660-2

**Nu:** elk softwarepakket maakt een systeem voor het vastleggen van een 'Boom' of 'Afvalbak'.

**Toekomst:** softwarepakket legt geen 'Boom' meer vast, maar enkel nog klassen uit de NEN2660-2.

**Voordelen:**
- Automatisch de actuele lijst van objecten en attributen:<br />softwarepakket wordt gevuld met de IMBOR-ontologie
- Minder werk, minder opslag nodig
- Software minder vaak aanpassen

## Demo

&raquo; [**Bekijk de demo**](https://docs.crow.nl/demo-beheerpakket-linked-data/)

## Screenshots

Kaart met alle objecten:

![Kaart](https://i.imgur.com/2xGID7i.png)

Voeg een nieuw objecttype toe:

![Selecteer objecttype](https://i.imgur.com/p6MtWcf.png)

Vul de attributen in:

![Attributen](https://i.imgur.com/KVh6d9J.png)

## De applicatie gebruiken als ontwikkelaar

Deze sectie geeft informatie over het op je computer starten van de applicatie. Als je de applicatie wilt zien en testen kun je ook gebruik maken van de online versie op [docs.crow.nl/demo-beheerpakket-linked-data](https://docs.crow.nl/demo-beheerpakket-linked-data/).

### Benodigdheden

Clone de repository:

    git clone https://github.com/Stichting-CROW/demo-beheerpakket-linked-data.git
    cd demo-beheerpakket-linked-data

Stel de API token in:

- Dupliceer `.env.local.example` en geef dit duplicaat de bestandsnaam `.env.local`
- Configureer de `NEXT_PUBLIC_IMBOR_TOKEN` variabele

### Beschikbare scripts

#### `npm install`

Installeert alle afhankelijkheden. Dit is verplicht voordat je de applicatie voor de eerste keer start.

#### `npm run dev`

Start de app in ontwikkelingsmodus.

Als je naar [http://localhost:3000](http://localhost:3000) gaat zie je de webapplicatie in je browser.

De site herlaadt automatisch als je wijzigingen in de code aanbrengt.

#### `npm run deploy`

Plaatst een nieuwe versie online.

De applicatie zal worden gebouwd en geupload naar GitHub Pages. De online geplaatste applicatie verschijnt op [docs.crow.nl/demo-beheerpakket-linked-data](https://docs.crow.nl/demo-beheerpakket-linked-data).

## Meer leren?

Dit project is gemaakt met NextJS
- [NextJS documentatie](https://nextjs.org/docs).
- [React documentatie](https://reactjs.org/).

Voor het bevragen van de triple store gebruiken we SPARQL.
- [SPARQL By Example](https://www.w3.org/2009/Talks/0615-qbe/)

Voor het bevragen van IMBOR kunnen we de volgende bronnen gebruiken:
- https://hub.laces.tech/crow/imbor/2022/p/vocabulaire
- https://hub.laces.tech/crow/imbor/2022/p/kern
- https://hub.laces.tech/crow/imbor/2022/p/domeinwaarden
- https://hub.laces.tech/crow/imbor/2022/p/informatief
- https://hub.laces.tech/crow/imbor/2022/p/aanvullend-metamodel

Documentatie over hoe te authenticeren op de Laces Hub:
- [Laces Hub authentication](https://docs.laces.tech/hub/9.0.8/security.html#authentication)

De IMBOR ontologie verkennen:
- [IMBOR Onto Verkenner](https://docs.crow.nl/onto-verkenner/imbor/#/view)

## Note to self

### GitHub Pages: y is not defined

Er was het probleem dat GitHub Pages een foutmelding gaf: `y is not defined`. Dit is opgelost met [deze oplossing](https://github.com/alex3165/react-mapbox-gl/issues/931#issuecomment-826135957).
