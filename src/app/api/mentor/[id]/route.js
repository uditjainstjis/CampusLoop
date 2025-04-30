// src/app/api/mentor/[id]/route.js
import { NextResponse } from 'next/server';
import clientPromise from "../../../lib/mongodb"; // Adjust path
import { ObjectId } from 'mongodb';
import Mentor from '../../../models/Mentor'; // Import your Mentor model

// --- IMPORTANT: Implement Authentication/Authorization ---
// You MUST add middleware/logic here to protect these routes.
// This example *omits* the auth check for brevity, but it's crucial.
/*
async function authenticateMentorRequest(req, params) {
    // ... (Your auth logic) ...
    // If auth fails, return NextResponse.json(...) with 401/403 status
}
*/

// Manual IST Offset: UTC+5:30 -> 5 hours * 60 mins + 30 mins = 330 minutes
const IST_OFFSET_MINUTES = 330;


// GET a specific mentor's profile
export async function GET(req, { params }) {
    try {
        const { id } = params;

        // --- Add Auth Check Here ---
        // const authResponse = await authenticateMentorRequest(req, params);
        // if (authResponse) return authResponse;
        // --------------------------

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid mentor ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("test"); // <<< REPLACE THIS
        const mentorsCollection = db.collection('mentors');

        const mentor = await mentorsCollection.findOne({ _id: new ObjectId(id) });

        if (!mentor) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
        }

        const { otpInfo, ...mentorData } = mentor; // Remove sensitive info

        return NextResponse.json(mentorData, { status: 200 });

    } catch (error) {
        console.error('API Catch Block Error in /api/mentor/[id] GET:', error);
         if (error.message.includes('Unauthorized')) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
         }
        return NextResponse.json({ error: 'Internal Server Error occurred.' + (error.message ? ' Details: ' + error.message : '') }, { status: 500 });
    }
}

// PATCH update a mentor's availability
export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        // Expect array of objects like { dateStr: 'YYYY-MM-DD', startTimeStr: 'HH:mm', duration: number }
        const { availability } = body;

        // --- Add Auth Check Here ---
        // const authResponse = await authenticateMentorRequest(req, params);
        // if (authResponse) return authResponse;
        // --------------------------

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid mentor ID format' }, { status: 400 });
        }

        // --- Input Validation and Date Object Conversion (Manual Offset) ---
        if (!Array.isArray(availability)) {
             return NextResponse.json({ error: 'Availability must be an array.' }, { status: 400 });
        }

        const validDurations = [15, 30, 45, 60]; // Allowed durations

        const validatedSlots = [];
        for (const slot of availability) {
            const { dateStr, startTimeStr, duration } = slot;

            // Validate required fields
            if (!dateStr || !startTimeStr || duration === undefined || duration === null) {
                 return NextResponse.json({ error: 'Each slot must have date, start time, and duration.' }, { status: 400 });
            }

            // Validate date format
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                 return NextResponse.json({ error: `Invalid date format in slot: "${dateStr}". Use YYYY-MM-DD.` }, { status: 400 });
            }

            // Validate time format
            if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTimeStr)) {
                 return NextResponse.json({ error: `Invalid time format in slot: "${startTimeStr}". Use HH:mm.` }, { status: 400 });
            }

            // Validate duration value
            const durationNum = parseInt(duration, 10);
            if (isNaN(durationNum) || !validDurations.includes(durationNum)) {
                 return NextResponse.json({ error: `Invalid duration in slot: "${duration}". Allowed values are ${validDurations.join(', ')}.` }, { status: 400 });
            }

            // --- Manually construct a Date string with IST offset and parse it ---
            // Use the format YYYY-MM-DDTHH:mm:ss+HH:mm (ISO 8601 with offset)
            // +05:30 is the offset for IST
             const dateTimeStringWithOffset = `${dateStr}T${startTimeStr}:00+05:30`;

             let startTimeUTC;
             try {
                 // ** new Date() is expected to parse this string correctly into a UTC Date object **
                 startTimeUTC = new Date(dateTimeStringWithOffset);
             } catch (parseError) {
                  console.error(`Failed to parse date/time string "${dateTimeStringWithOffset}":`, parseError);
                  return NextResponse.json({ error: `Could not parse date/time in slot: "${dateTimeStringWithOffset}"` }, { status: 400 });
             }


            // Check if the parsed date is valid
            if (isNaN(startTimeUTC.getTime())) {
                 return NextResponse.json({ error: `Could not parse date/time in slot: "${dateTimeStringWithOffset}"` }, { status: 400 });
            }

            // Calculate endTime Date object by adding duration (milliseconds) to the UTC timestamp
             const endTimeUTC = new Date(startTimeUTC.getTime() + durationNum * 60 * 1000); // Add duration minutes

             // Ensure end time is strictly after start time
             if (endTimeUTC.getTime() <= startTimeUTC.getTime()) {
                  return NextResponse.json({ error: `End time must be after start time for slot starting at ${startTimeStr}.` }, { status: 400 });
             }
            // Optional: Add checks for reasonable ranges (e.g., slot doesn't end days later)

            validatedSlots.push({
                startTime: startTimeUTC, // Save UTC Date object
                endTime: endTimeUTC,     // Save UTC Date object
            });
        }
        // ---------------------------------------------------

        // Optional: Add validation here to check for overlapping slots among validatedSlots before saving

        const client = await clientPromise;
        const db = client.db("test"); // <<< REPLACE THIS
        const mentorsCollection = db.collection('mentors');

        const updateResult = await mentorsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    availability: validatedSlots, // Save the array of Date objects
                    updatedAt: new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
        }

        // Fetch the updated document to return the saved data
        const updatedMentor = await mentorsCollection.findOne({ _id: new ObjectId(id) });

        // Return the updated availability data (Date objects will be JSON stringified to ISO strings automatically)
        return NextResponse.json(
            { message: 'Availability updated successfully.', availability: updatedMentor?.availability || [] },
            { status: 200 }
        );

    } catch (error) {
        console.error('API Catch Block Error in /api/mentor/[id] PATCH:', error);
         // Catch validation errors thrown within the loop or other errors
        if (error.message.includes('date format') || error.message.includes('time format') || error.message.includes('duration') || error.message.includes('Could not parse') || error.message.includes('End time')) {
             return NextResponse.json({ error: error.message }, { status: 400 }); // Bad Request for validation errors
        }
         if (error.message.includes('Unauthorized')) {
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
         }
        return NextResponse.json({ error: 'Internal Server Error occurred during availability update.' + (error.message ? ' Details: ' + error.message : '') }, { status: 500 });
    }
}