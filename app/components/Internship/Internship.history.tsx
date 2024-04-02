import {useSignal} from '@preact/signals-react';

// Define the content for each year
const contentByYear: {[key: string]: JSX.Element} = {
  '2021': (
    <div>
      <Year2021 />
    </div>
  ),
  '2022': (
    <div>
      <Year2022 />
    </div>
  ),
  '2023': (
    <div>
      <Year2023 />
    </div>
  ),
  '2024': (
    <div>
      <Year2024 />
    </div>
  ),
  Future: (
    <div>
      <Future />
    </div>
  ),
};

function Timeline() {
  const selectedYear = useSignal('2024'); // Default selected year is 2021

  return (
    <div className="flex flex-col items-center max-w-full">
      {/* Timeline buttons */}
      <div className="flex relative justify-center flex-col items-center">
        <div className="flex justify-center items-center gap-10 xxs:gap-12 sm:gap-20 md:gap-28">
          {/* Render the circles with rings and connecting lines */}
          {Object.keys(contentByYear).map((year) => (
            <button
              key={year}
              className={`relative flex justify-center rounded-full size-4 xxs:size-6 xs:size-8 ring-4 ring-offset-4 ${
                selectedYear.value === year
                  ? 'bg-sky-500 ring-sky-500 text-sky-500' // Selected year styling
                  : 'bg-blue-800 ring-blue-500 text-blue-800' // Non-selected year styling
              }`}
              onClick={() => (selectedYear.value = year)}
            >
              <div className="mt-6 xs:mt-10 font-bold text-lg xxs:text-xl xs:text-2xl">
                {year}
              </div>
            </button>
          ))}
        </div>
        <hr className="absolute w-[99%] h-1 mx-auto my-4 bg-blue-800 border-0 rounded md:my-10 -z-10" />
      </div>
      {/* Dynamic content based on selected year */}
      <div className="flex place-items-center mt-24 max-w-[65rem]">
        {contentByYear[selectedYear.value]}
      </div>
    </div>
  );
}

export default function History() {
  return (
    <div className="flex flex-col justify-center items-center my-8 gap-4">
      <h2 className="text-4xl font-bold text-center mb-4">
        History of the Program
      </h2>
      <p className="">
        We're a team of passionate collectors, enthusiasts of anime, gaming, and
        pop culture, sharing our love and knowledge with fellow fans like you!
      </p>
      <p className="">
        Our skilled support staff is dedicated to assisting you with your
        shopping needs and providing the best customer service experience.
      </p>
      <p className="font-medium">
        Join our community of collectors and enthusiasts and let's make
        collecting a fun and interactive journey!
      </p>
      {/* The Timeline component is used here to switch between different year's content */}
      <div className="mt-10 mb-8">
        <Timeline />
      </div>
    </div>
  );
}

function Year2021() {
  return (
    <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center md:gap-12">
      <img
        src="/images/InternshipSite/2021-image.svg"
        loading="lazy"
        className="-mt-24 md:mt-0 row-start-2 md:row-start-1 w-full h-full aspect-[1/1] object-cover"
        alt="First Image"
      />
      <div className="text-left flex flex-col gap-4">
        <h1 className="text-4xl font-Montserrat font-extrabold">
          Future-Proof Initiative
        </h1>
        <p className="">
          cooledtured ignited its expansion journey with a dedicated team,
          embarking on strategic initiatives to unlock new horizons and propel
          growth.The program's focus on equipping students for the future.
        </p>
        <ul className="list-disc ml-4">
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Business Development:</h4>
              <span>Yu Yang</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Front End Development:</h4>
              <span>Sana Ahmed</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Back End Development:</h4>
              <span>Preston Bona</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Manager:</h4>
              <span>Chloe Altez</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Coordinator:</h4>
              <span>Rachelle Valderueda</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
function Year2022() {
  return (
    <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center gap-12">
      <img
        src="/images/InternshipSite/2022-image.svg"
        loading="lazy"
        className="-mt-24 md:mt-0 row-start-2 md:row-start-1 w-full h-full aspect-[1/1] object-contain"
        alt="First Image"
      />
      <div className="text-left flex flex-col gap-4">
        <h1 className="text-4xl font-Montserrat font-extrabold">
          Disruptors Lab
        </h1>
        <p className="">
          Where the research team ignited change and redefined what's possible.
        </p>
        <ul className="list-disc ml-4">
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Social Media Management:</h4>
              <span>Harjit Singh</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Communication Management:</h4>
              <span> Daniel Simons</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Manager:</h4>
              <span>Chloe Altez</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Coordinator:</h4>
              <span>Rachelle Valderueda</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
function Year2023() {
  return (
    <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center gap-12">
      <img
        src="/images/InternshipSite/2023-image.svg"
        loading="lazy"
        className="-mt-24 md:mt-0 row-start-2 md:row-start-1 w-full h-full aspect-[1/1] object-contain"
        alt="First Image"
      />
      <div className="text-left flex flex-col gap-4">
        <h1 className="text-4xl font-Montserrat font-extrabold">
          Project Moonshot
        </h1>
        <p className="">
          Spark ambitious thinking and a "reach for the stars" mentality.
        </p>
        <ul className="list-disc ml-4">
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">VTuber “Vivi”:</h4>
              <span>Damien Rineer</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">
                Standardized Operating Procedures:
              </h4>
              <span> Kavya Deevi</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">
                200k+ reasons to reach for the stars:
              </h4>
              <span> Leonardo Maranhao</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Manager:</h4>
              <span>Chloe Altez</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Coordinator:</h4>
              <span>Rakesh Tadkal</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
function Year2024() {
  return (
    <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center gap-12">
      <img
        src="/images/InternshipSite/2024-image.svg"
        loading="lazy"
        className="-mt-32 -mb-24 row-start-2 md:row-start-1 w-full h-full aspect-[1/1]"
        alt="First Image"
      />
      <div className="text-left flex flex-col gap-4">
        <h1 className="text-4xl font-Montserrat font-extrabold">
          The Code-Breakers
        </h1>
        <p className="">
          Meet the masterminds behind Cooledtured v3! The Code Breakers cracked
          the future of web dev, paving the way for a smoother, cooler
          experience.
        </p>
        <ul className="list-disc ml-4">
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Lead Developer:</h4>
              <span>Christopher Lowden</span>
            </div>
          </li>
          <li>
            <div>
              <h4 className="font-semibold">Developer Team:</h4>
              <ul className="ml-2 p-1 list-[circle] list-inside">
                <li>Elie</li>
                <li>Keron</li>
                <li>Raphael</li>
                <li>Garrick</li>
                <li>Eric</li>
              </ul>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Lead Ui/Ux Designer:</h4>
              <span>Shubham</span>
            </div>
          </li>
          <li>
            <div>
              <h4 className="font-semibold">Ui/Ux Team:</h4>
              <ul className="ml-2 p-1 list-[circle] list-inside">
                <li>Regina</li>
                <li>Ana-Louise</li>
              </ul>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Manager:</h4>
              <span>Chloe Altez</span>
            </div>
          </li>
          <li>
            <div className="flex gap-2">
              <h4 className="font-semibold">Coordinator:</h4>
              <span>Rakesh Tadkal</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
function Future() {
  return (
    <div className="w-full grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center gap-12">
      <img
        src="/images/InternshipSite/Future-image.svg"
        loading="lazy"
        className="-mt-20 md:mt-0 row-start-2 md:row-start-1 w-full h-full aspect-[1.5/1] object-contain"
        alt="First Image"
      />
      <div className="text-left flex flex-col gap-4">
        <h1 className="text-4xl font-Montserrat font-extrabold">
          The cooledtured Way{' '}
        </h1>
        <p className="max-w-[80ch]">
          At Cooledtured, we believe in fostering a dynamic and enriching
          environment for our team members. We offer a multitude of growth
          opportunities, allowing you to carve your own path within our company.
          From the moment you join us as an intern, you'll be actively engaged
          in projects that provide a hands-on experience. This immersive
          approach ensures you gain a comprehensive understanding of our
          operations and the wider pop culture landscape.
        </p>
      </div>
      <a
        className="col-span-full mx-auto lg:-mt-10"
        href="https://app.joinhandshake.com/stu/employers/908556"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="bg-blue-950 w-48 h-10 text-white font-semibold text-xl rounded-md shadow-xl hover:bg-blue-700">
          Apply
        </button>
      </a>
    </div>
  );
}
