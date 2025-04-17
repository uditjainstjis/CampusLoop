import { NextResponse } from 'next/server';
import dbConnect from '../../lib/mongodb'; // Adjust path if your lib folder is elsewhere
import Mentor from '../../models/Mentor';     // Adjust path if your models folder is elsewhere
import { getServerSession } from "next-auth/next";

/**
 * Handles GET requests to /api/mentors
 * Fetches all mentors from the MongoDB database.
 */
export async function GET(request) {
  try {
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
    await dbConnect(); // Establish database connection (uses cached if available)

    // Fetch all mentors from the 'mentors' collection
    // .lean() returns plain JavaScript objects instead of Mongoose documents, which can be faster.
    const mentors = await Mentor.find({}).lean();

    // --- Data Transformation (Important!) ---
    // Mongoose uses `_id`. Your frontend likely expects `id`.
    // Map the results to include an `id` field based on `_id`.
    const formattedMentors = mentors.map(mentor => ({
        ...mentor,
        id: mentor._id.toString(), // Convert ObjectId to string and map to `id`
        _id: undefined, // Optionally remove the original _id if not needed
    }));
    // --- End Data Transformation ---


    // Check if data was found (optional, but good practice)
    if (!formattedMentors || formattedMentors.length === 0) {
      // You could return an empty array or a specific message
      // console.log('No mentors found in the database.');
      // Return empty array with 200 OK status as per frontend expectation
       return NextResponse.json([], { status: 200 });
    }

    // Return the fetched and formatted mentors
    return NextResponse.json(formattedMentors, { status: 200 });

  } catch (error) {
    console.error("API Error fetching mentors:", error);

    // Distinguish between connection errors and query errors if needed
    if (error.name === 'MongoNetworkError' || error.message.includes('connect ECONNREFUSED')) {
         return NextResponse.json(
             { message: "Database connection error." },
             { status: 503 } // 503 Service Unavailable is appropriate
         );
    }

    // General server error for other issues
    return NextResponse.json(
      { message: "Internal Server Error: Could not fetch mentors." },
      { status: 500 }
    );
  }
}

// You can add POST, PUT, DELETE handlers here using dbConnect() and Mentor model methods (e.g., Mentor.create(), Mentor.findByIdAndUpdate(), Mentor.findByIdAndDelete())
/*
export async function POST(request) {
   try {
     await dbConnect();
     const body = await request.json();

     // Add validation here using Mongoose schema or a library like Zod

     const newMentor = await Mentor.create(body); // Mongoose handles validation based on schema

     const formattedMentor = {
        ...newMentor.toObject(), // Convert Mongoose doc to plain object
        id: newMentor._id.toString(),
        _id: undefined,
     }

     return NextResponse.json(formattedMentor, { status: 201 }); // 201 Created

   } catch (error) {
     console.error("API Error creating mentor:", error);
     if (error.name === 'ValidationError') {
         return NextResponse.json({ message: "Validation Failed", errors: error.errors }, { status: 400 }); // Bad Request
     }
     return NextResponse.json(
       { message: "Internal Server Error: Could not create mentor." },
       { status: 500 }
     );
   }
}
*/