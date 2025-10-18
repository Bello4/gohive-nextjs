export default function Loading() {
  return (
    <svg className="spinner" width="174" height="174" viewBox="0 0 66 66">
      <circle
        className="path"
        fill="transparent"
        strokeWidth="2"
        cx="33"
        cy="33"
        r="30"
        stroke="url(#gradient)"
      />
      <linearGradient id="gradient">
        <stop offset="50%" stopColor="#000000" stopOpacity="1" />
        <stop offset="65%" stopColor="#000000" stopOpacity=".5" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </linearGradient>

      <svg
        className="spinner-dot"
        width="5"
        height="5"
        viewBox="0 0 66 66"
        x="37"
        y="1.5"
      >
        <circle fill="#000000" cx="33" cy="33" r="30" />
      </svg>
    </svg>
  );
}
