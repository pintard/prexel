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
        isActive ? "bg-neutral-100 dark:bg-neutral-800" : "bg-transparent"
      } rounded-lg p-2.5 hover:bg-blue-50 dark:hover:bg-neutral-700 focus:outline-none border-solid border border-transparent active:border-blue-200 select-none ${
        isDisabled && "!cursor-not-allowed"
      }`}
      {...props}
    >
      <Icon
        width={width ?? 22}
        height={height ?? 22}
        className={`fill-current ${
          isActive ? "text-active-blue" : "text-neutral-gray"
        } dark:text-neutral-500`}
      />
    </button>
  );
};

export default IconButton;
