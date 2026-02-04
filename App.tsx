
import React, { useState, useCallback } from 'react';
import { queryStarlinksAPI, fetchShipmentHistory, extractTimeline } from './services/starlinksService';
import { Shipment } from './types';
import ShipmentCard from './components/ShipmentCard';
import FeedbackWidget from './components/FeedbackWidget';
import { LanguageProvider, LanguageToggle, useLanguage } from './i18n';

const AppContent: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedNumber, setSearchedNumber] = useState<string | null>(null);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setError(null);
    setShipments([]);

    const trimmedInput = trackingNumber.trim();
    if (!trimmedInput) {
      setError(t('errorEmpty'));
      return;
    }

    if (trimmedInput.length < 3) {
      setError(t('errorTooShort'));
      return;
    }

    if (trimmedInput.length > 25) {
      setError(t('errorTooLong'));
      return;
    }

    // Direct use of tracking number without cleaning
    const searchValue = trimmedInput;

    setIsLoading(true);
    setSearchedNumber(trimmedInput);

    try {
      const result = await queryStarlinksAPI(searchValue);
      if (result.success && result.data) {
        if (result.data.length > 0) {
          // Enhance each shipment with history and timeline
          const enhancedShipments = await Promise.all(
            result.data.map(async (s) => {
              if (s.track_number) {
                const history = await fetchShipmentHistory(s.track_number);
                const timeline = extractTimeline(history);
                return { ...s, history, timeline };
              }
              return s;
            })
          );
          setShipments(enhancedShipments);
        } else {
          setError(t('errorNotFound', { trackingNumber: trimmedInput }));
        }
      } else {
        setError(result.error || t('errorUnexpected'));
      }
    } catch (err) {
      setError(t('networkError'));
    } finally {
      setIsLoading(false);
    }
  }, [trackingNumber, t]);

  return (
    <div className="min-h-screen bg-white relative">
      <FeedbackWidget />

      {/* Top Header with Logo and Language Toggle */}
      <header className="border-b border-gray-100 py-4 mb-20">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <img src="/logo.png" alt="Starlinks Logo" className="h-12 w-auto" />
          <LanguageToggle />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Input Area - Responsive Stacked on Mobile */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-20">
          <form onSubmit={handleSearch} className={`flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4 group ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div className="flex-grow group-focus-within:translate-y-[-2px] transition-transform duration-300">
              <label className={`block text-[10px] font-black text-[#115e59] uppercase tracking-widest mb-1.5 ${isRTL ? 'mr-1 text-right' : 'ml-1'} opacity-60`}>{t('enterTrackingCode')}</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full h-[52px] sm:h-[64px] px-5 text-xl sm:text-2xl font-black text-[#064e3b] bg-gray-50/50 border-2 border-gray-200 focus:border-[#115e59] focus:bg-white rounded-xl sm:rounded-2xl transition-all outline-none placeholder:text-gray-200"
                  placeholder={t('placeholder')}
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  disabled={isLoading}
                  dir="ltr"
                />
                <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none hidden sm:block`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2-2m0 0l-2-2m2 2l-2 2m2-2l2-2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`h-[52px] sm:h-[64px] px-8 sm:px-10 bg-[#ff9d18] text-white text-base sm:text-lg font-black rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 hover:bg-[#e58400] hover:shadow-xl active:scale-95 transition-all shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>{t('search')}</span>
                </>
              )}
            </button>
          </form>

          {/* Status Messages */}
          <div className="mt-6 min-h-[1.5rem] flex justify-center">
            {isLoading && (
              <div className="flex items-center gap-3 text-sm font-bold text-[#115e59] bg-[#f0fdf4] px-4 py-2 rounded-full border border-[#d1fae5] animate-bounce">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#115e59] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#115e59]"></span>
                </span>
                {t('loading')}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-100 text-sm font-bold shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {shipments.length > 0 && (
          <div className="mt-4 sm:mt-8">
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {shipments.map((s, idx) => (
                <ShipmentCard key={s.track_number || idx} shipment={s} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Friendly Illustration */}
        {!isLoading && shipments.length === 0 && !error && (
          <div className="mt-12 sm:mt-24 text-center max-w-md mx-auto px-6">
            <div className="relative mb-8 flex justify-center">
              <div className="absolute inset-0 bg-green-50 rounded-full scale-[2.5] opacity-20 blur-2xl"></div>
              <div className="bg-[#f0fdf4] p-8 rounded-3xl border-2 border-dashed border-[#d1fae5] relative group">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-[#115e59] opacity-20 group-hover:opacity-40 transition-opacity duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{t('readyToTrack')}</h3>
            <p className="text-gray-400 font-bold text-sm leading-relaxed">
              {t('readyToTrackDesc')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
