export default function ConfigOption({
  title,
  description,
  selected,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer mb-4 p-6 rounded-xl border-2 transition 
        ${selected
          ? "border-white bg-white/10"
          : "border-transparent bg-white/5 hover:border-white/40"}
      `}
    >
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
}
