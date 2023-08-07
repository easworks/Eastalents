import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenAIApi {
  private readonly devMode = isDevMode();
  private readonly apiUrl = 'https://api.openai.com/v1'
  private readonly apiKey = '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';
  private readonly chatModel = 'gpt-3.5-turbo'

  private readonly headers = new Headers({
    'authorization': `bearer ${this.apiKey}`
  });

  async chat(messages: OpenAIChatMessage[]) {
    const res = await fetch(`${this.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        model: this.chatModel,
        messages
      })
    });
    await this.handleErrorsIfAny(res);

    const response = await res.json();
    return response.choices[0] as OpenAIChatMessage;
  }

  private async handleErrorsIfAny(response: Response) {
    if (!response.ok) {
      const body = await response.json();
      if (this.devMode) {
        console.error(body);
      }
      throw body;
    }
  }

}

export interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant',
  content: string
}
