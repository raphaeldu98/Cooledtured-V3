type TagOverlayProps = {
  tags: string[];
};

const TagOverlay: React.FC<TagOverlayProps> = ({tags}) => {
  // Map of tag labels to image paths
  const tagImages: Record<string, string> = {
    exclusive: '/images/tags/exclusive.png',
    'pre-order': '/images/tags/pre_order.png',
    'sold out': '/images/tags/soldout.png',
    sale: '/images/tags/sale.png',
    'in stock': '/images/tags/in_stock.png',
  };

  return (
    <div className="absolute bottom-0 left-0 p-2 grid grid-cols-2 gap-1">
      {tags
        .filter((tag) => Object.keys(tagImages).includes(tag.toLowerCase()))
        .map((tag, index) => (
          <img
            key={index}
            src={tagImages[tag.toLowerCase()]}
            alt={tag}
            className="w-20 h-auto" // Adjust width and height as necessary
          />
        ))}
    </div>
  );
};

export default TagOverlay;
