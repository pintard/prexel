import { useEffect, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { toPng } from "html-to-image";
import useFetch from "../../hooks/useFetch";
import {
  PrexelPostPayload,
  PrexelPostResponse,
} from "../../utils/apiConstants";
import useModalState from "../../hooks/useModalState";
import { HorizontalDivider } from "../Divider";

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
      alert("Please ensure you title and tag your prexel before publishing.");
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
          className="bg-white rounded-2xl flex flex-col"
          style={{ width: "400px" }}
        >
          <div className="pt-8 pb-6 px-8">
            <h2 className="text-xl leading-4">Publish this prexel?</h2>
          </div>
          <HorizontalDivider />
          <div className="pt-5 pb-6 px-8">
            <p className="text-gray-500 text-lg mb-5">
              Share your prexel to the public by publishing it to the online
              repository?
            </p>
            <div
              className="border-2 border-blue-200 mb-4 flex items-center justify-center rounded-lg overflow-hidden p-1"
              style={{ minHeight: "220px" }}
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

            <p className="text-gray-500 text-lg">Title</p>
            <input
              type="text"
              placeholder="Title your prexel..."
              autoFocus={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border-solid border-2 rounded-md p-2 w-full mb-2 outline-2 focus:outline-blue-400"
            />

            <p className="text-gray-500 text-lg">Tags</p>

            <div className="mb-5">
              <input
                type="text"
                placeholder="Use space key to enter tags... (max 5)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="bg-white border-solid border-2 rounded-md p-2 w-full mb-3 outline-2 focus:outline-blue-400"
              />
              <div className="flex flex-wrap">{renderTags()}</div>
            </div>

            <button
              className="px-4 py-2 bg-white text-green-600 font-bold rounded-full hover:bg-green-50 mr-3 outline outline-1 focus:bg-green-50"
              onClick={publish}
            >
              Publish
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 outline outline-2 focus:outline-blue-300"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PublishModal;
