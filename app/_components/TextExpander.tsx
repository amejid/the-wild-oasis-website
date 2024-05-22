"use client";

import { ReactNode, useState } from "react";

function TextExpander({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const textContent = typeof children === "string" ? children : "";

  const displayText = isExpanded
    ? textContent
    : textContent?.split(" ").slice(0, 40).join(" ") + "...";

  return (
    <span>
      {displayText}{" "}
      <button
        className="text-primary-700 border-b border-primary-700 leading-3 pb-1"
        onClick={() => setIsExpanded((x) => !x)}
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </span>
  );
}

export default TextExpander;
