import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || '',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function test() {
  try {
    const response = await client.chat.completions.create({
      model: 'nvidia/llama-3.1-nemotron-70b-instruct',
      messages: [{ role: 'user', content: 'hello' }],
      max_tokens: 10,
    });
    console.log("SUCCESS:", response.choices[0].message.content);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

test();
