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

async function testArithmeticQuestion(question, expected, idx) {
  // Only ask the question once per test
  const resp = await axios.post(`${apiUrl}/ask`, { question });
  if (!resp.data || typeof resp.data.answer !== 'string') {
    throw new Error(`POST /ask did not return expected answer field for question "${question}"`);
  }
  // Extract last number in answer string (should be result)
  const matches = [...resp.data.answer.matchAll(/-?\d+(\.\d+)?/g)];
  if (!matches.length) {
    throw new Error(`Answer did not contain a number for question "${question}": ${resp.data.answer}`);
  }
  const answerNum = parseFloat(matches[matches.length - 1][0]);
  if (answerNum !== expected) {
    throw new Error(`Incorrect answer for "${question}". Expected ${expected}, got ${answerNum} (raw: ${resp.data.answer})`);
  }
  console.log(`Q${idx + 1}: "${question}" => ${answerNum} (ok)`);
}

(async () => {
  try {
    await checkServerRunning();

    // Only a single question per whole test
    const { question, expected } = getRandomArithmetic();
    await testArithmeticQuestion(question, expected, 0);

    console.log('Test passed.');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
})();