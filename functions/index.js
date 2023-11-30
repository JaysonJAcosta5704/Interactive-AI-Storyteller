const functions = require('firebase-functions');
const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors');

dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY,});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {res.status(200).send({message: 'This is a server for Interactive AI Storyteller!'})});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
              {
                "role": "user",
                "content": `${prompt}`
              }
            ],
            temperature: 1,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });

        console.log(response);
        res.status(200).send({bot: response.choices[0].message.content});
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '2GB',
}

exports.app = functions.runWith(runtimeOpts).https.onRequest(app);