"use client";

import AppLayout from "../../components/AppLayout";

export function MainHeroSection() {
  return (
    <section className="relative w-full min-h-[600px] flex items-center overflow-hidden text-accent">
      <div className="absolute inset-0 -z-20">
        <img
          src="/background.png"
          alt="Logistics network background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-0 bg-tertiary/65 -z-10" />
      <div className="mx-auto max-w-7xl w-full ms-48 px-6 py-20 flex items-center justify-between gap-12">
        <div className="flex-1 max-w-xl">

          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Global Logistics
            <br />
            for Moving & Growth
          </h1>

          <p className="mt-4 text-lg text-gray-200">
            Track shipments, manage freight, and monitor delivery operations in real time.
          </p>
          <div className="mt-8 bg-white rounded-lg shadow-xl p-6 text-gray-800">

            <label className="text-sm font-medium">
              Shipment Tracking
            </label>

            <div className="mt-2 flex gap-3">
              <input
                type="text"
                placeholder="Enter Tracking ID"
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />

              <button className="bg-[#0f2b4d] text-accent px-6 py-2 rounded-md font-medium hover:opacity-90">
                Track
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE SPACE (keeps layout balanced) */}
        <div className="flex-1 hidden lg:block" />
      </div>
    </section>
  );
}