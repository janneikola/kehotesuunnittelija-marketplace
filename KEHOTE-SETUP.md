# Synkronoinnin käyttöönotto

Paketti päivittää yhdeksän kategoriapluginia. Se ei sisällä maksullisia skill-ohjeita. Clauden organisaatiomarketplace tarvitsee private-repositorion.

1. Lisää tämän paketin tiedostot tarkoitusta varten luodun GitHub-repositorion juureen ja commitoi oletushaaraan. Paketti ei vielä sisällä skill-tiedostoja.
2. Salli GitHub Actions ja työnkulun contents: write -oikeus. Yritysyhteys tarvitsee lisäksi id-token: write -oikeuden; pysyvää palveluavainta ei tarvita.
3. Avaa Actions → Kehotesuunnittelija skills sync → Run workflow. Tarkista onnistunut ajo ja syntynyt commit ennen marketplacen lisäämistä.
4. ChatGPT Admin → Plugins → Import marketplace: lisää GitHub-repositorion URL. Claude Organization settings → Plugins: lisää private-GitHub-repositorio. Hae työnkulun tekemä päivitys Clauden Update-painikkeella. Clauden automaattinen sync edellyttää oletushaaraan yhdistettyä pull requestia, jossa pluginin versionumero muuttuu; tämä suoraan haaraan kirjoittava työnkulku ei käynnistä sitä.

Työnkulku tarkistaa palvelun 30 minuutin välein (GitHub voi viivästyttää ajoja). AI-sovelluksen oma synkronointi lisää viivettä. Julkisessa repositoriossa GitHub voi poistaa ajastuksen käytöstä 60 päivän toimettomuuden jälkeen; ylläpitäjä voi ottaa työnkulun uudelleen käyttöön Actions-näkymässä. ChatGPT:n työtilatuonti tarkistaa lähteen oletuksena päivittäin; Sync now nopeuttaa päivitystä.

Muokkaa hallittuja skillejä Kehotesuunnittelijassa. Suora muokkaus GitHubissa keskeyttää seuraavan synkronoinnin, jotta työtä ei ylikirjoiteta. Ratkaise ristiriita ennen seuraavaa ajoa. Haarasuojaus voi estää automaattisen pushin; työnkulku ei ohita suojausta.

Yrityksen lähdetiedostot näkyvät repositorion lukijoille sekä niille AI-työtilan käyttäjille, joille admin jakaa pluginin. Kehotesuunnittelijan työntekijäkohtaiset MCP-oikeudet eivät rajoita näitä kopioita. Käytä eri repositorioita eri luottamusrajoille. Poistetut tiedostot voivat säilyä Git-historiassa ja AI-sovelluksessa.

Virheellinen tai estetty palveluhaku ei poista viimeistä toimivaa julkaisua. Tilauksen päätyttyä yrityksen automaattinen lähdehaku sulkeutuu, mutta yritys säilyttää Git-kopionsa ja voi viedä lähteet palvelusta.

Kategoriapluginin MCP-yhteys vaatii käyttäjän oman OAuth-kirjautumisen. ChatGPT:n suoran MCP-määrityksen sisältävä plugin on työpöytäkäyttöön; selaimeen tarvitaan erikseen rekisteröity sovellusyhteys.

Ohjeet: https://learn.chatgpt.com/docs/enterprise/plugin-management ja https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization
