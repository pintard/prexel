interface IconButtonProps {
  option?: number;
  isActive?: boolean;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

const neutralFg: string = "#8d8d8d";
const activeFg: string = "#7d87e2";

const IconButton = ({
  option,
  icon: Icon,
  isActive,
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`relative ${
        isActive ? "bg-gray-100" : "bg-transparent"
      } rounded-lg p-2.5 hover:bg-red-50 focus:outline-none border-solid border border-transparent active:border-red-200 select-none`}
      {...props}
    >
      <Icon width={18} height={18} fill={isActive ? activeFg : neutralFg} />
      <span className="absolute bottom-1 right-1 text-zinc-400 text-xxs">
        {option}
      </span>
    </button>
  );
};

export default IconButton;
