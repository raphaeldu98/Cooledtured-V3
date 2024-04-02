import {useEffect, useState} from 'react';
import bannerData from '../data/childrenBanner.json';

const movementDurationRange = {min: 2000, max: 5000}; // Movement duration range between 2 and 5 seconds
const staticLayerIds: number[] = [1, 2, 3, 4, 5, 10, 11, 13, 14];

interface Position {
  x: number;
  y: number;
}

interface Positions {
  [key: number]: Position;
}

const generateRandomPosition = (boundary = 50): number =>
  Math.random() * boundary * 2 - boundary;

const generateRandomDuration = (): number =>
  Math.floor(
    Math.random() *
      (movementDurationRange.max - movementDurationRange.min + 1) +
      movementDurationRange.min,
  );

const ChildBanner = (): JSX.Element => {
  const [positions, setPositions] = useState<Positions>({});

  useEffect(() => {
    const intervalIds: {[key: number]: ReturnType<typeof setTimeout>} = {};

    const moveLayer = (id: number, duration: number): void => {
      const boundaryX = 200;
      const boundaryY = 200;

      const newX = generateRandomPosition(boundaryX);
      const newY = generateRandomPosition(boundaryY);

      setPositions((prevPositions) => ({
        ...prevPositions,
        [id]: {x: newX, y: newY},
      }));

      intervalIds[id] = setTimeout(
        () => moveLayer(id, generateRandomDuration()),
        duration,
      );
    };

    bannerData.childBanner[0].ImageLayers.forEach((layer) => {
      if (!staticLayerIds.includes(layer.id)) {
        const duration = generateRandomDuration();
        moveLayer(layer.id, duration);
      } else {
        setPositions((prevPositions) => ({
          ...prevPositions,
          [layer.id]: {x: 0, y: 0},
        }));
      }
    });

    return () => {
      Object.values(intervalIds).forEach((id) => clearTimeout(id));
    };
  }, []);

  const handleClick = () => {
    window.open('https://Rocousa.org', '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-full aspect-[2/1] overflow-hidden max-h-[45rem] flex justify-center mb-4 border-8 border-blue-950 rounded-3xl hover:border-amber-500 hover:scale-[101%] active:scale-[99%] transition-all duration-100 ease-out"
    >
      {bannerData.childBanner[0].ImageLayers.map((layer) => (
        <img
          key={layer.id}
          src={layer.url}
          alt={`Layer ${layer.id}`}
          className="absolute object-contain max-h-full"
          style={{
            ...layer.style,
            transform: `translate(${positions[layer.id]?.x ?? 0}px, ${
              positions[layer.id]?.y ?? 0
            }px)`,
            transition: `transform ${movementDurationRange.max}ms linear`,
          }}
        />
      ))}
    </div>
  );
};

export default ChildBanner;
