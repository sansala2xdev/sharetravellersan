'use client';

import { Check, MapPin, DollarSign, Users, Clock, Calendar, Image, Notebook } from 'lucide-react';

interface ReviewStepProps {
  data: {
    serviceName: string;
    description: string;
    category: string;
    province: string;
    city: string;
    district: string;
    basePrice: string;
    adultPrice: string;
    childPrice: string;
    maxGroupSize: string;
    duration: string;
    durationType: string;
    availableDates: string[];
    timeSlots: { start: string; end: string }[];
    blockedDates: string[];
    images: Array<{ preview: string }>;
  };
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ReviewStep({ data, onSubmit, isSubmitting }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your service details before publishing</p>
      </div>

      {/* Basic Details */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Check className="w-5 h-5 text-orange-600" />
          </div>
          Basic Details
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Service Name</p>
            <p className="font-semibold text-gray-900">{data.serviceName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-900">{data.description}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-semibold text-gray-900">{data.category}</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          Location
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Province:</span>
            <span className="font-semibold text-gray-900">{data.province}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">City:</span>
            <span className="font-semibold text-gray-900">{data.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">District:</span>
            <span className="font-semibold text-gray-900">{data.district}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Capacity */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Notebook className="w-5 h-5 text-orange-600" />
          </div>
          Pricing & Capacity
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Base Price</p>
            <p className="text-2xl font-bold text-gray-900">${data.basePrice}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Adult Price</p>
            <p className="text-2xl font-bold text-gray-900">${data.adultPrice}</p>
          </div>
          {data.childPrice && (
            <div>
              <p className="text-sm text-gray-500">Child Price</p>
              <p className="text-2xl font-bold text-gray-900">${data.childPrice}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Max Group Size</p>
            <p className="flex items-center gap-2 text-gray-900 font-semibold">
              <Users className="w-5 h-5" />
              {data.maxGroupSize} guests
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="flex items-center gap-2 text-gray-900 font-semibold">
              <Clock className="w-5 h-5" />
              {data.duration} {data.durationType}
            </p>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          Availability
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Available Dates ({data.availableDates.length})
            </p>
            {data.availableDates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.availableDates.slice(0, 5).map((date) => (
                  <span
                    key={date}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                ))}
                {data.availableDates.length > 5 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    +{data.availableDates.length - 5} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No dates set</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">
              Time Slots ({data.timeSlots.length})
            </p>
            {data.timeSlots.length > 0 ? (
              <div className="space-y-1">
                {data.timeSlots.map((slot, index) => (
                  <p key={index} className="text-gray-900">
                    {slot.start} - {slot.end}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No time slots set</p>
            )}
          </div>

          {data.blockedDates.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Blocked Dates ({data.blockedDates.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {data.blockedDates.slice(0, 3).map((date) => (
                  <span
                    key={date}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                  >
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                ))}
                {data.blockedDates.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    +{data.blockedDates.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Image className="w-5 h-5 text-orange-600" />
          </div>
          Images ({data.images.length})
        </h3>
        {data.images.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {data.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
              >
                {index === 0 && (
                  <div className="absolute top-1 left-1 px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded z-10">
                    Cover
                  </div>
                )}
                <img
                  src={image.preview}
                  alt={`Service ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No images uploaded</p>
        )}
      </div>

      {/* Submit Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-orange-200 p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to Publish?
          </h3>
          <p className="text-gray-700">
            Your service will be live and visible to travelers on ShareTraveller
          </p>
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-lg font-semibold rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Publishing...
            </span>
          ) : (
            'Publish Service'
          )}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          You can edit your service details anytime from your dashboard
        </p>
      </div>
    </div>
  );
}
