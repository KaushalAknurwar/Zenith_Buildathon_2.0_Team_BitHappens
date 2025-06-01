interface ImageGenerationOptions {
  prompt: string;
  image_generator_version?: "standard" | "hd" | "genius";
  negative_prompt?: string;
}

// Generate images using Unsplash API
export const generateImage = async ({
  prompt,
  image_generator_version = "standard",
  negative_prompt
}: ImageGenerationOptions): Promise<string> => {
  try {
    // Use Unsplash source for random images based on the prompt
    // This is a reliable service that works in production environments
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://source.unsplash.com/random/800x600/?${encodedPrompt}`;
    
    // Add a cache-busting parameter to ensure we get a new image each time
    const cacheBuster = Date.now();
    return `${imageUrl}&cb=${cacheBuster}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};