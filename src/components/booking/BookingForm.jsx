// src/components/booking/BookingForm.jsx
import React, { useState } from 'react';
import PackageSelector from './PackageSelector';
import EventDetailsForm from './EventDetailsForm';
import ContactDetailsForm from './ContactDetailsForm';
import QuoteReview from './QuoteReview';
import BookingSuccess from './BookingSuccess';

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [createdBooking, setCreatedBooking] = useState(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleBookingCreated = (booking) => {
    setCreatedBooking(booking);
  };

  const stepsLabel = ['Package', 'Customizer', 'Details', 'Review', 'Success'];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      {/* Step Progress Indicators */}
      {step <= 4 && (
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-12">
          {stepsLabel.slice(0, 4).map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            return (
              <React.Fragment key={idx}>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isCompleted 
                        ? 'bg-gold text-velvet' 
                        : isActive 
                        ? 'bg-burgundy border border-gold text-gold shadow-gold-sm' 
                        : 'bg-white/5 border border-white/10 text-champagne/40'
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span
                    className={`hidden sm:inline font-body text-xs font-semibold ${
                      isActive ? 'text-gold' : 'text-champagne/40'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`h-[1px] w-8 sm:w-16 transition-all ${
                      isCompleted ? 'bg-gold' : 'bg-white/10'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Steps Switcher */}
      <div className="bg-velvet/30 border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.03)_0%,transparent_50%)] pointer-events-none" />
        
        {step === 1 && <PackageSelector onNext={nextStep} />}
        {step === 2 && <EventDetailsForm onNext={nextStep} onPrev={prevStep} />}
        {step === 3 && <ContactDetailsForm onNext={nextStep} onPrev={prevStep} />}
        {step === 4 && (
          <QuoteReview
            onNext={nextStep}
            onPrev={prevStep}
            onBookingCreated={handleBookingCreated}
          />
        )}
        {step === 5 && (
          <BookingSuccess
            booking={createdBooking}
          />
        )}
      </div>
    </div>
  );
};

export default BookingForm;
