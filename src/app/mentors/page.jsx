import React from 'react';
import { motion } from 'framer-motion';

const faqData = [
  {
    id: 1,
    question: 'What is Mentor Match?',
    answer: 'Mentor Match is a platform designed to connect individuals seeking guidance with experienced mentors in various fields.'
  },
  {
    id: 2,
    question: 'How do I find a mentor?',
    answer: 'You can browse our list of mentors, view their profiles, and book a session that fits your needs and schedule.'
  },
  {
    id: 3,
    question: 'Is there a cost to use Mentor Match?',
    answer: 'The cost of sessions varies depending on the mentor. Please check individual mentor profiles for pricing details.'
  },
  {
    id: 4,
    question: 'Can I book multiple sessions with the same mentor?',
    answer: 'Yes, you can book multiple sessions with a mentor based on their availability and your requirements.'
  },
  {
    id: 5,
    question: 'What if I need to reschedule a session?',
    answer: 'Rescheduling policies vary by mentor. Please refer to the mentors profile or contact them directly to inquire about rescheduling.'
  },
  {
    id: 6,
    question: 'How do I become a mentor on this platform?',
    answer: 'We have a separate application process for individuals interested in becoming mentors. Please visit our "Become a Mentor" page for more information.'
  },
  {
    id: 7,
    question: 'What kind of support is available?',
    answer: 'We offer email support for any questions or issues you may encounter. Please visit our "Contact Us" page.'
  },
  // Add more FAQs here
];

const FAQItem = ({ faq }) => (
  <motion.div
    className="bg-white rounded-md shadow-md p-6 mb-4"
    whileInView={{ x: 0, opacity: 1 }}
    initial={{ x: -100, opacity: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
  >
    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
    <p className="text-gray-700">{faq.answer}</p>
  </motion.div>
);

const FAQs = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        {faqData.map((faq) => (
          <FAQItem key={faq.id} faq={faq} />
        ))}
      </div>
    </div>
  );
};

export default FAQs;