// src/app/api/mentors/route.js
import connectToDB from '../../lib/mongodbdata';
import Mentor from '../../models/Mentor'; // Adjust to your actual model path

export async function GET(req) {
  try {
    await connectToDB(); // <-- Important

    const mentors = await Mentor.find(); // Now this won't hang
    return Response.json({ mentors });
  } catch (err) {
    console.error('API Error fetching mentors:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
