import { logger } from './logger';
import config from '@/../config.json';

interface Message {
  role: string;
  content: string;
}

interface AzureRequestBody {
  messages: Message[];
  max_tokens: number;
  temperature: number;
  stream: boolean;
}

interface ContentFilterSeverity {
  filtered: boolean;
  severity: string;
}

interface ContentFilterResults {
  hate: ContentFilterSeverity;
  self_harm: ContentFilterSeverity;
  sexual: ContentFilterSeverity;
  violence: ContentFilterSeverity;
}

interface Delta {
  content: string;
}

interface Choice {
  content_filter_results: ContentFilterResults;
  delta: Delta;
  finish_reason: string | null;
  index: number;
}

interface Data {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  system_fingerprint: string;
}

export async function sendAIRequest(
  text: string,
  onData?: (data: string) => void
): Promise<any> {
  let headers: HeadersInit;
  let body: string;

  headers = {
    'Content-Type': 'application/json',
    'api-key': config.apiKey,
  };
  const azureRequestBody: AzureRequestBody = {
    messages: [
      {
        role: 'system',
        content:
          'You are an assistant. Please answer my question with plain text.',
      },
      { role: 'user', content: text },
    ],
    max_tokens: 1024,
    temperature: 0.7,
    stream: true,
  };
  body = JSON.stringify(azureRequestBody);

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let result = '';

    while (true && reader) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const lines = decoder.decode(value, { stream: true }).split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonString = line.trim().substring(6).trim();
          if (jsonString) {
            try {
              const resObj = JSON.parse(jsonString) as Data;
              if (
                resObj.choices &&
                resObj.choices[0] &&
                resObj.choices[0].delta
              ) {
                result += resObj.choices[0].delta.content || '';
                logger.log(result);
                onData?.(result);
              } else {
                logger.error('Delta property is missing in the response');
              }
            } catch (error: any) {
              logger.error(`Failed to parse JSON: ${error.message}`);
            }
          }
        }
      }
    }
    return result;
  } catch (error: any) {
    throw new Error(`Request failed: ${error.message}`);
  }
}
