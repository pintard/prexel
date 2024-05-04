import React from "react";
import IconButton from "../components/IconButton";
import { WaffleIcon } from "../components/Icons";
import { Link } from "react-router-dom";

const Marketplace = () => {
  return (
    <div className="w-full h-full bg-gray-200 flex flex-col p-10">
      <div className="w-full h-10 bg-gray-300">
        <Link to="/editor">
          <IconButton icon={WaffleIcon} />
        </Link>
      </div>
      <div className="w-full h-full bg-gray-100"></div>
    </div>
  );
};

export default Marketplace;
