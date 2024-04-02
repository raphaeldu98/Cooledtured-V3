import {
  FaFacebook,
  FaInstagram,
  FaDiscord,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';

export default function Social() {
  return (
    <div className="bottom-0 align-middle z-0">
      <ul className="gap-2 grid grid-cols-5">
        <li>
          <a
            href="https://facebook.com/cooledtured"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="hover:scale-110 hover:text-amber-500 text-3xl cursor-pointer" />
          </a>
        </li>
        <li>
          <a
            href="https://instagram.com/cooledture"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:scale-110 hover:text-amber-500 text-3xl cursor-pointer" />
          </a>
        </li>
        <li>
          <a
            href="https://discord.gg/Pd2wgZaWac" //Discord invite set to no expiration. Can be revoked in server's invite settings if needed.
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord className="hover:scale-110 hover:text-amber-500 text-3xl cursor-pointer" />
          </a>
        </li>
        <li>
          <a
            href="https://tiktok.com/@cooledtured/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok className="hover:scale-110 hover:text-amber-500 text-3xl cursor-pointer" />
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/@cooledtured"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="hover:scale-110 hover:text-amber-500 text-3xl cursor-pointer" />
          </a>
        </li>
      </ul>
    </div>
  );
}
