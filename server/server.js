process.env.GOOGLE_APPLICATION_CREDENTIALS = "./googleKeyFile.json";
const cors = require("cors");
const express = require('express');
const googleSpeechRoutes = require("./languageRoutes/googleSpeech");
const gptRoutes = require("./gptRoutes/gptRoutes");
const app = express();
app.use(cors());
app.use(express.json());


app.use('/promptVoice', googleSpeechRoutes);
app.use("/gptPrompt", gptRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log('Server started on port');

});