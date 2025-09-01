import { GoogleGenAI, Type } from "@google/genai";

export const suggestTopics = async (subject: string): Promise<string[]> => {
  try {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set.");
      throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Break down the broad subject "${subject}" into a list of smaller, specific topics suitable for spaced repetition learning. Each topic should be a concise, actionable item for a flashcard or a single study session. Provide around 10-15 topics.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'A specific, learnable topic.',
              },
              description: 'A list of suggested topics for learning.'
            },
          },
          required: ['topics'],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && Array.isArray(result.topics)) {
        return result.topics;
    }
    
    console.warn("Could not parse topics from Gemini response:", result);
    return [];

  } catch (error) {
    console.error("Error suggesting topics with Gemini:", error);
    throw new Error("Could not generate topics. Please check the subject or try again later.");
  }
};
