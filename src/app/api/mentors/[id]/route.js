// File: app/api/mentors/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb'; // Adjust path if needed
import Mentor from '../../../models/Mentor';     // Adjust path if needed
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";

/**
 * Handles GET requests to /api/mentors/[id]
 * Fetches a single mentor by their MongoDB ObjectId.
 */
export async function GET(request, { params }) {
  const { id } = params; // Extract the id from the URL parameters
  const session = await getServerSession(request);
  if (!session || !session.user) {
    return NextResponse.json(
      { response: "Unauthorized" },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  }
  // Optional: Validate if the ID is a valid MongoDB ObjectId format
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Mentor ID format." },
      { status: 400 } // 400 Bad Request
    );
  }

  try {
    await dbConnect(); // Ensure database connection

    // Find the mentor by their _id
    // Use .lean() for potentially better performance (returns plain JS object)
    const mentor = await Mentor.findById(id).lean();

    // If mentor not found in the database
    if (!mentor) {
      return NextResponse.json(
        { message: "Mentor not found." },
        { status: 404 } // 404 Not Found
      );
    }

    // --- Data Transformation ---
    // Map _id to id for frontend consistency
    const formattedMentor = {
        ...mentor,
        id: mentor._id.toString(),
        _id: undefined, // Remove the original _id if not needed frontend
    };
    // --- End Data Transformation ---

    // Return the found mentor's data
    return NextResponse.json(formattedMentor, { status: 200 });

  } catch (error) {
    console.error(`API Error fetching mentor with ID: ${id}`, error);

    // Handle potential DB connection errors separately if desired
    if (error.name === 'MongoNetworkError' || error.message.includes('connect ECONNREFUSED')) {
         return NextResponse.json(
             { message: "Database connection error." },
             { status: 503 } // 503 Service Unavailable
         );
    }

    // General server error
    return NextResponse.json(
      { message: "Internal Server Error: Could not fetch mentor details." },
      { status: 500 }
    );
  }
}

// You could add PUT/DELETE handlers here later if needed to update/delete specific mentors