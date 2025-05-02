import Image from "next/image";
import React from "react";

interface ErrorProps {
  error: {
    message: string;
  };
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <div className="flex flex-col mt-24 items-center h-screen mx-auto">
      <Image
        width={0}
        height={0}
        placeholder="blur"
        blurDataURL="data:image/png;base64,..."
        sizes="(max-width: 768px) 100vw, 50vw"
        className="h-auto w-52 object-cover"
        src="/error.webp"
        alt="errorImg"
      />
      <h2 className="flex flex-row font-semibold text-2xl mt-4 mb-4">Error</h2>
      <p>{error.message}</p>
    </div>
  );
};

export default Error;
