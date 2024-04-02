import React, {useEffect} from 'react';
import {useSignal} from '@preact/signals-react';
import ContactForm from '~/components/ContactForm';
import {
  FaFacebookF,
  FaTwitter,
  FaTwitch,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaYoutube,
  FaEnvelope,
} from 'react-icons/fa';

const teamMembers = [
  // Add team members here
  {
    username: 'Jason',
    position: 'Director of Operation',
    imageUrl: '/images/AboutPage/MeetOurTeam/Jason.webp',
    description: `Jason isn't just the glue that holds cooledtured together, he's the whole toolbox. Problem solver, tech wizard, and champion of smooth sailing.`,
    socials: {
      instagram: 'https://www.instagram.com/oneprspective/',
      twitch: 'https://www.twitch.tv/oneperspective',
      facebook: 'https://www.facebook.com/oneprspective/',
      linkedin: 'https://www.linkedin.com/in/mark-villamayor-00aa9861/',
    },
  },
  {
    username: 'Chris',
    position: 'Financial Director',
    imageUrl: '/images/AboutPage/MeetOurTeam/Chris.webp',
    description: `Chris, our Financial Director, keeps the "cool" in cooledtured, navigating budgets with ninja-like precision. Numbers sing to him, and spreadsheets are his canvas. No comma goes astray under his watch!`,
    socials: {
      instagram: 'https://www.instagram.com/2pak1n/',
      // linkedin: 'https://www.linkedin.com/in/catreides/',
      email: 'mailto:info@cooledtured.com',
    },
  },
  {
    username: 'Chloe',
    position: 'Managing Director',
    imageUrl: '/images/AboutPage/MeetOurTeam/Chloe.webp',
    description: `Chloe, cooledtured's Managing Director, wields creativity like a brush, painting vibrant company culture with purpose and passion. Watch her transform ideas into reality, one cool initiative at a time.`,
    socials: {
      instagram: 'https://www.instagram.com/lhadychloe/',
      twitch: 'https://www.twitch.tv/lhadychloe',
      facebook: 'https://www.facebook.com/lhadychIoe/',
      linkedin: 'https://www.linkedin.com/in/lhadychloe/',
    },
  },
  {
    username: 'Yu',
    position: 'Director of Public Relations',
    imageUrl: '/images/AboutPage/MeetOurTeam/Yu.webp',
    description: `Yu, the maestro of cool, orchestrates cooledtured's story. With a PR magic wand, she makes waves, sparking buzz and building bridges. Catch her on the pulse of culture, always ahead of the curve.`,
    socials: {
      linkedin: 'https://www.linkedin.com/in/yu-yang-48388a248/',
    },
  },
  {
    username: 'Law',
    position: 'E-Commerce Lead',
    imageUrl: '/images/AboutPage/MeetOurTeam/Law.webp',
    description:
      'King of the geek kingdom, wrangling robots, anime tears, and epic sales!',
    socials: {
      linkedin: 'https://www.linkedin.com/in/lawaltez/',
    },
  },
  {
    username: 'Jordy',
    position: 'Social Media Lead',
    imageUrl: '/images/AboutPage/MeetOurTeam/Jordy.webp',
    description: `Meme whisperer, GIF guru, hashtag hero - spins cooltured's story like a pro!`,
    socials: {
      linkedin: 'https://www.linkedin.com/in/jordan-w-abab292b4/',
    },
  },
]; // Array of team member information

const locations = [
  {
    location: 'Los Angeles, California',
    // position: 'Suburbs of Burbank',
    imageUrl: '/images/AboutPage/OurHqs/LA.webp',
    subtitle: 'Where cooledtured Ignited',
    description: `Nestled amidst the magic of Hollywood, Cooledtured sprouted from a love for all things geek.`,
    mapUrl:
      'https://www.google.com/maps/place/cooledtured/@34.1941486,-118.3430343,17z/data=!4m10!1m2!2m1!1scooledtured,+2309+N+Naomi+St+B,+Burbank,+CA+91504!3m6!1s0x80c29546923d0af1:0xab69d0bbe68c42c!8m2!3d34.1941442!4d-118.3404647!15sCjFjb29sZWR0dXJlZCwgMjMwOSBOIE5hb21pIFN0IEIsIEJ1cmJhbmssIENBIDkxNTA0kgEJdG95X3N0b3Jl4AEA!16s%2Fg%2F11v5_5wshg?entry=ttu',
  },
  {
    location: 'Chicago, Illinois',
    // position: 'Suburbs of Bensenville',
    imageUrl: '/images/AboutPage/OurHqs/Chicago.webp',
    subtitle: 'From West Coast Dreams to Midwest Haven',
    description: `Out from Los Angeles's spotlight, cooledtured blossomed in Chicago, Illinois`,
    mapUrl:
      'https://www.google.com/maps/place/460+W+Irving+Park+Rd,+Bensenville,+IL+60106/@41.9605625,-87.948659,17z/data=!3m1!4b1!4m5!3m4!1s0x880fb3ecd49e972d:0x7d3d44ae62ea74ed!8m2!3d41.9605585!4d-87.9460787?entry=ttu',
  },
]; // Array of locations of HQ's

const ourStoryImageUrls = [
  '/images/AboutPage/OurStory/Story01.webp',
  '/images/AboutPage/OurStory/Story02.webp',
  '/images/AboutPage/OurStory/Story03.webp',
  // Image URLs used in "Our Story" here
];
const ImagePrefetcher: React.FC<{imageUrls: string[]}> = ({imageUrls}) => {
  useEffect(() => {
    imageUrls.forEach((url) => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [imageUrls]);

  return null; // This component does not render anything
};

// Type definition for props of headers
type HeaderProps = {
  title: string;
  subtitle: string;
};

// Custom header for the about us page w/ customizable title and subtitle
const Header: React.FC<HeaderProps> = ({title, subtitle}) => {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-500 text-white p-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-2">{title}</h2>
        <h2 className="text-4xl font-bold">{subtitle}</h2>
      </div>
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

// Type definition for props of the Content Template
type ContentTemplateProps = {
  title: string;
  content: React.ReactNode;
};

// Customized content for each label's content
const ContentTemplate: React.FC<ContentTemplateProps> = ({title, content}) => {
  return (
    <div className="container mx-auto py-12 max-w-[90ch]">
      <h2 className="text-center text-4xl font-bold text-blue-900 float-left mr-4">
        {title}
      </h2>
      <div className="text-base md:text-sm font-sans">{content}</div>
    </div>
  );
};

const OurStory = () => (
  <ContentTemplate
    title="OUR STORY"
    content={
      <div>
        <p>
          Nestled in the heart of Burbank, California, two kindred spirits
          sparked a revolution. Not with fire and pitchforks, but with action
          figures, and an unyielding love for anime, video games, and all things
          geek chic. These weren't your average mallrats; they were otaku
          heroes, destined to weave a pop culture tapestry unlike any other.
        </p>
        <br />
        <img
          src="/images/AboutPage/OurStory/Story01.webp"
          loading="lazy"
          alt="First Image"
        />
        <br />
        <p>
          One was a seasoned gamer, fingers dancing across controllers, his mind
          a labyrinth of quests and epic loot. The other, a manga maestro, eyes
          devouring panels, heart aflame with tales of courage and friendship.
          Two halves of a pop culture whole, united by a common dream: to share
          their passion, curate a haven for fellow enthusiasts, and build a
          fortress of fandom unlike any seen before.
        </p>
        <br />
        <p>
          Thus, in the humble confines of a Burbank basement, Cooledtured was
          born. It wasn't just a store; it was a portal, a gateway to a universe
          where imaginations soared on dragon wings, where heroes wielded
          pixelated blades, and where every bookshelf whispered untold stories.
          With each limited edition figure, each vintage comic, each
          meticulously chosen Funko Pop, they built a monument to obsession, a
          shrine to joy.
        </p>
        <br />
        <p>
          Cooledtured wasn't just about collecting, it was about connection.
          Fans flocked from near and far, drawn by the infectious camaraderie,
          the knowledgeable staff (themselves hardcore collectors, fluent in the
          language of loot and lore), and the sheer, unadulterated passion that
          crackled in the air. It was a haven where cosplay wasn't a costume,
          but a badge of honor, where debates raged over the fate of fictional
          realms, and where high fives erupted over finding the Holy Grail of
          figures.
        </p>
        <br />
        <p>
          But the story doesn't end in Burbank. Driven by the shared heartbeat
          of their community, Cooledtured set its sights on Bensenville,
          Illinois, spreading the pop culture gospel across the country. Today,
          it stands not just as a warehouse, but as a thriving ecosystem, a
          testament to the power of shared passion.
        </p>
        <br />
        <img
          src="/images/AboutPage/OurStory/Story04.svg"
          loading="lazy"
          alt="Story image 2"
        />
        <br />
        <p>
          Cooledtured is more than just a name; it's a promise. A promise to
          fuel imaginations, to forge friendships, and to keep the spirit of
          geekdom alive and kicking. It's a reminder that in the basement of
          every heart, a pop culture hero lurks, waiting to be unleashed. So,
          come join the adventure, fellow fan. Walk through the portal, grab
          your controller, and let Cooledtured guide you to a world where dreams
          are currency and shelves are your throne.
        </p>
        <br />
        <p>This is Cooledtured. This is our story.</p>
      </div>
    }
  />
);

const History = () => (
  <ContentTemplate
    title="HISTORY"
    content={
      <div>
        <p>
          Once upon a time in Burbank, California two otaku nerds who shared a
          love for anime, video games, and pop culture decided to open a store
          where they could share their passion with fellow fans. They created a
          haven for collectors, offering a wide range of limited and exclusive
          items from popular anime, gaming, and pop culture brands. With their
          excitement and dedication, they soon became a go-to destination for
          fans across America.
        </p>
        <br />
        <img
          src="/images/AboutPage/OurStory/Story02.webp"
          loading="lazy"
          alt="History image"
        />
      </div>
    }
  />
);

const Vision = () => (
  <ContentTemplate
    title="VISION"
    content={
      <div>
        <p>
          To be the ultimate destination for collectors and fans of anime,
          gaming, and pop culture, providing a vast selection of high-quality,
          limited and exclusive items. We aim to create an immersive and
          exciting shopping experience that celebrates the joy and passion of
          collecting, and inspires creativity and imagination. Through our
          products and services, we hope to build a thriving community of
          like-minded individuals who share our love for anime, gaming, and pop
          culture.
        </p>
        <br />
        <img
          src="/images/AboutPage/OurStory/Story03.webp"
          loading="lazy"
          alt="Vision Image 1"
        />
      </div>
    }
  />
);

const OurTeam = () => (
  <ContentTemplate
    title="OUR TEAM"
    content={
      <div>
        <p>
          We're a team of passionate and dedicated collectors and enthusiasts of
          anime, gaming, and pop culture. We believe that collecting is not just
          a hobby, but a lifestyle, and we're excited to share our love and
          knowledge with fellow fans like you!
        </p>
        <br />
        <p>
          But that's not all - we've also got a team of skilled and friendly
          support staff who are always ready to assist you with your shopping
          needs. From finding that one figure you've been searching for to
          answering your questions about our products, our team is dedicated to
          providing you with the best customer service experience.
        </p>
      </div>
    }
  />
);

const OurHQ = () => (
  <ContentTemplate
    title="OUR HUB"
    content="We are based in Los Angeles, California at the suburb of Burbank. Opened our second base in Chicago, Illinois at the suburb of Bensenville. We distribute via our partners at USPS and UPS."
  />
);
const ContactUs = () => (
  <ContentTemplate
    title="CONNECT"
    content={
      <div>
        <p>
          We cordially invite you into cooledtured.com, please feel free to
          browse our catalog. If you have any questions or just want to say
          hello, you can always email us directly and we will reply back to you
          as soon as we can.
        </p>
        <br />
        <p className="font-medium">Phone Number: 818-394-0023</p>
        <p className="font-medium">Email: info@cooledtured.com</p>
      </div>
    }
  />
);

// Depending on the specific label tab, it will display its title and content
const Content = (label: string) => {
  switch (label) {
    case 'Our Story':
      return <OurStory />;
    case 'History':
      return <History />;
    case 'Vision':
      return <Vision />;
    case 'Our Team':
      return <OurTeam />;
    case 'Our HQ':
      return <OurHQ />;
    case 'Contact Us':
      return <ContactUs />;
  }
};

// Helper function to format numbers over 1000 to have a "K" such as 1K = 1000
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return Math.round(num / 1000) + 'K';
  } else {
    return num.toString();
  }
};

// Helper function to ease the animation to it's end of duration
const easeOutQuad = (t: number) => t * (2 - t);

// Counter function for the increase of numbers to its end number over a specific duration
const useCounter = (endNum: number, duration: number = 1) => {
  const count = useSignal(0); // Signal intial value for count of number climbing

  // UseEffect to start animation
  useEffect(() => {
    let frame = 0; // Intial value for current frame
    const totalFrames = duration * 60; // Total frames for the animation

    const counter = () => {
      frame++;
      // Calculate progress using an easing function
      const progress = easeOutQuad(frame / totalFrames);
      // Update count based on progress
      count.value = Math.floor(progress * endNum);

      if (frame < totalFrames) {
        requestAnimationFrame(counter);
      } else {
        count.value = endNum; // Ensure the last frame sets the value exactly to endNum
      }
    };

    requestAnimationFrame(counter);

    // Clean up the animation frame
    return () => {
      frame = totalFrames; // This effectively stops the animaion
    };
  }, [endNum]);

  return count;
};

// Type definition for props of stats
type StatProp = {
  number: number;
  text: string;
  shouldAppendPlus?: boolean;
};

// Custom display of the stats for the company
const Stat: React.FC<StatProp> = ({number, text, shouldAppendPlus}) => {
  const count = useCounter(number, 1.75); // Animation with customizable duration of numbers increasing

  return (
    <div className="flex flex-col items-center px-2 mb-4 md:mb-0 md:px-4">
      <span className="text-xl md:text-3xl font-semibold text-blue-950">
        {formatNumber(count.value)}
        {/* Checks if the number should be "10+" once its past the number we set */}
        {shouldAppendPlus && count.value >= number && '+'}
      </span>
      <span className="text-xs md:text-base text-gray-600 text-center">
        {text}
      </span>
    </div>
  );
};

// Interface definition for props of the Social Links
interface SocialLinks {
  facebook?: string;
  twitter?: string;
  twitch?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  email?: string;
}

// Interface definition for props of profile cards
interface ProfileCardProps {
  username: string;
  position: string;
  imageUrl: string;
  description: string;
  socials?: SocialLinks;
}

// Pre-defined socials designs to just pull social icons into the profile card
const SocialIcon: React.FC<{platform: keyof SocialLinks; url: string}> = ({
  platform,
  url,
}) => {
  const icons = {
    facebook: <FaFacebookF className="text-blue-600 text-xl cursor-pointer" />,
    twitter: <FaTwitter className="text-sky-400 text-xl cursor-pointer" />,
    twitch: <FaTwitch className="text-purple-600 text-xl cursor-pointer" />,
    linkedin: <FaLinkedin className="text-blue-500 text-xl cursor-pointer" />,
    instagram: <FaInstagram className="text-pink-600 text-xl cursor-pointer" />,
    tiktok: <FaTiktok className="text-black text-xl cursor-pointer" />,
    youtube: <FaYoutube className="text-red-500 text-xl cursor-pointer" />,
    email: <FaEnvelope className="text-amber-500 text-xl cursor-pointer" />,
  };

  const IconComponent = icons[platform];

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.stopPropagation(); // Prevents the event from bubbling up
  };
  // Return the icon component or null if the platform is not supported
  return url && IconComponent ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="hover:-translate-y-1 transition-transform"
    >
      {IconComponent}
    </a>
  ) : null;
};

// Modal for profile descriptions of team members
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageUrl: string;
  children: React.ReactNode;
}> = ({isOpen, onClose, title, imageUrl, children}) => {
  if (!isOpen) return null;

  // Function to handle the overlay click
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // If the clicked element is not the modal content, close the modal
    if ((event.target as HTMLElement).id === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="modal-overlay"
      onClick={handleOverlayClick} // Call handleOverlayClick when the overlay is clicked
    >
      <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <img
            src={imageUrl}
            loading="lazy"
            alt={`Image of ${title}`}
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />
          {/* Use the modals title */}
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
            {title}
          </h3>
          {/* Description for the user's */}
          <div className="mt-2 px-7 py-3">{children}</div>
          {/* Button to close the description */}
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom profile card for team members name, positions, and their socials
const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  position,
  imageUrl,
  socials = {},
  description,
}) => {
  const isModalOpen = useSignal(false); // Use signal defaulted to be closed by default

  // Determine if the card is clickable based on the presence of a description
  const isClickable = description.trim() !== '';

  const handleImageClick = () => {
    isModalOpen.value = true;
  };

  return (
    <>
      <div className="flex flex-col items-center p-4 w-full">
        <img
          src={imageUrl}
          alt={username}
          loading="lazy"
          className="min-w-[85px] h-auto rounded-2xl mb-4 object-cover cursor-pointer transition-transform duration-200 ease-in-out hover:-translate-y-1"
          onClick={handleImageClick}
        />
        {/* Name of members and their position */}
        <div className="text-center">
          <div className="font-bold text-xl">{username}</div>
          <div className="text-sm">{position}</div>
          {/* Socials display with hover effect */}
          <div className="flex justify-center space-x-2 mt-2">
            {Object.entries(socials).map(([platform, url]) => (
              <SocialIcon
                key={platform}
                platform={platform as keyof SocialLinks}
                url={url}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal function for users profile and their description */}
      {isClickable && (
        <Modal
          isOpen={isModalOpen.value}
          onClose={() => (isModalOpen.value = false)}
          title={username}
          imageUrl={imageUrl}
        >
          <p className="text-sm text-gray-500">{description}</p>
        </Modal>
      )}
    </>
  );
};

// Interface props for location
interface LocationCardProps {
  location: string;
  position?: string;
  description: string;
  subtitle: string;
  imageUrl: string;
  mapUrl: string;
}

// Custom location card for HQ's information
const LocationCard: React.FC<LocationCardProps> = ({
  location,
  position,
  description,
  subtitle,
  imageUrl,
  mapUrl,
}) => {
  const isModalOpen = useSignal(false); // Use signal defaulted to be closed by default
  const handleMapClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.stopPropagation(); // Prevent the modal from opening when the map link is clicked
  };
  return (
    <>
      <div className="flex flex-col items-center p-4 w-full cursor-pointer">
        {/* Image of location */}
        <img
          src={imageUrl}
          alt={location}
          onClick={() => (isModalOpen.value = true)}
          loading="lazy"
          className="min-w-[85px] h-auto rounded-2xl mb-4 object-cover cursor-pointer transition-transform duration-200 ease-in-out hover:-translate-y-1"
        />
        {/* Name of location and their position */}
        <div className="text-center">
          <div className="font-bold text-xl">{location}</div>
          <div className="text-sm">{position}</div>
          {/* Link to location and icon marker */}
          <div className="flex justify-center mt-2">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform duration-200 ease-in-out hover:-translate-y-1"
              onClick={handleMapClick}
            >
              <FaMapMarkerAlt className="text-red-600 text-xl cursor-pointer" />
            </a>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen.value}
        onClose={() => (isModalOpen.value = false)}
        title={location}
        imageUrl={imageUrl}
      >
        <p className="text-xs -mt-4 mb-4 text-gray-400">{subtitle}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </Modal>
    </>
  );
};

interface TeamMember {
  username: string;
  position: string;
  description: string;
  imageUrl: string;
  socials: SocialLinks;
}

// Define the type for the component's props
interface MeetOurTeamProps {
  teamMembers: TeamMember[];
}

const MeetOurTeam: React.FC<MeetOurTeamProps> = ({teamMembers}) => {
  return (
    <div className="w-2/3 mx-auto pt-8 text-center">
      {/* Title */}
      <h2 className="text-4xl text-black-900 font-bold mb-4">Meet Our Team</h2>
      {/* Message about our team */}
      <p className="text-gray-500 text-base mx-auto w-9/12">
        We're more than just a store - we're a community of collectors, gamers,
        and pop culture enthusiasts who share a passion for all things cool.
        Join us on this epic journey and let's have some fun!
      </p>
      {/* Profiles of team members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 justify-items-center mx-auto">
        {teamMembers.map((member, index) => (
          <ProfileCard
            key={index}
            username={member.username}
            position={member.position}
            description={member.description}
            imageUrl={member.imageUrl}
            socials={member.socials}
          />
        ))}
      </div>
    </div>
  );
};

// Define the type for each location
interface Location {
  location: string;
  description: string;
  subtitle: string;
  position?: string;
  imageUrl: string;
  mapUrl: string;
}

// Define the type for the component's props
interface OurHQsProps {
  locations: Location[];
}

const OurHQs: React.FC<OurHQsProps> = ({locations}) => {
  return (
    <div className="w-2/3 mx-auto pt-4 text-center">
      <h2 className="text-4xl text-black-900 font-bold mb-4">Our HQs</h2>
      <p className="text-gray-400 text-xs mx-auto w-9/12">
        Command centers, fueled by ramen and hype trains!
      </p>
      {/* Profile of locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 justify-items-center mx-auto">
        {locations.map((location, index) => (
          <LocationCard
            key={index}
            location={location.location}
            description={location.description}
            subtitle={location.subtitle}
            position={location.position}
            imageUrl={location.imageUrl}
            mapUrl={location.mapUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default function About() {
  const activeTab = useSignal('Our Story'); // Signal value for the initial tab

  // Detect URL fragment and set the active tab
  useEffect(() => {
    if (window.location.hash === '#contact') {
      activeTab.value = 'Contact Us';
    }
    if (window.location.hash === '#OurHQ') {
      activeTab.value = 'Our HQ';
    }
  }, []);

  const Tabs = [
    'Our Story',
    'History',
    'Vision',
    'Our Team',
    'Our HQ',
    'Contact Us',
  ]; // Array of tabs to navigate

  const stats = [
    {number: 30000, text: 'Happy Customers', shouldAppendPlus: true},
    {number: 50, text: 'Countries Served', shouldAppendPlus: true},
    {number: 100, text: 'Collaborations', shouldAppendPlus: true},
  ]; // Stat values for specific company accomplishments

  const allImageUrls = [
    ...teamMembers.map((member) => member.imageUrl),
    ...locations.map((location) => location.imageUrl),
    ...ourStoryImageUrls,
  ];

  return (
    <div>
      <ImagePrefetcher imageUrls={allImageUrls} />
      {/* Header Tab */}
      <Header title="About" subtitle="COOLEDTURED" />
      {/* Tabs and Content Tab */}
      {/* <div className="mx-auto sm:w-9/12 md:w-8/12 lg:w-1/2"> */}
      {/* Tab */}
      <div className="mx-auto mt-4 sm:w-9/12 md:w-8/12 lg:w-1/2 grid grid-flow-col gap-5">
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
      <div
        className={`mx-auto w-3/5 ${
          activeTab.value === 'Contact Us' ? 'max-w-none' : ''
        }`}
      >
        {Content(activeTab.value)}
      </div>

      {activeTab.value === 'Contact Us' && (
        <div className="sm:w-full md:w-10/12 lg:w:3/4 mx-auto">
          <ContactForm />
        </div>
      )}

      {activeTab.value === 'Our Team' && (
        <MeetOurTeam teamMembers={teamMembers} />
      )}

      {activeTab.value === 'Our HQ' && <OurHQs locations={locations} />}
      {/* Stats Tab */}
      <div className="flex flex-wrap justify-center items-center py-8 px-4">
        {stats.map((stat, index) => (
          <Stat
            key={index}
            number={stat.number}
            text={stat.text}
            shouldAppendPlus={stat.shouldAppendPlus}
          />
        ))}
      </div>
    </div>
  );
}
