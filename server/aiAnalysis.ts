import { invokeLLM } from "./_core/llm";

export interface OutfitAnalysis {
  detectedItems: string[];
  colorPalette: string[];
  styleTags: string[];
  styleScore: number;
  recommendations: string[];
}

export async function analyzeOutfitImage(
  imageBase64: string
): Promise<OutfitAnalysis> {
  try {
    const response = await invokeLLM({
      model: "gpt-4-vision",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64.split(",")[1] || imageBase64}`,
              },
            },
            {
              type: "text",
              text: `Analyze this outfit image and provide a detailed fashion analysis in JSON format with these exact fields:
{
  "detectedItems": ["item1", "item2", ...],
  "colorPalette": ["#RRGGBB", "#RRGGBB", ...],
  "styleTags": ["tag1", "tag2", ...],
  "styleScore": number (1-10),
  "recommendations": ["recommendation1", "recommendation2", ...]
}

Be specific about clothing items, extract dominant colors as hex codes, use style tags like casual, formal, sporty, minimalist, bohemian, etc., provide a score based on color coordination and fit, and give 3-4 actionable style recommendations.`,
            },
          ],
        },
      ],
    });

    // Extract JSON from response
    const choice = response.choices[0];
    if (!choice || !choice.message) {
      throw new Error("No response from LLM");
    }

    const messageContent = choice.message.content;
    const textContent = typeof messageContent === "string" 
      ? messageContent 
      : Array.isArray(messageContent) 
        ? messageContent.find(c => c.type === "text")?.text 
        : undefined;

    if (!textContent) {
      throw new Error("No text content in response");
    }

    // Parse JSON from response text
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const analysis = JSON.parse(jsonMatch[0]) as OutfitAnalysis;

    // Validate and sanitize response
    return {
      detectedItems: Array.isArray(analysis.detectedItems)
        ? analysis.detectedItems.slice(0, 10)
        : [],
      colorPalette: Array.isArray(analysis.colorPalette)
        ? analysis.colorPalette.slice(0, 5)
        : [],
      styleTags: Array.isArray(analysis.styleTags)
        ? analysis.styleTags.slice(0, 5)
        : [],
      styleScore: Math.min(10, Math.max(1, Math.round(analysis.styleScore || 7))),
      recommendations: Array.isArray(analysis.recommendations)
        ? analysis.recommendations.slice(0, 4)
        : [],
    };
  } catch (error) {
    console.error("AI Analysis error:", error);
    // Return fallback analysis
    return {
      detectedItems: ["Clothing Item"],
      colorPalette: ["#333333", "#CCCCCC"],
      styleTags: ["casual"],
      styleScore: 7,
      recommendations: [
        "Great outfit choice!",
        "Consider adding layers for versatility",
      ],
    };
  }
}

export async function generateWeatherRecommendations(
  detectedItems: string[],
  styleTags: string[],
  weatherCondition: string | null,
  temperature: number | null
): Promise<string[]> {
  try {
    const response = await invokeLLM({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Given this outfit and weather conditions, provide 3-4 specific style recommendations:

Outfit Items: ${detectedItems.join(", ")}
Style Tags: ${styleTags.join(", ")}
Weather: ${weatherCondition || "Unknown"} at ${temperature || "unknown"}°C

Provide recommendations as a JSON array of strings. Only return the JSON array, nothing else.`,
        },
      ],
    });

    const choice = response.choices[0];
    if (!choice || !choice.message) {
      return [];
    }

    const messageContent = choice.message.content;
    const textContent = typeof messageContent === "string" 
      ? messageContent 
      : Array.isArray(messageContent) 
        ? messageContent.find(c => c.type === "text")?.text 
        : undefined;

    if (!textContent) {
      return [];
    }

    try {
      const recommendations = JSON.parse(textContent) as string[];
      return Array.isArray(recommendations)
        ? recommendations.slice(0, 4)
        : [];
    } catch {
      return [];
    }
  } catch (error) {
    console.error("Weather recommendations error:", error);
    return [];
  }
}
