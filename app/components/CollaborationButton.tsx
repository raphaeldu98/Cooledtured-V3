const CollaborationButton = () => {
  const handleButtonClick = () => {
    window.open(
      'https://api.collabs.shopify.com/creator/signup/community_application/ipKr20bBBkI?origin=THEME_EXTENSION',
    ),
      '_blank'; // Redirects to the collab page
  };

  return (
    <div className="">
      <button
        className="bg-yellow-500 hover:bg-yellow-200 text-white font-bold py-3 px-4 rounded font-Montserrat"
        onClick={handleButtonClick}
      >
        COLLABORATE!
      </button>
    </div>
  );
};

export default CollaborationButton;
