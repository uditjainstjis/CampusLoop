// src/app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
// No date-fns-tz imports

// Manual IST Offset: UTC+5:30 -> 5 hours * 60 mins + 30 mins = 330 minutes
const IST_OFFSET_MINUTES = 330;
const IST_OFFSET_MS = IST_OFFSET_MINUTES * 60 * 1000;


// Allowed durations for the dropdown
const ALLOWED_DURATIONS = [15, 30, 45, 60];

// Helper function to convert a UTC Date object to a Date object representing IST
const convertUtcToIstDate = (utcDate) => {
    if (!utcDate || isNaN(new Date(utcDate).getTime())) return new Date(NaN); // Return invalid date if input is invalid
    const d = new Date(utcDate); // This is a UTC Date object
    // Create a new Date object by adding the IST offset in milliseconds to the UTC timestamp
    // This new Date object's *local* methods (getDate, getHours, etc.) will reflect the IST time.
    const istDate = new Date(d.getTime() + IST_OFFSET_MS);
    return istDate;
};


// Helper function to format Date object to "HH:mm" string in IST for display/inputs
const formatTimeIST = (date) => {
    const istDate = convertUtcToIstDate(date);
    if (isNaN(istDate.getTime())) return '';

    const hours = istDate.getHours().toString().padStart(2, '0'); // Use getHours for local time
    const minutes = istDate.getMinutes().toString().padStart(2, '0'); // Use getMinutes for local time
    return `${hours}:${minutes}`;
};

// Helper function to format Date object to "YYYY-MM-DD" string in IST for display/inputs
const formatDateIST = (date) => {
    const istDate = convertUtcToIstDate(date);
    if (isNaN(istDate.getTime())) return '';

    const year = istDate.getFullYear(); // Use getFullYear for local date
    const month = (istDate.getMonth() + 1).toString().padStart(2, '0'); // Use getMonth for local date
    const day = istDate.getDate().toString().padStart(2, '0'); // Use getDate for local date
    return `${year}-${month}-${day}`;
};

// Helper function to format Date object for general display (e.g., "Oct 27, 2023") in IST
const formatDisplayDateIST = (date) => {
     const istDate = convertUtcToIstDate(date);
     if (isNaN(istDate.getTime())) return 'Invalid Date';

     // Use toLocaleDateString on the IST-adjusted Date object
     try {
          return istDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
     } catch (e) {
         console.error("Error formatting display date in IST:", e);
         return 'Invalid Date'; // Fallback
     }
};


export default function MentorAdminPage() {
  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mentorId, setMentorId] = useState(null);

  // --- Login Form State ---
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // --- Profile Data State ---
  const [mentor, setMentor] = useState(null);
  // State for editing availability - store inputs: date string, time string, duration number
  const [currentAvailabilityInputs, setCurrentAvailabilityInputs] = useState([]);

  // --- UI State ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingAvailability, setEditingAvailability] = useState(false);


  // Effect to fetch mentor data *only* after successful authentication
  useEffect(() => {
    if (isAuthenticated && mentorId) {
      fetchMentorProfile(mentorId);
    } else {
        // If not authenticated, ensure mentor data is cleared
        setMentor(null);
        setCurrentAvailabilityInputs([]); // Clear editing state too
    }
  }, [isAuthenticated, mentorId]);

  // Function to fetch mentor profile data
  const fetchMentorProfile = async (id) => {
    setLoading(true);
    setError(null);
    try {
      // *** IMPORTANT: Add authentication header/cookie logic here ***
      const response = await fetch(`/api/mentor/${id}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
             setIsAuthenticated(false); // Reset authentication state
             setMentorId(null); // Clear mentor ID
             setError("Authentication expired or invalid. Please login again.");
             return; // Stop further processing
        }
        throw new Error(data.error || 'Failed to fetch mentor profile');
      }

      setMentor(data);
      // Don't populate editing inputs until "Edit" is clicked

    } catch (err) {
      setError(err.message);
      console.error('Fetch mentor profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // ... (Same as before) ...
     try {
      const response = await fetch('/api/mentor/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      console.log(data.message); // Log success message

    } catch (err) {
      setError(err.message);
      console.error('Send OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
     // ... (Same as before) ...
    try {
      const response = await fetch('/api/mentor/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      setIsAuthenticated(true);
      setMentorId(data.mentorId);

      // Clear login form state
      setEmail('');
      setOtp('');
      setOtpSent(false);

    } catch (err) {
      setError(err.message);
      console.error('Verify OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new slot for editing
  const handleAddSlot = () => {
     // Add a new slot template with empty values and default duration
     setCurrentAvailabilityInputs([...currentAvailabilityInputs, { dateStr: '', startTimeStr: '', duration: ALLOWED_DURATIONS[0] }]);
  };

  // Handle changes in availability inputs
  // This updates the currentAvailabilityInputs state
  const handleAvailabilityInputChange = (index, field, value) => {
      const newAvailabilityInputs = [...currentAvailabilityInputs];
      newAvailabilityInputs[index][field] = value; // Update the specific field (dateStr, startTimeStr, or duration)
      setCurrentAvailabilityInputs(newAvailabilityInputs);
  };

  // Handle removing a slot during editing
  const handleRemoveSlot = (index) => {
      const newAvailabilityInputs = currentAvailabilityInputs.filter((_, i) => i !== index);
      setCurrentAvailabilityInputs(newAvailabilityInputs);
  };

  // Handle saving availability
  const handleSaveAvailability = async () => {
      if (!mentorId) { // Use the state mentorId for the request
          setError("Mentor ID not available for saving.");
          return;
      }
      setLoading(true);
      setError(null);

      // Basic client-side validation (API will do full validation)
       // Check if all required fields in currentAvailabilityInputs are filled and duration is valid
      const isValid = currentAvailabilityInputs.every(slot => {
           const durationNum = parseInt(slot.duration, 10);
           return slot.dateStr && slot.startTimeStr && !isNaN(durationNum) && ALLOWED_DURATIONS.includes(durationNum);
      });


      if (!isValid) {
          setError("Please fill out valid date, start time, and duration for all slots.");
           setLoading(false);
          return;
      }
       if (currentAvailabilityInputs.length === 0) {
            setError("Please add at least one availability slot.");
             setLoading(false);
             return;
       }


      try {
          // Send the input strings/numbers (dateStr, startTimeStr, duration) to the backend
          // The backend will calculate startTime and endTime Date objects based on the +05:30 offset
          const response = await fetch(`/api/mentor/${mentorId}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  // *** IMPORTANT: Include authentication header/cookie here ***
              },
              body: JSON.stringify({ availability: currentAvailabilityInputs }), // Send the array of inputs
          });

          const data = await response.json();

          if (!response.ok) {
               if (response.status === 401 || response.status === 403) {
                   setIsAuthenticated(false);
                   setMentorId(null);
                   setError("Authentication expired or invalid. Please login again.");
                   return;
               }
              throw new Error(data.error || 'Failed to save availability');
          }

          // Update local state with the data returned from the API (which has Date objects in ISO strings)
          // React/JS will parse these ISO strings into Date objects automatically when used
          setMentor(prev => ({ ...prev, availability: data.availability }));
          // Reset editing inputs state (clear the form)
          setCurrentAvailabilityInputs([]);
          setEditingAvailability(false); // Exit editing mode

      } catch (err) {
          setError(err.message);
          console.error('Save availability error:', err);
      } finally {
          setLoading(false);
      }
  };

    // Handle Logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        setMentorId(null);
        setMentor(null);
        setCurrentAvailabilityInputs([]);
        setOtpSent(false); // Go back to initial email form
        setEmail('');
        setOtp('');
        setError(null);
        console.log("Mentor logged out.");
    };

   // When entering editing mode, populate the editing state from the current mentor data
   // Convert stored UTC Date objects back to IST strings/numbers for editing inputs
    const handleEditAvailability = () => {
       if (mentor?.availability) {
           // Convert stored Date objects (UTC) back to input strings/numbers for editing
           const inputs = mentor.availability.map(slot => {
                const startTimeUTC = new Date(slot.startTime); // This is a UTC Date object from the backend JSON
                const endTimeUTC = new Date(slot.endTime);     // This is a UTC Date object from the backend JSON

                // Calculate duration in minutes from saved start/end times (timezone-agnostic using timestamps)
                const durationMs = endTimeUTC.getTime() - startTimeUTC.getTime();
                const calculatedDuration = Math.round(durationMs / (60 * 1000));

                // Convert UTC Date objects to IST Date objects for formatting inputs
                const startTimeIST = convertUtcToIstDate(startTimeUTC);

               return ({
                // Format the IST Date object into YYYY-MM-DD and HH:mm strings for inputs
               dateStr: formatDateIST(startTimeIST),
               startTimeStr: formatTimeIST(startTimeIST),
               // Use the calculated duration. If it's not one of the ALLOWED_DURATIONS,
               // the select dropdown might not show a selected value, but the integer
               // value will be stored in state. We add a check to default if needed.
               duration: calculatedDuration > 0 && ALLOWED_DURATIONS.includes(calculatedDuration) ? calculatedDuration : ALLOWED_DURATIONS[0]
           })});
            setCurrentAvailabilityInputs(inputs);
       } else {
           setCurrentAvailabilityInputs([]); // Start with empty if no availability exists
       }
        setEditingAvailability(true);
        setError(null); // Clear any previous errors
    };


  // --- Render Logic ---
  if (error) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
             <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <p className="text-red-500 mb-4">{error}</p>
                 <button onClick={() => { setError(null); setIsAuthenticated(false); setMentorId(null); setOtpSent(false); setEmail(''); setOtp(''); }} className="text-blue-600 hover:underline">
                     Try Logging In Again
                 </button>
             </div>
          </div>
      );
  }

  if (!isAuthenticated) {
    // Show Login Forms
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Mentor Login</h1>

          {!otpSent ? (
            // Email Input Form
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send OTP via WhatsApp'}
              </button>
            </form>
          ) : (
            // OTP Input Form
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
               <p className="text-sm text-gray-600 text-center mb-2">
                   An OTP has been sent to the WhatsApp number registered with <span className="font-medium">{email}</span>.
               </p>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6" // Assuming 6-digit OTP
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-center text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                 type="button"
                 onClick={() => { setOtpSent(false); setOtp(''); setError(null); }} // Go back to email input
                 className="text-sm text-blue-600 hover:text-blue-800 text-center mt-2"
              >
                  Request New OTP
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Show Loading state while fetching profile after auth
   if (loading || !mentor) {
       return (
           <div className="min-h-screen flex items-center justify-center bg-gray-100">
               <p className="text-lg text-gray-700">Loading profile...</p>
           </div>
       );
   }


  // --- Show Mentor Profile ---
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {mentor.name}!</h1>
           <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
           >
               Logout
           </button>
      </div>

      {/* Profile Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
               {/* Profile Image */}
               {mentor.imageUrl && (
                   <div className="flex justify-center md:justify-start mb-4 md:mb-0">
                       <img
                           src={mentor.imageUrl}
                           alt={`Profile picture of ${mentor.name}`}
                           className="w-32 h-32 object-cover rounded-full border-4 border-blue-200 shadow-inner"
                       />
                   </div>
               )}
               <div>
                   <p className="text-gray-700 mb-2"><strong className="font-medium text-gray-800">Email:</strong> {mentor.email}</p>
                   <p className="text-gray-700 mb-2"><strong className="font-medium text-gray-800">WhatsApp Number:</strong> {mentor.number}</p>
                   <p className="text-gray-700 mb-2"><strong className="font-medium text-gray-800">Seniority:</strong> {mentor.seniority}</p>
                   <p className="text-gray-700 mb-2"><strong className="font-medium text-gray-800">Achievement:</strong> {mentor.achievement || 'N/A'}</p>
               </div>
          </div>
           <div className="mt-4">
               <p className="text-gray-700"><strong className="font-medium text-gray-800 block mb-1">About:</strong> {mentor.about}</p>
           </div>
      </div>

      {/* Availability Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Availability <span className="text-sm text-gray-500">(All times are in IST)</span></h2>

          {!editingAvailability ? (
              // Display Availability (reading from mentor.availability which has Date objects - display in IST)
              <>
                  {mentor.availability && mentor.availability.length > 0 ? (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mentor.availability.map((slot, index) => (
                              <li key={index} className="bg-blue-50 p-4 rounded-md border border-blue-100 shadow-sm text-blue-800 text-sm">
                                  {/* Display Date and Time in IST */}
                                  <strong className="block mb-1">{formatDisplayDateIST(slot.startTime)}</strong>
                                  {formatTimeIST(slot.startTime)} - {formatTimeIST(slot.endTime)}
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p className="text-gray-600">No availability set yet.</p>
                  )}
                  <button
                      onClick={handleEditAvailability} // Use the handler to populate inputs for editing
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                      Edit Availability
                  </button>
              </>
          ) : (
              // Edit Availability Form (using currentAvailabilityInputs state)
              <>
                   {currentAvailabilityInputs.length === 0 && (
                       <p className="text-gray-600 italic mb-4">Add your first slot below.</p>
                   )}
                  <div className="flex flex-col gap-4 mb-4">
                      {currentAvailabilityInputs.map((slot, index) => (
                          // Each slot editing row
                          <div key={index} className="border border-gray-200 p-4 rounded-md flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50">
                              <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                                   {/* Date Input */}
                                   <div>
                                        <label htmlFor={`date-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Date (IST)</label>
                                       <input
                                           id={`date-${index}`}
                                           type="date"
                                           value={slot.dateStr} // Bound to dateStr in currentAvailabilityInputs state
                                           onChange={(e) => handleAvailabilityInputChange(index, 'dateStr', e.target.value)}
                                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                           required
                                       />
                                   </div>
                                   {/* Start Time Input */}
                                   <div>
                                       <label htmlFor={`startTime-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Start Time (IST HH:mm)</label>
                                        <input
                                            id={`startTime-${index}`}
                                            type="time"
                                            value={slot.startTimeStr} // Bound to startTimeStr in currentAvailabilityInputs state
                                            onChange={(e) => handleAvailabilityInputChange(index, 'startTimeStr', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                             required
                                        />
                                   </div>
                                   {/* Duration Select */}
                                    <div>
                                       <label htmlFor={`duration-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Duration (mins)</label>
                                        <select
                                            id={`duration-${index}`}
                                            value={slot.duration} // Bound to duration in currentAvailabilityInputs state
                                            onChange={(e) => handleAvailabilityInputChange(index, 'duration', parseInt(e.target.value, 10))} // Parse value to number before storing
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                            required
                                        >
                                            {ALLOWED_DURATIONS.map(d => (
                                                 <option key={d} value={d}>{d} mins</option>
                                            ))}
                                        </select>
                                   </div>
                              </div>
                              {/* Remove Button */}
                              <div className="flex-shrink-0 w-full md:w-auto">
                                   <button
                                       onClick={() => handleRemoveSlot(index)}
                                       className="w-full md:w-auto bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                   >
                                       Remove
                                   </button>
                              </div>
                          </div>
                      ))}
                  </div>

                   <div className="flex flex-wrap gap-3">
                       <button type="button" onClick={handleAddSlot} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Add Slot</button>
                       <button
                           type="button"
                           onClick={handleSaveAvailability} // This sends currentAvailabilityInputs (including duration) to the backend
                           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                           disabled={loading}
                       >
                           {loading ? 'Saving...' : 'Save Availability'}
                       </button>
                       <button
                           type="button"
                           onClick={() => {
                               setEditingAvailability(false);
                               setCurrentAvailabilityInputs([]); // Clear inputs on cancel
                               setError(null); // Clear any editing errors
                           }}
                           className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                       >
                           Cancel
                       </button>
                   </div>
              </>
          )}
      </div>
    </div>
  );
}