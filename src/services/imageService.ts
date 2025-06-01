import axios from "axios";

interface ImageGenerationOptions {
  prompt: string;
  image_generator_version?: "standard" | "hd" | "genius";
  negative_prompt?: string;
}

// Use Nebius AI for image generation
export const generateImage = async ({
  prompt,
  image_generator_version = "standard",
  negative_prompt
}: ImageGenerationOptions): Promise<string> => {
  try {
    // Call the Nebius AI API endpoint
    const response = await axios.post('/api/generate-image', {
      prompt,
      image_generator_version,
      negative_prompt
    });
    
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};