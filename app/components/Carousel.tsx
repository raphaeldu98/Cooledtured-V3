import {useSignal} from '@preact/signals-react';
import {FaAngleRight, FaAngleLeft} from 'react-icons/fa';
import slideData from '../data/slideData.json';
import {useEffect, useRef} from 'react';
import {Link} from '@remix-run/react';
import React from 'react';

// Slide Data - An array of objects, each representing a slide with its content.
// Each object contains an ID, subheading, heading, description, call-to-action (CTA) link and text, and an image URL.

type MousePositionType = {x: number; y: number};

function Carousel() {
  // State for managing slides and current slide index
  const slide = useSignal(slideData.Cards);
  const isClicked_P = useSignal(false);
  const isClicked_N = useSignal(false);
  const currentSlide = useSignal(0);
  const nextClicked = useSignal(false);
  const mousePosition = useSignal<MousePositionType>({x: 0, y: 0});

  // Function to update mouse position
  const handleMouseMove = (event: any) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    mousePosition.value = {x, y}; // Update signal with new mouse position
  };

  // Function to handle click on the "Previous" button
  // It decrements the currentSlide index or loops back to the last slide if the first slide is currently displayed.
  const prevSlide = () => {
    currentSlide.value =
      currentSlide.value === 0
        ? slide.value.length - 1
        : currentSlide.value - 1;
    nextClicked.value = false;
    isClicked_P.value = true;
    // Reset the animation
    setTimeout(() => (isClicked_P.value = false), 600); // Duration of the animation
  };

  // Function to handle click on the "Next" button
  // It increments the currentSlide index or loops back to the first slide if the last slide is currently displayed.
  const nextSlide = () => {
    currentSlide.value =
      currentSlide.value === slide.value.length - 1
        ? 0
        : currentSlide.value + 1;
    nextClicked.value = true;
    isClicked_N.value = true;
    // Reset the animation
    setTimeout(() => (isClicked_N.value = false), 600); // Duration of the animation
  };

  // Custom hook for setting up an interval
  function useInterval(callback: () => void, delay: number) {
    const intervalId = useRef<number | null>(null); // useRef to persist the interval ID across renders

    useEffect(() => {
      intervalId.current = setInterval(callback, delay); // Set up the interval
      return () => clearInterval(intervalId.current); // Clear interval on component unmount or dependencies change
    }, [callback, delay]); // Dependencies array for useEffect
  }

  // Using the custom useInterval hook
  useInterval(() => {
    const nextIndex = (currentSlide.value + 1) % slide.value.length; // Calculate next slide index
    setTimeout(() => {
      currentSlide.value = nextIndex; // Update slide index
    }, 250); // Transition delay
  }, 9000); // Interval delay

  function renderBreakPoints(description: string) {
    return description
      .split('\n')
      .map((line: any, index: number, array: any) => (
        <React.Fragment key={index}>
          {line}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      ));
  }

  // Function to render background image layers with smooth transitions
  const renderBgImageLayers = () => {
    return slide.value.map((slide, slideIndex) =>
      slide.bgImageLayers.map((layer, layerIndex) => {
        // Calculate movement based on mouse position and layer speed
        const xOffset = (mousePosition.value.x * layer.speed) / 100;
        const yOffset = (mousePosition.value.y * layer.speed) / 100;
        // Determine if this layer is part of the current slide
        const isActive = slideIndex === currentSlide.value;

        return (
          <div
            key={`${slideIndex}-${layerIndex}`}
            className="absolute inset-0 bg-repeat-space"
            style={{
              backgroundImage: `url(${layer.url})`,
              backgroundPosition: 'center',
              backgroundSize: `${layer.style.objectFit}`,
              opacity: isActive ? 1 : 0, // Only the active slide's layer is fully visible
              transform: `translate(${xOffset}px, ${yOffset}px) scale(${layer.style.scale})`,
              // Specify separate transitions for opacity and transform
              transition: `opacity 300ms ease-in-out, transform 100ms ease-out`,
            }}
          />
        );
      }),
    );
  };

  // Rendering the main carousel section.
  return (
    <div
      className="slide-container after:absolute after:top-0 after:-left-full after:w-full after:h-full hover:after:left-full transition-all duration-700 ease-in-out pt-3 pb-0.5 px-4 xl:px-0 relative overflow-hidden border-b-4 border-b-gray-300"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 z-0 overflow-visible">
        {renderBgImageLayers()}
      </div>

      {/* ------- Slide Container ------- */}
      <section
        className={`relative rounded-xl hover:scale-[103%] transition-all duration-700 ease-in-out min-w-[300px] mx-auto min-h-[30rem] h-[30rem] mxs:h-[35rem] sm:min-h-[40rem] sm:h-[40rem] md:h-[50rem] md:min-h-[50rem] lg:h-[35rem] lg:min-h-[35rem] max-w-[76rem] mt-0 sm:mt-4 mb-4 sm:mb-8 overflow-hidden ${
          nextClicked ? 'next-clicked' : ''
        }`}
      >
        {/* Individual Slides */}
        {slide.value.map((slide, slideIndex) => (
          <Link
            to={`/collections/${slide.handle}`}
            key={slide.id}
            prefetch="intent"
            className={`absolute inset-0 flex flex-col lg:flex-row justify-center items-center transition-opacity duration-[700ms] ease-in-out hover:no-underline ${
              slideIndex === currentSlide.value ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translateX(${
                100 * (slideIndex - currentSlide.value)
              }%)`,
            }}
          >
            {/* Contents */}
            <div className=" lg:basis-3/4 lg:ml-32 mb-4 sm:mb-8 sm:mt-0 bg-black bg-opacity-75 md:bg-gray-400 md:bg-opacity-[60%] lg:bg-transparent rounded-3xl py-1 sm:py-4 lg:py-0 w-2/3 lg:my-auto lg:space-y-3 z-20 min-w-[260px] transition-all duration-500 ease-in-out">
              {/*  Heading ---- Top Line */}
              <h3
                className="block uppercase text-center lg:text-left mb-2 text-4xl sm:text-5xl lg:text-7xl font-bold leading-snug tracking-tighter lg:tracking-normal hover:scale-105 transition-transform duration-150 ease-in-out"
                style={slide.headingStyle}
              >
                {renderBreakPoints(slide.heading)}
              </h3>
              {/* SubHeading ---- Middle Line */}
              <span
                className="block uppercase mx-2 lg:mx-0 text-center lg:text-left mb-2 text-lg sm:text-xl lg:text-2xl font-bold leading-6 tracking-tight hover:scale-105 transition-transform duration-150 ease-in-out"
                style={slide.subheadingStyle}
              >
                {renderBreakPoints(slide.subheading)}
              </span>
              {/* Description ---- Bottom Line */}
              <p
                className="hidden md:block w-5/6 text-wrap lg:w-full lg:text-nowrap text-center lg:text-left mx-auto lg:ml-16 text-lg md:text-[1.35rem] lg:text-2xl font-medium leading-normal tracking-tighter hover:scale-105 transition-transform duration-150 ease-in-out"
                style={slide.descriptionStyle}
              >
                {renderBreakPoints(slide.description)}
              </p>
            </div>
            {/* Product Image */}
            <img
              src={slide.image}
              alt={slide.heading}
              className=" flex md:-mx-8 mb-8 -mt-2 sm:mb-12 sm:mt-0 lg:mb-4 lg:my-0 lg:-ml-8 lg:mr-12 w-auto max-w-full max-h-[17rem] sm:max-h-[22rem] md:max-h-[28rem] lg:max-h-[29rem] lg:max-h-5/6 xl:pr-8 object-contain z-20 hover:scale-105 transition-all duration-300 ease-in-out"
            />
          </Link>
        ))}
        <div className="flex h-full justify-center items-center">
          {/* Previous button */}
          <button
            onClick={prevSlide}
            className={`hidden md:block transition-all duration-300 ease-in-out hover:scale-125 hover:bg-gray-950 hover:border-gray-500 border-2 hover:py-28 hover:rounded-[1.25rem] absolute left-4 z-2 p-2 text-white bg-gray-800 border-black rounded-2xl ${
              isClicked_P.value ? 'bounce' : ''
            }`}
          >
            <FaAngleLeft className=" text-3xl h-32 text-slate-300 hover:text-slate-50" />
          </button>

          {/*Next button */}
          <button
            onClick={nextSlide}
            className={`hidden md:block transition-all duration-300 ease-in-out hover:scale-125 hover:bg-gray-950 hover:border-gray-500 border-2 hover:py-28 hover:rounded-[1.25rem] absolute right-4 z-2 p-2 z-2 text-white bg-gray-800 border-black rounded-2xl ${
              isClicked_N.value ? 'bounce' : ''
            }`}
          >
            <FaAngleRight className=" text-3xl h-32 text-slate-300 hover:text-slate-50" />
          </button>
        </div>

        {/* Indicator buttons */}
        <div className="absolute bottom-4 flex items-end w-full justify-center">
          {slide.value.map((_, index) => (
            <div
              key={index}
              className="relative mx-11 md:mx-8 flex justify-center items-center content-center w-10 h-6"
            >
              <div
                key={index}
                className={`indicator-button h-6 w-6 lg:w-5 lg:h-5 bg-slate-100 border-2 border-slate-100 rounded-full cursor-pointer absolute transition-all duration-200 ease-in-out hover:w-10 hover:h-10 lg:hover:w-8 lg:hover:h-8 mb-4 ${
                  index === currentSlide.value ? 'active' : ''
                }`}
                onClick={() => (currentSlide.value = index)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Carousel;
