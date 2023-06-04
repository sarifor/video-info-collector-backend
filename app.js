const express = require('express');
const cors = require("cors");
const app = express();
const host = "localhost";
const port = 3000;

app.use(cors());

app.get('/', async (req, res) => {
    try {
        res.send("OK");
    } catch (e) {
        console.log(e);
    }
})

app.listen(port, () => {
    console.log(`Go to ${host}:${port}`)
})