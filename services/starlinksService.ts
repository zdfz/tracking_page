
import axios from 'axios';
import { API_BASE_URL, API_HISTORY_URL, API_KEY, REQUEST_TIMEOUT, MAX_RETRIES } from '../constants';
import { APIResult, HistoryEvent, Timeline } from '../types';



export function extractTimeline(historyEvents: HistoryEvent[]): Timeline {
  if (!Array.isArray(historyEvents) || historyEvents.length === 0) {
    return {
      first_hub_scan: '',
      ofd_time: '',
      first_delivery_attempt: '',
      last_delivery_attempt: '',
      delivered_time: ''
    };
  }

  const parseDt = (s: string) => new Date((s || '').replace(' ', 'T')).getTime();
  const byAsc = [...historyEvents].sort((a, b) => parseDt(a.event_date) - parseDt(b.event_date));
  const byDesc = [...byAsc].reverse();

  const firstHub = byAsc.find(ev => (ev.event_name || '').toLowerCase().match(/hub|facility|arrival|scan/));
  const ofd = byAsc.find(ev => (ev.event_name || '').toLowerCase().match(/ofd|out.*delivery/));
  const firstAttempt = byAsc.find(ev => (ev.event_name || '').toLowerCase().includes('attempt'));
  const lastAttempt = byDesc.find(ev => (ev.event_name || '').toLowerCase().includes('attempt'));
  const delivered = byDesc.find(ev => (ev.event_name || '').toLowerCase() === 'delivered');

  return {
    first_hub_scan: firstHub?.event_date || '',
    ofd_time: ofd?.event_date || '',
    first_delivery_attempt: firstAttempt?.event_date || '',
    last_delivery_attempt: lastAttempt?.event_date || '',
    delivered_time: delivered?.event_date || ''
  };
}

export async function fetchShipmentHistory(trackNumber: string): Promise<HistoryEvent[]> {
  try {
    const url = `${API_HISTORY_URL}?api_key=${API_KEY}&tracking_number=${encodeURIComponent(trackNumber)}`;
    const response = await axios.get(url, { timeout: REQUEST_TIMEOUT });
    const data = response.data;
    // The API returns an object where the key is the tracking number
    if (data && data[trackNumber] && Array.isArray(data[trackNumber])) {
      return data[trackNumber];
    }
    return [];
  } catch (err) {
    console.error(`History API failed for ${trackNumber}:`, err);
    return [];
  }
}

export async function queryStarlinksAPI(searchValue: string, retryCount = 0): Promise<APIResult> {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: { search_value: searchValue, include_completed: true },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: REQUEST_TIMEOUT
    });

    const shipments = response.data || [];
    return { success: true, data: shipments, error: null };
  } catch (e: any) {
    if (retryCount < MAX_RETRIES - 1) {
      await new Promise(r => setTimeout(r, Math.min(1500 * 2 ** retryCount, 6000)));
      return queryStarlinksAPI(searchValue, retryCount + 1);
    }

    let msg = 'Unknown error';
    if (e.code === 'ECONNABORTED') {
      msg = 'Connection timeout. Please check your internet and try again.';
    } else if (e.response) {
      if (e.response.status === 404) msg = 'Shipment not found. Please check the tracking number and try again.';
      else if (e.response.status === 422) msg = 'Invalid tracking number format. Please check and try again.';
      else if (e.response.status === 401 || e.response.status === 403) msg = 'System error: API access denied. Contact support.';
      else msg = `HTTP ${e.response.status}: ${e.response.statusText}`;
    } else if (e.request) {
      msg = 'Network error. Please check your internet connection.';
    } else {
      msg = e.message || 'Request failed - please try again';
    }

    return { success: false, data: null, error: msg };
  }
}
