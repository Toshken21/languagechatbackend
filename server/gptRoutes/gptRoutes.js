const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config({path: "../server/config.env"});


// Data configuration for chatgpt
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_NUM,
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

router.post("/userResponse/add", async (req, res) => {
    try {
        console.log("UserResponse to gpt route has started");
        const dePackage = req.body;
        
        console.log(dePackage);

       
        const completion = await openai.createChatCompletion(
        {

            model: "gpt-3.5-turbo",
            
            messages: [
                {role: "system", content: `You are talking to a user in the language they are speaking to you, the setting of the conversation is ${dePackage.conversationSetting}.
                 You are playing the role of a ${dePackage.assistantSetting}.
                 The user's skill level is ${dePackage.skillLevelSetting}. Do not get out of character.` },
                {role: "user", content: dePackage.userPrompt}

            ],
            temperature: 0.8,
            max_tokens:4000
        });
            
       const responseText = completion.data.choices[0].message;

        
        
        
        res.status(200).json({gptResponse: responseText, message: "Response from gpt api successful"});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server Error"});
    }
})

module.exports = router;