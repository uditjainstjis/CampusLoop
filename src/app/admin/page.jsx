// File: app/admin/manage-mentors/page.jsx
"use client"; // This page needs client-side interactivity (state, forms)

import React, { useState, useEffect, useCallback } from 'react';
// Optional: Install and import form/date libraries if needed
// import { useForm } from 'react-hook-form';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// --- Simple Password Protection Component ---
function PasswordProtect({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // In a real app, NEVER store or compare the actual password directly
    // on the client-side like this. This is a simplified example.
    // A better approach involves an API call to verify the password server-side.
    // For this example, we'll *simulate* the check.
    // We NEED an API route or Server Action for secure password verification.
    // Let's create a *very basic* check simulation for demonstration.
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        // **VERY IMPORTANT SECURITY NOTE:**
        // This is NOT secure. The password check logic should be on the server.
        // We'll create a simple API route for this below.
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (res.ok) {
                setIsAuthenticated(true);
            } else {
                const data = await res.json();
                setError(data.message || 'Incorrect password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error(err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={styles.loginContainer}>
                <h2>Admin Access Required</h2>
                <form onSubmit={handleLogin} style={styles.loginForm}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Admin Password"
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        );
    }

    return <>{children}</>; // Render the protected content
}


// --- Main Admin Page Component ---
export default function ManageMentorsPage() {
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' }); // 'success' or 'error'

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''; // Get base URL

    // Fetch all mentors (just names/IDs for selection)
    const fetchMentors = useCallback(async () => {
        setIsLoading(true);
        setFetchError('');
        try {
            // Note: You might want a simpler API endpoint that just returns names/IDs
            const res = await fetch(`${API_BASE_URL}/api/mentors`);
            if (!res.ok) throw new Error(`Failed to fetch mentors: ${res.statusText}`);
            const data = await res.json();
            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                 setMentors(data.map(m => ({ id: m.id, name: m.name }))); // Extract only needed fields for list
            } else {
                 // Handle case where API might return single object or error structure
                 console.warn("API did not return an array of mentors:", data);
                 setMentors([]); // Set to empty array on unexpected format
                 setFetchError('Unexpected data format received for mentors list.');
            }
        } catch (error) {
            console.error("Error fetching mentors:", error);
            setFetchError(error.message || 'Could not load mentors.');
            setMentors([]); // Clear mentors on error
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);


    // Fetch details for the selected mentor
    const fetchMentorDetails = useCallback(async (mentorId) => {
        if (!mentorId) {
            setSelectedMentor(null);
            setFormData({});
            return;
        }
        setIsLoading(true);
        setFetchError('');
        setUpdateStatus({ message: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/api/mentors/${mentorId}`);
            if (!res.ok) {
                 const errorData = await res.json();
                 throw new Error(`Failed to fetch details (${res.status}): ${errorData.message || res.statusText}`);
            }
            const data = await res.json();
            setSelectedMentor(data);
            // Pre-fill form data - handle nested structures like availability carefully
            setFormData({
                name: data.name || '',
                achievement: data.achievement || '',
                skills: data.skills ? data.skills.join(', ') : '', // Join array for simple input
                about: data.about || '',
                help: data.help ? data.help.join('\n') : '', // Join array with newlines
                imageUrl: data.imageUrl || '',
                rate: data.rate || 0,
                // Handle availability separately - more complex UI needed
                availability: data.availability || [],
            });
        } catch (error) {
            console.error("Error fetching mentor details:", error);
            setFetchError(error.message);
            setSelectedMentor(null);
            setFormData({});
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    // Fetch mentors list on initial mount
    useEffect(() => {
        // Fetch mentors only *after* authentication in a real secure app
        // For this example, we fetch immediately, but it's gated by PasswordProtect
        fetchMentors();
    }, [fetchMentors]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle changes for array fields (simple example using comma/newline separation)
    const handleArrayInputChange = (e) => {
        const { name, value } = e.target;
         // Split skills by comma, trim whitespace
        if (name === 'skills') {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
         // Split help by newline, trim whitespace
        else if (name === 'help') {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    // Handle Availability changes (needs a more dedicated UI)
    const handleAvailabilityChange = (index, field, value) => {
        setFormData(prev => {
            const updatedAvailability = [...(prev.availability || [])];
            if (updatedAvailability[index]) {
                updatedAvailability[index] = { ...updatedAvailability[index], [field]: value };
            }
            return { ...prev, availability: updatedAvailability };
        });
    };

    const addAvailabilitySlot = () => {
         setFormData(prev => ({
             ...prev,
             availability: [...(prev.availability || []), { date: '', startTime: '', endTime: '' }]
         }));
     };

     const removeAvailabilitySlot = (index) => {
         setFormData(prev => ({
             ...prev,
             availability: (prev.availability || []).filter((_, i) => i !== index)
         }));
     };


    // Handle form submission (Update Mentor)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMentor?.id) return;

        setIsLoading(true);
        setUpdateStatus({ message: '', type: '' });

        // Prepare data for API (convert string arrays back to arrays)
        const updatePayload = {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            help: formData.help.split('\n').map(h => h.trim()).filter(Boolean),
            rate: Number(formData.rate) || 0, // Ensure rate is a number
            // Ensure availability dates are valid if necessary before sending
             availability: formData.availability.map(slot => ({
                 ...slot,
                 // Add date parsing/validation if needed here
                 // date: new Date(slot.date).toISOString() // Example if sending ISO string
             })),
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/mentors/${selectedMentor.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if your API needs it (e.g., JWT)
                    // 'Authorization': `Bearer ${your_token}`
                },
                body: JSON.stringify(updatePayload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || `Update failed with status: ${res.status}`);
            }

            setUpdateStatus({ message: 'Mentor updated successfully!', type: 'success' });
            // Optionally refresh the mentor list or just update the current form
            setSelectedMentor(result); // Update local state with response from API
            // Re-fetch the main list if names might have changed etc.
            // fetchMentors();

        } catch (error) {
            console.error("Error updating mentor:", error);
            setUpdateStatus({ message: `Update failed: ${error.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        // Wrap the entire page content with the password protection
        <PasswordProtect>
            <div style={styles.container}>
                <h1>Manage Mentors</h1>

                {fetchError && <p style={{ color: 'red' }}>Error: {fetchError}</p>}

                {/* Mentor Selection */}
                <div style={styles.section}>
                    <label htmlFor="mentorSelect" style={styles.label}>Select Mentor:</label>
                    <select
                        id="mentorSelect"
                        onChange={(e) => fetchMentorDetails(e.target.value)}
                        value={selectedMentor?.id || ''}
                        disabled={isLoading}
                        style={styles.select}
                    >
                        <option value="">-- Select a Mentor --</option>
                        {mentors.map(mentor => (
                            <option key={mentor.id} value={mentor.id}>
                                {mentor.name} ({mentor.id})
                            </option>
                        ))}
                    </select>
                     <button onClick={fetchMentors} disabled={isLoading} style={styles.buttonSmall}>
                        Refresh List
                    </button>
                </div>

                {isLoading && <p>Loading...</p>}

                {/* Mentor Edit Form */}
                {selectedMentor && (
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <h2>Editing: {selectedMentor.name}</h2>

                        {/* Basic Fields */}
                        <div style={styles.formGroup}>
                            <label htmlFor="name" style={styles.label}>Name:</label>
                            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} required style={styles.input} />
                        </div>
                         <div style={styles.formGroup}>
                            <label htmlFor="achievement" style={styles.label}>Achievement:</label>
                            <input type="text" id="achievement" name="achievement" value={formData.achievement || ''} onChange={handleInputChange} style={styles.input} />
                        </div>
                         <div style={styles.formGroup}>
                            <label htmlFor="imageUrl" style={styles.label}>Image URL:</label>
                            <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleInputChange} required style={styles.input} />
                        </div>
                         <div style={styles.formGroup}>
                            <label htmlFor="rate" style={styles.label}>Rate (per hour):</label>
                            <input type="number" id="rate" name="rate" value={formData.rate || 0} onChange={handleInputChange} min="0" required style={styles.input} />
                        </div>
                        <div style={styles.formGroup}>
                            <label htmlFor="about" style={styles.label}>About:</label>
                            <textarea id="about" name="about" value={formData.about || ''} onChange={handleInputChange} required style={styles.textarea}></textarea>
                        </div>

                        {/* Array Fields (Simple Text Input) */}
                         <div style={styles.formGroup}>
                            <label htmlFor="skills" style={styles.label}>Skills (comma-separated):</label>
                            <input type="text" id="skills" name="skills" value={formData.skills || ''} onChange={handleArrayInputChange} required style={styles.input} />
                         </div>
                         <div style={styles.formGroup}>
                            <label htmlFor="help" style={styles.label}>How they help (one item per line):</label>
                            <textarea id="help" name="help" value={formData.help || ''} onChange={handleArrayInputChange} required style={styles.textarea}></textarea>
                         </div>

                        {/* Availability Section (Needs better UI - basic example) */}
                        <div style={styles.formGroup}>
                           <label style={styles.label}>Availability:</label>
                           {(formData.availability || []).map((slot, index) => (
                               <div key={index} style={styles.availabilitySlot}>
                                   <input
                                       type="date" // Use type="datetime-local" for combined picker if supported
                                       value={slot.date ? slot.date.split('T')[0] : ''} // Format for date input
                                       onChange={(e) => handleAvailabilityChange(index, 'date', e.target.value)}
                                       required
                                       style={{ ...styles.inputSmall, marginRight: '5px' }}
                                   />
                                   <input
                                       type="time" // Consider pattern="[0-9]{2}:[0-9]{2}"
                                       value={slot.startTime || ''}
                                       onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                                       required
                                        style={{ ...styles.inputSmall, marginRight: '5px' }}
                                   />
                                   <input
                                       type="time"
                                       value={slot.endTime || ''}
                                       onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                                       required
                                        style={{ ...styles.inputSmall, marginRight: '5px' }}
                                   />
                                   <button type="button" onClick={() => removeAvailabilitySlot(index)} style={styles.buttonSmallDanger}>Remove</button>
                               </div>
                           ))}
                           <button type="button" onClick={addAvailabilitySlot} style={{...styles.buttonSmall, marginTop: '10px'}}>Add Slot</button>
                       </div>


                        {/* Submit Button & Status */}
                        <button type="submit" disabled={isLoading} style={styles.button}>
                            {isLoading ? 'Updating...' : 'Save Changes'}
                        </button>

                        {updateStatus.message && (
                            <p style={{ color: updateStatus.type === 'success' ? 'green' : 'red', marginTop: '10px' }}>
                                {updateStatus.message}
                            </p>
                        )}
                    </form>
                )}
            </div>
        </PasswordProtect>
    );
}


// --- Basic Inline Styles (Replace with CSS Modules or Tailwind) ---
const styles = {
    loginContainer: { padding: '40px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' },
    loginForm: { display: 'flex', flexDirection: 'column', gap: '15px' },
    container: { padding: '20px', fontFamily: 'sans-serif' },
    section: { marginBottom: '20px' },
    form: { border: '1px solid #eee', padding: '20px', borderRadius: '5px', marginTop: '20px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    input: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    inputSmall: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' },
    textarea: { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px', boxSizing: 'border-box' },
    select: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginRight: '10px' },
    button: { padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    buttonSmall: { padding: '5px 10px', backgroundColor: '#ccc', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' },
    buttonSmallDanger: { padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' },
    availabilitySlot: { display: 'flex', alignItems: 'center', marginBottom: '5px', border: '1px dashed #eee', padding: '5px' },
};