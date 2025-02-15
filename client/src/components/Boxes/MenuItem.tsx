import { useControlBarContext } from "../../hooks/useControlBarContext";
import { useKeybindContext } from "../../hooks/useKeybindContext";

type MenuItemPosition = "first" | "last";
type MenuItemValue =
  | "paint"
  | "erase"
  | "fill"
  | "picker"
  | "menu"
  | "reset"
  | "resize"
  | "clear"
  | "upload"
  | "save"
  | "publish"
  | "darkLightToggle"
  | "keybinds";

interface MenuItemProps {
  label: string;
  value: MenuItemValue;
  keybind?: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isActive?: boolean;
  position?: MenuItemPosition;
  isDisabled?: boolean;
}

const MenuItem = ({
  label,
  value,
  keybind,
  icon: Icon,
  isActive,
  position,
  isDisabled,
  ...props
}: MenuItemProps) => {
  const { setIsKeybindModalOpen } = useControlBarContext();
  const { setKeybindModalId } = useKeybindContext();

  const openKeybindModal = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setKeybindModalId(value);
    setIsKeybindModalOpen(true);
  };

  return (
    <li
      className={`px-4 py-2 w-full rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 active:bg-blue-100 dark:active:bg-blue-900 flex flex-row gap-4 items-center cursor-pointer select-none ${
        isActive ? "bg-blue-100 dark:bg-blue-900" : "bg-transparent"
      } ${
        isActive
          ? "text-blue-400 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400"
      } whitespace-nowrap ${isDisabled && "!cursor-not-allowed"}`}
      {...props}
    >
      <span>
        <Icon width={18} height={18} className={`fill-current`} />
      </span>
      <span className="text-lg">{label}</span>
      {keybind && (
        <span className="w-full text-end">
          <span
            onClick={openKeybindModal}
            className="italic inline-block px-2 py-1 border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-300 text-xs rounded hover:bg-gray-200 dark:hover:bg-neutral-900 active:bg-gray-300 dark:active:bg-neutral-600"
          >
            {keybind}
          </span>
        </span>
      )}
    </li>
  );
};

export default MenuItem;
