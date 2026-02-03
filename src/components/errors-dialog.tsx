'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Wrench, CheckCircle2, X } from 'lucide-react';
import FaultF066 from '@/components/fault-f066';
import FaultF055 from '@/components/fault-f055';
import FaultF252 from '@/components/fault-f252';

interface ErrorCode {
  code: string;
  title: string;
  description: string;
  causes: string[];
  solutions: string[];
  image?: string;
}

const errorCodes: ErrorCode[] = [
  {
    code: "F066",
    title: "Fault F66",
    description: "The tumble dryer has switched off. This fault code can have several causes.",
    causes: [
      "The fluff filters are soiled.",
      "The plinth filter in front of the heat exchanger is soiled.",
      "The tumble dryer has been overloaded by placing too much laundry inside.",
      "The ventilation grille under the door is obstructed.",
      "Ventilation to and from the appliance is insufficient (e.g. because it is installed in a small room). This may have caused the room temperature to rise sharply.",
      "The plinth filter is encrusted (see Fig.4).",
      "The plinth filter is damaged or out of shape (see Fig.5)."
    ],
    solutions: [
      "Environmental impact due to fluff which has been disposed of incorrectly. To prevent microplastics from spreading into the waste water system, fluff must not be drained away with the water. Dispose of the fluff collected by the fluff filters with your household waste.",
      "Tip: You can also use a vacuum cleaner so that you can remove the fluff without touching it.",
      "Clean the fluff filters as follows:",
      "1. Open the door.",
      "2. Pull the upper fluff filter forwards to remove it.",
      "3. Remove the fluff from the surface of all the fluff filters and the perforated laundry deflector.",
      "4. Turn the yellow rotary control on the lower fluff filter in the direction of the arrow (until you hear it click). Hold the rotary control and pull the fluff filter forwards to remove it.",
      "5. Use a vacuum cleaner with a long crevice nozzle attached to remove any visible fluff from the upper air flow openings.",
      "6. Clean all fluff filters with water:",
      "   - Wipe the smooth plastic surfaces with a damp cloth.",
      "   - Rinse the filter surfaces under warm running water.",
      "   - Shake thoroughly and dry carefully.",
      "7. Wet fluff filters could cause operational faults while drying. Push the lower fluff filter in completely and lock it with the yellow rotary control. Push the upper fluff filter all the way in. Close the door.",
      "For plinth filter:",
      "1. Press the round, indented area on the heat exchanger access panel to open it.",
      "2. Pull the plinth filter out by the handle.",
      "3. Clean carefully under running water.",
      "4. To speed up removal of residue, run a water jet vertically over the front of the plinth filter. Squeeze very carefully several times as you rinse it.",
      "5. The plinth filter must not be fitted dripping wet. Otherwise, this could cause a fault. Carefully squeeze the water out of the plinth filter.",
      "Risk of injury from sharp cooling fins. You could cut yourself. Do not touch the cooling fins with your hands. Use a vacuum cleaner with a dusting brush attached.",
      "For overloading: Take out some of the laundry. Start the process again.",
      "Remove objects that are obstructing the ventilation grille under the door.",
      "For insufficient ventilation: When drying, open a door or window to ensure sufficient ventilation.",
      "For encrusted plinth filter: Wash separately in the washing machine without detergent at max. 40 °C with a spin speed of max. 600 rpm.",
      "For damaged plinth filter: Replace the plinth filter. You can order a plinth filter from the Miele online shop."
    ]
  },
  {
    code: "F252",
    title: "Door Contact Issue",
    description: "The door contacts in the area of the door hinge are dirty.",
    causes: [
      "Dirty door contacts in hinge area",
      "Contamination in the door hinge area"
    ],
    solutions: [
      "Clean the door contacts thoroughly",
      "Ensure the door hinge area is free from debris",
      "Contact Miele Customer Service if the issue persists"
    ]
  },
  {
    code: "F055",
    title: "Maximum Drying Time Exceeded", 
    description: "The laundry is still not dry after the maximum drying time of 180 minutes. Only with residual moisture drying programme.",
    causes: [
      "The drum is too full",
      "The laundry is too damp",
      "The fluff filters are soiled",
      "The laundry has not been spun sufficiently"
    ],
    solutions: [
      "Do not exceed the maximum load size for the drying programme selected",
      "Spin the laundry at a higher speed in the washing machine",
      "Clean the fluff filters thoroughly following the provided steps",
      "Ensure laundry is spun at the highest possible speed in the washing machine"
    ]
  },
  {
    code: "Others",
    title: "Other Technical Faults",
    description: "Various technical faults that require professional service.",
    causes: [],
    solutions: []
  }
];

interface ErrorsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  buildingName: string;
}

export default function ErrorsDialog({ isOpen, onClose, buildingName }: ErrorsDialogProps) {
  const [selectedError, setSelectedError] = useState(errorCodes[0]?.code || '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Error Codes - {buildingName}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Tabs value={selectedError} onValueChange={setSelectedError} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {errorCodes.map((error) => (
              <TabsTrigger 
                key={error.code} 
                value={error.code}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                {error.code}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {errorCodes.map((error) => (
            <TabsContent key={error.code} value={error.code}>
              {error.code === 'F066' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Error {error.code}: {error.title}
                    </CardTitle>
                    <CardDescription>{error.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FaultF066 />
                  </CardContent>
                </Card>
              ) : error.code === 'F055' || error.code === 'F252' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Error {error.code}: {error.title}
                    </CardTitle>
                    <CardDescription>{error.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error.code === 'F055' ? <FaultF055 /> : <FaultF252 />}
                  </CardContent>
                </Card>
              ) : error.code === 'Others' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      {error.title}
                    </CardTitle>
                    <CardDescription>{error.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Fault F1 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F1
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F1 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> Refrigerant temperature sensor short-circuited.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F2 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F2
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F2 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an open circuit at the refrigerant temperature sensor.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F3 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F3
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F3 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> A short circuit has occurred at the drying air temperature sensor.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F4 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F4
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F4 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an open circuit at the drying air temperature sensor.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F30 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F30
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F30 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> Different signal for door and door contact.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F36 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F36
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F36 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> Door contact (reed contact) defective.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F38 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F38
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F38 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an electronic module fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F39 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F39
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F39 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an electronic module fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F40 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F40
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F40 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an electronic module fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F41 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F41
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F41 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an electronic module fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F43 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F43
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F43 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> Model type not programmed/incorrect variant.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F45 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F45
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F45 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an electronic module fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F46 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F46
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F46 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an electronic module fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F50 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F50
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F50 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> The drum is too full.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          <strong>Solution:</strong> Do not exceed the maximum load size for the drying programme selected. Information on the load size can be found in the operating instructions.
                        </p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> After opening the door, e.g. to add laundry, F50 may appear in the display after approx. 1 minute. There is a software fault.
                        </p>
                        <p className="text-sm text-yellow-800 mt-2">
                          Switch the appliance off and back on again straight away.
                        </p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ If the issue persists, there is a technical fault. Contact Miele Customer Service.
                        </p>
                      </div>
                    </div>

                    {/* Fault F53 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F53
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F53 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> The drive motor is defective/there is an electronic module fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F99 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F99
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F99 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> The appliance is disabled.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F104 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F104
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F104 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> The mains voltage applied to the drive motor is too low.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F108 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F108
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F108 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an electronic module fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F156 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F156
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F156 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> A short circuit has occurred at the refrigerant temperature sensor downstream of the condenser.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F157 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F157
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F157 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an open circuit at the refrigerant temperature sensor downstream of the condenser.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F158 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F158
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F158 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> The appliance has overheated.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F159 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F159
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F159 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is a compressor start-up fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F206 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F206
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F206 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> A short circuit has occurred at the refrigerant temperature sensor downstream of the compressor.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Fault F242 Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Fault F242
                      </h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Fault F242 is shown on the tumble dryer display.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Issue:</strong> There is an electronic module fault.
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          ⚠️ This is a technical fault that you cannot remedy yourself.
                        </p>
                      </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-yellow-800">Professional Service Required</h5>
                          <p className="text-sm text-yellow-700 mt-1">
                            These technical faults require professional diagnosis and repair. Please contact Miele Customer Service or an authorized service technician.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Error {error.code}: {error.title}
                    </CardTitle>
                    <CardDescription>{error.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Standard single image placeholder for other error codes */}
                    <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Image</span>
                        </div>
                        <p className="text-gray-500 text-sm">Diagnostic Image</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Causes */}
                      <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          Possible Causes
                        </h4>
                        <ul className="space-y-2">
                          {error.causes.map((cause, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Solutions */}
                      <div>
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-blue-500" />
                          How to fix it?
                        </h4>
                        <ul className="space-y-2">
                          {error.solutions.map((solution, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-yellow-800">Important Notice</h5>
                          <p className="text-sm text-yellow-700 mt-1">
                            If the problem persists after trying these solutions, please contact the building maintenance team or call a professional service technician.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
