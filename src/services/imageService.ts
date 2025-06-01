import axios from "axios";

interface ImageGenerationOptions {
  prompt: string;
  image_generator_version?: "standard" | "hd" | "genius";
  negative_prompt?: string;
}

// Mock image generation service that returns placeholder images
export const generateImage = async ({
  prompt,
  image_generator_version = "standard",
  negative_prompt
}: ImageGenerationOptions) => {
  try {
    // Return a placeholder image URL based on the prompt
    return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(prompt)}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};