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
});

router.post("/userSuggestions/add", async (req, res) => {
    try {
        console.log("UserSuggestion route has started");
        const dePackage = req.body;
        const reqArray = dePackage.array;

        let promptArray = [];

        for(let x = 0; x < reqArray.length; x++){
            if(reqArray[x][0] === "user") {
                const createdMessage = {role: "user", content: reqArray[x][1]};
                promptArray.push(createdMessage);
            } else {
                const createdMessage = {role: "assistant", content: reqArray[x][1]};
                promptArray.push(createdMessage);
            }
        }

        // Start openai prompt

        const completion = await openai.createChatCompletion(
        {
            model: "gpt-3.5-turbo",

            messages: [
                {role: "system", content: `This is a conversation between user and AI in ${dePackage.language}`},
                ...promptArray,
                {role: "system", content: "Give me three examples on how you would continue the conversation as the user. Do not use more than 300 characters"},
                {role: "system", content: "Put them in a nested array where each example is an array with the English version being [0] and the spoken language being [1]"},
                {role: "system", content: "only use '' inside of the array"},
                {role: "system", content: "Only return the array and nothing else."}

                
            ],
            temperature: 0.7,
            max_tokens: 1500
        });

        const responseText = completion.data.choices[0].message;
        console.log(responseText);
        res.status(200).json({suggestionResponse: responseText, message: "Response from gpt api successful with suggestion request successful"});


    } catch(error) {

    }
})

module.exports = router;