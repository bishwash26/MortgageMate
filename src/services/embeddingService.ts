export class EmbeddingService {
  private static readonly OPENAI_API_URL = 'https://api.openai.com/v1/embeddings';
  
  static async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not provided, using mock embedding');
      // Return mock embedding for development
      return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
    }

    try {
      const response = await fetch(this.OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-ada-002',
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return mock embedding as fallback
      return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
    }
  }

  static async generateChatResponse(query: string, context: string): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      return `Mock response for query: "${query}". In a real implementation, this would use the context: "${context.substring(0, 100)}..." to provide relevant answers.`;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that answers questions about bank policies. Use the following context to answer questions: ${context}`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat response:', error);
      return `I apologize, but I'm having trouble processing your request right now. Please try again later.`;
    }
  }
}