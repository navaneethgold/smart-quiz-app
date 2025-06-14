import express from 'express';
import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';
dotenv.config();
const router=express.Router();
const cohere = new CohereClient({
  token: process.env.COHERE,
});

const generateExamQuestions=async(difficult,maxMarks,noQuestions,typeQuestions,portions)=>{
    const prompt=`Generate an array of JavaScript objects representing exam questions. The difficulty of the exam is ${difficult}, the total marks are ${maxMarks}, and the number of questions to generate is ${noQuestions}. The type of questions required is ${typeQuestions}. All questions should be strictly based on the following syllabus portions: ${portions}.

Ensure the difficulty level matches ${difficult} and marks are fairly distributed across all questions.

Each question object must follow this structure exactly:
{
  "questionNo": Number,
  "questionsType": String, 
  "question": String, 
  "additional": [String], 
  "qAnswer": String
}
full form of MCQ is multi choice questions
questionNo: the question number starting from 1.
questionsType: "MCQ", "TrueFalse", or "FillBlank".
question: The actual question text, generated based on the topic in ${portions} and the difficulty ${difficult}.
additional: if the question type is "MCQ", include **exactly four** answer options as strings; otherwise, leave as an empty array.
qAnswer: the correct answer to the question don't just mention the option(if MCQ) put the text.
**IMPORTANT**:
Return only the array of question objects.
type of questions is limited to ${typeQuestions} no other type of questions to be included
Do NOT include any variable declarations, comments, code formatting, explanations, or markdown.
Just the raw JavaScript array. Nothing else.
Remember: return ONLY a clean array of question objects, not a string.`
    const response = await cohere.chat({
      model: 'command-r',
      message:prompt,
      // max_tokens: 500,
      temperature: 0.7,
    });

    return response.text.trim();
}

router.post("/generate-AI-questions", async (req, res) => {
  const { difficult, maxMarks, noQuestions, typeQuestions, portions } = req.body;
  const AIquestions = await generateExamQuestions(difficult, maxMarks, noQuestions, typeQuestions, portions);

  try {
    const parsedQuestions = JSON.parse(AIquestions); 
    res.json({ allAiQuestions: parsedQuestions });
  } catch (err) {
    console.error("AI response was not valid JSON:", AIquestions);
    res.status(500).json({ error: "Invalid AI response", details: err.message });
  }
});

export default router;