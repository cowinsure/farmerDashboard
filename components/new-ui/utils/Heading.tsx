import React from "react";
interface HeadingProp {
  heading: string;
}

const Heading = ({ heading }: HeadingProp) => {
  return (
    <h2 className="text-2xl text-[var(--base-color)] font-bold text-center mb-8 mt-5">
      {heading}
    </h2>
  );
};

export default Heading;
