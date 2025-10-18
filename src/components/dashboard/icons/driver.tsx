const DriverIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={50}
      className="h-8 w-8 #ff7539"
      viewBox="0 0 512 512"
    >
      <defs>
        <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff7539" />
          <stop offset="100%" stopColor="#ff7539" />
        </linearGradient>
      </defs>

      <path
        d="M388 288a76 76 0 1076 76 76.24 76.24 0 00-76-76zM124 288a76 76 0 1076 76 76.24 76.24 0 00-76-76z"
        fill="none"
        stroke="#ff7539"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        fill="none"
        stroke="#ff7539"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M256 360v-86l-64-42 80-88 40 72h56"
      />
      <path d="M320 136a31.89 31.89 0 0032-32.1A31.55 31.55 0 00320.2 72a32 32 0 10-.2 64z" />
    </svg>
  );
};

export default DriverIcon;
