
export interface Address {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  address1?: string;
  address2?: string;
}

export interface Parcel {
  description?: string;
  warehouse?: string;
  product_sku?: string;
  product_description?: string;
  product_price?: string;
  product_currency?: string;
  product_quantity?: number | string;
  product_image_url?: string;
}

export interface HistoryEvent {
  event_date: string;
  event_name: string;
  event_location?: string;
  event_description?: string;
}

export interface Timeline {
  first_hub_scan: string;
  ofd_time: string;
  first_delivery_attempt: string;
  last_delivery_attempt: string;
  delivered_time: string;
}

export interface Shipment {
  status?: string;
  track_number?: string;
  customer_name?: string;
  service_code?: string;
  order_reference?: string;
  customer_id_reference?: string;
  invoice?: string;
  description?: string;
  rgr_number?: string;
  export_entry_number?: string;
  incoterm?: string;
  currency?: string;
  price?: string;
  cod_value?: string;
  cod_currency?: string;
  is_dangerous?: boolean | string;
  category?: string;
  label_format?: string;
  display_id?: string;
  pudo_id?: string;
  estimated_delivery_date?: string;
  scheduled_delivery_date?: string;
  consignee_address?: Address;
  shipper_address?: Address;
  parcels?: Parcel[];
  // Added fields
  timeline?: Timeline;
  history?: HistoryEvent[];
  shipment_type?: string;
  order_weight?: string | number;
}

export interface APIResult {
  success: boolean;
  data: Shipment[] | null;
  error: string | null;
}
