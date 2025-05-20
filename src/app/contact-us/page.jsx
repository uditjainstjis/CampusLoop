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

export default function ContactUsPage() {
  const lastUpdated = "[Date - e.g., October 27, 2023]"; // SET YOUR DATE
  const contactEmail = "uditj668@gmail.com";
  const websiteUrl = "https://campus-loop.vercel.app/";
  const companyName = "[Your Company Name/Your Name]"; // SET YOUR COMPANY NAME
  const streetAddress = "[Your Street Address (Optional)]";
  const cityStateZip = "[Your City, State, Zip Code (Optional)]";
  const country = "[Your Country (Optional)]";


  return (
    <>
      <Head>
        <title>Contact Us - CampusLoop</title>
        <meta name="description" content="Get in touch with CampusLoop for support, inquiries, or feedback." />
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
            Contact Us
          </h1>
          <p className="text-sm text-gray-500 mb-10 text-center">
            Last Updated: {lastUpdated}
          </p>

          <section className="space-y-6 text-gray-700 leading-relaxed">
            <p>We're here to help! If you have any questions, concerns, feedback, or need support regarding the CampusLoop platform (<a href={websiteUrl} className="text-purple-600 hover:text-purple-800 font-medium">{websiteUrl}</a>) or our services, please don't hesitate to reach out.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">How to Reach Us:</h2>
            
            <div className="mt-6 p-6 border border-purple-200 rounded-lg bg-purple-50/50">
              <h3 className="text-xl font-semibold text-purple-700">Primary Contact Method: Email</h3>
              <p className="mt-2">For general inquiries, support requests, feedback, or questions about our policies, please email us at:</p>
              <p className="mt-1">
                <a href={`mailto:${contactEmail}`} className="text-2xl font-semibold text-purple-600 hover:text-purple-800 hover:underline">
                  {contactEmail}
                </a>
              </p>
              <p className="mt-3 text-sm text-gray-600">We aim to respond to all inquiries within 24-48 business hours. Please provide as much detail as possible in your email so we can assist you effectively. This may include:</p>
              <ul className="list-disc list-inside space-y-1 pl-4 mt-2 text-sm text-gray-600">
                  <li>Your username (if applicable)</li>
                  <li>Details of the issue or question</li>
                  <li>Date and time of any relevant session</li>
                  <li>Screenshots (if helpful)</li>
              </ul>
            </div>

            { (streetAddress && streetAddress !== "[Your Street Address (Optional)]") && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800">Mailing Address (Optional):</h3>
                <address className="mt-2 not-italic text-gray-600">
                  {companyName}<br />
                  {streetAddress}<br />
                  {cityStateZip}<br />
                  {country}
                </address>
                <p className="mt-1 text-sm text-gray-500"><em>Please note: For the quickest response, email is the preferred method of contact.</em></p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-purple-600 pt-4">Feedback</h2>
            <p>We value your feedback and are always looking for ways to improve CampusLoop. Please feel free to share your thoughts and suggestions with us.</p>

            <h2 className="text-2xl font-bold text-purple-600 pt-4">Reporting Issues</h2>
            <p>If you encounter any technical issues, inappropriate conduct, or other problems on the platform, please report them to us promptly via email.</p>

            <p className="pt-6 text-center font-medium text-purple-700">Thank you for being a part of the CampusLoop community!</p>
          </section>
        </div>
      </motion.main>
    </>
  );
}