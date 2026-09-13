# Kehotesuunnittelijan marketplace

[Kehotesuunnittelija](https://kehotesuunnittelija.fi/marketplace) tarjoaa yhdeksän kategoriapluginia: HR, myynti, markkinointi, koodaus, liiketoiminta, koulutus, luova, teknologia ja sisällöt.

## Asenna ChatGPT Workin työpöytäsovellukseen

1. Avaa Plugins → Add plugin marketplace.
2. Liitä Source-kenttään https://github.com/janneikola/kehotesuunnittelija-marketplace. Git ref: main. Jätä Sparse paths tyhjäksi.
3. Valitse lähteeksi Kehotesuunnittelija ja asenna haluamasi kategoriapluginit.
4. Yhdistä Kehotesuunnittelija omilla tunnuksillasi sovelluksen pyytäessä kirjautumaan. Valitse henkilökohtainen Premium-tilisi tai yritystilisi.

Yrityksen ChatGPT-admin voi tuoda saman GitHub-osoitteen työtilan Plugins → Import marketplace -toiminnolla. Työtilan on sallittava plugin ja MCP-yhteys. Pluginien suora MCP-määritys on tarkoitettu työpöytäsovellukseen; Kehotesuunnittelijan selainkäyttöön tarkoitettua sovellusyhteyttä ei ole vielä rekisteröity.

## Sisältö ja tunnistautuminen

Tämä julkinen repositorio sisältää vain plugin-määritykset ja ohjeet skillien hakemiseen MCP-palvelusta. Se ei sisällä maksullisia skill-ohjeita, asiakastietoja, yritysten omia skillejä tai palveluavaimia. Repositorion lukeminen ei vaadi GitHub-tunnusta.

MCP-osoite on https://kehotesuunnittelija.fi/mcp. Jokainen käyttäjä kirjautuu omalla Kehotesuunnittelija-tunnuksellaan. Palvelu tarkistaa tilauksen ja yrityksen myöntämät sisältöoikeudet jokaisessa haussa. Tilauksen tai oikeuden päättyminen estää uudet haut. Aiemmin keskusteluun palautettua sisältöä ei voida poistaa.

## Päivitykset

GitHub Actions tarkistaa kategoriapluginien julkaisun 30 minuutin välein. Vain muuttunut julkaisu tekee uuden commitin. GitHub voi viivästyttää ajastusta. Päivitä lähde työpöytäsovelluksen marketplace-hallinnassa; ChatGPT:n keskitetty työtilatuonti tarkistaa lähteen oletuksena päivittäin, ja Sync now nopeuttaa päivitystä.

Varsinaiset maksulliset skill-sisällöt haetaan käyttökerralla palvelusta. Niiden päivitykset eivät odota GitHub-päivitystä. Uusi tehtävä hakee uusimman julkaistun version; jo avoimen keskustelun teksti ei muutu jälkikäteen.

Ylläpitäjä voi käynnistää synkronoinnin Actions → Kehotesuunnittelija skills sync → Run workflow. Julkisessa repositoriossa GitHub voi poistaa ajastuksen käytöstä 60 päivän toimettomuuden jälkeen; sen voi ottaa uudelleen käyttöön Actions-näkymässä. Hallittuja plugin-tiedostoja muokataan palvelun lähdekoodissa. Käsin tehty ristiriitainen muutos pysäyttää päivityksen.

## Claude ja yrityksen omat skillit

Clauden organisaatiomarketplace edellyttää private- tai internal-repositoriota, joten tätä julkista URL-osoitetta ei voi käyttää siihen suoraan. Yrityksen admin voi synkronoida kategoriakirjaston yrityksen omaan private-repositorioon Kehotesuunnittelijan asennuspaketilla. Yrityksen omat pluginit ja niiden jakeluyhteydet määritetään Kehotesuunnittelijan tiiminhallinnassa. Yritys omistaa omat lähdetiedostonsa ja hallitsee niiden jakelua GitHubissa ja AI-työtilassa.

Tämän työnkulun tekemä Git-päivitys haetaan Claudessa Update-painikkeella. Clauden automaattinen sync tarvitsee oletushaaraan yhdistetyn pull requestin, jossa pluginin versionumero muuttuu; suora push ei käynnistä sitä. Henkilökohtainen Claude-käyttäjä voi käyttää suoraa MCP-yhteyttä tilauksensa sallimalla tavalla.

## Ohjeet

- [Käyttöönotto ja tilin oikeudet](https://kehotesuunnittelija.fi/marketplace)
- [OpenAI: marketplace-paketit](https://developers.openai.com/plugins/build/plugins)
- [ChatGPT: yrityksen plugin-hallinta](https://learn.chatgpt.com/docs/enterprise/plugin-management)
- [Claude: yrityksen plugin-hallinta](https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization)
- [Synkronoinnin asennuspaketti ja rajat](KEHOTE-SETUP.md)
