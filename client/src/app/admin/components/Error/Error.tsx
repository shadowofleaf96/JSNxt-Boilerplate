import React from "react";

interface ErrorProps {
  error: {
    message: string;
  };
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <div className="flex flex-col mt-24 items-center h-screen mx-auto">
      <img
        className="h-auto w-52 object-cover"
        src="../../../error.webp"
        alt="errorImg"
      />
      <h2 className="flex flex-row font-semibold text-2xl mt-4 mb-4">Error</h2>
      <p>{error.message}</p>
    </div>
  );
};

export default Error;
