import axios from "axios";

interface ImageGenerationOptions {
  prompt: string;
  image_generator_version?: "standard" | "hd" | "genius";
  negative_prompt?: string;
}

export const generateImage = async ({
  prompt,
  image_generator_version = "standard",
  negative_prompt
}: ImageGenerationOptions) => {
  try {
    // Try to call the local API server first
    try {
      const response = await axios.post('http://localhost:3002/generate-image', {
        prompt,
        image_generator_version,
        negative_prompt
      });
      return response.data.imageUrl;
    } catch (localError) {
      console.warn("Could not reach local API server, using fallback:", localError);
      // Fallback to Unsplash if the API server is not running
      return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`;
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};