const axios = require("axios");
const express = require('express');
const cors = require("cors");
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager').v1;
const app = express();
const host = "localhost";
const port = 3000;
const secretmanagerClient = new SecretManagerServiceClient();

let API_KEY;

const getData = async () => {
    try {
        const baseURL = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCkIu9pkxvDcnBs4Tl4seMFw&maxResults=5&order=date&type=video&key=${API_KEY}`
        const client = axios.create({
            baseURL: baseURL
        });

        const result = await client.get();
        return result;
    } catch (e) { // Return test data usually when exceeded quota per day
        console.log(e);
        const videos = {
            "0": {
              "items": [
                {
                  "snippet": {
                    "topLevelComment": {
                      "snippet": {
                        "publishedAt": "2024/4/1",
                        "textDisplay": "Visit Australia"
                      }
                    }
                  }
                }
              ]
            },
            "1": {
              "items": [
                {
                  "snippet": {
                    "topLevelComment": {
                      "snippet": {
                        "publishedAt": "2024/4/2",
                        "textDisplay": "Wanna meet cockatoos!"
                      }
                    }
                  }
                }
              ]
            },
          }
        return videos;        
    }
}

app.use(cors());

async function callAccessSecretVersion() {
    try {
        const request = {
            name: "projects/493842336457/secrets/youtube_api/versions/1",
        };
        const res = await secretmanagerClient.accessSecretVersion(request); // can be accessed only in VM instance
        API_KEY = res[0].payload.data.toString('utf-8'); // index starts from 0 
        console.log(API_KEY)
    } catch (e) {
        console.log(e);
    }
}
callAccessSecretVersion();

app.get('/', async (req, res) => {
    try {
        const result = await getData();
        res.send(result);
    } catch (e) {
        console.log(e);
    }
})

app.listen(port, () => {
    console.log(`Go to ${host}:${port}`)
})