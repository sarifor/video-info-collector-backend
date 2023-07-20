const axios = require("axios");
const express = require('express');
const cors = require("cors");
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager').v1;
const app = express();
const host = "localhost";
const port = 3000;
const secretmanagerClient = new SecretManagerServiceClient();

let API_KEY;

const testData = [
  {
    "items": [
      {
        "snippet": {
          "topLevelComment": {
            "snippet": {
              "publishedAt": "2024/4/1 (test data from server)",
              "textDisplay": "Visit Australia (test data from server)",
              "authorDisplayName": "앵무새사남매-루몽다로"
            }
          }
        }
      }
    ]
  },
  {
    "items": [
      {
        "snippet": {
          "topLevelComment": {
            "snippet": {
              "publishedAt": "2024/4/2 (test data from server)",
              "textDisplay": "Wanna meet cockatoos! (test data from server)",
              "authorDisplayName": "앵무새사남매-루몽다로"
            }
          }
        }
      }
    ]
  },
];

const getData = async () => {
  /* Get Data using Youtube API
  try { 
    // Fetch latest infomation of five videos from a YouTube channel
    const latestFiveVideos = await axios(`
      https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCkIu9pkxvDcnBs4Tl4seMFw&maxResults=5&order=date&type=video&key=${API_KEY}`
    ).then(response => response.json())
      .catch(error => {
        console.log(error);

        // Return test object if api returns error or exceeds quota per day
        const latestFiveVideos = testData;
        return latestFiveVideos;
      });
    
    // Extract video ids and put them into an array
    const videoIds = latestFiveVideos.items.map(item => item.id.videoId);

    // Create an array of YouTube comment api url including video ids extracted
    const urls = videoIds.map((videoId) => 
      `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=1&videoId=${videoId}&key=${API_KEY}`
    );

    // Fetch each comment at the same time using YouTube comment api url including video ids extracted
    const videos = await Promise.all([fetch(urls[0]), fetch(urls[1]), fetch(urls[2]), fetch(urls[3]), fetch(urls[4])]).then(responses => {
      return Promise.all(responses.map(response => {
        return response.json();
      }));
    }).then(json => {
      const videos = json;
      return videos;
    }).catch(error => {
      console.log(error);

      // Return test object if api returns error or exceeds quota per day
      const videos = testData;
      return videos;    
    })  
  } catch (e) {
    const videos = testData;
    return videos;
  } */

  const videos = testData;
  return videos;
};

async function callAccessSecretVersion() {
    try {
        const request = {
            name: "projects/493842336457/secrets/youtube_api/versions/1",
        };
        const res = await secretmanagerClient.accessSecretVersion(request); // can be accessed only in VM instance
        API_KEY = res[0].payload.data.toString('utf-8'); // index starts from 0 
        console.log(API_KEY);
    } catch (e) {
        console.log(e);
    }
}
callAccessSecretVersion();

app.use(cors());

app.get('/', async (req, res) => {
    try {
        const result = await getData();
        console.log(result);
        res.send(result);
    } catch (e) {
        console.log(e);
    }
})

app.listen(port, () => {
    console.log(`Go to ${host}:${port}`)
})