'use client';

import { AlertTriangle, Wrench, CheckCircle2, ExternalLink } from 'lucide-react';

export function FaultF055() {
  return (
    <div className="space-y-6">
      

      {/* Causes and Solutions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Causes */}
        <div>
          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Possible Causes
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm">The drum is too full</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm">The laundry is too damp</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm">The fluff filters are soiled</span>
            </li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-blue-500" />
            Quick Solutions
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Do not exceed the maximum load size for the selected programme</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Spin the laundry at a higher speed in the washing machine</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Clean the fluff filters following the steps below</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step-by-step cleaning instructions with images */}
      <div>
        <h4 className="font-semibold text-lg mb-3">How to Clean Fluff Filters</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 1: Pull upper fluff filter</div>
            <img 
              src="/faults/image 1.png" 
              alt="Pulling the fluff filter out to the front" 
              className="w-full h-auto rounded-md"
            />
            <p className="text-xs text-gray-600 mt-2">Open the door and pull the upper fluff filter forwards to remove it</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 2: Remove fluff</div>
            <img 
              src="/faults/image 2.png" 
              alt="Removing fluff from the fluff filter" 
              className="w-full h-auto rounded-md"
            />
            <p className="text-xs text-gray-600 mt-2">Remove the fluff from all surfaces</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 3: Clean all surfaces</div>
            <img 
              src="/faults/image 3.png" 
              alt="Removing fluff from filter surfaces" 
              className="w-full h-auto rounded-md"
            />
            <p className="text-xs text-gray-600 mt-2">Clean the perforated laundry deflector</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 4: Turn yellow control</div>
            <img 
              src="/faults/image 4.png" 
              alt="Turning the yellow rotary control" 
              className="w-full h-auto rounded-md"
            />
            <p className="text-xs text-gray-600 mt-2">Turn until you hear it click</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 5: Remove lower filter</div>
            <img 
              src="/faults/image 5.png"
              alt="Pulling the lower fluff filter out" 
              className="w-full h-auto rounded-md"
            />
            <p className="text-xs text-gray-600 mt-2">Hold the rotary control and pull forwards</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 6: Clean openings</div>
            <img 
              src="/faults/image 6.png" 
              alt="Vacuuming the air flow openings" 
              className="w-full h-auto rounded-md"
            />
            <p className="text-xs text-gray-600 mt-2">Use a vacuum cleaner with long crevice nozzle</p>
          </div>
        </div>
      </div>

     
      {/* Important Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-yellow-800">Important</h5>
            <p className="text-sm text-yellow-700 mt-1">
              Wet fluff filters could cause operational faults while drying. Make sure filters are completely dry before inserting.
            </p>
          </div>
        </div>
      </div>

      {/* Miele Support Link */}
      <div className="pt-4 border-t border-gray-200">
        <a 
          href="https://www.miele.co.uk/support/customer-assistance/tumble_dryer-1242/all"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="text-sm">Visit Miele Support Website</span>
        </a>
      </div>
    </div>
  );
}

export default FaultF055;
