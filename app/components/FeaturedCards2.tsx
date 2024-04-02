import {Link} from '@remix-run/react';

const FeaturedCards2 = () => {
  return (
    <>
      {/* Second container */}
      <div className="flex flex-col lg:flex-row p-4 gap-2 md:gap-4 max-w-[98%] xxs:max-w-[95%] lg:max-w-[90rem]">
        {/*Flex Container for Smaller items*/}
        <div className="grid lg:grid-rows-2 grid-rows-1 grid-cols-2 lg:grid-cols-1 justify-between gap-2 lg:gap-4 w-full lg:w-1/4 max-h-full">
          {/* Added wrapper for aspect ratio fix */}
          {/* Homegoods card */}
          <div className="w-full p-1 md:p-2 lg:w-auto border-4 border-transparent hover:border-amber-500 rounded-lg lg:rounded-3xl bg-[#A5AEE0] transition-all duration-300 ease-in-out hover:scale-[102%] hover:shadow-lg cursor-pointer max-h-full">
            <Link
              to={`/collections/home-goods`}
              prefetch="intent"
              className="aspect-w-6 aspect-h-7 lg:aspect-none" // Use aspect ratio utilities from Tailwind CSS v2.2+
            >
              <img
                className="object-contain lg:object-cover h-full rounded-md lg:rounded-2xl"
                src="/images/FeaturedCards/Home.svg"
                alt="Shop Staff Picks"
              />
            </Link>
          </div>

          {/* Added wrapper for aspect ratio fix */}
          {/* Pride Card */}
          <div className="w-full p-1 md:p-2 lg:w-auto border-4 border-transparent hover:border-amber-500 rounded-lg lg:rounded-3xl bg-[#A5AEE0] transition-all duration-300 ease-in-out hover:scale-[102%] hover:shadow-lg cursor-pointer max-h-full">
            <Link
              to={`/collections/gear`}
              prefetch="intent"
              className="aspect-w-6 aspect-h-7 lg:aspect-none"
            >
              <img
                className="object-contain lg:object-cover h-full rounded-md lg:rounded-2xl"
                src="/images/FeaturedCards/Gear.svg"
                alt="Shop Pride Products"
              />
            </Link>
          </div>
        </div>
        {/* Premium card */}
        <Link
          to={`/collections/exclusives`}
          prefetch="intent"
          className=" flex flex-grow-0 justify-center items-center border-4 border-transparent hover:border-amber-500 p-1 md:p-2 rounded-lg lg:rounded-3xl bg-[#A5AEE0] overflow-hidden w-full lg:w-3/4 transition duration-300 hover:scale-[101.5%] hover:shadow-lg cursor-pointer"
        >
          <img
            className="object-cover aspect-[16/9] lg:aspect-[16/11] h-full rounded-md lg:rounded-2xl object-top"
            src="/images/FeaturedCards/Premium.svg"
            alt="Shop Exclusives"
          />
        </Link>
      </div>
    </>
  );
};

export default FeaturedCards2;
