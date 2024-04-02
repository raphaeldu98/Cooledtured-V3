import {Link} from '@remix-run/react';

<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>;
const FeaturedCards = () => {
  return (
    <>
      {/* <div className="grid gap-8 justify-items-center mx-auto max-w-[98%] xxs:max-w-[95%] lg:max-w-[90rem]"> */}
      {/* First container */}
      <div className=" flex flex-col lg:flex-row p-4 gap-2 lg:gap-4 max-w-[98%] xxs:max-w-[95%] lg:max-w-[90rem]">
        {/* Collections card container */}
        <Link
          to={`/collections/gunpla`}
          prefetch="intent"
          className=" flex flex-grow-0 justify-center items-center border-4 border-transparent hover:border-amber-500 p-1 md:p-2 rounded-lg lg:rounded-3xl bg-[#A5AEE0] overflow-hidden w-full lg:w-1/2 mlg:w-7/12 transition duration-300 hover:scale-[101.5%] hover:shadow-lg cursor-pointer"
        >
          <img
            className="object-cover aspect-[12/10] lg:aspect-video h-full rounded-md lg:rounded-2xl"
            src="/images/FeaturedCards/Gunpla.svg"
            alt="Shop Set Collections"
          />
        </Link>
        {/* Right cards container */}
        <div className="grid grid-rows-2 lg:flex lg:flex-col justify-between gap-2 lg:gap-4 w-full lg:w-1/2 mlg:w-5/12 max-h-full ">
          {/* Top row cards */}
          <div className="flex flex-row justify-between gap-2 lg:gap-4 max-h-full">
            {/* Gacha card */}
            <Link
              to={`/collections/gacha`}
              prefetch="intent"
              className="w-1/2 p-1 md:p-2 border-4 border-transparent hover:border-amber-500 lg:aspect-[5/6]  rounded-lg lg:rounded-3xl bg-[#A5AEE0] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer "
            >
              <img
                className="object-contain lg:object-cover h-full rounded-md lg:rounded-2xl"
                src="/images/FeaturedCards/Gacha.svg"
                alt="Shop Gacha Collection"
              />
            </Link>
            {/* Replica card */}
            <Link
              to={`/collections/replicas`}
              prefetch="intent"
              className="w-1/2 p-1 md:p-2 border-4 border-transparent hover:border-amber-500 lg:aspect-[5/6] rounded-lg lg:rounded-3xl bg-[#A5AEE0] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer "
            >
              <img
                className="object-contain lg:object-cover h-full rounded-md lg:rounded-2xl"
                src="/images/FeaturedCards/Replicas.svg"
                alt="Shop Replica Collection"
              />
            </Link>
          </div>
          {/* Bottom row cards */}
          <div className="flex flex-row justify-between gap-2 lg:gap-4 max-h-full">
            {/* Pride card */}
            <Link
              to={`/collections/pride`}
              prefetch="intent"
              className="w-1/2 p-1 md:p-2 lg:aspect-[5/6] border-4 border-transparent hover:border-amber-500  rounded-lg lg:rounded-3xl bg-[#A5AEE0] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer "
            >
              <img
                className="object-contain lg:object-cover h-full rounded-md lg:rounded-2xl"
                src="/images/FeaturedCards/Pride.svg"
                alt="Shop Pride Collection"
              />
            </Link>
            {/* Plush card */}
            <Link
              to={`/collections/plush`}
              prefetch="intent"
              className="w-1/2 p-1 md:p-2 lg:aspect-[5/6] border-4 border-transparent hover:border-amber-500 rounded-lg lg:rounded-3xl bg-[#A5AEE0] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer "
            >
              <img
                className="object-contain lg:object-cover h-full rounded-md lg:rounded-2xl"
                src="/images/FeaturedCards/Plush.svg"
                alt="Shop Plush Collection"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* </div> */}
    </>
  );
};

export default FeaturedCards;
