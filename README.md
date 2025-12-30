# Tracking Page

A modern, responsive shipment tracking application with visual progress tracking and detailed status history.

---

## 1. Progress Bar Stages (Visual Stepper)

The system groups statuses into **5 distinct stages (0-4)** to drive the progress bar:

| Stage | Name | Progress | Statuses |
|-------|------|----------|----------|
| **0** | Created | 0% | `cancelled`, `pickup_scheduled`, `pickup_awaited`, `lost` (fallback) |
| **1** | Accepted / In Scan | 25% | `pickup_completed`, `inscan_at_hub`, `not_picked_up` |
| **2** | In Transit / Hub Processing | 50% | `loaded`, `create_courier_booking`, `handover_courier_partner`, `intransittohub`, `in_transit`, `reachedathub` |
| **3** | Last Mile / Delivery Attempt | 75% | `assigned_for_delivery`, `outfordelivery`, `attempted`, `undelivered`, `on_hold` |
| **4** | Delivered | 100% | `delivered`, `rto_delivered` |

### RTO (Return to Origin) Handling

RTO statuses are mapped to **Stage 2 (In Transit)** to indicate progress is reversed:
- `rto`, `rto_initiated`, `rto_in_transit`, `Arrived at Return Hub`
- Exception: `rto_delivered` maps to Stage 4

---

## 2. Color Coding

The application assigns colors based on keywords found within the status:

| Color | Meaning | Statuses |
|-------|---------|----------|
| 🟢 **Green** | Success | `delivered`, `rto_delivered` |
| 🔴 **Red** | Failure/Return | `cancelled`, `rto`, `rto_initiated`, `rto_in_transit`, `not_picked_up`, any status containing `return`, `cancel`, or `fail` |
| 🔵 **Blue** | Active | `pickup_*`, `in_transit`, `outfordelivery`, `assigned_for_delivery`, statuses containing `transit`, `pick`, or `delivery` |
| 🟡 **Yellow** | Warning/Idle | Default for others like `on_hold`, `undelivered`, `attempted` |

---

## 3. Text & Logic Transformations

### simplifyComment Function

Converts technical database values into human-readable text:

#### Pickup Status Mappings

| Technical Value | Readable Text |
|-----------------|---------------|
| `out_for_pickup` | Parcel is on its way to be picked up |
| `not_picked_up` | Pickup attempt unsuccessful |
| `pickup_assigned` | Courier assigned for pickup |
| `pickup_completed` | Pickup Successfully completed at our hub |

#### Hub & Transit Mappings

| Technical Value | Readable Text |
|-----------------|---------------|
| `inscan_at_hub` | Parcel received at hub |
| `intransit` | Parcel in transit to sorting center |
| `reached` + `hub` | Parcel arrived at hub |
| `arrived_in_country` | Arrived in Country - {City} |

#### Delivery Status Mappings

| Technical Value | Readable Text |
|-----------------|---------------|
| `delivered` | Shipment successfully delivered |
| `accept` | Shipment outgoing for delivery |

#### Failed Delivery Attempt Mappings

| Technical Value | Readable Text |
|-----------------|---------------|
| `customer change address` | Customer requested to change delivery address |
| `rescheduled` | Rescheduled - Customer requested delay |
| `out of zone` | The delivery zone is not accessible |
| `wrong number` | The number is incorrect |
| `mobile off` | The mobile number is off |
| `no response` | No response from customer - Delivery re-attempt planned |
| `wrong city` | Delivery failed - Wrong city |

#### Exception Mappings

| Technical Value | Readable Text |
|-----------------|---------------|
| `lost` | Shipment declared lost |
| `rto` | Shipment Returned to Sender |
| `cancelled` | Shipment Cancelled |

### Fallback Behavior

- If the comment is already a sentence (length > 25 characters) or contains Arabic text, it is displayed as-is.
- Generic location + status patterns are parsed (e.g., "RIYADH arrived_in_country" → "Arrived in Country - Riyadh")

---

## 4. Privacy & Masking

Personal data is masked for privacy:

| Data Type | Example Input | Masked Output |
|-----------|---------------|---------------|
| Phone | +966 512345678 | +966 51******78 |
| Name | John Doe | J*** D*** |
| Address | 123 Main Street | 123 M****** |

---


