OpenAI Compatible Providers: Writing a Custom Provider
[](https://vercel.com/)

[

AI SDK



](/)

*   [Docs](/docs)
*   [Cookbook](/cookbook)
*   [Providers](/providers)
*   [Showcase](/showcase)
*   [Playground](/playground)
*   [Model Library](/model-library)

Announcing AI SDK 5 Alpha!

[Learn more](https://ai-sdk.dev/docs/announcing-ai-sdk-5-alpha)

Menu

[AI SDK Providers](/providers/ai-sdk-providers)

[xAI Grok](/providers/ai-sdk-providers/xai)

[Vercel](/providers/ai-sdk-providers/vercel)

[OpenAI](/providers/ai-sdk-providers/openai)

[Azure OpenAI](/providers/ai-sdk-providers/azure)

[Anthropic](/providers/ai-sdk-providers/anthropic)

[Amazon Bedrock](/providers/ai-sdk-providers/amazon-bedrock)

[Groq](/providers/ai-sdk-providers/groq)

[Fal](/providers/ai-sdk-providers/fal)

[DeepInfra](/providers/ai-sdk-providers/deepinfra)

[Google Generative AI](/providers/ai-sdk-providers/google-generative-ai)

[Google Vertex AI](/providers/ai-sdk-providers/google-vertex)

[Mistral AI](/providers/ai-sdk-providers/mistral)

[Together.ai](/providers/ai-sdk-providers/togetherai)

[Cohere](/providers/ai-sdk-providers/cohere)

[Fireworks](/providers/ai-sdk-providers/fireworks)

[DeepSeek](/providers/ai-sdk-providers/deepseek)

[Cerebras](/providers/ai-sdk-providers/cerebras)

[Replicate](/providers/ai-sdk-providers/replicate)

[Perplexity](/providers/ai-sdk-providers/perplexity)

[Luma](/providers/ai-sdk-providers/luma)

[ElevenLabs](/providers/ai-sdk-providers/elevenlabs)

[AssemblyAI](/providers/ai-sdk-providers/assemblyai)

[Deepgram](/providers/ai-sdk-providers/deepgram)

[Gladia](/providers/ai-sdk-providers/gladia)

[LMNT](/providers/ai-sdk-providers/lmnt)

[Hume](/providers/ai-sdk-providers/hume)

[Rev.ai](/providers/ai-sdk-providers/revai)

[OpenAI Compatible Providers](/providers/openai-compatible-providers)

[Writing a Custom Provider](/providers/openai-compatible-providers/custom-providers)

[LM Studio](/providers/openai-compatible-providers/lmstudio)

[NVIDIA NIM](/providers/openai-compatible-providers/nim)

[Baseten](/providers/openai-compatible-providers/baseten)

[Community Providers](/providers/community-providers)

[Writing a Custom Provider](/providers/community-providers/custom-providers)

[Qwen](/providers/community-providers/qwen)

[Ollama](/providers/community-providers/ollama)

[Chrome AI](/providers/community-providers/chrome-ai)

[Requesty](/providers/community-providers/requesty)

[FriendliAI](/providers/community-providers/friendliai)

[Portkey](/providers/community-providers/portkey)

[Cloudflare Workers AI](/providers/community-providers/cloudflare-workers-ai)

[Cloudflare AI Gateway](/providers/community-providers/cloudflare-ai-gateway)

[OpenRouter](/providers/community-providers/openrouter)

[Azure AI](/providers/community-providers/azure-ai)

[Crosshatch](/providers/community-providers/crosshatch)

[Mixedbread](/providers/community-providers/mixedbread)

[Voyage AI](/providers/community-providers/voyage-ai)

[Mem0](/providers/community-providers/mem0)

[Letta](/providers/community-providers/letta)

[LLamaCpp](/providers/community-providers/llama-cpp)

[Anthropic Vertex](/providers/community-providers/anthropic-vertex-ai)

[Spark](/providers/community-providers/spark)

[Inflection AI](/providers/community-providers/inflection-ai)

[LangDB](/providers/community-providers/langdb)

[Zhipu AI](/providers/community-providers/zhipu)

[SambaNova](/providers/community-providers/sambanova)

[Dify](/providers/community-providers/dify)

[Sarvam](/providers/community-providers/sarvam)

[Adapters](/providers/adapters)

[LangChain](/providers/adapters/langchain)

[LlamaIndex](/providers/adapters/llamaindex)

[Observability Integrations](/providers/observability)

[Braintrust](/providers/observability/braintrust)

[Helicone](/providers/observability/helicone)

[Laminar](/providers/observability/laminar)

[Langfuse](/providers/observability/langfuse)

[LangSmith](/providers/observability/langsmith)

[LangWatch](/providers/observability/langwatch)

[Patronus](/providers/observability/patronus)

[Traceloop](/providers/observability/traceloop)

[Weave](/providers/observability/weave)

[OpenAI Compatible Providers](/providers/openai-compatible-providers)Writing a Custom Provider

[Writing a Custom Provider](#writing-a-custom-provider)
=======================================================

You can create your own provider package that leverages the AI SDK's [OpenAI Compatible package](https://www.npmjs.com/package/@ai-sdk/openai-compatible). Publishing your provider package to [npm](https://www.npmjs.com/) can give users an easy way to use the provider's models and stay up to date with any changes you may have. Here's an example structure:

### [File Structure](#file-structure)

    packages/example/├── src/│   ├── example-chat-settings.ts       # Chat model types and settings│   ├── example-completion-settings.ts # Completion model types and settings│   ├── example-embedding-settings.ts  # Embedding model types and settings│   ├── example-image-settings.ts      # Image model types and settings│   ├── example-provider.ts            # Main provider implementation│   ├── example-provider.test.ts       # Provider tests│   └── index.ts                       # Public exports├── package.json├── tsconfig.json├── tsup.config.ts                     # Build configuration└── README.md

### [Key Files](#key-files)

1.  **example-chat-settings.ts** - Define chat model IDs and settings:

    import { OpenAICompatibleChatSettings } from '@ai-sdk/openai-compatible';
    export type ExampleChatModelId =  | 'example/chat-model-1'  | 'example/chat-model-2'  | (string & {});
    export interface ExampleChatSettings extends OpenAICompatibleChatSettings {  // Add any custom settings here}

The completion, embedding, and image settings are implemented similarly to the chat settings.

2.  **example-provider.ts** - Main provider implementation:

    import { LanguageModelV1, EmbeddingModelV1 } from '@ai-sdk/provider';import {  OpenAICompatibleChatLanguageModel,  OpenAICompatibleCompletionLanguageModel,  OpenAICompatibleEmbeddingModel,  OpenAICompatibleImageModel,} from '@ai-sdk/openai-compatible';import {  FetchFunction,  loadApiKey,  withoutTrailingSlash,} from '@ai-sdk/provider-utils';// Import your model id and settings here.
    export interface ExampleProviderSettings {  /**Example API key.*/  apiKey?: string;  /**Base URL for the API calls.*/  baseURL?: string;  /**Custom headers to include in the requests.*/  headers?: Record<string, string>;  /**Optional custom url query parameters to include in request urls.*/  queryParams?: Record<string, string>;  /**Custom fetch implementation. You can use it as a middleware to intercept requests,or to provide a custom fetch implementation for e.g. testing.*/  fetch?: FetchFunction;}
    export interface ExampleProvider {  /**Creates a model for text generation.*/  (    modelId: ExampleChatModelId,    settings?: ExampleChatSettings,  ): LanguageModelV1;
      /**Creates a chat model for text generation.*/  chatModel(    modelId: ExampleChatModelId,    settings?: ExampleChatSettings,  ): LanguageModelV1;
      /**Creates a completion model for text generation.*/  completionModel(    modelId: ExampleCompletionModelId,    settings?: ExampleCompletionSettings,  ): LanguageModelV1;
      /**Creates a text embedding model for text generation.*/  textEmbeddingModel(    modelId: ExampleEmbeddingModelId,    settings?: ExampleEmbeddingSettings,  ): EmbeddingModelV1<string>;
      /**Creates an image model for image generation.*/  imageModel(    modelId: ExampleImageModelId,    settings?: ExampleImageSettings,  ): ImageModelV1;}
    export function createExample(  options: ExampleProviderSettings = {},): ExampleProvider {  const baseURL = withoutTrailingSlash(    options.baseURL ?? 'https://api.example.com/v1',  );  const getHeaders = () => ({    Authorization: `Bearer ${loadApiKey({      apiKey: options.apiKey,      environmentVariableName: 'EXAMPLE_API_KEY',      description: 'Example API key',    })}`,    ...options.headers,  });
      interface CommonModelConfig {    provider: string;    url: ({ path }: { path: string }) => string;    headers: () => Record<string, string>;    fetch?: FetchFunction;  }
      const getCommonModelConfig = (modelType: string): CommonModelConfig => ({    provider: `example.${modelType}`,    url: ({ path }) => {      const url = new URL(`${baseURL}${path}`);      if (options.queryParams) {        url.search = new URLSearchParams(options.queryParams).toString();      }      return url.toString();    },    headers: getHeaders,    fetch: options.fetch,  });
      const createChatModel = (    modelId: ExampleChatModelId,    settings: ExampleChatSettings = {},  ) => {    return new OpenAICompatibleChatLanguageModel(modelId, settings, {      ...getCommonModelConfig('chat'),      defaultObjectGenerationMode: 'tool',    });  };
      const createCompletionModel = (    modelId: ExampleCompletionModelId,    settings: ExampleCompletionSettings = {},  ) =>    new OpenAICompatibleCompletionLanguageModel(      modelId,      settings,      getCommonModelConfig('completion'),    );
      const createTextEmbeddingModel = (    modelId: ExampleEmbeddingModelId,    settings: ExampleEmbeddingSettings = {},  ) =>    new OpenAICompatibleEmbeddingModel(      modelId,      settings,      getCommonModelConfig('embedding'),    );
      const createImageModel = (    modelId: ExampleImageModelId,    settings: ExampleImageSettings = {},  ) =>    new OpenAICompatibleImageModel(      modelId,      settings,      getCommonModelConfig('image'),    );
      const provider = (    modelId: ExampleChatModelId,    settings?: ExampleChatSettings,  ) => createChatModel(modelId, settings);
      provider.completionModel = createCompletionModel;  provider.chatModel = createChatModel;  provider.textEmbeddingModel = createTextEmbeddingModel;  provider.imageModel = createImageModel;
      return provider;}
    // Export default instanceexport const example = createExample();

3.  **index.ts** - Public exports:

    export { createExample, example } from './example-provider';export type {  ExampleProvider,  ExampleProviderSettings,} from './example-provider';

4.  **package.json** - Package configuration:

    {  "name": "@company-name/example",  "version": "0.0.1",  "dependencies": {    "@ai-sdk/openai-compatible": "^0.0.7",    "@ai-sdk/provider": "^1.0.2",    "@ai-sdk/provider-utils": "^2.0.4",    // ...additional dependencies  },  // ...additional scripts and module build configuration}

### [Usage](#usage)

Once published, users can use your provider like this:

    import { example } from '@company-name/example';import { generateText } from 'ai';
    const { text } = await generateText({  model: example('example/chat-model-1'),  prompt: 'Hello, how are you?',});

This structure provides a clean, type-safe implementation that leverages the OpenAI Compatible package while maintaining consistency with the usage of other AI SDK providers.

### [Internal API](#internal-api)

As you work on your provider you may need to use some of the internal API of the OpenAI Compatible package. You can import these from the `@ai-sdk/openai-compatible/internal` package, for example:

    import { convertToOpenAICompatibleChatMessages } from '@ai-sdk/openai-compatible/internal';

You can see the latest available exports in the AI SDK [GitHub repository](https://github.com/vercel/ai/blob/main/packages/openai-compatible/src/internal/index.ts).

On this page

[Writing a Custom Provider](#writing-a-custom-provider)

[File Structure](#file-structure)

[Key Files](#key-files)

[Usage](#usage)

[Internal API](#internal-api)

Elevate your AI applications with Vercel.

Trusted by OpenAI, Replicate, Suno, Pinecone, and more.

Vercel provides tools and infrastructure to deploy AI apps and features at scale.

[Talk to an expert](https://vercel.com/contact/sales?utm_source=ai_sdk&utm_medium=web&utm_campaign=contact_sales_cta&utm_content=talk_to_an_expert_sdk_docs)

#### Resources

[Docs](/docs)[Cookbook](/cookbook)[Providers](/providers)[Showcase](/showcase)[GitHub](https://github.com/vercel/ai)[Discussions](https://github.com/vercel/ai/discussions)

#### More

[Playground](/playground)[](https://v0.dev)[Contact Sales](https://vercel.com/contact/sales)

#### About Vercel

[Next.js + Vercel](https://vercel.com/frameworks/nextjs)[Open Source Software](https://vercel.com/oss)[GitHub](https://github.com/vercel)[X](https://x.com/vercel)

#### Legal

[Privacy Policy](https://vercel.com/legal/privacy-policy)

© 2025 Vercel, Inc.
