'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from "@components/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/components/ui/avatar";
import { CalendarDays, MessageSquare, User, Code, BookOpen, HelpCircle, CheckCircle } from "lucide-react";

const MentorProfile = ({ mentor }) => {
  // State to hold the string identifier of the selected slot
  const [selectedSlot, setSelectedSlot] = useState(null);
  // State to track booking step
  const [bookingStep, setBookingStep] = useState(0); // 0: select slot, 1: confirm booking

  // Format availability into displayable slots
  const formatAvailabilitySlots = (availability) => {
    if (!availability || availability.length === 0) return [];
    
    return availability.map(slot => {
      // Parse date
      const date = new Date(slot.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Format date display
      let dateDisplay;
      if (date.toDateString() === today.toDateString()) {
        dateDisplay = 'Today';
      } else if (date.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString()) {
        dateDisplay = 'Tomorrow';
      } else {
        dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      // Format time for display
      const startTime = formatTimeDisplay(slot.startTime);
      const endTime = formatTimeDisplay(slot.endTime);
      
      return {
        date: dateDisplay,
        time: `${startTime} - ${endTime}`,
        rawDate: slot.date,
        rawTime: slot.startTime,
        rawEndTime: slot.endTime,
        fullDisplay: `${dateDisplay}, ${startTime} - ${endTime}`
      };
    });
  };

  // Format time from 24hr to 12hr format
  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Handler function for slot selection
  const handleSlotSelect = (slot) => {
    const slotId = `${slot.rawDate}-${slot.rawTime}`;
    setSelectedSlot(selectedSlot === slotId ? null : slotId);
    // Reset booking step when selecting a new slot
    setBookingStep(0);
  };

  // Handler for proceeding to booking confirmation
  const proceedToBooking = () => {
    setBookingStep(1);
  };

  // Handler for confirming booking
  const confirmBooking = () => {
    // Here you would typically send the booking data to your backend
    alert("Booking confirmed! A confirmation will be sent to your email.");
    // Reset states after successful booking
    setSelectedSlot(null);
    setBookingStep(0);
  };

  // Format price with currency
  const formatPrice = (price) => {
    return `₹${price}`;
  };

  // Prepare the displayable slots
  const availableSlots = formatAvailabilitySlots(mentor?.availability);
  
  // Find the selected slot object
  const selectedSlotObject = availableSlots.find(
    slot => `${slot.rawDate}-${slot.rawTime}` === selectedSlot
  );

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Left Column - Profile Info */}
      <motion.div 
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[340px] bg-[#27276B] text-white p-8 flex flex-col items-center shadow-lg relative"
      >
        {/* Profile Image with animation */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-48 mt-24 h-48 mb-6  rounded-full overflow-hidden border-4 border-purple-300/30"
        >
          <Avatar className="w-full h-full">
            <AvatarImage src='/aman.png' alt={`${mentor?.name}'s avatar`} />
            <AvatarFallback>
              <User className="w-20 h-20" />
            </AvatarFallback>
          </Avatar>
          
          {/* Purple gradient overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/20 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Name and Achievement */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2 text-center px-4">Aman Kumar</h1>
          <p className="text-sm mb-4 text-center opacity-90 px-4">DRDO Intern</p>
          
          {/* Animated divider */}
          <motion.div 
            className="h-0.5 bg-purple-300/30 w-16 mx-auto mb-5"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ delay: 0.6, duration: 0.4 }}
          />
        </motion.div>

        {/* Rate Display */}
        {mentor?.rate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full mb-6"
          >
            <CalendarDays className="w-5 h-5 text-purple-200" />
            <span className="font-medium">{formatPrice(mentor.rate)}</span>
            <span className="text-sm opacity-90">/ Session</span>
          </motion.div>
        )}

        {/* Skills Section */}
        {mentor?.skills && mentor.skills.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-4 w-full text-left px-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-4 h-4 text-purple-200" />
              <h3 className="text-sm uppercase tracking-wide opacity-80">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {mentor.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-white/10 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Help Section */}
        {mentor?.help && mentor.help.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="w-full text-left px-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-purple-200" />
              <h3 className="text-sm uppercase tracking-wide opacity-80">Can Help With</h3>
            </div>
            <ul className="list-disc list-inside text-sm space-y-1 opacity-90 pl-1">
              {mentor.help.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* About Section */}
        {mentor?.about && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6 w-full text-left px-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-purple-200" />
              <h3 className="text-sm uppercase tracking-wide opacity-80">About</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              {mentor.about}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Right Column - Main Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex-1 bg-white p-8 overflow-y-auto"
      >
        {/* Added the requested 80px top margin */}
        <div className="mt-20">
          {/* Session Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Let's connect 👋🏼</h2>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <CalendarDays className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">30 mins</p>
                  <p className="text-sm text-gray-500">Video Meeting</p>
                </div>
              </div>
              <div className="font-medium text-purple-600 text-lg">
                {formatPrice(mentor?.rate || 50)}
              </div>
            </div>

            {bookingStep === 0 ? (
              <>
                {/* Available Slots */}
                {availableSlots && availableSlots.length > 0 ? (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <h3 className="text-lg font-medium mb-4 text-gray-800">Select Available Time Slot</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableSlots.map((slot, index) => (
                        <Button
                          key={`${slot.rawDate}-${slot.rawTime}-${index}`}
                          variant="outline"
                          className={`justify-between border-gray-300 text-gray-800 hover:bg-gray-100
                                    ${selectedSlot === `${slot.rawDate}-${slot.rawTime}`
                                      ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:text-white'
                                      : 'bg-white'
                                    }`}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          <span>{slot.date}</span>
                          <span>{slot.time}</span>
                        </Button>
                      ))}
                    </div>
                    
                    {selectedSlot && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-8 flex justify-center"
                      >
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
                          onClick={proceedToBooking}
                        >
                          Continue to Book
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No availability slots found for this mentor.
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-medium mb-6 text-gray-800">Booking Confirmation</h3>
                
                <div className="bg-gray-50 p-5 rounded-lg mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CalendarDays className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Session Details</p>
                      <p className="text-sm text-gray-600">{selectedSlotObject?.fullDisplay}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 mb-4">
                    <User className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Mentor</p>
                      <p className="text-sm text-gray-600">{mentor?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Session Type</p>
                      <p className="text-sm text-gray-600">30 mins Video Call</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-medium text-gray-800">{formatPrice(mentor?.rate || 50)}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="border-gray-300 text-gray-700"
                      onClick={() => setBookingStep(0)}
                    >
                      Back
                    </Button>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                      onClick={confirmBooking}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Have a Question Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Have a question?</h2>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 text-gray-700">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Replies in 2 days</p>
                  <p className="text-sm text-gray-500">Priority DM</p>
                </div>
              </div>
              <Button variant="outline" className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100">
                Free
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MentorProfile;