import {useEffect} from 'react';

function TrustedSiteEmbed() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'https://cdn.ywxi.net/js/1.js';
      script.async = true;
      script.type = 'text/javascript';

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <a
      href="https://www.trustedsite.com/verify?js=1&host=cooledtured.com&lang=EN"
      target="_blank"
      rel="noopener noreferrer"
      className="h-max w-max cursor-pointer"
    >
      <img
        src="/images/trusted.webp"
        loading="lazy"
        alt="Certified Trusted Site"
        className="w-32"
      />
    </a>
  );
}

export default TrustedSiteEmbed;
