// src/components/booking/EventDetailsForm.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { EVENT_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { useBookings } from '../../hooks/useBookings';

const EventDetailsForm = ({ onNext, onPrev }) => {
  const { eventDetails, setEventDetails, cateringDetails, setCateringDetails } = useCart();
  const { checkSlotAvailability } = useBookings();
  const [checking, setChecking] = useState(false);

  const [localDetails, setLocalDetails] = useState({ ...eventDetails });
  const [localCatering, setLocalCatering] = useState({ ...cateringDetails });

  const handleDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalDetails((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCateringChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalCatering((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localDetails.eventDate || !localDetails.venueName) {
      toast.error('Date and Venue name are required.');
      return;
    }

    setChecking(true);
    // Verify booking date availability in Vijayawada database
    const available = await checkSlotAvailability(localDetails.eventDate);
    setChecking(false);

    if (!available) {
      toast.error(`Sorry! Event date ${localDetails.eventDate} is already booked.`);
      return;
    }

    setEventDetails(localDetails);
    setCateringDetails(localCatering);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto text-left">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-gold">Step 2: Customize Event & Decor</h3>
        <p className="font-body text-xs text-champagne/60 mt-1">Specify date, venue location, and food catering details</p>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-6">
        <h4 className="font-display text-gold text-sm font-semibold border-b border-white/5 pb-2">Event Parameters</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Event Type"
            name="eventType"
            value={localDetails.eventType}
            onChange={handleDetailsChange}
            options={EVENT_TYPES.map(e => ({ value: e.id, label: e.label }))}
          />
          <Input
            label="Event Date"
            name="eventDate"
            type="date"
            value={localDetails.eventDate}
            onChange={handleDetailsChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Venue Name"
            name="venueName"
            value={localDetails.venueName}
            onChange={handleDetailsChange}
            placeholder="e.g. Imperial Hall"
            required
          />
          <Select
            label="Stage Decoration Theme"
            name="stageDecoration"
            value={localDetails.stageDecoration}
            onChange={handleDetailsChange}
            options={[
              { value: 'standard', label: 'Standard Classic Decor Theme' },
              { value: 'premium', label: 'Premium Stage Setup' },
              { value: 'royal', label: 'Royal Grand Backdrop Setup' },
            ]}
          />
        </div>

        <Input
          label="Venue Full Address"
          name="venueAddress"
          value={localDetails.venueAddress}
          onChange={handleDetailsChange}
          placeholder="Detailed address of the venue"
        />
      </div>

      {/* Catering customizer */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h4 className="font-display text-gold text-sm font-semibold">Gourmet Catering Options</h4>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="enabled"
              checked={localCatering.enabled}
              onChange={handleCateringChange}
              className="mr-2 rounded border-white/10 text-gold bg-charcoal focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="font-body text-xs text-champagne/80">Add Catering Platter</span>
          </label>
        </div>

        {localCatering.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn">
            <Input
              label="Vegetarian Guests Count"
              name="vegGuests"
              type="number"
              value={localCatering.vegGuests}
              onChange={handleCateringChange}
              placeholder="e.g. 150"
            />
            <Input
              label="Non-Vegetarian Guests Count"
              name="nonVegGuests"
              type="number"
              value={localCatering.nonVegGuests}
              onChange={handleCateringChange}
              placeholder="e.g. 200"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button onClick={onPrev} variant="outline" className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold">
          Back
        </Button>
        <Button type="submit" disabled={checking} className="px-8 py-2.5 text-xs uppercase tracking-wider font-semibold">
          {checking ? 'Checking slot...' : 'Next Step'}
        </Button>
      </div>
    </form>
  );
};

export default EventDetailsForm;
