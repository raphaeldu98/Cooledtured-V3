import {
  FaFacebook,
  FaWhatsapp,
  FaSms,
  FaEnvelope,
  FaShareAlt,
} from 'react-icons/fa';
import {FaXTwitter} from 'react-icons/fa6';

const ShareButtons = ({title, currentUrl = window.location.href}: any) => {
  // Prepare encoded URI components
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(currentUrl);

  // Define the share URLs for each platform
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const smsUrl = `sms:?&body=${encodedTitle}%20${encodedUrl}`;

  // Function to handle general sharing (for sharing via text or other means)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: currentUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for desktop browsers
      // Copy URL to clipboard or display a modal with sharing options
      // This example copies the URL to the clipboard
      try {
        await navigator.clipboard.writeText(`${title} ${currentUrl}`);
        alert('Link copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        // Fallback UI or method in case clipboard API fails
      }
    }
  };
  const handleEmailShare = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(
      title,
    )}&body=Check%20out%20this%20link:%20${encodeURIComponent(currentUrl)}`;
    window.open(emailUrl, '_blank');
  };

  return (
    <div className="flex text-3xl gap-6 justify-center mb-4 mmd:-mb-6">
      <a
        href={facebookUrl}
        className="text-blue-600"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebook aria-label="Share on Facebook" />
      </a>
      <a href={smsUrl} className="text-green-600 xs:hidden">
        <FaSms aria-label="Share via SMS" />
      </a>
      <a
        href={whatsappUrl}
        className="text-green-500"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp aria-label="Share on WhatsApp" />
      </a>
      <a
        href={twitterUrl}
        className="text-blue-950"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaXTwitter aria-label="Share on Discord" />
      </a>
      <a
        onClick={handleEmailShare}
        className="text-red-600"
        rel="noopener noreferrer"
      >
        <FaEnvelope aria-label="Share via Email" />
      </a>

      <button
        onClick={handleShare}
        className="xs:hidden text-2xl text-gray-600"
      >
        <FaShareAlt aria-label="Share via text or other means" />
      </button>
    </div>
  );
};

export default ShareButtons;
