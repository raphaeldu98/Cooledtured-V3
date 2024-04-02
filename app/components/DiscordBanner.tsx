import {useEffect, useRef} from 'react';
import discordBanner from '../data/discordBanner.json';
import {useSignal} from '@preact/signals-react';

const DiscordBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const isIntersectingRef = useRef<boolean>(false);

  const scrollY = useSignal(0);
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Calculate position for parallax effect
          const relativePosition =
            entry.boundingClientRect.top / window.innerHeight;

          // Update scrollY value
          scrollY.value = relativePosition * 100;

          // Update isIntersecting flag
          isIntersectingRef.current = true;
        } else {
          // Update isIntersecting flag
          isIntersectingRef.current = false;
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0, // Trigger whenever the component is in the viewport
    });

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    const handleScroll = () => {
      if (!isIntersectingRef.current) return; // Stop handling scroll if not intersecting

      const boundingRect = bannerRef.current?.getBoundingClientRect();
      if (
        boundingRect &&
        boundingRect.top >= 0 &&
        boundingRect.bottom <= window.innerHeight
      ) {
        const relativePosition = boundingRect.top / window.innerHeight;
        scrollY.value = relativePosition * 100;
      }
    };

    // Attach event listener for scroll
    document.body.addEventListener('scroll', handleScroll);

    return () => {
      // Detach event listener on component unmount
      document.body.removeEventListener('scroll', handleScroll);

      // Disconnect IntersectionObserver
      observer.disconnect();
    };
  }, [scrollY]);

  const renderBgImageLayers = () => {
    const {subheading, ImageLayers} = discordBanner.discordBanner[0];

    return (
      <>
        {ImageLayers.map((layer, index) => {
          const offsetX = layer.style.offsetX; // Directly use the percentage value
          const offsetY = layer.style.offsetY; // Directly use the percentage value

          const additionalXOffset = (scrollY.value * layer.speed.x) / 100;
          const additionalYOffset = (scrollY.value * layer.speed.y) / 100;

          const totalXOffset = `calc(${offsetX} + ${additionalXOffset}%)`;
          const totalYOffset = `calc(${offsetY} + ${additionalYOffset}%)`; //

          return (
            <div
              key={index}
              className="absolute inset-0 bg-no-repeat overflow-hidden"
              style={{
                backgroundImage: `url(${layer.url})`,
                backgroundPosition: layer.style.objectPosition,
                backgroundSize: layer.style.objectFit,
                transform: `translate(${totalXOffset}, ${totalYOffset}) scale(${layer.style.scale})`,
              }}
            />
          );
        })}
        <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 font-bold text-xs xs:text-sm align-text-bottom w-4/5 mmd:w-1/2 sm:text-md mmd:text-xl lg:text-2xl xl:text-3xl text-center rounded-full text-gray-100">
          {subheading}
        </div>
      </>
    );
  };

  return (
    <div
      ref={bannerRef}
      className="relative overflow-hidden m-8 rounded-3xl border-8 border-blue-950 w-full max-w-[80rem] mx-auto aspect-[4/1] hover:scale-[101%] hover:border-amber-500 transition-all duration-150 ease-in"
    >
      <div className="absolute aspect-[4/1] inset-0 z-0 overflow-hidden">
        <a
          href="https://discord.gg/Pd2wgZaWac" // Discord invite link
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full overflow-hidden" // Ensure the link is a block-level element to contain the banner
        >
          {renderBgImageLayers()}
        </a>
      </div>
    </div>
  );
};

export default DiscordBanner;
