import { theme } from "../utils/constants";

interface IconButtonProps {
  option?: number;
  isActive?: boolean;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  width?: number;
  height?: number;
  isDisabled?: boolean;
}

const IconButton = ({
  option,
  icon: Icon,
  isActive,
  width,
  height,
  isDisabled,
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`relative ${
        isActive ? "bg-gray-100" : "bg-transparent"
      } rounded-lg p-2.5 hover:bg-red-50 focus:outline-none border-solid border border-transparent active:border-red-200 select-none`}
      {...props}
    >
      <Icon
        width={width || 18}
        height={height || 18}
        fill={isActive ? theme.ACTIVE_BLUE_FG : theme.NEUTRAL_GRAY_FG}
      />
      <span className="absolute bottom-1 right-1 text-zinc-400 text-xxs select-none">
        {option}
      </span>
    </button>
  );
};

export default IconButton;
