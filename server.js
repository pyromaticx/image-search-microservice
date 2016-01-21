"use strict"
var cacheObj = {};
var searches = [];
const imgurOptions = {
        "headers": {
          "authorization": "Client-ID 15413480fdae22d"
        }
      };
const url = "https://api.imgur.com/3/gallery/t/";

const express = require('express');
const app = express();
const fetch = require('node-fetch');
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/searches/', (req, res) => {
  res.send(JSON.stringify(searches));
});

app.get('/api/:query', (req, res) => {
  let query = req.params.query;
  let offset = req.query.offset || 1;
  let offsetStart = (offset - 1) * 10;
  let offsetEnd = (offset * 10) - 1;
  searches.push({
    term: query,
    time: Date()
  });

  if(!cacheObj[query]) {
    fetch(url + query, imgurOptions).then((resp) => {
      return resp.json()
    }).then((data) => {
      let responseData = data.data.items.map((el) => {
        return {
            url: el.link,
            snippet: el.title,
            thumbnail: el.link,
            context: el.description
          };
        });
      cacheObj[query] = responseData;
      res.send(JSON.stringify(responseData.slice(offsetStart, offsetEnd)));
    });

    } else {
      res.send(JSON.stringify(cacheObj[query].slice(offsetStart, offsetEnd)));
    }

});



app.listen(port);
