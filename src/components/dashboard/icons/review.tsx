import React from "react";

export default function ReviewIcon() {
  return (
    <svg
      width={50}
      height={50}
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 scale-125"
      viewBox="0 0 512 512"
    >
      <path
        d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
        fill="#ff7539"
        stroke="#ff7539"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path d="M256 48v316L118 464l54-160-140-96h172l52-160z" />
    </svg>
  );
}
