# Synteza: @ai-sdk/openai-compatible + Custom Providers

## 1. @ai-sdk/openai-compatible
- Lekki provider OpenAI API-compatible (bez eksperymentalnych/legacy OpenAI features)
- Instalacja: `npm i @ai-sdk/openai-compatible`
- Import: `import { createOpenAICompatible } from '@ai-sdk/openai-compatible'`
- Użycie:  
  - `generateText({ model: createOpenAICompatible({ baseURL, name, apiKey }).chatModel('model-id'), prompt })`
- Możliwość własnych nagłówków (headers)
- Typowanie model-id (chat/completion/embedding) dla podpowiedzi/autouzupełniania
- Repo: https://github.com/vercel/ai
- Dokumentacja: https://ai-sdk.dev/providers/openai-compatible-providers

## 2. Tworzenie własnego providera (custom provider)
- Własny pakiet npm, oparty o @ai-sdk/openai-compatible
- Struktura:
  - src/example-chat-settings.ts (typy modeli, settings)
  - src/example-provider.ts (implementacja providera)
  - src/index.ts (eksporty)
  - package.json, tsconfig.json, tsup.config.ts, README.md
- Kluczowe pliki:
  - *example-chat-settings.ts*: typy model-id, interfejs settings (rozszerza OpenAICompatibleChatSettings)
  - *example-provider.ts*:  
    - import klas z @ai-sdk/openai-compatible i @ai-sdk/provider  
    - interfejs ExampleProviderSettings (apiKey, baseURL, headers, queryParams, fetch)
    - funkcje: createChatModel, createCompletionModel, createTextEmbeddingModel, createImageModel
    - provider: funkcja z metodami .chatModel, .completionModel, .textEmbeddingModel, .imageModel
    - eksport: createExample, example
  - *index.ts*: eksportuje createExample, example, typy
  - *package.json*: zależności: @ai-sdk/openai-compatible, @ai-sdk/provider, @ai-sdk/provider-utils
- Użycie:  
  - `import { example } from '@company-name/example'`
  - `generateText({ model: example('example/chat-model-1'), prompt })`
- Internal API:  
  - `import { convertToOpenAICompatibleChatMessages } from '@ai-sdk/openai-compatible/internal'`
  - Szczegóły: patrz kod źródłowy na github.com/vercel/ai

## 3. Podsumowanie
- Typowanie model-id
- Własne endpointy, nagłówki, query params, fetch
- Pełna zgodność z AI SDK
- Czysta, typowana implementacja providera