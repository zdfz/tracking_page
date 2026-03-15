export const handler = async (event) => {
  const apiKey = process.env.VITE_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server API Key not configured." })
    };
  }

  const { tracking_number } = event.queryStringParameters || {};

  if (!tracking_number) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing tracking_number" }) };
  }

  const url = new URL('https://starlinksapi.app/api/v1/shipment/history');
  url.searchParams.append('tracking_number', tracking_number);
  url.searchParams.append('api_key', apiKey); // The Starlinks API requires this securely appended from the server

  try {
    const response = await fetch(url.toString());
    let rawData = await response.json();

    // The History API returns an object where the key is the tracking number and the value is the array of events
    // Example: { "S0005747286": [{ event_name: "Delivered", event_location: "Riyadh" }] }
    
    // We will just pass it through, as event history typically doesn't contain PII (names, phone numbers).
    // If we wanted to mask locations, we could do it here, but event locations are usually public hub names.

    return {
      statusCode: response.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(rawData)
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
