
import React, { useState } from 'react';
import { Shipment } from '../types';
import { FIELD_MAPPING, CONSIGNEE_FIELDS, SHIPPER_FIELDS, PARCEL_FIELDS, TIMELINE_LABELS } from '../constants';

interface ShipmentCardProps {
  shipment: Shipment;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getVal = (obj: any, key: string) => {
    const val = obj[key];
    if (val === null || val === undefined || val === '') return 'N/A';
    return String(val);
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivered') || s.includes('rto_delivered')) return 'bg-[#006F4A]/10 text-[#006F4A] border-[#006F4A]/20';
    if (s.includes('cancel') || s.includes('fail') || s.includes('return')) return 'bg-red-100 text-red-800 border-red-200';
    if (s.includes('transit') || s.includes('pick') || s.includes('delivery')) return 'bg-[#00A0AF]/10 text-[#00A0AF] border-[#00A0AF]/20';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const titleCase = (str: string) => {
    if (!str) return '---';
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const simplifyComment = (comment: string) => {
    if (!comment) return '';
    const c = comment.toLowerCase();
    const hasArabic = /[\u0600-\u06FF]/.test(comment);
    const arabicPart = hasArabic ? comment.match(/[\u0600-\u06FF].+/)?.[0] : null;

    // Technical Pickup Mappings
    if (c.includes('out_for_pickup')) return 'Parcel is on its way to be picked up';
    if (c.includes('not_picked_up')) return 'Pickup attempt unsuccessful';
    if (c.includes('pickup_assigned')) return 'Courier assigned for pickup';

    if (c.includes('pickup_completed')) return 'Pickup Succefully completed at our hub';
    if (c.includes('inscan_at_hub')) return 'Parcel received at hub';
    if (c.includes('intransit')) return 'Parcel in transit to sorting center';
    if (c.includes('reached') && c.includes('hub')) return 'Parcel arrived at hub';
    if (c.includes('lost')) return 'Shipment declared lost';
    if (c.includes('delivered')) return 'Shipment successfully delivered';
    if (c.includes('accept')) return 'Shipment outgoing for delivery';
    if (c.includes('rto')) return 'Shipment Returned to Sender';

    // Delivery Attempt Mappings
    if (c.includes('customer change address')) return 'Customer requested to change delivery address';
    if (c.includes('rescheduled')) return 'Rescheduled - Customer requested delay';
    if (c.includes('out of zone')) return 'The delivery zone is not accessible';
    if (c.includes('wrong number')) return 'The number is incorrect';
    if (c.includes('mobile off')) return 'The mobile number is off';
    if (c.includes('no response')) return 'No response from customer - Delivery re-attempt planned';
    if (c.includes('wrong city')) return 'Delivery failed - Wrong city';

    // If it's already a sentence or has Arabic and wasn't mapped above, keep it
    if (comment.length > 25 || hasArabic) return comment;

    // Generic Location + Status Patterns
    // e.g. "RIYADH arrived_in_country" -> "Arrived in Country - Riyadh"
    if (c.includes('arrived_in_country')) {
      // Extract city if possible
      const city = comment.split(' ')[0];
      return `Arrived in Country - ${titleCase(city)}`;
    }

    if (c.includes('cancelled')) {
      return 'Shipment Cancelled';
    }

    return comment;
  };

  const maskString = (str: string, type: 'phone' | 'name' | 'address' = 'name') => {
    if (!str) return '---';
    if (type === 'phone') {
      // +966 5X XXX XXXX -> +966 5X *** **XX
      // Simple logic: keep first 5 chars, mask next few, show last 2
      if (str.length < 8) return '******';
      return str.substring(0, 7) + '******' + str.substring(str.length - 2);
    }
    if (type === 'name') {
      // John Doe -> J*** D***
      return str.split(' ').map(part => {
        if (part.length < 2) return part;
        return part[0] + '***';
      }).join(' ');
    }
    if (type === 'address') {
      // Just showing city is usually safe if specific address line is sensitive, 
      // but let's just mask most of it if we display raw line.
      if (str.length < 10) return str;
      return str.substring(0, 5) + '******';
    }
    return str;
  };

  // Determine effective status (fallback to history if status is 'ERROR' or missing)
  const getEffectiveStatus = () => {
    const s = shipment.status?.toUpperCase();
    if ((!s || s === 'ERROR' || s === 'UNKNOWN') && shipment.history && shipment.history.length > 0) {
      return shipment.history[shipment.history.length - 1].event_name;
    }
    return shipment.status || 'Unknown';
  };

  const effectiveStatus = getEffectiveStatus();

  // Process history to merge consecutive duplicate 'Canceled' events
  const processedHistory = React.useMemo(() => {
    if (!shipment.history) return [];

    return shipment.history.reduce((acc: any[], current, index) => {
      if (index === 0) return [current];

      const prev = acc[acc.length - 1];
      const isDuplicateCancel =
        current.event_name?.toLowerCase().includes('cancel') &&
        prev.event_name?.toLowerCase().includes('cancel');

      if (isDuplicateCancel) {
        // Keep the latest one (or the one that makes more sense, usually the latest in a chronological list)
        // Assuming history is sorted, we skip the current if it's identical or just merges.
        // Actually, if we want to merge them, we just don't add the current one if it's "same" enough.
        return acc;
      }
      return [...acc, current];
    }, []);
  }, [shipment.history]);

  return (
    <div className={`${effectiveStatus.toLowerCase().includes('cancel') ? 'bg-red-50 border-red-100' : 'bg-[#006F4A]/5 border-[#006F4A]/20'} rounded-xl overflow-hidden mb-5 sm:mb-8 border transition-all duration-200 mx-1 sm:mx-0 shadow-sm`}>
      {/* Primary Horizontal Bar - Responsive Stacked on Mobile */}
      <div className="bg-slate-50 px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100">
        <div className="flex flex-col items-start w-full sm:w-auto">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Track Number</span>
          <span className="text-xl font-bold text-[#115e59]">{shipment.track_number || 'Unknown'}</span>
        </div>

        <div className="flex flex-row items-center gap-8 sm:gap-8 w-full sm:w-auto justify-start">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</span>
            <div className={`inline-flex px-3 py-1 bg-white border rounded-lg shadow-sm ${getStatusColor(effectiveStatus).replace('bg-', 'border-').split(' ')[2]}`}>
              <span className={`text-[11px] font-bold uppercase tracking-tight ${getStatusColor(effectiveStatus).split(' ')[1]}`}>
                {effectiveStatus}
              </span>
            </div>
          </div>

          {!effectiveStatus.toLowerCase().includes('cancel') && (
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivered Time</span>
              <span className="text-[13px] font-semibold text-gray-900 leading-tight">
                {shipment.timeline?.delivered_time ? formatShortDate(shipment.timeline.delivered_time) : 'Pending'}
              </span>
            </div>
          )}

          {/* Integrated ETA for Desktop */}
          {effectiveStatus.toLowerCase() !== 'delivered' && shipment.estimated_delivery_date && (
            <div className="hidden sm:flex flex-col border-l border-gray-200 pl-8">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Arriving by</span>
              <span className="text-[13px] font-semibold text-[#006F4A] leading-tight">
                {formatShortDate(shipment.estimated_delivery_date)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center w-full sm:w-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between sm:justify-center gap-2 w-full sm:w-auto px-4 py-3 sm:py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <span>View Full Details</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Reference Image Layout Version */}
      <div className="px-5 sm:px-12 py-12 sm:py-16 bg-white">
        {/* Top Header Labels (Origin/Destination) - Desktop only for reference look */}
        <div className="hidden sm:flex justify-between items-start mb-12">
          <div className="flex flex-col text-left">
            <span className="text-xl font-medium text-gray-300 mb-1">Origin</span>
            <span className="text-lg font-bold text-gray-400 leading-tight uppercase tracking-tight">{shipment.shipper_address?.country || ''}</span>
            <span className="text-4xl font-bold text-gray-900">{titleCase(shipment.shipper_address?.city || '')}</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-xl font-medium text-gray-300 mb-1">Destination</span>
            <span className="text-lg font-bold text-gray-400 leading-tight uppercase tracking-tight">{shipment.consignee_address?.country || ''}</span>
            <span className="text-4xl font-bold text-gray-900">{titleCase(shipment.consignee_address?.city || '')}</span>
          </div>
        </div>

        {/* Horizontal Stepper */}
        <div className="relative">
          {/* Tracking Line - Layered with Baseline */}
          <div className="absolute 
            left-5 top-5 bottom-5 w-px sm:left-6 sm:right-6 sm:top-[23px] sm:bottom-auto sm:h-px sm:w-auto
            z-0"
          >
            {/* Gray Baseline */}
            <div className="absolute inset-0 bg-gray-200 z-0" />

            {/* Progress indicator - Mobile (Vertical) */}
            <div
              className="sm:hidden absolute inset-x-0 top-0 bg-[#006F4A] transition-all duration-1000 ease-out z-10"
              style={{ height: `${determineProgressWidth(effectiveStatus)}%` }}
            />
            {/* Progress indicator - Desktop (Horizontal) */}
            <div
              className="hidden sm:block absolute inset-y-0 left-0 bg-[#006F4A] transition-all duration-1000 ease-out z-10"
              style={{ width: `${determineProgressWidth(effectiveStatus)}%` }}
            />
          </div>

          {/* Checkpoints Stack */}
          <div className="relative flex flex-col sm:flex-row justify-between gap-10 sm:gap-0 z-10">
            {['Created', 'Accepted', 'In transit', 'Last Mile', 'Delivered'].map((stage, idx) => {
              const isCompleted = isStageCompleted(stage, effectiveStatus, idx);
              const isCurrent = isCurrentStage(stage, effectiveStatus, idx);
              const isDelivered = stage === 'Delivered' && isCompleted;

              return (
                <div key={stage} className="flex flex-row sm:flex-col items-center sm:items-center relative group">
                  {/* Icon Circle */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center transition-all duration-500 ${idx === 4 // Delivered state normally hollow in reference
                    ? 'bg-white border-2 border-[#006F4A] text-[#006F4A]'
                    : isCompleted || isCurrent
                      ? 'bg-[#006F4A] text-white'
                      : 'bg-white border-2 border-gray-100 text-gray-200'
                    }`}>
                    {getTimelineIcon(stage, isCompleted || isCurrent)}
                  </div>

                  {/* Labels Below (All Caps) */}
                  <div className="ml-4 sm:ml-0 sm:mt-6 flex flex-col sm:items-center">
                    <span className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase leading-none ${isCurrent || isCompleted
                      ? stage === 'Delivered' ? 'text-[#006F4A]' : 'text-gray-900'
                      : 'text-gray-300'
                      }`}>
                      {stage}
                    </span>

                    {/* Muted Timestamps */}
                    <div className="mt-2 h-4"> {/* Spacer for consistent alignment */}
                      {stage === 'Created' && (
                        <span className="text-[9px] font-medium text-gray-300 whitespace-nowrap uppercase tracking-tighter">
                          {formatShortDate(
                            shipment.history?.find(h => h.event_name.toLowerCase().includes('create'))?.event_date ||
                            shipment.history?.[0]?.event_date || ''
                          )}
                        </span>
                      )}
                      {stage === 'Delivered' && shipment.timeline?.delivered_time && (
                        <span className="text-[9px] font-medium text-[#006F4A] whitespace-nowrap uppercase tracking-tighter">
                          {formatShortDate(shipment.timeline.delivered_time)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Expanded Content - Simplified History (Collapsible) */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[9999px] opacity-100 border-t border-[#006F4A]/20 mt-12 sm:mt-16' : 'max-h-0 opacity-0'}`}>
          <div className="p-8 bg-gray-50/50 border-x border-b border-gray-100 rounded-b-xl">
            {/* New Info Grid: Receiver & Shipment Facts */}
            {/* New Info Grid: Receiver & Shipment Facts */}
            {/* New Info Grid: Receiver & Shipment Facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Receiver Details (Masked) - Card Grid Style */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  RECEIVER DETAILS
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Card */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Name</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span className="text-sm font-bold text-gray-900 truncate">{maskString(shipment.consignee_address?.name || '', 'name')}</span>
                    </div>
                  </div>
                  {/* Phone Card */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Phone</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <span className="text-sm font-bold text-gray-900 tracking-tight truncate">{maskString(shipment.consignee_address?.phone || '', 'phone')}</span>
                    </div>
                  </div>
                  {/* Location Card - Full Width */}
                  <div className="col-span-1 sm:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Location</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="text-sm font-bold text-gray-900">{shipment.consignee_address?.city || '---'}, {shipment.consignee_address?.country || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Facts - Card Grid Style */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  SHIPMENT FACTS
                </h5>
                <div className="grid grid-cols-2 gap-4 h-full content-start">
                  {/* Pieces Card */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center transition-colors hover:bg-gray-100 group">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Pieces</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      <span className="text-sm font-bold text-gray-900">{shipment.parcels?.length || 1}</span>
                    </div>
                  </div>
                  {/* COD Card */}
                  {(shipment.cod_value && parseFloat(shipment.cod_value) > 0) ? (
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex flex-col justify-center transition-colors hover:bg-orange-100">
                      <span className="text-[10px] text-orange-400 font-bold uppercase mb-1">COD Amount</span>
                      <span className="text-sm font-bold text-gray-900">{shipment.cod_value} <span className="text-[10px] text-gray-500">{shipment.cod_currency}</span></span>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center opacity-50">
                      <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">COD</span>
                      <span className="text-[10px] font-bold text-gray-400">Paid / None</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h4 className="text-md font-bold text-[#006F4A] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Shipment History Details
            </h4>

            {processedHistory.length > 0 ? (
              <div className="space-y-4">
                {processedHistory.map((ev, i) => {
                  const name = ev.event_name?.toLowerCase() || '';
                  const isCanceled = name.includes('cancel');
                  const isAttempted = name.includes('attempt');
                  const isOFD = name.includes('out for delivery') || name.includes('accept');
                  const isDelivered = name === 'delivered' || (name.includes('delivered') && !isAttempted && !isOFD) || name.includes('return to');

                  return (
                    <div key={i} className={`bg-white p-6 rounded-xl border shadow-sm flex items-start gap-6 group transition-all duration-300 ${isCanceled ? 'border-red-100 hover:border-red-200' :
                      isAttempted ? 'border-amber-100 hover:border-amber-200' :
                        isOFD ? 'border-[#00A0AF]/20 hover:border-[#00A0AF]/40' :
                          'border-gray-100 hover:border-[#006F4A]/30'
                      }`}>
                      <div className={`p-3 rounded-xl shrink-0 ${isDelivered ? 'bg-[#006F4A]/10 text-[#006F4A]' :
                        isCanceled ? 'bg-red-100 text-red-600' :
                          isAttempted ? 'bg-amber-100 text-amber-600' :
                            isOFD ? 'bg-[#00A0AF]/10 text-[#00A0AF]' :
                              name.includes('create') ? 'bg-[#00a0af]/10 text-[#00a0af]' :
                                name.includes('transit') ? 'bg-amber-100 text-amber-600' :
                                  'bg-gray-100 text-gray-600'
                        }`}>
                        {getEventIcon(ev.event_name)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <h5 className={`text-base font-black uppercase tracking-tight ${isCanceled ? 'text-red-700' :
                              isAttempted ? 'text-amber-700' :
                                isOFD ? 'text-[#00A0AF]' :
                                  'text-gray-900'
                              }`}>{ev.event_name}</h5>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <span className="text-xs font-black text-gray-900 block">{formatShipmentDate(ev.event_date).split(' ').slice(0, 2).join(' ')}</span>
                            <span className="text-[11px] font-bold text-gray-400 uppercase">{formatShipmentDate(ev.event_date).split(' ').slice(2).join(' ')}</span>
                          </div>
                        </div>
                        <div className={`mt-1.5 py-2 px-3 rounded-lg transition-colors ${isCanceled ? 'bg-red-50 group-hover:bg-red-100' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                          <p className={`text-xs font-medium ${isCanceled ? 'text-red-600' : 'text-gray-600'}`}>
                            {simplifyComment(ev.event_description) || `Shipment processed and ${ev.event_name?.toLowerCase()} at ${ev.event_location || 'our sorting center'}.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No detailed history available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components/functions for dynamic stage mapping
const formatShortDate = (dateStr?: string) => {
  if (!dateStr) return '---';
  try {
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length < 2) return dateStr;
    const datePart = parts[0];
    const timePart = parts[1];

    const [year, month, day] = datePart.split('-');
    const [hoursStr, minutes] = timePart.split(':');

    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = parseInt(month, 10) - 1;
    const shortMonth = monthNames[monthIndex] || month;

    return `${day} ${shortMonth} ${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return dateStr;
  }
};

const formatShipmentDate = (dateStr?: string) => {
  return formatShortDate(dateStr);
};

const isStageCompleted = (stage: string, status: string, idx: number) => {
  const currentIdx = getStageIndex(status);
  return idx < currentIdx;
};

const isCurrentStage = (stage: string, status: string, idx: number) => {
  const currentIdx = getStageIndex(status);
  return idx === currentIdx;
};

const getStageIndex = (status: string) => {
  const s = status.toLowerCase().trim();

  // Terminal / Delivered
  if (s === 'delivered') return 4;

  // Last Mile / Delivery Attempt
  if ([
    'assigned_for_delivery',
    'outfordelivery',
    'attempted',
    'undelivered',
    'on_hold'
  ].includes(s)) return 3;

  // In Transit / Hub Processing
  if ([
    'loaded',
    'create_courier_booking',
    'handover_courier_partner',
    'intransittohub',
    'in_transit',
    'reachedathub'
  ].includes(s)) return 2;

  // Accepted / In Scan
  if ([
    'not_picked_up',
    'pickup_completed',
    'inscan_at_hub'
  ].includes(s)) return 1;

  // Created / Initial
  if ([
    'cancelled',
    'pickup_scheduled',
    'pickup_awaited'
  ].includes(s)) return 0;

  // Handle RTO (Return to Origin) - usually shows progress is reversed or at a specific stage
  // For the stepper, we'll map RTO to "In Transit" (2) as it's moving back, or "Accepted" if it's back at hub.
  // Actually, RTO is often treated as a terminal state or a specific flow. 
  // We'll keep it at stage 2/3 depending on the specific RTO status.
  if (s.includes('rto') || s.includes('return')) {
    if (s.includes('delivered')) return 4;
    return 2;
  }

  // Fallback / Keywords
  if (s.includes('transit')) return 2;
  if (s.includes('deliver')) return 3;
  if (s.includes('pickup') || s.includes('scan')) return 1;

  return 0; // Default to Created
};

const getTimelineIcon = (stage: string, isActive: boolean) => {
  const s = stage.toLowerCase();
  const size = "w-5 h-5 sm:w-6 sm:h-6";
  if (s.includes('create')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>;
  if (s.includes('accept')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
  if (s.includes('transit')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
  if (s.includes('mile')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
  if (s.includes('deliver')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
  return <div className="w-2 h-2 rounded-full bg-current"></div>;
};

const getEventIcon = (name: string) => {
  const n = (name || '').toLowerCase();
  const size = "w-5 h-5";
  if (n.includes('create')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

  // Specific matching for delivery states
  if (n === 'delivered' || n.includes('return to')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>;
  if (n.includes('attempt')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; // Clock/Alert
  if (n.includes('out for delivery') || n.includes('accept')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>; // Cargo/Truck

  if (n.includes('transit')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
  if (n.includes('hub') || n.includes('facility')) return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
  return <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

const determineProgressWidth = (status: string) => {
  const idx = getStageIndex(status);
  // Indices mapped to percentage: 0%, 25%, 50%, 75%, 100%
  // Return mapping for both horizontal and vertical
  const s = status?.toLowerCase() || '';
  return (s === 'cancelled' || s === 'canceled') ? 0 : idx * 25;
};

export default ShipmentCard;
