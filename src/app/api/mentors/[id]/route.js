// File: app/api/mentors/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb'; // Adjust path if needed
import Mentor from '../../../models/Mentor';     // Adjust path if needed
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../lib/auth.config'; // Assuming your auth options are here

// --- GET Request Handler (Existing Code - slightly modified session check) ---
export async function GET(request, { params }) {
  const { id } = params;
  // const session = await getServerSession(req, res, authOptions); // Use authOptions

  // Optional: Uncomment if you want GET requests to be protected too
  // if (!session || !session.user) {
  //   return NextResponse.json(
  //     { message: "Unauthorized" }, { status: 401 }
  //   );
  // }

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Mentor ID format." }, { status: 400 }
    );
  }

  try {
    await dbConnect();
    const mentor = await Mentor.findById(id).lean();

    if (!mentor) {
      return NextResponse.json(
        { message: "Mentor not found." }, { status: 404 }
      );
    }

    const formattedMentor = {
        ...mentor,
        id: mentor._id.toString(),
        _id: undefined,
    };

    return NextResponse.json(formattedMentor, { status: 200 });

  } catch (error) {
    console.error(`API Error fetching mentor with ID: ${id}`, error);
    if (error.name === 'MongoNetworkError' || error.message.includes('connect ECONNREFUSED')) {
         return NextResponse.json(
             { message: "Database connection error." }, { status: 503 }
         );
    }
    return NextResponse.json(
      { message: "Internal Server Error: Could not fetch mentor details." }, { status: 500 }
    );
  }
}

// --- PUT Request Handler (New Code for Updates) ---
export async function PUT(request, { params }) {
  const { id } = params;
  // const session = await getServerSession(authOptions); // Use authOptions

  // --- Authentication Check ---
  // IMPORTANT: Protect your update endpoint.
  // You might want more granular checks here (e.g., is the user an admin?)
  // if (!session || !session.user /* || !session.user.isAdmin */) { // Add admin check if needed
  //   return NextResponse.json(
  //     { message: "Unauthorized: You must be logged in (and potentially an admin) to update mentors." },
  //     { status: 401 }
  //   );
  // }
  // --- End Authentication Check ---

  // Validate ID format
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Mentor ID format." }, { status: 400 }
    );
  }

  let updateData;
  try {
    // Parse the request body for the update data
    updateData = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request body. Ensure it's valid JSON." }, { status: 400 }
    );
  }

  // Basic validation: Ensure required fields are present if needed
  // (Mongoose validation will handle more complex cases)
  if (!updateData || typeof updateData !== 'object') {
     return NextResponse.json(
      { message: "Invalid or empty update data provided." }, { status: 400 }
    );
  }

  // Optional: Prevent updating certain fields like _id or createdAt/updatedAt
  delete updateData._id;
  delete updateData.id; // Don't try to update the string 'id' field
  delete updateData.createdAt;
  delete updateData.updatedAt;


  try {
    await dbConnect(); // Ensure database connection

    // Find the mentor by ID and update it
    // - `new: true` returns the updated document
    // - `runValidators: true` ensures the update respects your schema rules
    const updatedMentor = await Mentor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true, context: 'query' } // context:'query' helps with some validator types
    ).lean(); // Use lean for plain JS object

    // If mentor not found to update
    if (!updatedMentor) {
      return NextResponse.json(
        { message: "Mentor not found." },
        { status: 404 } // 404 Not Found
      );
    }

    // --- Data Transformation ---
    const formattedMentor = {
        ...updatedMentor,
        id: updatedMentor._id.toString(),
        _id: undefined, // Remove original _id
    };
    // --- End Data Transformation ---

    // Return the updated mentor's data
    return NextResponse.json(formattedMentor, { status: 200 });

  } catch (error) {
    console.error(`API Error updating mentor with ID: ${id}`, error);

    // Handle Mongoose Validation Errors specifically
    if (error instanceof mongoose.Error.ValidationError) {
      // Extract meaningful messages (optional)
      const errors = Object.values(error.errors).map(el => el.message);
      return NextResponse.json(
        { message: "Validation failed.", errors },
        { status: 400 } // 400 Bad Request for validation errors
      );
    }

    // Handle potential DB connection errors
    if (error.name === 'MongoNetworkError' || error.message.includes('connect ECONNREFUSED')) {
         return NextResponse.json(
             { message: "Database connection error." },
             { status: 503 } // 503 Service Unavailable
         );
    }

    // General server error
    return NextResponse.json(
      { message: "Internal Server Error: Could not update mentor details." },
      { status: 500 }
    );
  }
}

// You could add DELETE handler here later if needed
// export async function DELETE(request, { params }) { ... }