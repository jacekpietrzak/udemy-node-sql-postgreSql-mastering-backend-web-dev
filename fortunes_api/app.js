const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const fortunes = require('./data/fortunes.json');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hey');
});

app.get('/fortunes', (req, res) => {
  // res.send('requesting fortunes');
  console.log('requesting fortunes');
  res.json(fortunes);
});

app.get('/fortunes/random', (req, res) => {
  console.log('requesting random fortune');
  // res.send('requesting random fortune');

  // getting random index of fortunes. Math.random * arr.length and Math.flor to make it round number
  const random_index = Math.floor(Math.random() * fortunes.length);
  console.log(random_index);

  const r_fortune = fortunes[random_index];

  res.json(r_fortune);
});

app.get('/fortunes/:id', (req, res) => {
  console.log(req.params);

  const fortune = fortunes.find((fortune) => fortune.id == req.params.id);
  res.json(fortune);
});

const writeFortunes = (json) =>
  fs.writeFile('./data/fortunes.json', JSON.stringify(json), (error) =>
    console.log(error)
  );

app.post('/fortunes', (req, res) => {
  console.log(req.body);
  const { message, lucky_number, spirit_animal } = req.body;

  const fortuneIds = fortunes.map((f) => f.id);

  const newFortune = {
    id: (fortuneIds.length > 0 ? Math.max(...fortuneIds) : 0) + 1,
    message,
    lucky_number,
    spirit_animal,
  };

  const newFortunesArr = fortunes.concat(newFortune);

  // fs.writeFile('./data/fortunes.json', JSON.stringify(newFortunes), (error) =>
  //   console.log(error)
  // );
  // Optimized

  writeFortunes(newFortunesArr);

  res.json(newFortunesArr);
});

app.put('/fortunes/:id', (req, res) => {
  const { id } = req.params;
  // const { message, lucky_number, spirit_animal } = req.body;

  const oldFortune = fortunes.find((f) => f.id == id);

  // if (message) oldFortune.message = message;
  // if (lucky_number) oldFortune.lucky_number = lucky_number;
  // if (spirit_animal) oldFortune.spirit_animal = spirit_animal;
  // Optimized

  ['message', 'lucky_number', 'spirit_animal'].forEach((key) => {
    if (req.body[key]) oldFortune[key] = req.body[key];
  });

  // fs.writeFile('./data/fortunes.json', JSON.stringify(fortunes), (error) =>
  //   console.log(error)
  // );
  // Optimized
  writeFortunes(fortunes);

  res.json(fortunes);
});

app.delete('/fortunes/:id', (req, res) => {
  const { id } = req.params;
  const newFortunesArr = fortunes.filter((f) => f.id != id);
  console.log('new fortunes from del', newFortunesArr);
  writeFortunes(newFortunesArr);
  res.send(newFortunesArr);
});

module.exports = app;
