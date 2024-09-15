import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { HorizontalDivider } from "../Divider";

const DimensionBox = () => {
  const {
    rows,
    setRows,
    cols,
    setCols,
    isDimensionBoxOpen,
    setIsInputFocused,
  } = useControlBarContext();
  const MAX_ROWS: number = 30;
  const MAX_COLS: number = 60;

  if (isDimensionBoxOpen) {
    return (
      <span className="absolute z-20 w-44 bg-neutral-100 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-600 rounded-lg shadow-dark dark:shadow-light flex flex-col p-4 gap-4 pointer-events-auto top-4 right-4">
        <DimensionInput
          label="cols"
          placeholder="enter desired cols"
          autoFocus={true}
          defaultValue={cols}
          maxValue={MAX_COLS}
          minValue={1}
          updateValue={setCols}
          setIsInputFocused={setIsInputFocused}
        />
        <HorizontalDivider />
        <DimensionInput
          label="rows"
          placeholder="enter desired rows"
          defaultValue={rows}
          maxValue={MAX_ROWS}
          minValue={1}
          updateValue={setRows}
          setIsInputFocused={setIsInputFocused}
        />
      </span>
    );
  }

  return null;
};

interface DimensionInputProps {
  label?: string;
  placeholder: string;
  autoFocus?: boolean;
  defaultValue: number;
  maxValue: number;
  minValue: number;
  updateValue: Dispatch<SetStateAction<number>>;
  setIsInputFocused: Dispatch<SetStateAction<boolean>>;
}

const DimensionInput = ({
  label,
  defaultValue,
  maxValue,
  minValue,
  updateValue,
  setIsInputFocused,
  ...props
}: DimensionInputProps) => {
  const [value, setValue] = useState<string>(defaultValue.toString());
  const ref = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue: number = +e.target.value;

    if (newValue < minValue || newValue > maxValue) {
      return;
    }

    setValue(newValue.toString());
    updateValue(newValue);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (ref.current) {
          ref.current.blur();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-row items-center justify-between text-gray-600 dark:text-neutral-500">
      <label className="uppercase mr-4">{label}</label>
      <input
        ref={ref}
        type="number"
        value={value}
        max={maxValue}
        min={minValue}
        onChange={handleOnChange}
        onFocus={(e: React.FocusEvent<HTMLInputElement, Element>) => {
          setIsInputFocused(true);
          e.target.select();
        }}
        onBlur={() => setIsInputFocused(false)}
        className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md p-2 w-8/12 outline-2 focus:outline-blue-400"
        {...props}
      />
    </div>
  );
};

export default DimensionBox;
