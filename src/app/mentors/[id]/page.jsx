// src/app/mentors/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@components/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@components/components/ui/avatar";
import { CalendarDays, MessageSquare, User, Code, BookOpen, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const MentorProfile = () => {
  // State for mobile view
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  // Static Mentor Data (replace with your actual data source later)
  const mentor = {
    name: "Aman Kumar",
    rate: 50,
    skills: ["JavaScript", "React", "Node.js", "Next.js"],
    help: ["Telling place for hangout's", "Telling about campus life"],
    about: "I love traveling and attending conferences & exhibitions I like to learn challenging things",
    availability: [
      { date: "2024-07-08", startTime: "10:00", endTime: "10:30" },
      { date: "2024-07-09", startTime: "14:00", endTime: "14:30" },
      { date: "2024-07-10", startTime: "16:00", endTime: "16:30" },
      { date: "2024-07-11", startTime: "11:00", endTime: "11:30" },
    ],
  };

  // State to hold the string identifier of the selected slot
  const [selectedSlot, setSelectedSlot] = useState(null);
  // State to track booking step
  const [bookingStep, setBookingStep] = useState(0); // 0: select slot, 1: confirm booking

  // Check if the device is mobile on component mount and when window is resized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Set up event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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
    // If on mobile, close the profile sidebar
    if (isMobile) {
      setShowMobileProfile(false);
    }
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

  // Toggle mobile profile view
  const toggleMobileProfile = () => {
    setShowMobileProfile(!showMobileProfile);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white overflow-hidden">
      {/* Mobile Profile Header - Only visible on mobile */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-[#27276B] text-white pt-16 pb-6 px-4 flex items-center gap-4 shadow-md"
        >
          <Avatar className="w-16 h-16 border-2 border-purple-300/30">
            <AvatarImage src='/aman.png' alt={`${mentor?.name}'s avatar`} />
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{mentor.name}</h1>
            <p className="text-sm opacity-80">DRDO Intern</p>
            <div className="flex items-center gap-1 mt-1 bg-white/10 px-2 py-1 rounded-full text-xs">
              <CalendarDays className="w-3 h-3 text-purple-200" />
              <span>{formatPrice(50)}</span>
              <span className="opacity-80">/ Session</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile Profile Toggle Button - Only visible on mobile */}
      {isMobile && (
        <motion.div 
          className="fixed bottom-4 right-4 z-50"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button 
            onClick={toggleMobileProfile}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          >
            {showMobileProfile ? <ChevronDown className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </Button>
        </motion.div>
      )}

      {/* Left Column - Profile Info (Desktop version and Mobile slide-up) */}
      <motion.div
        initial={isMobile ? 
          { x: 0, y: 100, opacity: 0, height: '0' } : 
          { x: -30, opacity: 0 }
        }
        animate={isMobile ?
          { 
            x: 0, 
            y: 0, 
            opacity: showMobileProfile ? 1 : 0,
            height: showMobileProfile ? 'auto' : '0'
          } : 
          { x: 0, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${isMobile ? 'fixed bottom-0 left-0 right-0 z-40 shadow-lg rounded-t-3xl overflow-hidden' : 'w-full md:w-[340px]'} 
                  bg-[#27276B] text-white p-4 md:p-8 flex flex-col items-center relative`}
      >
        {/* Profile Content - Will be hidden when collapsed on mobile */}
        <div className={`w-full transition-all duration-300 ${isMobile && !showMobileProfile ? 'opacity-0 pointer-events-none h-0' : 'opacity-100'}`}>
          {/* Mobile Close Bar - Only visible on mobile */}
          {isMobile && (
            <div className="w-full flex justify-center mb-2">
              <div className="w-12 h-1 bg-white/30 rounded-full" />
            </div>
          )}
          
          {/* Profile Image with animation - Only shown on desktop since mobile has it in the header */}
          {!isMobile && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative w-32 md:w-48 mt-2 md:mt-24 h-32 md:h-48 mb-4 md:mb-6 mx-auto rounded-full overflow-hidden border-4 border-purple-300/30"
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
          )}

          {/* Name and Achievement - Only shown on desktop since mobile has it in the header */}
          {!isMobile && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-center px-4">{mentor.name}</h1>
              <p className="text-sm mb-3 md:mb-4 text-center opacity-90 px-4">DRDO Intern</p>

              {/* Animated divider */}
              <motion.div
                className="h-0.5 bg-purple-300/30 w-16 mx-auto mb-4 md:mb-5"
                initial={{ width: 0 }}
                animate={{ width: "4rem" }}
                transition={{ delay: 0.6, duration: 0.4 }}
              />
            </motion.div>
          )}

          {/* Rate Display - Only shown on desktop since mobile has it in the header */}
          {!isMobile && mentor?.rate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full mb-4 md:mb-6 mx-auto"
            >
              <CalendarDays className="w-5 h-5 text-purple-200" />
              <span className="font-medium">{formatPrice(50)}</span>
              <span className="text-sm opacity-90">/ Session</span>
            </motion.div>
          )}



          {/* About Section */}
          {mentor?.about && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-3 md:mt-8 w-full text-left px-4 pb-4 md:pb-0"
            >
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <BookOpen className="w-4 h-4 text-purple-200" />
                <h3 className="text-sm uppercase tracking-wide opacity-80">About</h3>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                {mentor.about}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Right Column - Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex-1 bg-white p-4 md:p-8 overflow-y-auto"
      >
        {/* Content container with margin adjusted for mobile/desktop */}
        <div className={`${isMobile ? 'mt-4' : 'mt-20'} pb-24 md:pb-0`}>
          {/* Session Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-800">Let's connect 👋🏼</h2>
            <div className="flex items-center justify-between bg-gray-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3 text-gray-700">
                <CalendarDays className="w-4 md:w-5 h-4 md:h-5 text-gray-500" />
                <div>
                  <p className="font-medium">30 mins</p>
                  <p className="text-xs md:text-sm text-gray-500">Video Meeting</p>
                </div>
              </div>
              <div className="font-medium text-purple-600 text-base md:text-lg">
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
                    <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 text-gray-800">Select Available Time Slot</h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                      {availableSlots.map((slot, index) => (
                        <Button
                          key={`${slot.rawDate}-${slot.rawTime}-${index}`}
                          variant="outline"
                          className={`justify-between border-gray-300 text-gray-800 hover:bg-gray-100 text-sm md:text-base
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
                        className="mt-6 md:mt-8 flex justify-center"
                      >
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full md:w-auto"
                          onClick={proceedToBooking}
                        >
                          Continue to Book
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-center py-4 md:py-6 text-gray-500">
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
                <h3 className="text-base md:text-lg font-medium mb-4 md:mb-6 text-gray-800">Booking Confirmation</h3>

                <div className="bg-gray-50 p-4 md:p-5 rounded-lg mb-4 md:mb-6">
                  <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                    <CalendarDays className="w-4 md:w-5 h-4 md:h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Session Details</p>
                      <p className="text-xs md:text-sm text-gray-600">{selectedSlotObject?.fullDisplay}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                    <User className="w-4 md:w-5 h-4 md:h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Mentor</p>
                      <p className="text-xs md:text-sm text-gray-600">{mentor?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3">
                    <MessageSquare className="w-4 md:w-5 h-4 md:h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Session Type</p>
                      <p className="text-xs md:text-sm text-gray-600">30 mins Video Call</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center py-4 border-t border-gray-200 gap-4 md:gap-0">
                  <div className="mb-2 md:mb-0">
                    <p className="text-xs md:text-sm text-gray-500">Total</p>
                    <p className="text-lg md:text-xl font-medium text-gray-800">{formatPrice(mentor?.rate || 50)}</p>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 flex-1 md:flex-auto"
                      onClick={() => setBookingStep(0)}
                    >
                      Back
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 flex-1 md:flex-auto"
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
            className="mt-6 md:mt-8 bg-white rounded-xl p-4 md:p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center flex-wrap">
              <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">Have a question?</h2>
              <span className="text-xs md:text-sm font-semibold text-transparent bg-clip-text wave-text mb-2 md:mb-4">
                Coming Soon...
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 md:p-4 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3 text-gray-700">
                <MessageSquare className="w-4 md:w-5 h-4 md:h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Replies in 2 days</p>
                  <p className="text-xs md:text-sm text-gray-500">Priority DM</p>
                </div>
              </div>
              <Button variant="outline" className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100 text-sm md:text-base">
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