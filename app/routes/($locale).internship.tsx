import React, {useRef, useEffect} from 'react';
import {useSignal} from '@preact/signals-react';
import History from '../components/Internship/Internship.history';
import Apply from '~/components/Internship/Internship.apply';

// const ImagePrefetcher: React.FC<{imageUrls: string[]}> = ({imageUrls}) => {
//   useEffect(() => {
//     imageUrls.forEach((url) => {
//       if (url) {
//         const img = new Image();
//         img.src = url;
//       }
//     });
//   }, [imageUrls]);

//   return null; // This component does not render anything
// };

// Type definition for props of headers
type HeaderProps = {
  title: string;
};

// Custom header for the about us page w/ customizable title and subtitle
const Header: React.FC<HeaderProps> = ({title}) => {
  return (
    <div className=" bg-slate-900 w-full relative grid grid-cols-1 md:grid-cols-2 place-items-center">
      <div className="flex justify-center items-center mt-4 md:mt-8 md:mb-4 z-10">
        <h1 className="text-slate-50 ml-4 mt-4 md:mt-0 text-5xl md:text-4xl mmd:text-5xl lg:text-6xl font-bold mb-2 relative">
          {title}
        </h1>
      </div>
      <div>
        <img
          src="/images/InternshipSite/PandaHands.svg"
          loading="lazy"
          className=" object-contain max-h-[20rem] md:max-h-[32rem]"
          alt="Panda Hands"
        />
      </div>
      <img
        src="/images/InternshipSite/yellow-wedge.svg"
        loading="lazy"
        className="absolute right-0 object-cover max-h-full"
        alt="Panda Hands"
      />
    </div>
  );
};

// Type definition for props of Tabs
type TabProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

// Selectable buttons for specific labels on the tabs for switching to its content
const Tab: React.FC<TabProps> = ({label, isActive, onClick}) => {
  const activeClasses = 'text-blue-600 border-b-2 border-blue-600'; // Selected tab
  const inactiveClasses = 'text-gray-500 hover:text-gray-700'; // Unselected tabs

  return (
    // Customized button depending on the label
    <button
      className={`py-2 font-semibold ${
        isActive ? activeClasses : inactiveClasses
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// Type definition for the props of Accordion Item Component
type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
};

const AccordionItem: React.FC<AccordionItemProps> = ({title, children}) => {
  const isOpen = useSignal(false); // UseSignal to check if an accordion is open
  const contentRef = useRef<HTMLDivElement>(null);
  const transitionClasses = 'transition-all ease duration-750 overflow-hidden';

  // Checks if accordion is up or not
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen.value) {
        contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
      } else {
        contentRef.current.style.maxHeight = '0';
      }
    }
  }, [isOpen.value]);

  // Arrow rotation classes
  const arrowClasses = isOpen.value
    ? 'transform rotate-90'
    : 'transform rotate-0';

  return (
    <div className="bg-[#ECEEF6] mb-4 rounded-xl border-[#99A5DB] border">
      <button
        className="w-full flex items-center px-4 py-2 text-black font-semibold"
        onClick={() => (isOpen.value = !isOpen.value)}
      >
        <span className={`inline-block ${arrowClasses} mr-4`}>➤</span>
        <span>{title}</span>
      </button>
      <div ref={contentRef} className={`${transitionClasses} max-h-0`}>
        <div className="px-4 py-2 text-gray-500">{children}</div>
      </div>
    </div>
  );
};

// Accordion Component
const Accordion: React.FC = () => {
  return (
    <div className="flex flex-col max-w-[50rem] mx-auto gap-4 my-4">
      <AccordionItem title="What's CTRL+Xperience?">
        <p className="text-center mb-4 text-gray-600">
          Think of it as your personal cheat code to unlocking your potential.
          This internship program isn't just about fetching coffee. It's about
          rolling up your sleeves, tapping into your creative superpowers, and
          learning from a team of pop culture pros who live and breathe fandom.
        </p>
      </AccordionItem>
      <AccordionItem title="Who are we looking for?">
        <p className="mb-4 max-w-[80ch] text-center mx-auto  font-bold text-gray-800">
          You, yes, you! The one with the twinkle of mischief in your eye and
          the brain that churns out ideas faster than a sonic speed boost. We're
          seeking students who:
        </p>
        <ul className="list-disc ml-5 text-left">
          <li>
            Speak the language of fandom fluently: Whether it's anime
            catchphrases, video game lore, or comic book deep cuts, you get the
            references and can geek out with the best of us.
          </li>
          <li>
            {`Think outside the Batcave: Creativity is your kryptonite (in a good way!). We want minds that bend, twist, and turn conventional thinking into mind-blowing innovation.`}
          </li>
          <li>
            Aren't afraid to roll up their sleeves: From brainstorming like
            Avengers Assemble to tackling tasks like Captain America facing
            Hydra, we embrace a hands-on, get-things-done attitude.
          </li>
          <li>
            Bring the hype, leave the drama: We work hard, play hard, and
            celebrate every win with the enthusiasm of a thousand fan
            conventions combined. But negativity? Not invited to this party.
          </li>
        </ul>
      </AccordionItem>
      <AccordionItem title="Why CTRL+xperience?">
        <p className="mb-4 text-center font-bold text-gray-800">
          This isn't just an internship, it's a launchpad:
        </p>
        <ul className="list-disc ml-5 text-left">
          <li>
            Gain real-world experience: From marketing campaigns to website
            development, you'll tackle projects that make a difference, not just
            fill a filing cabinet.
          </li>
          <li>
            Level up your skillset: Master new tools, hone your existing
            talents, and become a digital Swiss Army knife of awesomeness.
          </li>
          <li>{`Network with industry rockstars: Rub shoulders (figuratively, of course) with the movers nad shakers of the pop culture world and build connections that could land you your dream job.`}</li>
          <li>{`Fuel your fandom passion: Immerse yourself in a company that celebrates your inner fangirl (or fanboy)! We speak your language, we understand your obsessions, and we encourage you to embrace them.`}</li>
        </ul>
        <p className="mt-5">
          So, if you're ready to ditch the ordinary and level up your future,
          hit that "Apply" button now like it's the last Super Mushroom before
          Bowser! Let's embark on this epic quest together and see what amazing
          things we can create.
        </p>
        <br />
        <p>CTRL+xperience: It's not just an internship, it's an adventure</p>
      </AccordionItem>
    </div>
  );
};

const Home = () => {
  return (
    <div className="container mx-auto py-12">
      <h2 className="text-center text-4xl font-bold text-blue-950 mr-4 mb-4">
        Ready to CTRL+xperience Your Future?
      </h2>
      <div className="text-center md:text-sm mt-4">
        <div className="font-semibold">
          <div className="max-w-[100ch] mx-auto">
            <p className="text-blue-600 my-4">
              Calling all independent spirits with a pop culture pulse and a
              passion for thinking outside the box!
            </p>
            <p>
              Cooledtured, your gateway to fandom's epic loot, is on the hunt
              for intrepid interns to join our CTRL+xperience program.
            </p>
            <p>
              This isn't your average internship - it's a launchpad for your
              future, a chance to level up your skills and unleash your inner
              maverick alongside our passionate team.
            </p>
          </div>
          <div className="my-8">
            <Accordion />
          </div>
          <p className="text-blue-600 mb-8">
            Ready to launch your career to the next level?{' '}
            <a
              href="https://app.joinhandshake.com/stu/employers/908556"
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply now and join our dynamic team
            </a>
          </p>
          <a
            href="https://app.joinhandshake.com/stu/employers/908556"
            target="_blank"
            rel="noopener noreferrer"
            className=""
          >
            <button className="bg-blue-950 w-48 h-10 text-white font-semibold text-xl rounded-md shadow-xl hover:bg-blue-700">
              Apply
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

// Depending on the specific label tab, it will display its title and content
const Content = (label: string) => {
  switch (label) {
    case 'Home':
      return <Home />;
    case 'History':
      return <History />;
    case 'Apply':
      return <Apply />;
  }
};

export default function Internship() {
  const activeTab = useSignal('Home'); // Signal value for the initial tab

  const Tabs = ['Home', 'History', 'Apply']; // Array of tabs to navigate

  return (
    <div>
      <Header title="CTRL+xperience" />
      <div className="mx-auto sm:w-9/12 md:w-8/12 lg:w-1/2 grid grid-flow-col gap-5">
        {Tabs.map((label) => (
          <Tab
            key={label}
            label={label}
            isActive={activeTab.value === label}
            onClick={() => (activeTab.value = label)}
          />
        ))}
      </div>
      {/* Content */}
      <div className={`mx-auto w-10/12`}>{Content(activeTab.value)}</div>
    </div>
  );
}
