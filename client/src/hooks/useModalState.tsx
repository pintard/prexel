import { useContext, useEffect } from "react";
import { ControlBarContext } from "../contexts/ControlBarProvider";

function useModalState(isOpen: boolean) {
  const { setIsAnyModalOpen } = useContext(ControlBarContext);

  useEffect(() => {
    setIsAnyModalOpen(isOpen);
    return () => setIsAnyModalOpen(false);
  }, [isOpen, setIsAnyModalOpen]);
}

export default useModalState;
