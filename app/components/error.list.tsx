import React from "react";

interface ErrorListProps {
  errors: string[] | undefined;
}

const ErrorList: React.FC<ErrorListProps> = ({ errors }) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <ul className="list-disc list-inside text-sm text-red-500 mt-2">
      {errors.map((error, index) => (
        <li key={index} className="mt-1">
          {error}
        </li>
      ))}
    </ul>
  );
};

export default ErrorList;
