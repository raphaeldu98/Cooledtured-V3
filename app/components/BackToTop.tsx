import {useEffect} from 'react';
import {useSignal} from '@preact/signals-react';

function BackToTop() {
  const backToTopVisible = useSignal(false); // Signal boolean to control the visibility of the backToTop button

  // Effect to handle scroll event and determine button visibility
  useEffect(() => {
    // Function to handle scroll event
    const handleScroll = () => {
      const position = document.body.scrollTop; // Current position of scroll
      backToTopVisible.value = position > 300; // Set boolean signal on scroll position past 300px
    };

    // Attach scroll event listener to the document body *might not work for certain browsers*
    document.body.addEventListener('scroll', handleScroll);

    // Cleanup function to remove event listener
    return () => {
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to scroll page back to top
  const scrollUp = () => {
    document.body.scrollTo({
      top: 0, // Scroll to top of page
      behavior: 'smooth', // Smooth scrolling *auto for instant scroll*
    });
  };

  return (
    <div className="Test">
      {backToTopVisible.value && (
        <button
          onClick={scrollUp}
          className="fixed bottom-3 right-8 h-12 w-12 bg-blue-950 rounded-full flex items-center justify-center text-gray-200 shadow-md shadow-black cursor-pointer hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Back to top"
        >
          {/* SVG for upward-pointing triangle */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-12"
          >
            <path fillRule="evenodd" d="M5 15l7-7 7 7H5z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default BackToTop;
