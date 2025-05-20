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

export default function CancellationRefundPolicyPage() {
  const lastUpdated = "[Date - e.g., October 27, 2023]"; // SET YOUR DATE
  const contactEmail = "uditj668@gmail.com";
  const websiteUrl = "https://campus-loop.vercel.app/";

  return (
    <>
      <Head>
        <title>Cancellation and Refund Policy - CampusLoop</title>
        <meta name="description" content="CampusLoop policy on cancellations and refunds for booked sessions." />
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
            Cancellation and Refund Policy
          </h1>
          <p className="text-sm text-gray-500 mb-10 text-center">
            Last Updated: {lastUpdated}
          </p>

          <section className="space-y-6 text-gray-700 leading-relaxed">
            <p>Thank you for choosing CampusLoop for your mentorship needs. This policy outlines our terms regarding cancellations and refunds for sessions booked through our platform <a href={websiteUrl} className="text-purple-600 hover:text-purple-800 font-medium">{websiteUrl}</a>.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">1. SESSION BOOKINGS</h2>
            <p>All session bookings made on the CampusLoop platform are considered final upon successful payment.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">2. CANCELLATIONS</h2>
            <p>Once a session is booked and paid for by a Mentee, it cannot be canceled by either the Mentee or the Mentor through the platform's standard process. We encourage both Mentors and Mentees to honor their scheduled commitments.</p>
            <p>If exceptional circumstances prevent a Mentor from attending a scheduled session, they are encouraged to communicate directly with the Mentee as soon as possible to explore rescheduling options, if mutually agreeable. CampusLoop does not currently facilitate rescheduling directly.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">3. REFUNDS</h2>
            <p>CampusLoop operates on a <strong className="font-semibold text-purple-700">no-refund policy</strong>. Due to the nature of scheduling digital services and the commitment of Mentors' time slots, we do not offer refunds for any booked sessions. This includes, but is not limited to:</p>
            <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Sessions a Mentee chooses not to attend.</li>
                <li>Dissatisfaction with the session content (while we encourage quality, the subjective nature of advice makes refunds unfeasible).</li>
                <li>Technical issues on the user's end preventing participation.</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-800 pt-2">Exceptions:</h3>
            <p>In the rare event of a platform-wide technical failure preventing a session from occurring, CampusLoop may, at its sole discretion, consider alternative remedies, which might include a credit for a future session or, in exceptional cases, a refund. Such instances will be evaluated on a case-by-case basis.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">4. MENTOR NO-SHOWS</h2>
            <p>While we encourage Mentors to be reliable, if a Mentor fails to attend a scheduled session without prior communication or valid reason, Mentees should report this to us at <a href={`mailto:${contactEmail}`} className="text-purple-600 hover:text-purple-800 font-medium">{contactEmail}</a>. We will investigate such instances and take appropriate action with the Mentor, which may include warnings or account suspension. However, this does not automatically guarantee a refund to the Mentee, as per our no-refund policy. We may, at our discretion, offer a credit or other resolution in such specific cases.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">5. POLICY CHANGES</h2>
            <p>CampusLoop reserves the right to modify this Cancellation and Refund Policy at any time. Any changes will be effective immediately upon posting the updated policy on our website.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">6. CONTACT US</h2>
            <p>If you have any questions regarding this Cancellation and Refund Policy, please contact us at:</p>
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