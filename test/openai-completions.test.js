const axios = require('axios');

const apiUrl = 'http://localhost:3000';

async function checkServerRunning() {
  const checkResponse = await axios.get(`${apiUrl}/`);
  if (checkResponse.data && checkResponse.data.message === 'pptr-gpt api running') {
    console.log('Server is running:', checkResponse.data);
  } else {
    throw new Error('Server did not respond as expected to GET /');
  }
}

function getRandomArithmetic() {
  const ops = [
    { op: '+', word: 'plus', fn: (a, b) => a + b },
    { op: '-', word: 'minus', fn: (a, b) => a - b },
    { op: '*', word: 'times', fn: (a, b) => a * b }
  ];
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const opIdx = Math.floor(Math.random() * ops.length);
  const { word, fn } = ops[opIdx];
  const question = `what is ${a} ${word} ${b} ?`;
  const expected = fn(a, b);
  return { question, expected };
}

async function testOpenAICompletions(question, expected, idx) {
  const body = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: question }
    ]
  };
  const headers = {
    Authorization: "Bearer testtoken"
  };
  const resp = await axios.post(`${apiUrl}/v1/chat/completions`, body, { headers });
  if (!resp.data || !resp.data.choices || !Array.isArray(resp.data.choices)) {
    throw new Error("POST /chat/completions did not return expected choices array");
  }
  const choice = resp.data.choices[0];
  if (!choice || !choice.message || choice.message.role !== "assistant") {
    throw new Error("Response does not contain assistant message");
  }
  if (typeof choice.message.content !== "string") {
    throw new Error("Assistant message content is not a string");
  }
  if (!resp.data.usage || typeof resp.data.usage.total_tokens !== "number") {
    throw new Error("Response missing usage.total_tokens");
  }
  console.log(`Q${idx + 1}: "${question}" => ${choice.message.content} (ok)`);
}

(async () => {
  try {
    await checkServerRunning();

    const { question, expected } = getRandomArithmetic();
    await testOpenAICompletions(question, expected, 0);

    console.log('Test passed.');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
})();