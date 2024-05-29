interface IconButtonProps {
  option?: number;
  isActive?: boolean;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  width?: number;
  height?: number;
  isDisabled?: boolean;
  color?: string;
}

const IconButton = ({
  option,
  icon: Icon,
  isActive,
  width,
  height,
  isDisabled,
  color,
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`relative ${
        isActive ? "bg-blue-100 dark:bg-neutral-800" : "bg-transparent"
      } rounded-lg p-2.5 hover:bg-blue-200 hover:text-blue-300 dark:hover:bg-neutral-700 focus:outline-none border-solid border border-transparent active:bg-blue-100 select-none ${
        isDisabled && "!cursor-not-allowed"
      }`}
      {...props}
    >
      <Icon
        width={width ?? 21}
        height={height ?? 21}
        className={`fill-current ${
          isActive ? "text-blue-400" : "text-gray-600"
        } dark:text-neutral-500`}
        style={!isActive && color ? { color } : undefined}
      />
    </button>
  );
};

export default IconButton;
