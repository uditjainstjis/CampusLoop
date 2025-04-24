'use client' // This should be at the very top

import { useState } from 'react';
// Ensure these import paths are correct for your project setup
// If you're using Shadcn/ui with a standard setup, these paths should be:
import { Button } from "@components/components/ui/button"; // Corrected import path
import { Avatar, AvatarFallback, AvatarImage } from "@components/components/ui/avatar"; // Corrected import path
import { CalendarDays, MessageSquare, Star, User } from "lucide-react";


// Added more complete mock data for demonstration
const mockMentor = {
  name: 'Aman Kumar', // Placeholder name
  title: 'Web Developer', // Placeholder title
  avatar:'/aman.png', // IMPORTANT: Ensure this path is accessible from your 'public' directory
  expertise:'Intern DRDO', // Added more content for Expertise
  about:'I love traveling and attending conferences & exhibitions I like to learn challenging things', // Added more content for About
  availableSlots: [ // Added placeholder slots
    { date: 'Today', time: '10:00 AM' },
    { date: 'Today', time: '11:30 AM' },
    { date: 'Tomorrow, May 28', time: '02:00 PM' },
    { date: 'Tomorrow, May 28', time: '03:30 PM' },
    { date: 'May 29', time: '10:00 AM' },
    { date: 'May 29', time: '11:30 AM' },
  ]
};

const Index = () => {
  // State to hold the string identifier of the selected slot (e.g., "Today-10:00 AM")
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Handler function now correctly stores a unique string identifier
  const handleSlotSelect = (slot) => {
    const slotId = `${slot.date}-${slot.time}`; // Create a unique ID string
    setSelectedSlot(selectedSlot === slotId ? null : slotId); // Toggle selection
  };

  return (
    // Main container: Use flex to create two columns, full height
    // Added overflow-hidden to prevent potential layout shifts or scrollbars if content overflows
    <div className="flex min-h-screen bg-white overflow-hidden">

      {/* Left Column - Profile Info */}
      {/* Background: Deep purple | Text: White | Padding | Flex column layout | Items centered horizontally */}
      {/* w-[320px] provides a fixed width, centered items-center centers contents horizontally */}
      <div className="w-[320px] bg-[#27276B] text-white p-8 flex flex-col items-center shadow-lg relative"> {/* Added shadow and relative positioning for potential future elements */}

        {/* Avatar: Centered horizontally by parent (items-center), pushed down from top, larger size */}
        {/* Position the Avatar slightly lower and center it horizontally within the fixed-width column */}
        <Avatar className="w-48 h-48 mb-6 mt-12 mx-auto"> {/* Increased size, added top margin (mt-12), centered using mx-auto within the flex item */}
          {/* AvatarImage src needs to be a valid path. Added alt text for accessibility. */}
          {/* Make sure the image itself looks good and fits the minimalistic aesthetic */}
          <AvatarImage src={mockMentor.avatar} alt={`${mockMentor.name}'s avatar`} />
          <AvatarFallback>
            {/* Fallback icon size adjusted */}
            <User className="w-20 h-20" />
          </AvatarFallback>
        </Avatar>

        {/* Name: Centered text */}
        <h1 className="text-3xl font-bold mb-2 text-center px-4">{mockMentor.name}</h1> {/* Added px-4 for padding on smaller names */}

        {/* Title: Centered text */}
        <p className="text-sm mb-6 text-center opacity-90 px-4">{mockMentor.title}</p> {/* Added px-4 */}

        {/* Bookings Count: Centered horizontally by parent (items-center), subtle background */}
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
          {/* Placeholder image - ensure path and visibility */}
          {/* Added text-purple-200 for icon color if it's an SVG or font icon you can color */}
          {/* If it's a PNG/JPG, you might need to replace it or use CSS filters if necessary for dark background */}
          {/* Assuming this is an icon, coloring it lightly */}
          <CalendarDays className="w-6 h-6 text-purple-200" /> {/* Replaced img with CalendarDays icon for consistent style */}
          <span className="font-medium">223</span>
          <span className="text-sm opacity-90">Bookings</span>
        </div>

        {/* Expertise Section */}
        {mockMentor.expertise && (
          // Container: Takes full width *within* the centered parent, text is left-aligned for readability
          <div className="mt-6 w-full text-left px-4"> {/* Added text-left and px-4 for padding */}
            {/* Heading: Left-aligned */}
            <h3 className="text-sm uppercase tracking-wide mb-3 opacity-80">Expertise</h3>
             {/* Expertise Text: Wrapped in a paragraph, text-sm, left-aligned */}
             <p className="text-sm leading-relaxed opacity-90">
               {mockMentor.expertise}
             </p>
          </div>
        )}

        {/* About Section */}
        {mockMentor.about && (
          // Removed incorrect extra curly braces around the div
          <div className="mt-6 w-full text-left px-4"> {/* Added text-left and px-4 for padding */}
            {/* Heading: Left-aligned */}
            <h3 className="text-sm uppercase tracking-wide mb-3 opacity-80">About</h3>
            {/* About Text: Wrapped in a paragraph, text-sm, left-aligned */}
            <p className="text-sm leading-relaxed opacity-90">
              {mockMentor.about}
            </p>
          </div>
        )}
      </div>

      {/* Right Column - Main Content */}
      {/* Background: White | Padding | Flex-1 takes remaining width */}
      <div className="flex-1 bg-white p-8 overflow-y-auto"> {/* Added overflow-y-auto for scrolling if content is long */}

        {/* Service Types Buttons: Flex row with gap */}
        <div className="flex gap-4 mb-8">
          {/* Button 'All': Purple background, white text, border matching purple */}
          <Button variant="outline" className="bg-[#5A3E73] text-white hover:bg-[#6B4F8F] border-[#5A3E73] hover:border-[#6B4F8F]">
            All
          </Button>
          {/* Other Buttons: White background, default text, subtle border and hover */}
          <Button variant="outline" className="bg-white text-gray-800 hover:bg-gray-100 border-gray-300">
            1:1 Call
          </Button>
          <Button variant="outline" className="bg-white text-gray-800 hover:bg-gray-100 border-gray-300">
            Priority DM
          </Button>
        </div>

        {/* Services Grid: Responsive grid layout with gap */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card styles remain largely the same, refined for white background */}
          {/* Added subtle border for definition */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Have a question?</h2> {/* Darker text for contrast */}
            {/* Inner detail block */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 text-gray-700"> {/* Darker text for contrast */}
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Replies in 2 days</p>
                  <p className="text-sm text-gray-500">Priority DM</p>
                </div>
              </div>
              {/* Button */}
              <Button variant="outline" className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100">
                ₹0+
              </Button>
            </div>
          </div>

          {/* Referral Request Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Referral Request</h2>
             {/* Inner detail block */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 text-gray-700">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Replies in 7 days</p>
                  <p className="text-sm text-gray-500">Priority DM</p>
                </div>
              </div>
              {/* Button */}
              <Button variant="outline" className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100">
                ₹0+
              </Button>
            </div>
          </div>

          {/* Resume Review Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            {/* Popular tag: Purple background, darker purple text */}
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" /> {/* Star color remains yellow */}
              <span className="font-medium text-gray-800">5</span> {/* Ensure text color is readable */}
              <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Popular</span> {/* Changed blue to purple, smaller text, rounded-full */}
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Resume review</h2>
            {/* Inner detail block */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 text-gray-700">
                <CalendarDays className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">15 mins</p>
                  <p className="text-sm text-gray-500">Video Meeting</p>
                </div>
              </div>
              {/* Button */}
              <Button variant="outline" className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100">
                ₹10+
              </Button>
            </div>
          </div>

          {/* Let's Connect Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
             <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-800">5</span>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Let's connect 👋🏼</h2>
             {/* Inner detail block */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 text-gray-700">
                <CalendarDays className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">30 mins</p>
                  <p className="text-sm text-gray-500">Video Meeting</p>
                </div>
              </div>
              {/* Button */}
              <Button variant="outline" className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100">
                ₹50+
              </Button>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        {/* Check if availableSlots exists and is not empty before rendering */}
        {mockMentor.availableSlots && mockMentor.availableSlots.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Available Slots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* More responsive grid */}
              {mockMentor.availableSlots.map((slot, index) => (
                <Button
                  // Use a unique key combining date, time, and index for robustness
                  key={`${slot.date}-${slot.time}-${index}`}
                  variant="outline"
                  // Conditional classes for selected state
                  className={`justify-between border-gray-300 text-gray-800 hover:bg-gray-100
                             ${selectedSlot === `${slot.date}-${slot.time}`
                               ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:text-white' // Purple fill when selected
                               : 'bg-white' // White background when not selected
                             }`}
                  onClick={() => handleSlotSelect(slot)}
                >
                  <span>{slot.date}</span>
                  <span>{slot.time}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;