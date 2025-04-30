// File: app/api/mentors/[id]/route.js

// Import necessary modules from Next.js, Mongoose, and your project setup
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodbdata'; // Adjust path if needed based on your project structure
import Mentor from '../../../models/Mentor';     // Adjust path if needed based on your project structure
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation and error handling
import { getServerSession } from "next-auth/next"; // For session authentication
import { authOptions } from '../../../lib/auth.config'; // Assuming your auth options are here (adjust path)

// --- GET Request Handler: Fetch a single mentor by ID ---
// This function will handle requests to GET /api/mentors/[id]
export async function GET(request, { params }) {
  // Extract the dynamic 'id' segment from the URL parameters
  const { id } = params;

  // Authentication Check (Optional for GET, uncomment if needed)
  // You might want to protect reading mentor data depending on your app's requirements.
  // const session = await getServerSession(authOptions); // Get the server session
  // if (!session || !session.user) {
  //   return NextResponse.json(
  //     { message: "Unauthorized: You must be logged in to view mentor profiles." },
  //     { status: 401 } // 401 Unauthorized
  //   );
  // }

  // Input Validation: Check if the provided ID is a valid MongoDB ObjectId format
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Mentor ID format." },
      { status: 400 } // 400 Bad Request
    );
  }

  try {
    // Ensure database connection is established
    await dbConnect();

    // Find the mentor document by its MongoDB _id
    // .lean() makes the query return a plain JavaScript object instead of a Mongoose document,
    // which is generally faster for read operations when you don't need Mongoose methods.
    const mentor = await Mentor.findById(id).lean();

    // Check if a mentor was found with the given ID
    if (!mentor) {
      return NextResponse.json(
        { message: "Mentor not found." },
        { status: 404 } // 404 Not Found
      );
    }

    // Format the mentor data for the response
    // Convert Mongoose's _id (ObjectId) to a string 'id' field
    // and remove the original _id field from the response.
    const formattedMentor = {
        ...mentor,
        id: mentor._id.toString(), // Add a string 'id' field
        _id: undefined, // Remove the original _id field
    };

    // Return the formatted mentor data with a 200 OK status
    return NextResponse.json(formattedMentor, { status: 200 });

  } catch (error) {
    // Log the error for server-side debugging
    console.error(`API Error fetching mentor with ID: ${id}`, error);

    // Handle specific common errors (e.g., database connection issues)
    if (error.name === 'MongoNetworkError' || error.message.includes('connect ECONNREFUSED')) {
         return NextResponse.json(
             { message: "Database connection error." },
             { status: 503 } // 503 Service Unavailable
         );
    }

    // Return a generic 500 Internal Server Error for unhandled exceptions
    return NextResponse.json(
      { message: "Internal Server Error: Could not fetch mentor details." },
      { status: 500 }
    );
  }
}

// --- PUT Request Handler (Update a mentor by ID) ---
// This function will handle requests to PUT /api/mentors/[id]
export async function PUT(request, { params }) {
  const { id } = params;

  // --- Authentication Check (CRITICAL for PUT) ---
  // Implement robust authentication and authorization here.
  // Only authorized users (e.g., the mentor themselves, or an admin) should be able to update.
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized: You must be logged in to update mentor profiles." },
      { status: 401 } // 401 Unauthorized
    );
  }
  // TODO: Add authorization check - e.g., is session.user._id the same as the mentor's user ID?
  // Or check if session.user has an admin role etc.
  // const mentorToUpdate = await Mentor.findById(id);
  // if (!mentorToUpdate || mentorToUpdate.userId.toString() !== session.user._id.toString()) {
  //    return NextResponse.json({ message: "Forbidden: You do not have permission to update this profile." }, { status: 403 });
  // }


  // Input Validation: Check if the provided ID is a valid MongoDB ObjectId format
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Mentor ID format." },
      { status: 400 } // 400 Bad Request
    );
  }

  let updateData;
  try {
    // Parse the request body to get the data to update the mentor with
    updateData = await request.json();
  } catch (error) {
    // If the request body is not valid JSON
    return NextResponse.json(
      { message: "Invalid request body. Ensure it's valid JSON." },
      { status: 400 } // 400 Bad Request
    );
  }

  // Basic validation: Ensure the parsed data is an object and not empty
  if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
     return NextResponse.json(
      { message: "Invalid or empty update data provided." },
      { status: 400 } // 400 Bad Request
    );
  }

  // Security: Prevent clients from attempting to update sensitive/immutable fields
  delete updateData._id; // Prevent updating the MongoDB ObjectId
  delete updateData.id; // Prevent updating the derived string 'id' field
  // You might also want to prevent updates to creation timestamps, user associations, etc.
  // delete updateData.createdAt;
  // delete updateData.userId;


  try {
    // Ensure database connection is established
    await dbConnect();

    // Find the mentor by ID and update it with the provided data
    // Options:
    // - `new: true`: Return the modified document rather than the original.
    // - `runValidators: true`: Run Mongoose validation defined in your schema against the update data.
    // - `context: 'query'`: Required for some Mongoose validators (like `unique`) when running in update queries.
    const updatedMentor = await Mentor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true, context: 'query' }
    ).lean(); // Use lean for a plain JS object response

    // If findByIdAndUpdate returns null, it means the document with the given ID was not found
    if (!updatedMentor) {
      return NextResponse.json(
        { message: "Mentor not found." },
        { status: 404 } // 404 Not Found
      );
    }

    // --- Data Transformation ---
    // Format the updated mentor data for the response, similar to the GET request
    const formattedMentor = {
        ...updatedMentor,
        id: updatedMentor._id.toString(), // Add string 'id'
        _id: undefined, // Remove original _id
    };
    // --- End Data Transformation ---

    // Return the updated mentor's data with a 200 OK status
    return NextResponse.json(formattedMentor, { status: 200 });

  } catch (error) {
    // Log the error for server-side debugging
    console.error(`API Error updating mentor with ID: ${id}`, error);

    // Handle specific Mongoose Validation Errors
    if (error instanceof mongoose.Error.ValidationError) {
      // Extract validation error messages to provide client-friendly feedback
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

    // Return a generic 500 Internal Server Error for other unhandled exceptions
    return NextResponse.json(
      { message: "Internal Server Error: Could not update mentor details." },
      { status: 500 }
    );
  }
}

// You can add other HTTP method handlers here if needed (e.g., DELETE)
/*
export async function DELETE(request, { params }) {
  const { id } = params;
  // Implement authentication and authorization checks here too!
  // ... validation ...
  try {
     await dbConnect();
     const deletedMentor = await Mentor.findByIdAndDelete(id).lean();
     if (!deletedMentor) {
        return NextResponse.json({ message: "Mentor not found." }, { status: 404 });
     }
     // Optionally return the deleted item or a success message
     return NextResponse.json({ message: "Mentor deleted successfully.", id: deletedMentor._id.toString() }, { status: 200 });
  } catch (error) {
     console.error('Error deleting mentor:', error);
     return NextResponse.json({ message: "Internal Server Error: Could not delete mentor." }, { status: 500 });
  }
}
*/