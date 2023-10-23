# Ajax Bluesky feed
Hier vind je de [eerste Ajax-feed van Bluesky](https://bsky.app/profile/did:plc:gtkdyrkxncmr2qaq4lwtdrbd/feed/ajax). In deze feed verzamelen we berichten van gecureerde Ajax-accounts en
populaire posts van andere Ajacieden.

## Hoe werkt de feed?
In de Ajax-feed vind je 3 verschillende type berichten:
1. Alle posts van een gecureerde whitelist Ajax-accounts. Dit zijn accounts van populaire Ajacieden die bijna uitsluitend over Ajax schrijven. De lijst met accounts is [hier](https://github.com/tomharting/ajax-bsky-feed/blob/main/src/lists/authorWhitelist.json) te vinden.
2. De posts van een gecureerde greylist accounts die een Ajax-term bevatten. Dit zijn accounts van populaire Ajacieden, die ook veel over andere zaken posten. Van deze accounts worden daarom alleen posts meegenomen die een Ajax-term bevatten. De greylist is [hier](https://github.com/tomharting/ajax-bsky-feed/blob/main/src/lists/authorGreylist.json) te vinden en de lijst met Ajax-termen [hier](https://github.com/tomharting/ajax-bsky-feed/blob/main/src/lists/ajaxHitWords.json).
3. Nederlandstalige posts van alle andere Bluesky-gebruikers die een Ajax-term bevatten en een minimaal aantal likes hebben gekregen binnen een dag. Zo nemen we alleen de interessante berichten van alle Ajacieden mee.

## Ik heb een toevoeging!
Mocht je een account willen aandragen voor de whitelist of de greylist, of een term aan de Ajax-termen willen toevoegen, dan kun je me een bericht sturen op Bluesky (@tomharting.bsky.social) of een pull request maken op deze GitHub.
Voor nu cureer ik deze lijsten, mocht de feed aanslaan als Bluesky groeit, dan ben ik zeker van plan dat niet alleen te blijven bepalen.

## Is de feed gratis?
Je kunt helemaal gratis gebruik maken van deze feed. Bovenaan de feed kun je op het hartje en de punaise drukken om de feed op je home-pagina terug te kunnen vinden.

Het onderhoud en ontwikkelen van de feed doe ik vrijwillig. Wel kost het mij geld om de server en het domein waarop de feed draait draaiende te houden. Wil je me helpen met een kleine bijdrage? Dat kan [hier](https://www.buymeacoffee.com/bsky.ajax) en wordt enorm gewaardeerd!

## De Toekomst
Het doel is uiteraard om de feed steeds beter te maken. Daarom worden de lijsten steeds uitgebreid als Bluesky verder groeit.
Ook ideeen voor aanpassingen op het algoritme zijn natuurlijk van harte welkom. In de toekomst kunnen we zo de feed steeds interessanter maken.

Goed om op te merken is dat mijn ervaring met TypeScript minimaal is. Het zou dus kunnen dat je de code bekijkt en de nodige opmerkingen hebt.
Schiet in dat geval vooral pull requests of issues in. Dit is een vrijwillig project, dus we moeten het samen doen.
