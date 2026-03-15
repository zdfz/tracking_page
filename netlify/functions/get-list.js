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

    let rawData = await response.json();

    // Helper function to mask PII
    const maskString = (str, type = 'name') => {
      if (!str) return '---';
      if (type === 'phone') {
        if (str.length < 8) return '******';
        return str.substring(0, 7) + '******' + str.substring(str.length - 2);
      }
      if (type === 'name') {
        return str.split(' ').map(part => {
          if (part.length < 2) return part;
          return part[0] + '***';
        }).join(' ');
      }
      if (type === 'address') {
        if (str.length < 10) return str;
        return str.substring(0, 5) + '******';
      }
      if (type === 'email') {
        const [username, domain] = str.split('@');
        if (!domain) return '******';
        return username.charAt(0) + '****@' + domain;
      }
      return str;
    };

    // Mask the payload
    if (Array.isArray(rawData)) {
      rawData = rawData.map(shipment => {
        // Mask main customer name
        if (shipment.customer_name) {
          shipment.customer_name = maskString(shipment.customer_name, 'name');
        }

        // Mask Consignee Address object
        if (shipment.consignee_address) {
          if (shipment.consignee_address.name) shipment.consignee_address.name = maskString(shipment.consignee_address.name, 'name');
          if (shipment.consignee_address.phone) shipment.consignee_address.phone = maskString(shipment.consignee_address.phone, 'phone');
          if (shipment.consignee_address.email) shipment.consignee_address.email = maskString(shipment.consignee_address.email, 'email');
          if (shipment.consignee_address.address1) shipment.consignee_address.address1 = maskString(shipment.consignee_address.address1, 'address');
          if (shipment.consignee_address.address2) shipment.consignee_address.address2 = maskString(shipment.consignee_address.address2, 'address');
        }

        // Mask Shipper Address object
        if (shipment.shipper_address) {
          if (shipment.shipper_address.name) shipment.shipper_address.name = maskString(shipment.shipper_address.name, 'name');
          if (shipment.shipper_address.phone) shipment.shipper_address.phone = maskString(shipment.shipper_address.phone, 'phone');
          if (shipment.shipper_address.email) shipment.shipper_address.email = maskString(shipment.shipper_address.email, 'email');
          if (shipment.shipper_address.address1) shipment.shipper_address.address1 = maskString(shipment.shipper_address.address1, 'address');
          if (shipment.shipper_address.address2) shipment.shipper_address.address2 = maskString(shipment.shipper_address.address2, 'address');
        }

        return shipment;
      });
    }

    return {
      statusCode: response.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Or restrict to your Netlify domain
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
