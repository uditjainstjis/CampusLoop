// pages/index.js (or app/page.js for App Router)
import ScrollSections from '../components/ScrollSections'; // Adjust path
import Head from 'next/head';

export default function HomePage() {
  return (
    <div className='mt-[-50vh]'>


      {/* Optional content before */}

      <ScrollSections />
      
      {/* Optional content after */}
      {/* This content won't be visible until you scroll past the ScrollSections trigger height */}

    </div>
  );
}