import { useState } from 'react';

const ModalWindow = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* SVG icon to open the modal */}
      <svg
        onClick={toggleModal}
        className="w-4 h-4 text-blue-500 hover:text-blue-600 cursor-pointer"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Open commitDraw information modal"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
      </svg>

      {/* Modal Overlay and Content */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg shadow-lg max-w-md w-full m-4 p-6 relative" style={{ backgroundColor: '#151B23' }}>
            {/* Close Button (Top-Right) */}
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-300 hover:text-gray-100"
            >
              ×
            </button>
            {/* Modal Content */}
            <h2 className="text-xl font-bold mb-4 text-white">About commitDraw</h2>
            <p className="text-gray-300 mb-4">
              CommitDraw is a service that lets you create custom designs on your GitHub commit chart. Draw on an exact replica of the GitHub commit chart, choose your target repository, and select an email linked to your GitHub account for commit authorship.
            </p>
            <p className="text-gray-300 mb-4">
              After drawing, click the "Commit" button to generate commits in your chosen repository. The process takes 10-20 seconds. A pull request will be created in the target repository, and once merged, your drawn design will appear on your GitHub contribution graph.
            </p>
            <p className="text-yellow-400 font-semibold">
              Warning: The target repository must have at least one commit. If creating a new repository, recommended to tick the "Add a README file" option to ensure this requirement is met.
            </p>
            {/* Centered Close Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalWindow;
