import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";

interface DimensionBoxProps {
  isActive: boolean;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
}

const DimensionBox = ({ isActive, setIsFocused }: DimensionBoxProps) => {
  const { rows, setRows, cols, setCols } = useControlBarContext();

  if (isActive) {
    return (
      <span className="z-20 w-44 bg-white rounded-lg shadow-cover flex flex-col p-4 gap-4">
        <DimensionInput
          label="cols"
          placeholder="enter desired cols"
          defaultValue={cols}
          maxValue={100}
          minValue={1}
          updateValue={setCols}
          setIsFocused={setIsFocused}
        />
        <DimensionInput
          label="rows"
          placeholder="enter desired rows"
          defaultValue={rows}
          maxValue={30}
          minValue={1}
          updateValue={setRows}
          setIsFocused={setIsFocused}
        />
      </span>
    );
  }

  return null;
};

interface DimensionInputProps {
  label?: string;
  placeholder: string;
  defaultValue: number;
  maxValue: number;
  minValue: number;
  updateValue: Dispatch<SetStateAction<number>>;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
}

const DimensionInput = ({
  label,
  defaultValue,
  maxValue,
  minValue,
  updateValue,
  setIsFocused,
  ...props
}: DimensionInputProps) => {
  const [value, setValue] = useState<string>(defaultValue.toString());
  const ref = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue: number = Math.min(+e.target.value, maxValue); // TODO
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
    <div className="flex flex-row items-center justify-between">
      <label>{label}</label>
      <input
        ref={ref}
        type="number"
        value={value}
        max={maxValue}
        min={minValue}
        onChange={handleOnChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="border-solid border-2 rounded-md p-2 w-8/12 outline-2 focus:outline-blue-400"
        {...props}
      />
    </div>
  );
};

export default DimensionBox;
