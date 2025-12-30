import axios from 'axios';

const API_BASE_URL = 'https://starlinksapi.app/api/v1/shipments/get-list';
const API_HISTORY_URL = 'https://starlinksapi.app/api/v1/shipment/history';
const API_KEY = '399c08024f1f5206d6eef361c1203394d3be9763';
const trackNumber = 'S0005463499';

async function test() {
    try {
        const listResponse = await axios.get(API_BASE_URL, {
            params: { search_value: trackNumber, include_completed: true },
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('--- List API Response ---');
        console.log(JSON.stringify(listResponse.data, null, 2));

        const historyResponse = await axios.get(`${API_HISTORY_URL}?api_key=${API_KEY}&tracking_number=${trackNumber}`);
        console.log('\n--- History API Response ---');
        console.log(JSON.stringify(historyResponse.data, null, 2));

    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
