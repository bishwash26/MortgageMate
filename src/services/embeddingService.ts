export class EmbeddingService {
  static async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.warn('Google API key not provided, using mock embedding');
      // Return mock embedding for development (768 dimensions for text-embedding-004)
      return Array.from({ length: 768 }, () => Math.random() * 2 - 1);
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: {
            parts: [
              {
                text: text
              }
            ]
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Google Embedding API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.embedding.values;
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return mock embedding as fallback (768 dimensions for text-embedding-004)
      return Array.from({ length: 768 }, () => Math.random() * 2 - 1);
    }
  }

  static async generateChatResponse(query: string, context: string, historyMessage: string): Promise<string> {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!apiKey) {
      return `Mock response for query: "${query}". In a real implementation, this would use the context: "${context.substring(0, 100)}..." to provide relevant answers.`;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful assistant that answers questions about bank policies and mortgage information. Use the following context to answer questions accurately and helpfully.

Context: ${context},
Previous User Messages: ${historyMessage},

Question: ${query}

Please provide a clear and helpful answer based on the context provided.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating chat response:', error);
      return `I apologize, but I'm having trouble processing your request right now. Please try again later.`;
    }
  }
}