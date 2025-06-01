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
    // Try Netlify function directly first
    try {
      const response = await axios.post('/.netlify/functions/api/generate-image', {
        prompt,
        image_generator_version,
        negative_prompt
      });
      
      if (response.data && response.data.imageUrl) {
        return response.data.imageUrl;
      }
      throw new Error("No image URL in response");
    } catch (netlifyError) {
      console.warn("Could not reach Netlify function, trying API endpoint:", netlifyError);
      
      // Try through the API endpoint
      try {
        const response = await axios.post('/api/generate-image', {
          prompt,
          image_generator_version,
          negative_prompt
        });
        
        if (response.data && response.data.imageUrl) {
          return response.data.imageUrl;
        }
        throw new Error("No image URL in response");
      } catch (apiError) {
        console.warn("Could not reach API endpoint, using Unsplash fallback:", apiError);
        
        // Use Unsplash as fallback
        return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`;
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
    // Final fallback
    return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`;
  }
}