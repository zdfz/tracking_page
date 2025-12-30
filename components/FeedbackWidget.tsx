
import React from 'react';

const FeedbackWidget: React.FC = () => {
    return (
        <a
            href="https://api.whatsapp.com/send/?phone=9668003044433&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 transform origin-right translate-x-[calc(100%-40px)] hover:translate-x-0 transition-transform duration-300 ease-in-out group"
        >
            <div className="flex items-center gap-2 bg-[#006F4A] text-white px-5 py-3 rounded-l-xl shadow-lg border-y border-l border-[#00583B]">
                <div className="flex flex-col items-center gap-1">
                    <svg
                        className="w-6 h-6 animate-pulse group-hover:animate-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest writing-vertical-rl sm:writing-horizontal-tb hidden">
                        Feedback
                    </span>
                </div>

                {/* Vertical Text for closed state, Horizontal for hover? Or just always horizontal? 
            Common pattern: Button sticks out, icon visible. Hover reveals text.
            Let's try a different approach: Simple vertical tab or horizontal button rotated?
            Saudia one is usually a vertical tab. 
            
            Let's go with a simple fixed button that is vertical on the right edge.
        */}
            </div>
        </a>
    );
};

// Re-implementing for a better "Vertical Tab" look as requested by the user flow description "like Saudia"
const FeedbackWidgetVertical: React.FC = () => {
    return (
        <>
            {/* Desktop Version: Vertical Tab on Right */}
            <a
                href="https://api.whatsapp.com/send/?phone=9668003044433&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 items-center justify-center bg-[#006F4A] text-white rounded-l-lg shadow-xl cursor-pointer hover:bg-[#00583B] transition-colors py-4 px-1"
                style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                }}
            >
                <div className="flex items-center gap-3 rotate-180">
                    <span className="text-sm font-bold tracking-widest uppercase">Feedback</span>
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

            {/* Mobile Version: Floating Rounded Button Bottom-Right */}
            <a
                href="https://api.whatsapp.com/send/?phone=9668003044433&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-[#006F4A] text-white rounded-full shadow-2xl cursor-pointer hover:bg-[#00583B] transition-transform active:scale-95 px-5 py-3 border border-[#00583B]/20"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="text-sm font-bold tracking-wider uppercase">Feedback</span>
            </a>
        </>
    );
};

export default FeedbackWidgetVertical;
