// File: app/api/admin/login/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set.");
      return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    // Basic comparison (for demonstration)
    // In a real app, use a secure comparison library like `bcrypt.compare` if hashing passwords.
    if (password === adminPassword) {
      // You could potentially set a secure, HTTP-only cookie here for session management
      // instead of relying solely on client-side state.
      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }

  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
}