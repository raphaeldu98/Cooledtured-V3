import {Link} from '@remix-run/react';
import {SocialIcon} from 'react-social-icons';
import CollaborationButton from '~/components/CollaborationButton';
import DiscordBanner from '~/components/DiscordBanner';
import ViviBanner from '~/components/ViviBanner';
import ChildBanner from '~/components/childBanner';
import HandBanner from '~/components/handBanner';

export default function Community() {
  return (
    <div className=" bg-[#19224c]">
      <div className="flex flex-col items-center max-w-[120rem] mx-auto">
        <div className="relative w-full border-8 border-blue-950 rounded-3xl items-center justify-center flex">
          <ViviBanner />
        </div>
        <div className="text-center p-4">
          <h1 className="text-4xl xxs:text-5xl xs:text-6xl font-medium mt-10 mb-2 text-[#ffffff]">
            Cooledtured COMMUNITY
          </h1>
        </div>
        <div className="w-full mx-4 sm:w-4/5 lg:w-1/2 mb-4">
          <iframe
            src="https://discord.com/widget?id=183353150126817280&theme=dark"
            width="100%"
            height="300"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          ></iframe>
        </div>
        <div className="flex justify-center mb-8 msm:mb-0 flex-wrap items-center">
          <div className="bg-white p-2 rounded-3xl mt-4 sm:mt-10 shadow-xl text-nowrap flex self-start justify-center space-x-2 border-8 border-gray-200">
            <SocialIcon
              url="https://instagram.com/cooledture"
              className="hover:scale-110 active:scale-95 transition-transform duration-150"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              url="https://facebook.com/cooledtured"
              className="hover:scale-110 active:scale-95 transition-transform duration-150"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              url="https://www.youtube.com/@cooledtured"
              className="hover:scale-110 active:scale-95 transition-transform duration-150"
              target="_blank"
              rel="noopener noreferrer"
            />
            <SocialIcon
              url="https://tiktok.com/@cooledtured/"
              className="hover:scale-110 active:scale-95 transition-transform duration-150"
              target="_blank"
              rel="noopener noreferrer"
            />
            {/* <SocialIcon url="https://twitter.com/cooledtured" className="hover:scale-110 active:scale-95 transition-transform duration-150" /> */}
            <SocialIcon
              url="https://discord.gg/Pd2wgZaWac"
              className="hover:scale-110 active:scale-95 transition-transform duration-150"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
          <div className="xs:-ml-16 xs:-mr-8 w-1/2">
            <img
              src="/images/Community/lazyPanda.svg"
              alt="Panda"
              className="h-full max-h-72 mb-8 xs:-mt-4 xs:mb-4 xs:ml-10"
            />
          </div>
        </div>
        <div className="w-full lg:w-4/5 -mt-10 mb-4">
          <ChildBanner />
        </div>
        <div className="flex justify-center gap-8 xl:gap-16 items-center flex-col-reverse lg:flex-row p-2">
          <div className="">
            <div className=" text-[#c8ac0c] italic font-black font-Montserrat text-6xl sm:text-8xl lg:text-8xl text-left leading-tight tracking-tight">
              <h4>
                LEVEL UP
                <br />
                YOUR
                <br />
                FANDOM
              </h4>
            </div>
            <div className="text-[#c8ac0c] pb-6 font-Montserrat">
              <p>It&apos;s not just anime, it&apos;s a lifestyle</p>
            </div>
            <a
              href="https://discord.gg/Pd2wgZaWac"
              className="bg-yellow-500 hover:bg-yellow-200 font-Montserrat text-white font-bold py-3 px-4 mt-4 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              START HERE
            </a>
          </div>
          <img
            src="/images/Community/CommunitySvg.svg"
            alt="Community"
            className="w-full max-w-[35rem] lg:max-w-[28rem] xl:max-w-[35rem]"
          />
        </div>
        <div className=" flex items-center justify-center w-full">
          <DiscordBanner />
        </div>
        <div className="w-full sm:max-w-[4/5] mx-auto my-4 xl:max-w-[80rem] flex">
          <HandBanner />
        </div>

        <div className="w-full my-10">
          <Link
            to={`/pages/collaboration`}
            prefetch="intent"
            className="w-max h-max cursor-pointer"
          >
            <img
              src="/images/Community/collaborating.svg"
              alt="Collaborating Us"
              className="w-full h-auto"
            />
          </Link>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="w-1/2 place-self-end">
              <img
                src="/images/Community/panda2.png"
                alt="Description"
                className="w-full rounded-lg"
              />
            </div>

            <div className="text-white w-full md:w-1/2 px-5 py-10">
              <h1 className="text-3xl xxs:text-4xl xs:text-5xl mb-4">
                Are you a Social Media Influencer?
              </h1>
              <p className="mb-8">We work with people of these talents:</p>
              <ul className="list-disc pl-2 mb-6">
                <li>Cosplayers</li>
                <li>Voice Actors</li>
                <li>Streamers</li>
                <li>Content Creators</li>
                <li>and more!</li>
              </ul>
              <CollaborationButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
