import { getMentors } from '../../utils/data';

export default function handler(req, res) {
  try {
    const mentors = getMentors();
    
    // Check if an ID was provided to get a specific mentor
    if (req.query.id) {
      const mentor = mentors.find(m => m.id === req.query.id);
      if (!mentor) {
        return res.status(404).json({ message: 'Mentor not found' });
      }
      return res.status(200).json(mentor);
    }
    
    // If no ID provided, return all mentors
    res.status(200).json(mentors);
  } catch (error) {
    console.error('Error in mentors API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
