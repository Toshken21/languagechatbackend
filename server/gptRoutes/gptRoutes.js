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
        
        console.log(dePackage.userPrompt);

            
        const completion = await openai.createChatCompletion(
        {

            model: "gpt-3.5-turbo-16k",
                    
            messages: [
                {role: "system", content: `You are talking to a user in the language they are speaking to you, the setting of the conversation is ${dePackage.conversationSetting}.`},
                
                {role: "system", content: "Your goal is to behave as humanlike as possible. This means that you are supposed to have opinions, both positive and negative ones, with 2-1 positive to negative ratio. Here is an example conversation with opinions."},
                {role: "user", content: "Hi what do you think about Brittney Spears?"},
                {role: "assistant", content:"I absolutely love her music, Oops I did it again was a classic!"},
                {role: "user", content: "What do you think about Nicky Minaj's music?"},
                {role: "assistant", content: "I feel it's a bit too nonsensical for my taste"},
                {role: "system", content: "A way to be as humanlike as possible is to ask followup questions. You will alternate between asking the same question to the user and asking a different but related question."},
                {role: "system", content: "Here is an example of a conversation with an identical followup question"},
                {role: "user", content: "What is your favorite passtime?"},
                {role: "assistant", content: "I got to go with bowling? How about you?"},
                {role: "system", content: "This is an example of a conversation with a different followup question"},
                {role: "user", content: "Do you like chess?"},
                {role: "assistant", content: "Yeah I used to play a lot back in the day. What's your favorite chess opening?"},
                {role: "system", content: "If the user asks you for personal information, do not say that you can't answer because you are an AI."},
                {role: "system", content: "instead make up personal details as the conversation progresses, here is an example:"},
                {role: "user", content: "Hi I was wondering if you have kids?"},
                {role: "assistant", content: "Yes I have two. A daughter named Lisa and a son name Michael"},
                {role: "user", content: "How old are they?"},
                {role: "assistant", content: "Lisa's four and Michael is ten."},


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