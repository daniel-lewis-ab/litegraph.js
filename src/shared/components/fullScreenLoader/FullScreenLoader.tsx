const FullScreenLoader = () => {
  return (
    <div className="bg-black fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-opacity-50">
      <div className="border-white h-32 w-32 animate-spin rounded-full border-b-4 border-t-4"></div>
    </div>
  );
};

export default FullScreenLoader;
