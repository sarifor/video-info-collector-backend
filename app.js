const axios = require("axios");
const express = require('express');
const cors = require("cors");
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager').v1;
const app = express();
const host = "localhost";
const port = 3000;
const secretmanagerClient = new SecretManagerServiceClient();

let API_KEY;
/*
const getData = async () => {
    try {
        const baseURL = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCkIu9pkxvDcnBs4Tl4seMFw&maxResults=5&order=date&type=video&key=${API_KEY}`
        const client = axios.create({
            baseURL: baseURL
        });

        const response = await client.get();
        return response;
    } catch (e) {
        console.log(e);
    }
}
*/
app.use(cors());

async function callAccessSecretVersion() {
    try {
        const request = {
            name: "projects/493842336457/secrets/youtube_api/versions/1",
        };
        const response = await secretmanagerClient.accessSecretVersion(request);
        API_KEY = response[0].payload.data.toString('utf-8'); // index starts from 0
        console.log(API_KEY)
    } catch (e) {
        console.log(e);
    }
}
callAccessSecretVersion();

app.get('/', async (req, res) => {
    try {
        // const result = await getData();
        res.send("OK");
        // res.send(result);
    } catch (e) {
        console.log(e);
    }
})

app.listen(port, () => {
    console.log(`Go to ${host}:${port}`)
})