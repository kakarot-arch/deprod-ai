import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openrouterClient = new OpenAI({
  baseURL: process.env.GAIA_MODEL_BASE_URL,
  apiKey: process.env.GAIA_API_KEY,
});

export async function suggestTokenDetails(projectDescription: string) {
  const prompt = `Please suggest a name, symbol, and total supply for a new ERC-20 token based on this project. Respond in this exact format:
Name: [token name]
Symbol: [token symbol]
Total Supply: [number without commas]`;

  const res = await openrouterClient.chat.completions.create({
    model: "qwen72b",
    messages: [{ 
      role: "user", 
      content: `${prompt}\n\nProject description: ${projectDescription}` 
    }],
  });
  return res.choices[0].message?.content;
}

export async function analyzeContractStats(stats: any) {
  const prompt = `You are a Solidity smart contract optimization expert. Please analyze this contract usage data for performance issues and provide recommendations.`;

  const res = await openrouterClient.chat.completions.create({
    model: "deepseek/deepseek-chat:free",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: `Analyze this usage data for performance issues:\n${JSON.stringify(stats)}` }
    ],
  });
  return res.choices[0].message?.content;
}
