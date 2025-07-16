import React from "react";

interface PageHeadingProp {
  pageTitle: string;
  description: string;
}

const PageHeading = ({ pageTitle, description }: PageHeadingProp) => {
  return (
    <div className="mb-14">
      <h1 className="text-3xl md:text-4xl font-extrabold">{pageTitle}</h1>
      <p className="md:text-lg font-medium text-gray-400">{description}</p>
    </div>
  );
};

export default PageHeading;
