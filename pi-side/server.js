#!/usr/bin/env node
const express = require('express');
const app = express();
const spawn = require('child_process').spawn;
const fs = require('fs');
const bodyParser = require('body-parser');

async function relayctl(...args) {
  return new Promise((resolve, reject)=>{
    let proc = spawn('/usr/local/bin/relayctl', args);
    let buf = "";
    proc.stdout.on('data', d=>buf+=d.toString());
    proc.on('exit', ()=> {
      try {
        resolve(JSON.parse(buf))
      } catch (e) {
        resolve()
      }
    });
  });
}

app.use(bodyParser.json());

app.get('/relays/:id', async (req, res, next) => {
  let state = await relayctl('state');
  res.json(state);
});

app.post('/relays/:id', async (req, res, next) => {
  let value = parseInt(req.body.value);
  if (value === 0) {
    await relayctl('on');
  } else {
    await relayctl('off');
  }
  res.status(201).end();
});

app.listen(80);
