'use client';

import { useState } from 'react';

interface Availability {
  isAvailable: boolean;
  nextAvailable?: string;
  responseTime?: string;
}

export default function AvailabilityIndicator() {
  const [availability] = useState<Availability>({
    isAvailable: true,
  });

  const statusConfig = {
    available: {
      color: 'bg-green-500',
      text: 'Available for work',
      pulse: true,
    },
    limited: {
      color: 'bg-yellow-500',
      text: 'Limited availability',
      pulse: true,
    },
    unavailable: {
      color: 'bg-red-500',
      text: 'Not available',
      pulse: false,
    },
  };

  const status = availability.isAvailable ? 'available' : 'unavailable';
  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${config.color}`} />
        {config.pulse && (
          <div
            className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} animate-ping opacity-75`}
          />
        )}
      </div>
      <div>
        <span className="text-sm font-medium">{config.text}</span>
        {availability.responseTime && (
          <p className="text-xs text-muted-foreground">
            Avg. response: {availability.responseTime}
          </p>
        )}
      </div>
    </div>
  );
}
