// pages/index.js (or app/page.js for App Router)
import ScrollSections from '../components/ScrollSections'; // Adjust path
import Head from 'next/head';

export default function HomePage() {
  return (
    <div className='mt-[-50vh] '>


      {/* Optional content before */}

      <ScrollSections />
      <div className='  bg-[#bfe4e1] mt-[-100vh] h-[120vh]'>
      </div> 
      
      {/* Optional content after */}
      {/* This content won't be visible until you scroll past the ScrollSections trigger height */}

    </div>
  );
}