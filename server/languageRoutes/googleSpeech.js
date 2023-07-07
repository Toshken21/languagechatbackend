const express = require('express');
const router = express.Router();
const multer = require('multer');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
require("dotenv").config({path: "../server/config.env"});
const googleKeyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
console.log(googleKeyFile);
const client = new textToSpeech.TextToSpeechClient();


router.get('/gptPromptVoice/googleSpeech',  async (req, res) => {

    const text = req.query.text || '';
    console.log(req.query.lang);
    const request = {
        input: { text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: req.query.lang, ssmlGender: 'FEMALE' },
        // Select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' }
      };

    console.log("This is the request", request);
    const [response] = await client.synthesizeSpeech(request);
    res.setHeader('Content-Type', 'audio/mp3');
    res.send(response.audioContent);
    
});

module.exports = router;
