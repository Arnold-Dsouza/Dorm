'use client';

import { AlertTriangle, Wrench, CheckCircle2, ExternalLink } from 'lucide-react';

export function FaultF066() {
  return (
    <div className="space-y-6">
         
    {/* YouTube Video */}
    <div>
      <h4 className="font-semibold text-lg mb-3">Video Tutorial</h4>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="aspect-video">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/RZy8R-BvUkg"
          title="Fault F66 Repair Tutorial"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-md"
        ></iframe>
        </div>
      </div>
    </div>
      {/* Step-by-step instructions with images - Fluff Filter Cleaning */}
      <div>
        <h4 className="font-semibold text-lg mb-3">Instructions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 1: Pull the upper fluff filter</div>
            <img 
              src="/faults/image 1.png" 
              alt="Pull the upper fluff filter" 
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 2: Remove the fluff</div>
            <img 
              src="/faults/image 2.png" 
              alt="Remove the fluff" 
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 3: Turn the yellow rotary control</div>
            <img 
              src="/faults/image 4.png" 
              alt="Turn the yellow rotary control" 
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 4: Remove the lower fluff filter</div>
            <img 
              src="/faults/image 5.png" 
              alt="Remove the lower fluff filter" 
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 5: Use vacuum cleaner to remove fluff</div>
            <img 
              src="/faults/image 6.png" 
              alt="Use vacuum cleaner to remove fluff" 
              className="w-full h-auto rounded-md"
            />
          </div>
          
        </div>
      </div>

      {/* Heat Exchanger Cleaning Instructions */}
      <div className="mt-6">
        <h4 className="font-semibold text-lg mb-3">Heat Exchanger Cleaning</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 1: Open the heat exchanger panel</div>
            <img 
              src="/faults/image 7.png" 
              alt="Open the heat exchanger panel" 
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 2: Pull out the plinth filter</div>
            <img 
              src="/faults/image 8.png" 
              alt="Pull out the plinth filter" 
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 3: Detach the plinth filter and the handle</div>
            <img 
              src="/faults/image 9.png" 
              alt="Detach the plinth filter and the handle" 
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 4: Clean under running water</div>
            <img 
              src="/faults/image 10.png" 
              alt="Clean under running water" 
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 5: Rinse the entire plinth filter thoroughly until all visible residue has been removed. </div>
            <img 
              src="/faults/image 11.png" 
              alt="Rinse the entire plinth filter thoroughly until all visible residue has been removed." 
              className="w-full h-auto rounded-md"
            />
          </div>
          <div className="bg-#b3d731-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-#e6e6e6-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-yellow-800">Continue to carefully squeeze the plinth filter until all of the water has been removed.</h5>
            <p className="text-sm text-yellow-700 mt-1">
              Tip: To soak up water, place the damp plinth filter between 2 hand towels. On a flat surface, repeatedly press down gently on the plinth filter with a flat hand. This will dry the plinth filter more quickly.
            </p>
          </div>
        </div>
      </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-700 mb-2 font-medium">Step 6: Use a damp cloth to remove any fluff from the handle.</div>
            <img 
              src="/faults/image 12.png" 
              alt="Use a damp cloth to remove any fluff from the handle." 
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Warning box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-yellow-800">Risk of injury from sharp cooling fins</h5>
            <p className="text-sm text-yellow-700 mt-1">
              You could cut yourself. Do not touch the cooling fins with your hands. Use a vacuum cleaner with a dusting brush attached.
            </p>
          </div>
        </div>
      </div>

      {/* Additional information */}
      <div>
        <h4 className="font-semibold text-lg mb-3">Environmental Note</h4>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            Environmental impact due to fluff which has been disposed of incorrectly. To prevent microplastics from spreading into the waste water system, fluff must not be drained away with the water. Dispose of the fluff collected by the fluff filters with your household waste.
          </p>
          <p className="text-sm text-green-800 mt-2">
            <strong>Tip:</strong> You can also use a vacuum cleaner so that you can remove the fluff without touching it.
          </p>
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

export default FaultF066;
