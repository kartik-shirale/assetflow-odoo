import React from "react";

export function AuthLayoutBrand() {
  return (
    <div className="hidden lg:flex lg:w-[440px] bg-gradient-to-br from-[#2D2A5E] to-[#1A1837] p-12 flex-col justify-between relative overflow-hidden">
      {/* Brand Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-white rounded-md"></div>
          </div>
          <h1 className="text-3xl font-bold text-white">AssetFlow</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Smart Asset Management
          <br />
          Made Simple.
        </p>
      </div>

      {/* Center Illustration Placeholder */}
      <div className="relative z-10 flex items-center justify-center my-8">
        <div className="w-full max-w-sm aspect-square flex items-center justify-center">
          {/* Placeholder for dashboard illustration */}
          <div className="text-gray-400 text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-indigo-600/20 rounded-2xl flex items-center justify-center">
              <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <div className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Secure. Reliable. Efficient.</h3>
            <p className="text-gray-400 text-sm">
              Everything you need to manage assets in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
