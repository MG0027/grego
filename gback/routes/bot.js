const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

require('dotenv').config();

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Helper function to delay between retries
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// System prompt
const systemPrompt = `
You are Grego, a helpful personal assistant. 
You assist the user with general queries such as tasks, calendar, and expenses, but only respond with such details when asked. 
If a user doesn't ask for tasks, calendar, or expenses, respond only to their message.`;

// Enhanced API call with retry logic
async function queryHuggingFace(userMessage) {
  const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
          const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  inputs: `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`,
                  parameters: {
                      max_new_tokens: 150,
                      temperature: 0.7,
                      top_p: 0.95,
                      do_sample: true,
                  }
              }),
          });

          const data = await response.json();
          
          if (data.error) {
              throw new Error(data.error);
          }

          let aiResponse = data[0]?.generated_text;
          if (!aiResponse) {
              throw new Error("No generated_text in response");
          }

          // Clean up the response and ensure that only the AI's message is returned
          aiResponse = aiResponse.replace(systemPrompt, '').trim();

          return aiResponse;

      } catch (error) {
          lastError = error;
          console.log(`Attempt ${attempt} failed. ${MAX_RETRIES - attempt} retries left.`);
          
          if (attempt < MAX_RETRIES) {
              await delay(RETRY_DELAY * attempt); // Exponential backoff
              continue;
          }
          throw new Error(`Failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
      }
  }
}

// Send message endpoint
router.post('/', async (req, res) => {
    try {
        const { message, calendar, tasks, expenses, income } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message field is required' });
        }

        // Add only the user message to be processed by Hugging Face
        let userMessage = message;

        // Detect if the user is asking for tasks, calendar, expenses, etc.
        const userLower = message.toLowerCase();
        if (userLower.includes("task") && tasks && tasks.length > 0) {
            userMessage += `\n\nTasks:\n`;
            tasks.forEach((task, index) => {
                userMessage += `${index + 1}. Task: ${task.task}, Due: ${task.duedatetime}, Completed: ${task.completed}\n`;
            });
        }

        if (userLower.includes("calendar") && calendar && calendar.length > 0) {
            userMessage += `\n\nCalendar Events:\n`;
            calendar.forEach((event, index) => {
                userMessage += `${index + 1}. Event: ${event.event}, Date: ${event.date}, Completed: ${event.completed}\n`;
            });
        }

        if (userLower.includes("expense") && expenses && expenses.length > 0) {
            userMessage += `\n\nExpenses:\n`;
            expenses.forEach((expense, index) => {
                userMessage += `${index + 1}. Amount: ₹${expense.amount}, Description: ${expense.description}, `;
            });
        }

        if (userLower.includes("income") && income && income.length > 0) {
            userMessage += `\n\nIncome:\n`;
            income.forEach((incomeItem, index) => {
                userMessage += `${index + 1}. Amount: ₹${incomeItem.amount}, Description: ${incomeItem.description}, Hidden: ${incomeItem.hide}\n`;
            });
        }

        // Get AI response with retry logic
       let aiResponse = await queryHuggingFace(userMessage);
        aiResponse = aiResponse.replace(`User: ${message}`, '').trim();

        // Optionally, also remove "Assistant:" prefix if you want it cleaner
        aiResponse = aiResponse.replace('Assistant:', 'Grego: ').trim();
        res.json({ response: aiResponse });

    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ 
            error: 'Failed to process message',
            message: error.message 
        });
    }
});

// Test endpoint to verify API token
router.get('/test-token',  async (req, res) => {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );
        
        const data = await response.json();
        
        if (data.error) {
            res.status(400).json({ success: false, error: data.error });
        } else {
            res.json({ success: true, message: "API token is working correctly!" });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Failed to test API token",
            details: error.message 
        });
    }
});

module.exports = router;
