export const handler = async (event) => {
  const apiKey = process.env.VITE_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server API Key not configured." })
    };
  }

  const { search_value, include_completed } = event.queryStringParameters || {};

  if (!search_value) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing search_value" }) };
  }

  const url = new URL('https://starlinksapi.app/api/v1/shipments/get-list');
  url.searchParams.append('search_value', search_value);
  if (include_completed) url.searchParams.append('include_completed', include_completed);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Or restrict to your Netlify domain
      },
      body: data
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
