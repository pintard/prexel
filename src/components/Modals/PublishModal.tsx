import { useEffect, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { toPng } from "html-to-image";
import useFetch from "../../hooks/useFetch";
import {
  PrexelPostPayload,
  PrexelPostResponse,
} from "../../utils/apiConstants";
import useModalState from "../../hooks/useModalState";

const PublishModal = () => {
  const { isPublishModalOpen, setIsPublishModalOpen, cuteCode } =
    useControlBarContext();

  useModalState(isPublishModalOpen);

  const { sendRequest } = useFetch<PrexelPostResponse, PrexelPostPayload>();

  const [title, setTitle] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isPublishModalOpen) {
      setIsImageLoading(true);
      captureImage();
    } else {
      setImageSrc(null);
    }
  }, [isPublishModalOpen]);

  const captureImage = (): void => {
    const artboard: HTMLElement | null = document.getElementById("artboard");
    if (artboard) {
      applyTransparentBackground();
      toPng(artboard, { cacheBust: true })
        .then((dataUrl: string) => {
          setImageSrc(dataUrl);
          revertBackground();
          setIsImageLoading(false);
        })
        .catch((err) => {
          console.error("Failed to capture screenshot", err);
          setImageSrc(null);
          revertBackground();
          setIsImageLoading(false);
        });
    }
  };

  const applyTransparentBackground = (): void => {
    document.querySelectorAll(".grid-cell.is-even").forEach((cell: Element) => {
      if (cell instanceof HTMLElement) {
        cell.style.background = "transparent";
      }
    });
  };

  const revertBackground = (): void => {
    document.querySelectorAll(".grid-cell.is-even").forEach((cell: Element) => {
      if (cell instanceof HTMLElement) {
        cell.style.background = "";
      }
    });
  };

  const handleTagInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === " ") {
      event.preventDefault();
      const newTag: string = tagInput.trim();
      if (newTag !== "" && tags.length < 6 && !tags.includes(newTag)) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (index: number): void => {
    setTags(tags.filter((_, tagIndex) => tagIndex !== index));
  };

  const renderTags = () => {
    return tags.map((tag: string, index: number) => (
      <div
        key={index}
        className="bg-blue-100 rounded-full px-4 py-1 mr-2 mb-2 flex items-center"
      >
        {tag}
        <button
          onClick={() => handleRemoveTag(index)}
          className="ml-3 text-red-500 hover:text-red-700"
        >
          &times;
        </button>
      </div>
    ));
  };

  const publish = (): void => {
    if (!title || !imageSrc || tags.length === 0) {
      alert("Please ensure title, tags, and the artboard snapshot are set.");
      return;
    }

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const fileName: string = `prexel_1_${Math.floor(
          new Date().getTime() / 1000
        )}.png`;

        const formData = new FormData();
        formData.append("user_id", "1");
        formData.append("code", cuteCode);
        formData.append("title", title);
        formData.append("tags", tags.join(","));
        formData.append("image", blob, fileName);

        sendRequest("/posts", {
          method: "POST",
          body: formData,
        })
          .then(() => {
            closeModal();
          })
          .catch((error) => {
            console.error("Publishing failed: ", error);
          });
      });
  };

  const closeModal = (): void => {
    setImageSrc(null);
    setTitle("");
    setTagInput("");
    setTags([]);
    setIsPublishModalOpen(false);
  };

  if (isPublishModalOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30">
        <div
          className="bg-white rounded-lg p-6 flex flex-col"
          style={{ width: "400px" }}
        >
          <h2 className="text-2xl font-semibold mb-2">Publish this prexel?</h2>

          <div
            className="border-2 border-blue-400 mb-4 flex items-center justify-center rounded-lg overflow-hidden p-3"
            style={{ minHeight: "240px" }}
          >
            {isImageLoading ? (
              <div>Loading...</div>
            ) : (
              imageSrc && (
                <img
                  src={imageSrc}
                  alt="Artboard Snapshot"
                  className="max-w-xs"
                />
              )
            )}
          </div>

          <span className="mb-2">
            <p>Title</p>
            <input
              type="text"
              autoFocus={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border-solid border-2 rounded-md p-2 w-full mb-2 outline-2 focus:outline-blue-400"
            />

            <p>Tags</p>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="bg-white border-solid border-2 rounded-md p-2 w-full mb-2 outline-2 focus:outline-blue-400"
            />
            <div className="flex flex-wrap">{renderTags()}</div>
          </span>

          <span>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4 outline outline-2 focus:outline-blue-400"
              onClick={publish}
            >
              Publish
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 outline outline-2 focus:outline-blue-400"
              onClick={closeModal}
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
