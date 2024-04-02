import {useSignal} from '@preact/signals-react';
import WidgetBot from '@widgetbot/react-embed';
import {useEffect, useRef} from 'react';
import {FaDiscord, FaTimes} from 'react-icons/fa';

const Discord = () => {
  const isWidgetVisible = useSignal(false);
  const widgetStyle = useSignal({});
  const widgetRef = useRef<HTMLDivElement>(null);

  const updateWidgetStyle = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Full width on small devices, else limit width
    const widgetWidth =
      viewportWidth < 768 ? viewportWidth : Math.min(350, viewportWidth * 0.8);
    const widgetHeight = Math.min(600, viewportHeight * 0.8);

    // Adjust right and bottom offset for mobile and non-mobile devices
    const rightOffset = viewportWidth < 768 ? 0 : 20;
    const bottomOffset = viewportWidth < 768 ? 90 : widgetHeight / 2;

    widgetStyle.value = {
      display: isWidgetVisible.value ? 'block' : 'none',
      width: `${widgetWidth}px`,
      height: `${widgetHeight}px`,
      position: 'fixed',
      bottom: `${bottomOffset}px`,
      right: `${rightOffset}px`,
      transition: 'transform 0.5s ease, opacity 0.5s ease',
      transform: isWidgetVisible.value ? 'scale(1)' : 'scale(0)',
      opacity: isWidgetVisible.value ? 1 : 0,
      zIndex: 80,
      overflow: 'hidden',
    };
  };
  // Update widget style on visibility change or window resize
  useEffect(() => {
    updateWidgetStyle();
    window.addEventListener('resize', updateWidgetStyle);
    return () => window.removeEventListener('resize', updateWidgetStyle);
  }, [isWidgetVisible.value]);

  // Toggle widget visibility
  const toggleWidgetVisibility = () => {
    isWidgetVisible.value = !isWidgetVisible.value;
    updateWidgetStyle();
  };

  // Close the widget
  const closeWidget = () => {
    isWidgetVisible.value = false;
    updateWidgetStyle();
  };

  // Close widget when clicking outside of it
  const handleClickOutside = (event: any) => {
    if (widgetRef.current && !widgetRef.current.contains(event.target)) {
      isWidgetVisible.value = false;
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-[15%] xs:bottom-[10%] sm:bottom-[8%] right-0 sm:right-4 z-[130] flex flex-col items-end"
    >
      {/* WidgetBot Embed */}
      <div
        className={`widget-container transition-all ease-out duration-200 origin-bottom-right transform ${
          isWidgetVisible.value ? 'scale-100' : 'scale-0'
        } absolute`}
        style={widgetStyle.value}
      >
        {isWidgetVisible.value && (
          <WidgetBot
            server="183353150126817280"
            channel="1112146630670549013"
            shard="https://e.widgetbot.io"
            height="100%"
            width="100%"
          />
        )}
        {/* Close button */}
        {isWidgetVisible.value && (
          <button
            onClick={closeWidget}
            className="absolute bottom-1 right-1 bg-red-700 hover:bg-red-800 text-black font-medium p-1 rounded-full"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Toggling button */}
      <button
        onClick={toggleWidgetVisibility}
        className="bg-[#5865f2] hover:bg-emerald-600 text-white font-bold rounded-md transition-all ease-in-out duration-150 flex flex-col items-center justify-center h-24 w-8 xs:h-28 xs:w-10 box-borders gap-4"
      >
        <FaDiscord className="text-3xl xs:text-4xl -mt-4" />
        <h3 className="text-base xs:text-lg tracking-widest origin-center -rotate-90">
          {isWidgetVisible.value ? 'Hide' : 'Chat'}
        </h3>
      </button>
    </div>
  );
};

export default Discord;
