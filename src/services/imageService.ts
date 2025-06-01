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
    // Try to call the API server directly first
    try {
      const response = await axios.post('http://localhost:3002/generate-image', {
        prompt,
        image_generator_version,
        negative_prompt
      });
      return response.data.imageUrl;
    } catch (directError) {
      console.warn("Could not reach API server directly, trying through main server:", directError);
      
      // Try through the main server proxy
      try {
        const response = await axios.post('/api/generate-image', {
          prompt,
          image_generator_version,
          negative_prompt
        });
        return response.data.imageUrl;
      } catch (proxyError) {
        console.warn("Could not reach API through proxy, using fallback:", proxyError);
        
        // Fallback to Unsplash if both attempts fail
        return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`;
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};