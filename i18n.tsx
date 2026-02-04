
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Page
    pageTitle: 'Track Shipment',
    
    // Search Section
    enterTrackingCode: 'Enter Tracking Code',
    placeholder: 'e.g. S0005747286',
    search: 'Search',
    loading: 'Extracting Tracking Data...',
    
    // Errors
    errorEmpty: 'Please enter a tracking number',
    errorTooShort: 'Tracking number is too short. Please enter a valid code.',
    errorTooLong: 'The tracking number entered is unusually long. Please check for errors.',
    errorNotFound: 'Shipment not found for {trackingNumber}. Please check the tracking number and try again.',
    networkError: 'Network error',
    errorTimeout: 'Connection timeout. Please check your internet and try again.',
    errorInvalidFormat: 'Invalid tracking number format. Please check and try again.',
    errorAccessDenied: 'System error: API access denied. Contact support.',
    errorGeneric: 'Request failed - please try again',
    errorUnexpected: 'An unexpected error occurred. Please try again later.',
    
    // Empty State
    readyToTrack: 'Ready to Track?',
    readyToTrackDesc: 'Enter a valid Starlinks tracking number above to see the real-time journey of your shipment.',
    
    // Shipment Card Header
    trackNumber: 'Track Number',
    currentStatus: 'Current Status',
    deliveredTime: 'Delivered Time',
    arrivingBy: 'Arriving by',
    viewDetails: 'View Full Details',
    pending: 'Pending',
    unknown: 'Unknown',
    
    // Origin/Destination
    origin: 'Origin',
    destination: 'Destination',
    
    // Progress Stages
    stageCreated: 'Created',
    stageAccepted: 'Accepted',
    stageInTransit: 'In transit',
    stageLastMile: 'Last Mile',
    stageDelivered: 'Delivered',
    
    // Receiver Details
    receiverDetails: 'RECEIVER DETAILS',
    name: 'Name',
    phone: 'Phone',
    location: 'Location',
    
    // Shipment Facts
    shipmentFacts: 'SHIPMENT FACTS',
    pieces: 'Pieces',
    codAmount: 'COD Amount',
    cod: 'COD',
    paidNone: 'Paid / None',
    
    // History
    historyTitle: 'Shipment History Details',
    noHistory: 'No detailed history available.',
    
    // Status Messages
    statusOutForPickup: 'Parcel is on its way to be picked up',
    statusPickupFailed: 'Pickup attempt unsuccessful',
    statusCourierAssigned: 'Courier assigned for pickup',
    statusPickupCompleted: 'Pickup Successfully completed at our hub',
    statusAtHub: 'Parcel received at hub',
    statusInTransit: 'Parcel in transit to sorting center',
    statusArrivedHub: 'Parcel arrived at hub',
    statusLost: 'Shipment declared lost',
    statusDelivered: 'Shipment successfully delivered',
    statusOutgoing: 'Shipment outgoing for delivery',
    statusRTO: 'Shipment Returned to Sender',
    statusAddressChange: 'Customer requested to change delivery address',
    statusRescheduled: 'Rescheduled - Customer requested delay',
    statusOutOfZone: 'The delivery zone is not accessible',
    statusWrongNumber: 'The number is incorrect',
    statusMobileOff: 'The mobile number is off',
    statusNoResponse: 'No response from customer - Delivery re-attempt planned',
    statusWrongCity: 'Delivery failed - Wrong city',
    statusCancelled: 'Shipment Cancelled',
    statusArrivedCountry: 'Arrived in Country - {city}',
    statusProcessed: 'Shipment processed and {eventName} at {location}.',
    sortingCenter: 'our sorting center',
    
    // Feedback Widget
    needHelp: 'Need Help ?',
    
    // Field Labels
    fieldTrackNumber: 'Track Number',
    fieldStatus: 'Status',
    fieldCustomerName: 'Customer Name',
    fieldServiceCode: 'Service Code',
    fieldOrderReference: 'Order Reference',
    fieldCustomerIdReference: 'Customer ID Reference',
    fieldInvoice: 'Invoice',
    fieldDescription: 'Description',
    fieldRgrNumber: 'RGR Number',
    fieldExportEntryNumber: 'Export Entry Number',
    fieldIncoterm: 'Incoterm',
    fieldCurrency: 'Currency',
    fieldPrice: 'Price',
    fieldCodValue: 'COD Value',
    fieldCodCurrency: 'COD Currency',
    fieldIsDangerous: 'Is Dangerous',
    fieldCategory: 'Category',
    fieldLabelFormat: 'Label Format',
    fieldDisplayId: 'Display ID',
    fieldPudoId: 'PUDO ID',
    fieldEstimatedDeliveryDate: 'Estimated Delivery Date',
    fieldScheduledDeliveryDate: 'Scheduled Delivery Date',
    
    // Timeline Labels
    fieldFirstHubScan: 'First Hub Scan',
    fieldOfdTime: 'Out For Delivery',
    fieldFirstDeliveryAttempt: 'First Delivery Attempt',
    fieldLastDeliveryAttempt: 'Last Delivery Attempt',
    fieldDeliveredTime: 'Delivered Time',
    
    // Consignee Fields
    fieldConsigneeName: 'Consignee Name',
    fieldConsigneePhone: 'Consignee Phone',
    fieldConsigneeEmail: 'Consignee Email',
    fieldConsigneeCity: 'Consignee City',
    fieldConsigneeState: 'Consignee State',
    fieldConsigneeCountry: 'Consignee Country',
    fieldConsigneeZip: 'Consignee Zip',
    fieldConsigneeAddress1: 'Consignee Address 1',
    fieldConsigneeAddress2: 'Consignee Address 2',
    
    // Shipper Fields
    fieldShipperName: 'Shipper Name',
    fieldShipperPhone: 'Shipper Phone',
    fieldShipperEmail: 'Shipper Email',
    fieldShipperCity: 'Shipper City',
    fieldShipperCountry: 'Shipper Country',
    fieldShipperZip: 'Shipper Zip',
    fieldShipperAddress1: 'Shipper Address 1',
    fieldShipperAddress2: 'Shipper Address 2',
    
    // Parcel Fields
    fieldParcelDescription: 'Parcel Description',
    fieldParcelWarehouse: 'Parcel Warehouse',
    fieldProductSku: 'Product SKU',
    fieldProductDescription: 'Product Description',
    fieldProductPrice: 'Product Price',
    fieldProductCurrency: 'Product Currency',
    fieldProductQuantity: 'Product Quantity',
  },
  ar: {
    // Page
    pageTitle: 'تتبع الشحنة',
    
    // Search Section
    enterTrackingCode: 'أدخل رقم التتبع',
    placeholder: 'مثال: S0005747286',
    search: 'بحث',
    loading: 'جاري استخراج بيانات التتبع...',
    
    // Errors
    errorEmpty: 'الرجاء إدخال رقم التتبع',
    errorTooShort: 'رقم التتبع قصير جداً. الرجاء إدخال رقم صحيح.',
    errorTooLong: 'رقم التتبع طويل جداً. الرجاء التحقق من الرقم.',
    errorNotFound: 'الشحنة غير موجودة لـ {trackingNumber}. الرجاء التحقق من رقم التتبع والمحاولة مرة أخرى.',
    networkError: 'خطأ في الاتصال',
    errorTimeout: 'انتهت مهلة الاتصال. الرجاء التحقق من الإنترنت والمحاولة مرة أخرى.',
    errorInvalidFormat: 'صيغة رقم التتبع غير صحيحة. الرجاء التحقق والمحاولة مرة أخرى.',
    errorAccessDenied: 'خطأ في النظام: تم رفض الوصول. الرجاء الاتصال بالدعم.',
    errorGeneric: 'فشل الطلب - الرجاء المحاولة مرة أخرى',
    errorUnexpected: 'حدث خطأ غير متوقع. الرجاء المحاولة لاحقاً.',
    
    // Empty State
    readyToTrack: 'جاهز للتتبع؟',
    readyToTrackDesc: 'أدخل رقم تتبع صالح أعلاه لمعرفة رحلة شحنتك.',
    
    // Shipment Card Header
    trackNumber: 'رقم التتبع',
    currentStatus: 'الحالة الحالية',
    deliveredTime: 'وقت التسليم',
    arrivingBy: 'الوصول بحلول',
    viewDetails: 'عرض التفاصيل الكاملة',
    pending: 'قيد الانتظار',
    unknown: 'غير معروف',
    
    // Origin/Destination
    origin: 'المصدر',
    destination: 'الوجهة',
    
    // Progress Stages
    stageCreated: 'تم الإنشاء',
    stageAccepted: 'تم الاستلام',
    stageInTransit: 'في الطريق',
    stageLastMile: 'التوصيل النهائي',
    stageDelivered: 'تم التسليم',
    
    // Receiver Details
    receiverDetails: 'بيانات المستلم',
    name: 'الاسم',
    phone: 'الهاتف',
    location: 'الموقع',
    
    // Shipment Facts
    shipmentFacts: 'معلومات الشحنة',
    pieces: 'القطع',
    codAmount: 'مبلغ الدفع عند الاستلام',
    cod: 'الدفع عند الاستلام',
    paidNone: 'مدفوع / لا يوجد',
    
    // History
    historyTitle: 'تفاصيل سجل الشحنة',
    noHistory: 'لا يوجد سجل تفصيلي متاح.',
    
    // Status Messages
    statusOutForPickup: 'الطرد في طريقه للاستلام',
    statusPickupFailed: 'محاولة الاستلام غير ناجحة',
    statusCourierAssigned: 'تم تعيين مندوب للاستلام',
    statusPickupCompleted: 'تم الاستلام بنجاح في مستودعنا',
    statusAtHub: 'تم استلام الطرد في المستودع',
    statusInTransit: 'الطرد في الطريق إلى مركز الفرز',
    statusArrivedHub: 'وصل الطرد إلى المستودع',
    statusLost: 'تم اعتبار الشحنة مفقودة',
    statusDelivered: 'تم تسليم الشحنة بنجاح',
    statusOutgoing: 'الشحنة خارجة للتسليم',
    statusRTO: 'تم إرجاع الشحنة للمرسل',
    statusAddressChange: 'طلب العميل تغيير عنوان التسليم',
    statusRescheduled: 'تمت إعادة الجدولة - طلب العميل التأجيل',
    statusOutOfZone: 'منطقة التسليم غير متاحة',
    statusWrongNumber: 'الرقم غير صحيح',
    statusMobileOff: 'الهاتف مغلق',
    statusNoResponse: 'لا يوجد رد من العميل - ستتم إعادة المحاولة',
    statusWrongCity: 'فشل التسليم - مدينة خاطئة',
    statusCancelled: 'تم إلغاء الشحنة',
    statusArrivedCountry: 'وصل إلى البلد - {city}',
    statusProcessed: 'تمت معالجة الشحنة و{eventName} في {location}.',
    sortingCenter: 'مركز الفرز',
    
    // Feedback Widget
    needHelp: 'تحتاج مساعدة؟',
    
    // Field Labels
    fieldTrackNumber: 'رقم التتبع',
    fieldStatus: 'الحالة',
    fieldCustomerName: 'اسم العميل',
    fieldServiceCode: 'رمز الخدمة',
    fieldOrderReference: 'مرجع الطلب',
    fieldCustomerIdReference: 'مرجع هوية العميل',
    fieldInvoice: 'الفاتورة',
    fieldDescription: 'الوصف',
    fieldRgrNumber: 'رقم RGR',
    fieldExportEntryNumber: 'رقم قيد التصدير',
    fieldIncoterm: 'شروط التسليم',
    fieldCurrency: 'العملة',
    fieldPrice: 'السعر',
    fieldCodValue: 'قيمة الدفع عند الاستلام',
    fieldCodCurrency: 'عملة الدفع عند الاستلام',
    fieldIsDangerous: 'مادة خطرة',
    fieldCategory: 'الفئة',
    fieldLabelFormat: 'صيغة البطاقة',
    fieldDisplayId: 'معرف العرض',
    fieldPudoId: 'معرف PUDO',
    fieldEstimatedDeliveryDate: 'تاريخ التسليم المتوقع',
    fieldScheduledDeliveryDate: 'تاريخ التسليم المجدول',
    
    // Timeline Labels
    fieldFirstHubScan: 'أول فحص في المستودع',
    fieldOfdTime: 'في الطريق للتسليم',
    fieldFirstDeliveryAttempt: 'أول محاولة تسليم',
    fieldLastDeliveryAttempt: 'آخر محاولة تسليم',
    fieldDeliveredTime: 'وقت التسليم',
    
    // Consignee Fields
    fieldConsigneeName: 'اسم المستلم',
    fieldConsigneePhone: 'هاتف المستلم',
    fieldConsigneeEmail: 'بريد المستلم',
    fieldConsigneeCity: 'مدينة المستلم',
    fieldConsigneeState: 'منطقة المستلم',
    fieldConsigneeCountry: 'دولة المستلم',
    fieldConsigneeZip: 'الرمز البريدي للمستلم',
    fieldConsigneeAddress1: 'عنوان المستلم 1',
    fieldConsigneeAddress2: 'عنوان المستلم 2',
    
    // Shipper Fields
    fieldShipperName: 'اسم المرسل',
    fieldShipperPhone: 'هاتف المرسل',
    fieldShipperEmail: 'بريد المرسل',
    fieldShipperCity: 'مدينة المرسل',
    fieldShipperCountry: 'دولة المرسل',
    fieldShipperZip: 'الرمز البريدي للمرسل',
    fieldShipperAddress1: 'عنوان المرسل 1',
    fieldShipperAddress2: 'عنوان المرسل 2',
    
    // Parcel Fields
    fieldParcelDescription: 'وصف الطرد',
    fieldParcelWarehouse: 'مستودع الطرد',
    fieldProductSku: 'رمز المنتج',
    fieldProductDescription: 'وصف المنتج',
    fieldProductPrice: 'سعر المنتج',
    fieldProductCurrency: 'عملة المنتج',
    fieldProductQuantity: 'كمية المنتج',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return (saved === 'ar' || saved === 'en') ? saved : 'en';
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    let text = translations[language][key] || translations['en'][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, paramValue);
      });
    }
    
    return text;
  }, [language]);

  const isRTL = language === 'ar';

  // Update document direction and language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.title = t('pageTitle');
    }
  }, [language, isRTL, t]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language Toggle Component
export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-[#115e59] hover:text-[#115e59] transition-all shadow-sm"
      aria-label="Toggle language"
    >
      <span className={language === 'ar' ? 'text-[#115e59] font-black' : 'text-gray-400'}>عربي</span>
      <span className="text-gray-300">|</span>
      <span className={language === 'en' ? 'text-[#115e59] font-black' : 'text-gray-400'}>English</span>
    </button>
  );
};

export default translations;
