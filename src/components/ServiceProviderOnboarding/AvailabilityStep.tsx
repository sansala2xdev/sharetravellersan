'use client';

import { useState } from 'react';
import { Calendar, Clock, X, Plus } from 'lucide-react';

interface AvailabilityStepProps {
  data: {
    availableDates: string[];
    timeSlots: { start: string; end: string }[];
    blockedDates: string[];
  };
  onChange: (data: any) => void;
}

export default function AvailabilityStep({ data, onChange }: AvailabilityStepProps) {
  const [newDate, setNewDate] = useState('');
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState({ start: '', end: '' });

  const handleAddDate = () => {
    if (newDate && !data.availableDates.includes(newDate)) {
      onChange({
        ...data,
        availableDates: [...data.availableDates, newDate].sort(),
      });
      setNewDate('');
    }
  };

  const handleRemoveDate = (date: string) => {
    onChange({
      ...data,
      availableDates: data.availableDates.filter((d) => d !== date),
    });
  };

  const handleAddBlockedDate = () => {
    if (newBlockedDate && !data.blockedDates.includes(newBlockedDate)) {
      onChange({
        ...data,
        blockedDates: [...data.blockedDates, newBlockedDate].sort(),
      });
      setNewBlockedDate('');
    }
  };

  const handleRemoveBlockedDate = (date: string) => {
    onChange({
      ...data,
      blockedDates: data.blockedDates.filter((d) => d !== date),
    });
  };

  const handleAddTimeSlot = () => {
    if (newTimeSlot.start && newTimeSlot.end) {
      onChange({
        ...data,
        timeSlots: [...data.timeSlots, newTimeSlot],
      });
      setNewTimeSlot({ start: '', end: '' });
    }
  };

  const handleRemoveTimeSlot = (index: number) => {
    onChange({
      ...data,
      timeSlots: data.timeSlots.filter((_, i) => i !== index),
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability Setup</h2>
        <p className="text-gray-600">Set when your service is available for booking</p>
      </div>

      {/* Available Dates */}
      <div className="bg-orange-50 rounded-xl p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Calendar className="w-5 h-5" />
          Available Dates
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Add Available Dates
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={getTodayDate()}
              className="flex-1 px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleAddDate}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Select dates when your service is available
          </p>
        </div>

        {data.availableDates.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Selected Dates ({data.availableDates.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {data.availableDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-green-300 rounded-lg"
                >
                  <span className="text-sm text-gray-700">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => handleRemoveDate(date)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No dates selected yet</p>
            <p className="text-sm text-gray-400 mt-1">Add dates when your service is available</p>
          </div>
        )}
      </div>

      {/* Time Slots */}
      <div className="bg-amber-50 rounded-xl p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Clock className="w-5 h-5" />
          Time Slots
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Add Time Slot
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="time"
                value={newTimeSlot.start}
                onChange={(e) => setNewTimeSlot({ ...newTimeSlot, start: e.target.value })}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Start time"
              />
            </div>
            <div className="flex-1">
              <input
                type="time"
                value={newTimeSlot.end}
                onChange={(e) => setNewTimeSlot({ ...newTimeSlot, end: e.target.value })}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="End time"
              />
            </div>
            <button
              onClick={handleAddTimeSlot}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Define time slots when tours start
          </p>
        </div>

        {data.timeSlots.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Time Slots ({data.timeSlots.length})
            </p>
            <div className="space-y-2">
              {data.timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 bg-white border border-blue-300 rounded-lg"
                >
                  <span className="text-sm text-gray-700">
                    {slot.start} - {slot.end}
                  </span>
                  <button
                    onClick={() => handleRemoveTimeSlot(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No time slots added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add times when your service starts</p>
          </div>
        )}
      </div>

      {/* Blocked Dates */}
      <div className="bg-red-50 rounded-xl p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <X className="w-5 h-5" />
          Blocked Dates (Optional)
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Block Unavailable Dates
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              min={getTodayDate()}
              className="flex-1 px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleAddBlockedDate}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Block dates when service is not available (holidays, maintenance, etc.)
          </p>
        </div>

        {data.blockedDates.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Blocked Dates ({data.blockedDates.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {data.blockedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-red-300 rounded-lg"
                >
                  <span className="text-sm text-gray-700">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => handleRemoveBlockedDate(date)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
