const axios = require('axios');

const apiUrl = 'http://localhost:3000';

(async () => {
  try {
    // 1. Check if server is running
    const checkResponse = await axios.get(`${apiUrl}/`);
    if (checkResponse.data && checkResponse.data.message === 'pptr-gpt api running') {
      console.log('Server is running:', checkResponse.data);
    } else {
      throw new Error('Server did not respond as expected to GET /');
    }

    // 2. Ask "who are you"
    const askResponse = await axios.post(`${apiUrl}/ask`, {
      question: 'who are you'
    });

    if (askResponse.data && typeof askResponse.data.answer === 'string') {
      console.log('Answer to "who are you":', askResponse.data.answer);
    } else {
      throw new Error('POST /ask did not return expected answer field');
    }

    console.log('Test passed.');

  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
    process.exit(1);
  }
})();