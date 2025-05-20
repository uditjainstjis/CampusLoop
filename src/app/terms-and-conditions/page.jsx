'use client'

import Head from 'next/head';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "[Date - e.g., October 27, 2023]"; // SET YOUR DATE
  const contactEmail = "uditj668@gmail.com";
  const websiteUrl = "https://campus-loop.vercel.app/";
  const jurisdiction = "[Your Jurisdiction - e.g., India, State of California, USA]"; // SET YOUR JURISDICTION

  return (
    <>
      <Head>
        <title>Terms and Conditions - CampusLoop</title>
        <meta name="description" content="CampusLoop Terms and Conditions for using our platform." />
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
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-10 text-center">
            Last Updated: {lastUpdated}
          </p>

          <section className="space-y-6 text-gray-700 leading-relaxed">
            <p>Please read these Terms and Conditions ("Terms," "Terms and Conditions") carefully before using the <a href={websiteUrl} className="text-purple-600 hover:text-purple-800 font-medium">{websiteUrl}</a> website (the "Service") operated by CampusLoop ("us," "we," or "our").</p>
            <p>Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who wish to access or use the Service. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the Service.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">1. SERVICE DESCRIPTION</h2>
            <p>CampusLoop is a platform that connects college students ("Mentors") with school students ("Mentees") seeking guidance and information about college life, studies, and related topics. Mentors can list available time slots, and Mentees can book these slots for paid, digital one-on-one sessions.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">2. ACCOUNTS</h2>
            <p>When you create an account with us, you guarantee that you are above the age of 13 (or the applicable age of consent in your jurisdiction) and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.</p>
            <p>You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">3. SESSIONS AND PAYMENTS</h2>
            <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Mentors set their availability and may define the scope of their sessions.</li>
                <li>Mentees can book available sessions by making a payment through our designated payment processor, Razorpay.</li>
                <li>All payments are processed by Razorpay. CampusLoop does not store your full payment card details.</li>
                <li>Sessions are conducted digitally through the platform's communication tools or as otherwise agreed between Mentor and Mentee (if applicable).</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">4. USER CONDUCT</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Violate any local, state, national, or international law.</li>
                <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability.</li>
                <li>Submit false or misleading information.</li>
                <li>Upload or transmit viruses or any other type of malicious code.</li>
                <li>Collect or track the personal information of others.</li>
                <li>Impersonate any person or entity.</li>
                <li>Interfere with or circumvent the security features of the Service.</li>
            </ul>
            <p>Mentors agree to provide information truthfully and to the best of their knowledge and experience. Mentees agree to be respectful and engage constructively.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">5. CANCELLATION AND REFUND POLICY</h2>
            <p>All bookings for sessions are final. CampusLoop does not offer cancellations or refunds for booked sessions once payment has been made, due to the commitment of Mentor's time and scheduling. Please refer to our separate "Cancellation and Refund Policy" page for details.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">6. INTELLECTUAL PROPERTY</h2>
            <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of CampusLoop and its licensors. The Service is protected by copyright, trademark, and other laws of both {jurisdiction} and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of CampusLoop.</p>
            <p>Content provided by users (e.g., Mentor bios, Mentee questions) remains the intellectual property of the respective user, but you grant CampusLoop a worldwide, non-exclusive, royalty-free license to use, reproduce, display, and distribute such content in connection with operating and providing the Service.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">7. DISCLAIMERS</h2>
            <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>
            <p>CampusLoop does not warrant that a) the Service will function uninterrupted, secure, or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.</p>
            <p>Advice or information provided by Mentors is for informational purposes only and does not constitute professional advice. CampusLoop is not responsible for the accuracy, applicability, or completeness of information shared by Mentors. We do not guarantee any specific outcomes, such as college admission, as a result of using the Service.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">8. LIMITATION OF LIABILITY</h2>
            <p>In no event shall CampusLoop, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">9. GOVERNING LAW</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of {jurisdiction}, without regard to its conflict of law provisions.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">10. CHANGES</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            <p>By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">11. CONTACT US</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <p>
              Email: <a href={`mailto:${contactEmail}`} className="text-purple-600 hover:text-purple-800 font-medium">{contactEmail}</a><br />
              Website: <a href={websiteUrl} className="text-purple-600 hover:text-purple-800 font-medium">{websiteUrl}</a>
            </p>
          </section>
        </div>
      </motion.main>
    </>
  );
}