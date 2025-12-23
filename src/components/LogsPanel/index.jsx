export default function LogsPanel({ logs }) {
  return (
    <div className="bg-black bg-opacity-40 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
      {logs.map((log, index) => (
        <div key={index} className="mb-1">
          {log}
        </div>
      ))}
    </div>
  );
}
