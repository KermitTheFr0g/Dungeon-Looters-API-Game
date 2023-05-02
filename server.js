const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    return res.send('Hello World!');
})


app.listen(() => {
    console.log(`Dungeon Looters is running on port ${port}.`);
})