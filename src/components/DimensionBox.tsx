import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";

interface DimensionBoxProps {
  isActive: boolean;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
}

const DimensionBox = ({ isActive, setIsFocused }: DimensionBoxProps) => {
  const { rows, setRows, cols, setCols } = useControlBarContext();

  if (isActive) {
    return (
      <span className="w-44 bg-white rounded-lg shadow-cover flex flex-col p-4 gap-4">
        <DimensionInput
          label="cols"
          placeholder="enter desired cols"
          defaultValue={cols}
          updateValue={setCols}
          setIsFocused={setIsFocused}
        />
        <DimensionInput
          label="rows"
          placeholder="enter desired rows"
          defaultValue={rows}
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
  updateValue: Dispatch<SetStateAction<number>>;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
}

const DimensionInput = ({
  label,
  defaultValue,
  updateValue,
  setIsFocused,
  ...props
}: DimensionInputProps) => {
  const [value, setValue] = useState<string>(defaultValue.toString());
  const ref = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    updateValue(+e.target.value);
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
        onChange={handleOnChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="outline-none border-solid border-2 rounded-md p-2 w-8/12"
        {...props}
      />
    </div>
  );
};

export default DimensionBox;
