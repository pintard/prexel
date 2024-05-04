import { useControlBarContext } from "../../hooks/useControlBarContext";

const PublishModal = () => {
  const { isPublishModalOpen, setIsPublishModalOpen } = useControlBarContext();

  if (isPublishModalOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30">
        <div className="bg-white rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Publish this prexel?</h2>

          <span className="mb-4">
            <p>Title</p>
            <input
              type="text"
              autoFocus={true}
              value={""}
              className="bg-white border-solid border-2 rounded-md p-2 w-full mb-2 outline-2 focus:outline-blue-400"
            />
            <p>Social</p>
            <input
              type="text"
              autoFocus={true}
              value={""}
              className="bg-white border-solid border-2 rounded-md p-2 w-full mb-2 outline-2 focus:outline-blue-400"
            />
          </span>

          <span>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4 outline outline-2 focus:outline-blue-400">
              Publish
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 outline outline-2 focus:outline-blue-400"
              onClick={() => setIsPublishModalOpen(false)}
            >
              Cancel
            </button>
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default PublishModal;
