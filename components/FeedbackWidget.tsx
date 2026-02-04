
import React from 'react';
import { useLanguage } from '../i18n';

const FeedbackWidget: React.FC = () => {
    const { t, isRTL } = useLanguage();

    return (
        <>
            {/* Desktop Version: Vertical Tab on Side */}
            <a
                href="https://api.whatsapp.com/send/?phone=9668003044433&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden sm:flex fixed ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-50 items-center justify-center bg-[#006F4A] text-white rounded-${isRTL ? 'r' : 'l'}-lg shadow-xl cursor-pointer hover:bg-[#00583B] transition-colors py-4 px-1`}
                style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                }}
            >
                <div className="flex items-center gap-3 rotate-180">
                    <span className="text-sm font-bold tracking-widest uppercase">{t('needHelp')}</span>
                    <svg
                        className="w-5 h-5 -rotate-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
            </a>

            {/* Mobile Version: Floating Rounded Button Bottom */}
            <a
                href="https://api.whatsapp.com/send/?phone=9668003044433&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className={`sm:hidden fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 flex items-center justify-center gap-2 bg-[#006F4A] text-white rounded-full shadow-2xl cursor-pointer hover:bg-[#00583B] transition-transform active:scale-95 px-5 py-3 border border-[#00583B]/20`}
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="text-sm font-bold tracking-wider uppercase">{t('needHelp')}</span>
            </a>
        </>
    );
};

export default FeedbackWidget;
