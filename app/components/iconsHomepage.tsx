const HomepageIcons = () => {
  return (
    <div className="w-full max-w-[90rem] mx-auto my-8">
      <h2 className="w-full justify-center text-center flex items-center mb-8 text-3xl xxs:text-4xl xs:text-5xl font-redhands">
        cooledtured Guarantee
      </h2>
      <div className="flex flex-col mx-auto w-full items-center gap-8">
        <div className="mx-auto justify-around flex min-w-0">
          <div className="flex flex-shrink gap-4">
            <img
              className="w-full object-cover max-w-36"
              src="/images/HomePage/Packaged.svg"
              alt="Packaged with Care!"
            />
            <h3 className="hidden md:block font-bold text-xl prose">
              Packaged
              <br />
              with Care
            </h3>
          </div>
          <div className="flex flex-shrink gap-4">
            <img
              className="w-full object-cover max-w-36"
              src="/images/HomePage/Licensed.svg"
              alt="Licensed Products!"
            />
            <h3 className="hidden md:block font-bold text-xl prose">
              Licensed
              <br />
              Products
            </h3>
          </div>
          <div className="flex flex-shrink gap-4">
            <img
              className="w-full object-cover max-w-36"
              src="/images/HomePage/Support.svg"
              alt="24/7 Support!"
            />
            <h3 className="hidden md:block font-bold text-xl prose">
              24/7
              <br />
              Support
            </h3>
          </div>
        </div>
        <a
          href="/pages/faqs"
          className="py-1 px-3 h-fit bg-blue-950 rounded-xl border-2 border-amber-500 font-medium text-gray-200 hover:no-underline hover:scale-105 active:scale-95 transition-transform duration-150 ease-out"
        >
          Learn more...
        </a>
      </div>
    </div>
  );
};
export default HomepageIcons;
