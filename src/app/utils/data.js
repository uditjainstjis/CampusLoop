// In-memory database for mentors
const mentors = [
  {
    id: "mentor_1",
    name: "Sarah Johnson",
    title: "Senior Software Engineer at TechGiant",
    bio: "10+ years of experience building scalable applications. Passionate about helping juniors navigate their tech career.",
    expertise: ["React", "Node.js", "System Design", "Career Planning"],
    rate: 75,
    availability: ["Mon", "Wed", "Fri"]
  },
  {
    id: "mentor_2",
    name: "Michael Chen",
    title: "Lead Data Scientist at DataCorp",
    bio: "ML expert with a PhD in Computer Science. Specializing in practical applications of AI/ML in business contexts.",
    expertise: ["Machine Learning", "Python", "Data Analysis", "Statistics"],
    rate: 90,
    availability: ["Tue", "Thu", "Sat"]
  },
  {
    id: "mentor_3",
    name: "Priya Patel",
    title: "Product Manager at InnovateTech",
    bio: "Former engineer turned PM. Helping new PMs and engineers understand the product development lifecycle.",
    expertise: ["Product Strategy", "User Research", "Agile", "Roadmapping"],
    rate: 85,
    availability: ["Mon", "Wed", "Fri"]
  },
  {
    id: "mentor_4",
    name: "David Wilson",
    title: "UX/UI Designer at CreativeStudio",
    bio: "Award-winning designer with expertise in user-centered design. Love mentoring junior designers on portfolio development.",
    expertise: ["UX Research", "UI Design", "Prototyping", "User Testing"],
    rate: 70,
    availability: ["Tue", "Thu", "Sat"]
  },
  {
    id: "mentor_5",
    name: "Olivia Rodriguez",
    title: "Frontend Developer at WebWorks",
    bio: "Specializing in modern frontend frameworks and animations. Passionate about clean code and performance optimization.",
    expertise: ["React", "Vue.js", "CSS Animations", "Web Performance"],
    rate: 65,
    availability: ["Mon", "Wed", "Sat"]
  },
  {
    id: "mentor_6",
    name: "James Kim",
    title: "DevOps Engineer at CloudScale",
    bio: "Cloud infrastructure expert focusing on scalable architectures. Helping juniors learn modern deployment practices.",
    expertise: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    rate: 80,
    availability: ["Tue", "Thu", "Fri"]
  },
  {
    id: "mentor_7",
    name: "Emma Thompson",
    title: "Blockchain Developer at CryptoInnovate",
    bio: "Developing decentralized applications since 2016. Mentor for those looking to break into Web3 development.",
    expertise: ["Solidity", "Smart Contracts", "Ethereum", "Web3.js"],
    rate: 95,
    availability: ["Mon", "Wed", "Fri"]
  },
  {
    id: "mentor_8",
    name: "Robert Garcia",
    title: "Mobile App Developer at AppWorks",
    bio: "iOS and Android expert with 50+ app releases. Passionate about creating intuitive mobile experiences.",
    expertise: ["iOS (Swift)", "Android (Kotlin)", "React Native", "Mobile UX"],
    rate: 75,
    availability: ["Tue", "Thu", "Sat"]
  }
];

// Get all mentors
export const getMentors = () => {
  return [...mentors]; // Return a copy of the array
};

// Get a specific mentor by ID
export const getMentorById = (id) => {
  return mentors.find(mentor => mentor.id === id);
};

// Search mentors by expertise
export const searchMentorsByExpertise = (expertise) => {
  if (!expertise) return [...mentors];
  
  const lowerCaseExpertise = expertise.toLowerCase();
  return mentors.filter(mentor => 
    mentor.expertise.some(skill => 
      skill.toLowerCase().includes(lowerCaseExpertise)
    )
  );
};

// Filter mentors by rate range
export const filterMentorsByRate = (minRate, maxRate) => {
  let filtered = [...mentors];
  
  if (minRate !== undefined) {
    filtered = filtered.filter(mentor => mentor.rate >= minRate);
  }
  
  if (maxRate !== undefined) {
    filtered = filtered.filter(mentor => mentor.rate <= maxRate);
  }
  
  return filtered;
};

// Filter mentors by availability
export const filterMentorsByAvailability = (day) => {
  if (!day) return [...mentors];
  
  return mentors.filter(mentor => 
    mentor.availability.includes(day)
  );
};
