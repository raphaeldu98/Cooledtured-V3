import {useEffect} from 'react';
import {useSignal} from '@preact/signals-react';
import bannerData from '../data/handBanner.json'; // Adjust the import path as necessary
import {Link} from '@remix-run/react';

const HandBanner = () => {
  const rotation = useSignal(0);
  const direction = useSignal(1);

  useEffect(() => {
    const rotateHand = () => {
      rotation.value += direction.value * 5; // Rotate by 45 degrees in the current direction
      if (Math.abs(rotation.value) === 5) {
        direction.value = direction.value * -1; // Change direction
      }
    };

    const intervalId = setInterval(rotateHand, 1500); // Adjust the duration as necessary

    return () => clearInterval(intervalId);
  }, [direction]);

  const handleClick = () => {
    window.open('https://discord.gg/Pd2wgZaWac', '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full object-contain flex justify-center items-center overflow-hidden bg-blue-950 rounded-2xl aspect-[2.2/1] border-8 border-indigo-400 hover:border-amber-500 hover:scale-[101%] active:scale-[99%] transition-all duration-100 ease-out"
    >
      {bannerData.handBanner[0].ImageLayers.map((layer) => (
        <img
          key={layer.id}
          src={layer.url}
          alt=""
          className={`absolute object-contain  ${
            layer.id === 3
              ? 'animate-rotateHand origin-bottom-right transition-transform duration-[2000ms] ease-linear translate-x-80 translate-y-12'
              : layer.id === 2
              ? 'opacity-50'
              : ''
          }`}
          style={{
            transform: layer.id === 3 ? `rotate(${rotation.value}deg)` : 'none',

            ...layer.style,
          }}
        />
      ))}
    </div>
  );
};

export default HandBanner;
