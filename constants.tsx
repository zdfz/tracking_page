
export const API_BASE_URL = 'https://starlinksapi.app/api/v1/shipments/get-list';
export const API_HISTORY_URL = 'https://starlinksapi.app/api/v1/shipment/history';
export const API_KEY = '399c08024f1f5206d6eef361c1203394d3be9763';
export const REQUEST_TIMEOUT = 10000;
export const MAX_RETRIES = 3;

export const FIELD_MAPPING = [
  { key: 'track_number', label: 'Track Number' },
  { key: 'status', label: 'Status' },
  { key: 'customer_name', label: 'Customer Name' },
  { key: 'service_code', label: 'Service Code' },
  { key: 'order_reference', label: 'Order Reference' },
  { key: 'customer_id_reference', label: 'Customer ID Reference' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'description', label: 'Description' },
  { key: 'rgr_number', label: 'RGR Number' },
  { key: 'export_entry_number', label: 'Export Entry Number' },
  { key: 'incoterm', label: 'Incoterm' },
  { key: 'currency', label: 'Currency' },
  { key: 'price', label: 'Price' },
  { key: 'cod_value', label: 'COD Value' },
  { key: 'cod_currency', label: 'COD Currency' },
  { key: 'is_dangerous', label: 'Is Dangerous' },
  { key: 'category', label: 'Category' },
  { key: 'label_format', label: 'Label Format' },
  { key: 'display_id', label: 'Display ID' },
  { key: 'pudo_id', label: 'PUDO ID' },
  { key: 'estimated_delivery_date', label: 'Estimated Delivery Date' },
  { key: 'scheduled_delivery_date', label: 'Scheduled Delivery Date' },
];

export const TIMELINE_LABELS = [
  { key: 'first_hub_scan', label: 'First Hub Scan' },
  { key: 'ofd_time', label: 'Out For Delivery' },
  { key: 'first_delivery_attempt', label: 'First Delivery Attempt' },
  { key: 'last_delivery_attempt', label: 'Last Delivery Attempt' },
  { key: 'delivered_time', label: 'Delivered Time' },
];

export const CONSIGNEE_FIELDS = [
  { key: 'name', label: 'Consignee Name' },
  { key: 'phone', label: 'Consignee Phone' },
  { key: 'email', label: 'Consignee Email' },
  { key: 'city', label: 'Consignee City' },
  { key: 'state', label: 'Consignee State' },
  { key: 'country', label: 'Consignee Country' },
  { key: 'zip', label: 'Consignee Zip' },
  { key: 'address1', label: 'Consignee Address 1' },
  { key: 'address2', label: 'Consignee Address 2' },
];

export const SHIPPER_FIELDS = [
  { key: 'name', label: 'Shipper Name' },
  { key: 'phone', label: 'Shipper Phone' },
  { key: 'email', label: 'Shipper Email' },
  { key: 'city', label: 'Shipper City' },
  { key: 'country', label: 'Shipper Country' },
  { key: 'zip', label: 'Shipper Zip' },
  { key: 'address1', label: 'Shipper Address 1' },
  { key: 'address2', label: 'Shipper Address 2' },
];

export const PARCEL_FIELDS = [
  { key: 'description', label: 'Parcel Description' },
  { key: 'warehouse', label: 'Parcel Warehouse' },
  { key: 'product_sku', label: 'Product SKU' },
  { key: 'product_description', label: 'Product Description' },
  { key: 'product_price', label: 'Product Price' },
  { key: 'product_currency', label: 'Product Currency' },
  { key: 'product_quantity', label: 'Product Quantity' },
];
