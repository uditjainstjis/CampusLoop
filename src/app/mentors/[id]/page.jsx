// src/app/mentors/[id]/page.jsx
'use client'; // This is a Client Component

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@components/components/ui/button"; // Adjust import path
import { Avatar, AvatarFallback, AvatarImage } from "@components/components/ui/avatar"; // Adjust import path
import { CalendarDays, MessageSquare, User, Code, BookOpen, HelpCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

// --- Helper function to format date for user's local timezone ---
const formatDateForUser = (utcDate) => {
  if (!utcDate) return 'Invalid Date';
  const date = new Date(utcDate); // Create Date object from UTC (or ISO string)
  if (isNaN(date.getTime())) return 'Invalid Date';

  // Use toLocaleDateString to display the date in the user's local timezone
  // Customize options as needed for a user-friendly format
  try {
       return date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
      console.error("Error formatting date for user:", e, date);
      return 'Invalid Date';
  }
};

// --- Helper function to format time range for user's local timezone ---
const formatTimeRangeForUser = (utcStartTime, utcEndTime) => {
  if (!utcStartTime || !utcEndTime) return 'Invalid Time';
  const startDate = new Date(utcStartTime); // Create Date objects from UTC
  const endDate = new Date(utcEndTime);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'Invalid Time';

  // Use toLocaleTimeString to display the time in the user's local timezone
  // Customize options (e.g., hour12: true/false, timeZoneName: 'short')
   try {
       const startTimeStr = startDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
       const endTimeStr = endDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });

       // Check if the times are on the same day in the user's timezone for simpler display
       // This is a basic check; full date change logic across timezones is complex.
       const startDay = startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });
       const endDay = endDate.toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' });

       if (startDay === endDay) {
            return `${startTimeStr} - ${endTimeStr}`;
       } else {
           // Indicate it crosses midnight if needed
           return `${startTimeStr} - ${endTimeStr} (Next Day)`; // Example
       }


   } catch (e) {
       console.error("Error formatting time range for user:", e, startDate, endDate);
       return 'Invalid Time';
   }
};

// --- Helper function to format a full display string including date and time range ---
const formatFullDisplayForUser = (utcStartTime, utcEndTime) => {
    const date = formatDateForUser(utcStartTime);
    const timeRange = formatTimeRangeForUser(utcStartTime, utcEndTime);
    if (date === 'Invalid Date' || timeRange === 'Invalid Time') return 'Invalid Slot';
    return `${date}, ${timeRange}`;
};


// This is a dynamic route component in Next.js App Router.
// It receives 'params' as a prop containing the route parameters.
const MentorProfile = ({ params }) => {
  // Use React.use(params) if you are streaming, otherwise just access params directly
  const { id } = React.use(params); // Extract the mentor ID from the URL params

  // State for fetching data
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI interactions
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  // selectedSlot now stores the *processed* slot object for display and booking
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState(0); // 0: select slot, 1: confirm booking

  // State to hold the availability slots formatted for user display
  const [availableSlotsForDisplay, setAvailableSlotsForDisplay] = useState([]);


  // Fetch mentor data from the API
  useEffect(() => {
    const fetchMentor = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch data using the ID
        // Ensure your API route /api/mentors/[id] fetches the mentor and includes the 'availability' array
        const response = await fetch(`/api/mentor/${id}`); // Use the PATCH API route for GET as well, or create a dedicated GET route

        if (!response.ok) {
          if (response.status === 404) {
             throw new Error('Mentor not found');
          }
          throw new Error(`Failed to fetch mentor data: ${response.statusText}`);
        }
        const data = await response.json(); // Data includes availability: [{ startTime: Date, endTime: Date }, ...]
        console.log("Fetched mentor data:", data); // Log data to inspect format

        setMentor(data);

        // Process the fetched availability data for display
        if (data.availability && Array.isArray(data.availability)) {
            const processedSlots = data.availability.map(slot => {
                // Ensure Date objects are valid
                const startTime = new Date(slot.startTime);
                const endTime = new Date(slot.endTime);

                // Create a unique ID using the ISO strings of the UTC dates
                const slotId = `${startTime.toISOString()}-${endTime.toISOString()}`;

                return {
                    id: slotId, // Unique ID for key and selection tracking
                    startTime: startTime, // Keep original UTC Date objects for booking
                    endTime: endTime,
                    date: formatDateForUser(startTime), // Formatted date for display (User's Local Time)
                    time: formatTimeRangeForUser(startTime, endTime), // Formatted time range for display (User's Local Time)
                    fullDisplay: formatFullDisplayForUser(startTime, endTime) // Combined string for confirmation
                    // Add other slot properties if needed
                };
            });
             setAvailableSlotsForDisplay(processedSlots);
        } else {
             setAvailableSlotsForDisplay([]); // No availability or invalid format
        }


      } catch (err) {
        console.error("Fetching mentor failed:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) { // Only fetch if id is available
      fetchMentor();
    }

  }, [id]); // Re-run effect if id changes (e.g., navigating between mentor pages)

  // Check if the device is mobile on component mount and when window is resized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile(); // Initial check
    window.addEventListener('resize', checkIfMobile); // Set up event listener
    return () => window.removeEventListener('resize', checkIfMobile); // Clean up
  }, []);


  // Handler function for slot selection - receives the *processed* slot object
  const handleSlotSelect = (slot) => {
    // Toggle selection based on the unique ID
    setSelectedSlot(selectedSlot?.id === slot.id ? null : slot);
    // Reset booking step when selecting/deselecting a slot
    setBookingStep(0);
     console.log("Slot selected:", slot); // Log the selected slot object
  };

  // Handler for proceeding to booking confirmation
  const proceedToBooking = () => {
    if (selectedSlot) { // Only proceed if a slot is selected
       setBookingStep(1);
       // If on mobile, close the profile sidebar (if it slides up)
       if (isMobile && showMobileProfile) {
         setShowMobileProfile(false);
       }
    }
  };

  // Handler for confirming booking
  const confirmBooking = () => {
    if (!selectedSlot) {
        alert('No slot selected for booking.'); // Should not happen if button is disabled correctly
        return;
    }
    // Here you would typically send the booking data to your backend
    // using the mentor ID and selected slot's Date objects
    console.log("Booking confirmed for mentor ID:", mentor?._id, "Slot UTC start:", selectedSlot.startTime, "Slot UTC end:", selectedSlot.endTime);

    // --- Example API Call (replace with your actual booking logic) ---
    // const bookingDetails = {
    //   mentorId: mentor?._id,
    //   startTime: selectedSlot.startTime.toISOString(), // Send ISO string of UTC Date
    //   endTime: selectedSlot.endTime.toISOString(),   // Send ISO string of UTC Date
    //   // Add user ID, etc.
    // };
    // fetch('/api/bookings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(bookingDetails),
    // })
    // .then(async response => {
    //   const data = await response.json();
    //   if (!response.ok) {
    //      throw new Error(data.error || 'Booking failed');
    //   }
    //   alert("Booking confirmed successfully!"); // Replace with better UI
    //   // Reset states after successful booking
    //   setSelectedSlot(null);
    //   setBookingStep(0);
    //   // Optionally refresh mentor availability if the booked slot should disappear
    //   // fetchMentor();
    // })
    // .catch(error => {
    //   console.error("Booking failed:", error);
    //   alert("Booking failed. Please try again. Details: " + error.message); // Replace with better UI
    //   // Optionally revert booking step or keep it on the error page
    // });
    // --- End Example API Call ---

    // Placeholder confirmation (remove in production)
    alert(`Booking confirmed for slot on ${selectedSlot.date} from ${selectedSlot.time}`);
    // Reset states after placeholder confirmation
    setSelectedSlot(null);
    setBookingStep(0);
  };

  // Format price with currency (Assuming mentor object has a 'rate' property)
  const formatPrice = (price) => {
    // Ensure price is a number and format it
    const numericPrice = typeof price === 'number' ? price : parseFloat(price);
    if (isNaN(numericPrice)) return 'N/A';
    return `₹${numericPrice.toFixed(0)}`; // Format as needed, e.g., to fixed decimal places
  };

  // Toggle mobile profile view
  const toggleMobileProfile = () => {
    setShowMobileProfile(!showMobileProfile);
  };

  // --- Render Logic based on Loading/Error/Data ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
        <span className="text-gray-600">Loading mentor profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-red-600 p-4 text-center">
        <HelpCircle className="w-12 h-12 mb-4" />
        <p className="text-xl font-semibold">Error loading profile</p>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!mentor) {
       // This case might happen if loading finishes but mentor is null (e.g., 404 from API)
      return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-700 p-4 text-center">
            <HelpCircle className="w-12 h-12 mb-4" />
            <p className="text-xl font-semibold">Mentor not found</p>
            <p className="text-sm text-gray-600 mt-2">Could not load profile for ID: {id}.</p>
         </div>
      );
  }

  // --- Main Render when data is loaded ---
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
            {/* Use mentor?.imageUrl */}
            <AvatarImage src={mentor?.imageUrl || '/placeholder-avatar.png'} alt={`${mentor?.name}'s avatar`}     className="w-full h-full object-cover"            />
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{mentor.name}</h1>
            {/* Use mentor?.achievement */}
            <p className="text-sm opacity-80">{mentor?.achievement || 'Mentor'}</p>
            {mentor?.rate && (
                <div className="flex items-center gap-1 mt-1 bg-white/10 px-2 py-1 rounded-full text-xs">
                  <CalendarDays className="w-3 h-3 text-purple-200" />
                  <span>{formatPrice(mentor.rate)}</span> {/* Use fetched rate */}
                  <span className="opacity-80">/ Session</span>
                </div>
            )}
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
            height: showMobileProfile ? 'auto' : '0',
            paddingBottom: showMobileProfile ? '1rem' : '0' // Add padding when open
          } :
          { x: 0, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        // Conditional classes for mobile fixed/slide-up vs desktop static
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
                 <AvatarImage src={mentor?.imageUrl || '/placeholder-avatar.png'} alt={`${mentor?.name}'s avatar`}     className="w-full h-full object-cover" />
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
              <p className="text-sm mb-3 md:mb-4 text-center opacity-90 px-4">{mentor?.achievement || 'Mentor'}</p>

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
              <span>{formatPrice(mentor.rate)}</span>
              <span className="text-sm opacity-90">/ Session</span>
            </motion.div>
          )}

           {/* Skills Section */}
           {mentor?.skills && mentor.skills.length > 0 && (
             <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.7, duration: 0.5 }}
               className="mt-3 md:mt-6 w-full text-left px-4"
             >
               <div className="flex items-center gap-2 mb-2 md:mb-3">
                 <Code className="w-4 h-4 text-purple-200" />
                 <h3 className="text-sm uppercase tracking-wide opacity-80">Skills</h3>
               </div>
               <div className="flex flex-wrap gap-2">
                 {mentor.skills.map((skill, index) => (
                   <span key={index} className="bg-white/10 text-xs px-3 py-1 rounded-full opacity-90">
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
               transition={{ delay: 0.75, duration: 0.5 }}
               className="mt-3 md:mt-6 w-full text-left px-4"
             >
               <div className="flex items-center gap-2 mb-2 md:mb-3">
                 <HelpCircle className="w-4 h-4 text-purple-200" />
                 <h3 className="text-sm uppercase tracking-wide opacity-80">Can Help With</h3>
               </div>
               <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
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
            {/* Session type/rate display - Ensure this reflects actual options if they vary */}
            <div className="flex items-center justify-between bg-gray-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3 text-gray-700">
                <CalendarDays className="w-4 md:w-5 h-4 md:h-5 text-gray-500" />
                <div>
                   {/* Assuming a standard session duration displayed here, maybe make this dynamic later */}
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
                {availableSlotsForDisplay && availableSlotsForDisplay.length > 0 ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {/* Added label indicating times are local */}
                    <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 text-gray-800">Select Available Time Slot <span className="text-sm text-gray-500">(Your Local Time)</span></h3>
                     {/* Use availableSlotsForDisplay for mapping */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                       {/* Map over the processed array */}
                      {availableSlotsForDisplay.map((slot) => (
                         // Use slot.id for the key and comparison
                        <Button
                          key={slot.id}
                          variant="outline"
                          className={`justify-between border-gray-300 text-gray-800 hover:bg-gray-100 text-sm md:text-base p-4
                                    ${selectedSlot?.id === slot.id // Compare using the unique ID
                              ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:text-white'
                              : 'bg-white hover:border-gray-400' // Added subtle hover border change
                            }`}
                          onClick={() => handleSlotSelect(slot)} // Pass the *processed slot object*
                        >
                          {/* Display formatted date and time */}
                          <span className="font-medium">{slot.date}</span>
                          <span>{slot.time}</span>
                        </Button>
                      ))}
                    </div>

                    {/* Only show the Continue button if a slot is selected */}
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
                   // Only show this message if data is loaded AND availability is empty
                   !isLoading && mentor && (
                      <div className="text-center py-4 md:py-6 text-gray-500">
                         No availability slots found for this mentor.
                      </div>
                   )
                )}
              </>
            ) : (
               // Booking Confirmation Step
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-base md:text-lg font-medium mb-4 md:mb-6 text-gray-800">Booking Confirmation</h3>

                 {/* Display selected slot details using the selectedSlot object */}
                 {selectedSlot && (
                    <div className="bg-gray-50 p-4 md:p-5 rounded-lg mb-4 md:mb-6">
                      <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                        <CalendarDays className="w-4 md:w-5 h-4 md:h-5 text-purple-600 mt-1" />
                        <div>
                          <p className="font-medium text-gray-800">Session Details</p>
                          {/* Use the pre-formatted fullDisplay string */}
                          <p className="text-xs md:text-sm text-gray-600">{selectedSlot.fullDisplay}</p>
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
                          {/* This seems hardcoded */}
                          <p className="text-xs md:text-sm text-gray-600">30 mins Video Call</p>
                        </div>
                      </div>
                    </div>
                 )}


                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center py-4 border-t border-gray-200 gap-4 md:gap-0">
                  <div className="mb-2 md:mb-0">
                    <p className="text-xs md:text-sm text-gray-500">Total</p>
                    <p className="text-lg md:text-xl font-medium text-gray-800">{formatPrice(mentor?.rate || 50)}</p>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 flex-1 md:flex-auto"
                      onClick={() => setBookingStep(0)} // Go back to slot selection
                    >
                      Back
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 flex-1 md:flex-auto"
                      onClick={confirmBooking}
                      disabled={!selectedSlot} // Button disabled if no slot is selected
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Have a Question Card */}
          {/* Ensure mentor has 'help' data or hide this section if not */}
          {mentor?.help && mentor.help.length > 0 && (
             <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4, duration: 0.5 }}
               className="mt-6 md:mt-8 bg-white rounded-xl p-4 md:p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
             >
               <div className="flex justify-between items-center flex-wrap">
                 <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">Have a question?</h2>
                 <span className="text-xs md:text-sm font-semibold text-transparent bg-clip-text wave-text mb-2 md:mb-4">
                   Coming Soon... {/* Replace with actual status */}
                 </span>
               </div>
               {/* This section seems static, update if 'question' is a separate service */}
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
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MentorProfile;