export async function handler(event, context) {
  // Handle API requests here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "API endpoint" })
  };
}