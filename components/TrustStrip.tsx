import React from "react";
import { ShieldCheck, Award, Wrench, Truck } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="bg-graphite-900 text-white py-12 border-y border-graphite-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-graphite-800 border border-graphite-700 rounded text-brass-500 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-space font-bold text-base text-white">35+ Years Manufacturing</h4>
            <p className="text-xs text-steel-400 mt-1 leading-relaxed">
              In-house forging and CNC machining since 1989.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-graphite-800 border border-graphite-700 rounded text-brass-500 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-space font-bold text-base text-white">10-Year Mechanical Warranty</h4>
            <p className="text-xs text-steel-400 mt-1 leading-relaxed">
              Guaranteed solid brass components against mechanical wear.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-graphite-800 border border-graphite-700 rounded text-brass-500 shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-space font-bold text-base text-white">250,000 Cycle Tested</h4>
            <p className="text-xs text-steel-400 mt-1 leading-relaxed">
              Exceeds EN 1303 Class 6 endurance standards for heavy doors.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-graphite-800 border border-graphite-700 rounded text-brass-500 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-space font-bold text-base text-white">Direct Factory Shipping</h4>
            <p className="text-xs text-steel-400 mt-1 leading-relaxed">
              Pan-India logistics with bulk freight support for dealers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
