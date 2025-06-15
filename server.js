import express from 'express';
const app = express();
import cors from 'cors';
app.use(cors());

import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import { GoogleGenAI } from "@google/genai";


import * as fs from 'fs';


// import db from './db.js';
import Content from './models/content.js';
import bodyParser from 'body-parser';

// Fix for __dirname in ES modules:
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(bodyParser.json());
app.use(express.static(__dirname)); // Now this works!



app.post('/text', async (req, res) => {
  try {
    const { text } = req.body;
    console.log("User question:", text);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("Model :");
     

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: text,
    });
    console.log(response);

    // Optionally save question to DB
    // await Content.create({ text });
    // Assuming response.text contains the AI's answer
    res.json({ answer: response.text });

    console.log("Gemini answer:", response.text);
    res.send(response.text);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({error : error.message });
  }
  // const answer1  = response.text ;
  // module.exports = response.text ; 
});



app.post('/code' , async (req , res)=>{
    try{
         const { text } = req.body;
         console.log("User question:", text);
        
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  let response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: [ text ,
  ],
  config: {
    tools: [{ codeExecution: {} }],
  },
});

const parts = response?.candidates?.[0]?.content?.parts || [];

//collecting all data 
let results = [];

parts.forEach((part) => {
  if (part.text) {
    results.push({ type: 'text', value: part.text });
  }
  if (part.executableCode && part.executableCode.code) {
    results.push({ type: 'code', value: part.executableCode.code });
  }
  if (part.codeExecutionResult && part.codeExecutionResult.output) {
    results.push({ type: 'output', value: part.codeExecutionResult.output });
  }
});

//printing all data 
res.json({ answer: response.text });

results.forEach((data)=>{
    console.log( "your data is as follows : ",data);
    
})
    } catch(err){
        console.log('error occured :' , err);
        res.status(500).json({error : err.message});
    }
})

app.post('/url' , (req , res)=>{
  try{
     const text = req.body;
     console.log("User question:", text);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
   

async function main() {

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: [
        text ,
    ],
    config: {
      tools: [{urlContext: {}}, {googleSearch: {}}],
    },
  });

  //printing all data 
  res.json({ answer: response.text });

  console.log(response.text);
  res.send(response.text);
  res.status(200);
  
}

main();


  }catch(err){
    console.log('error occured :' , err);
    res.status(500).json({error : err.message});
  }
})


// this is not working ...
//for image generation 
app.use(express.static(__dirname));

app.post('/image' , (req , res)=>{
  try{
    const text = req.body;
       console.log("User question:", text);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
 
  const response =  ai.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: text ,
    config: {
      numberOfImages: 4,
    },
  });

  let idx = 1;
  for (const generatedImage of response.generatedImages) {
    let imgBytes = generatedImage.image.imageBytes;
    console.log("imgBytes : " , imgBytes);
    const buffer = Buffer.from(imgBytes, "base64");
    console.log("image has been generated :)");
    console.log("Buffer is " , buffer);
    fs.writeFileSync(`imagen-${idx}.png`, buffer);
   
    idx++;
  }
  let imageUrls = [];
  for (let j = 1; j <= 4; j++) {
  imageUrls.push(`http://localhost:5000/imagen-${j}.png`);
}
res.json({ images: imageUrls });
 res.set('Content-Type', 'image/png');
    res.status(200);
    res.send(imageUrls);

  }catch(err){

  }
})
const upload = multer({ dest: 'uploads/' });

app.post('/pdf', upload.single('file') ,(req, res) => {
  try {
    const text = req.body.text;
    console.log("User question:", text);
    const filePath = req.file.path;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    async function main() {
      const contents = [
        {
          parts: [
            { text: text },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: Buffer.from(fs.readFileSync(filePath)).toString("base64")
              }
            }
          ]
        }
      ];

      const response = await ai.models.generateContent({
      model: "gemini-2.0-flash"

,// or your model
        contents: contents 
      });
       //printing all data 
      res.json({ answer: response.text });
      console.log("response.text");
      res.status(200).send(response.text);
    }

    main();
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.listen(5000 , (req ,res) =>{
   console.log('https://ai-model-8.onrender.com');
})