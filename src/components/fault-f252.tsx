'use client';

import { AlertTriangle, Wrench, ExternalLink } from 'lucide-react';

export function FaultF252() {
  return (
    <div className="space-y-6">

      {/* Image with instructions */}
      <div>
        <h4 className="font-semibold text-lg mb-3">Door Contact Area</h4>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-xs text-gray-700 mb-2 font-medium">Door contacts in the area of the door hinge</div>
          <img 
            src="/faults/image 16.png" 
            alt="Door contacts in the area of the door hinge" 
            className="w-full h-auto rounded-md max-w-xl mx-auto"
          />
          <p className="text-xs text-gray-600 mt-2">Clean the door contacts in this area</p>
        </div>
      </div>

      {/* Service Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Wrench className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-yellow-800">Service Notice</h5>
            <p className="text-sm text-yellow-700 mt-1">
              If the fault persists after cleaning the contacts, please contact Miele Customer Service or book a repair appointment online.
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

export default FaultF252;