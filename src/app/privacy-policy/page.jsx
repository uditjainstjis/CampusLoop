'use client'
import Head from 'next/head';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "[Date - e.g., October 27, 2023]"; // SET YOUR DATE
  const companyName = "[Your Company Name/Your Name]"; // SET YOUR COMPANY NAME
  const contactEmail = "uditj668@gmail.com";
  const websiteUrl = "https://campus-loop.vercel.app/";

  return (
    <>
      <Head>
        <title>Privacy Policy - CampusLoop</title>
        <meta name="description" content="CampusLoop Privacy Policy - How we collect, use, and protect your data." />
      </Head>
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-700 mb-6 text-center">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-10 text-center">
            Last Updated: {lastUpdated}
          </p>

          <section className="space-y-6 text-gray-700 leading-relaxed">
            <p>Welcome to CampusLoop ("we," "us," "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href={websiteUrl} className="text-purple-600 hover:text-purple-800 font-medium">{websiteUrl}</a> (the "Site") and use our services (the "Services"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">1. INFORMATION WE COLLECT</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">a. Personal Data:</h3>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li><strong>For Students/Mentors:</strong> Personally identifiable information, such as your name, email address, college affiliation, year of study, field of study, and any other information you voluntarily provide to us when you register for the Service, such as a profile picture or biography.</li>
              <li><strong>For Juniors/Mentees:</strong> Personally identifiable information, such as your name, email address, school affiliation, grade level, and any other information you voluntarily provide when you register or book a session.</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">b. Derivative Data:</h3>
            <p>Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</p>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">c. Financial Data:</h3>
            <p>We use Razorpay for payment processing. We do not directly collect or store your full financial information (like credit card numbers). All financial information is provided directly to Razorpay, whose use of your personal information is governed by their privacy policy. We may receive transaction identifiers and summaries from Razorpay.</p>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">d. Session Information:</h3>
            <p>We may store information related to your booked sessions, such as the mentor and mentee involved, date, time, and status of the session. We do not typically record or store the content of the digital sessions unless explicitly stated for quality or dispute resolution purposes with user consent.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">2. USE OF YOUR INFORMATION</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site or our Services to:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Create and manage your account.</li>
              <li>Facilitate the booking and execution of mentorship sessions.</li>
              <li>Process payments.</li>
              <li>Email you regarding your account or bookings.</li>
              <li>Improve the efficiency and operation of the Site and Services.</li>
              <li>Monitor and analyze usage and trends to improve your experience.</li>
              <li>Notify you of updates to the Site and Services.</li>
              <li>Respond to customer service requests.</li>
              <li>Resolve disputes and troubleshoot problems.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">3. DISCLOSURE OF YOUR INFORMATION</h2>
            <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">a. By Law or to Protect Rights:</h3>
            <p>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</p>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">b. Third-Party Service Providers:</h3>
            <p>We may share your information with third parties that perform services for us or on our behalf, including payment processing (Razorpay), data analysis, email delivery, hosting services, and customer service.</p>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">c. Between Users (Mentors and Mentees):</h3>
            <p>To facilitate sessions, necessary information (like names) will be shared between the mentor and mentee involved in a booked session.</p>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">d. Business Transfers:</h3>
            <p>We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">4. TRACKING TECHNOLOGIES</h2>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">Cookies and Web Beacons:</h3>
            <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">5. SECURITY OF YOUR INFORMATION</h2>
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">6. POLICY FOR CHILDREN</h2>
            <p>Our Services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information. If you believe we might have any information from or about a child under 13, please contact us at <a href={`mailto:${contactEmail}`} className="text-purple-600 hover:text-purple-800 font-medium">{contactEmail}</a>.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">7. YOUR DATA PROTECTION RIGHTS</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>The right to access – You have the right to request copies of your personal data.</li>
              <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
              <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
              <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
              <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
              <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
            </ul>
            <p>If you wish to exercise any of these rights, please contact us at <a href={`mailto:${contactEmail}`} className="text-purple-600 hover:text-purple-800 font-medium">{contactEmail}</a>.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">8. CHANGES TO THIS PRIVACY POLICY</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on the Site and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">9. CONTACT US</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <p>
              {companyName}<br />
              Email: <a href={`mailto:${contactEmail}`} className="text-purple-600 hover:text-purple-800 font-medium">{contactEmail}</a><br />
              Website: <a href={websiteUrl} className="text-purple-600 hover:text-purple-800 font-medium">{websiteUrl}</a>
            </p>
          </section>
        </div>
      </motion.main>
    </>
  );
}