const PORT = process.env.PORT || 8080;

const express = require ('express');
const axios = require ('axios');
const cheerio = require ('cheerio');

const app = express ();

const newspapers = [
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: '',
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change/?WT.mc_id=tmgoff_psc_ppc_dsa_catchall&gclid=EAIaIQobChMIo_P-j7Tu_wIV-gkGAB0x7wTNEAAYASAAEgLQ3vD_BwE',
    base: 'https://www.telegraph.co.uk',
  },
];

const articles = [];

newspapers.forEach (el => {
  axios
    .get (el.address)
    .then (response => {
      const html = response.data;

      const $ = cheerio.load (html);

      $ (`a:contains('climate')`, html).each (function () {
        const title = $ (this).text ();
        const url = $ (this).attr ('href');
        articles.push ({
          title,
          url: el.base + url,
          source: el.address,
        });
      });
    })
    .catch (err => console.log (err));
});

app.get ('/', (req, res) => {
  res.json ('Welcome to my climate change API');
});

app.get ('/news', (req, res) => {
  res.json (articles);
  // axios.get('https://www.thetimes.co.uk/environment/climate-change')
  // .then((response) => {
  //     const html =  response.data;
  //     const $ = cheerio.load(html);
  //     $(`a:contains('climate')`, html).each(function() {
  //         const title = $(this).text();
  //         const url = $(this).attr('href');
  //         articles.push({
  //             title,
  //             url
  //         })
  //     })

  //     res.json(articles);

  // }).catch((err) => console.log(err))
});

app.get ('/news/:newspaperId', (req, res) => {
  // console.log(req.params.newspaperId);
  const newspaparId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter (el => el.name == newspaparId)[0].address;
 
  const newspaperBase = newspapers.filter (el => el.name == newspaparId)[0].base

//   console.log (newspaper);
  axios.get (newspaperAddress).then (response => {
    const html = response.data;
    const $ = cheerio.load (html);
    const specificArticles = [];

    $ (`a:contains('climate')`, html).each (function () {
      const title = $ (this).text ();
      const url = $ (this).attr ('href');
      specificArticles.push ({
        title,
        url: newspaperBase + url,
      });
    });
    res.json(specificArticles)
  }).catch(err => console.log(err))
});

app.listen (PORT, () => console.log (`server running on port ${PORT}`));


// left at 49 mins!