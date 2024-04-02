const ViviBanner = () => {
  return (
    <div className="relative flex justify-center items-center w-full overflow-hidden aspect-[2.5/1] top-0">
      <a
        href="https://discord.gg/Pd2wgZaWac" //Discord invite set to no expiration. Can be revoked in server's invite settings if needed.
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Lower loop scrolling left to right */}
        <div className=" flex absolute top-4 left-0 w-full h-full scroll-left-to-right">
          <img
            src="/images/Community/vivi/vtuberLowerLoop.svg"
            alt="Lower Loop"
            className=" h-full"
          />
          <img
            src="/images/Community/vivi/vtuberLowerLoop.svg"
            alt="Lower Loop"
            className="h-full"
          />
          <img
            src="/images/Community/vivi/vtuberLowerLoop.svg"
            alt="Lower Loop"
            className=" h-full"
          />
        </div>

        {/* Upper loop scrolling right to left */}
        <div className=" flex absolute top-4 msm:top-8 md:top-12 lg:top-16 right-[0%] w-full h-full scroll-right-to-left">
          <img
            src="/images/Community/vivi/vtuberUpperLoop.svg"
            alt="Upper Loop"
            className=" h-full"
          />
          <img
            src="/images/Community/vivi/vtuberUpperLoop.svg"
            alt="Upper Loop"
            className=" h-full"
          />
          <img
            src="/images/Community/vivi/vtuberUpperLoop.svg"
            alt="Upper Loop"
            className=" h-full"
          />
        </div>

        {/* Decals and Vivi Gif Container */}
        <div className="absolute inset-0 flex justify-center items-center">
          {/* Decals */}
          <img
            src="/images/Community/vivi/vtuberDecals.svg"
            alt="Decals"
            className="object-contain h-full"
          />
          <img
            src="/images/Community/vivi/greyCircle.svg"
            alt="Decals"
            className="absolute left-1/2 -translate-y-1.5 -translate-x-1/2 rounded-full object-contain h-full"
          />

          {/* Vivi Gif */}
          <img
            src="/images/Community/vivi/VIVIgif.gif"
            alt="Vivi"
            className="absolute top-1/2 left-1/2 -translate-y-[63%]  xxs:-translate-y-[60%] xs:-translate-y-[59%]  sm:-translate-y-[58%] md:-translate-y-[57%] -translate-x-1/2 rounded-full w-[22%]"
          />
          <img
            src="/images/Community/vivi/liveOverlay.svg"
            alt="Decals"
            className="absolute left-1/2 -translate-y-1.5 -translate-x-1/2 rounded-full object-contain h-full"
          />
        </div>
      </a>
    </div>
  );
};

export default ViviBanner;
