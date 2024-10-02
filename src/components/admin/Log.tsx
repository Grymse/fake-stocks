import { useEffect, useState } from "react";

export type LogLevel = "update" | "info" | "warn" | "error";

const logs: {
  message: string;
  level: LogLevel;
  timestamp: Date;
  id: number;
}[] = [];

export function LOG(message: string, level: LogLevel = "info") {
  logs.push({ message, level, timestamp: new Date(), id: logs.length });
}

export default function Log() {
  const [logsState, setLogsState] = useState(logs);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogsState([...logs].reverse());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="border w-full overflow-scroll overflow-x-hidden p-4 flex-1 rounded-lg shadow-sm"
      style={{ maxHeight: "calc(100vh - 350px)" }}
    >
      {logsState.map((log) => {
        return (
          <p key={log.id}>
            <span className="w-[100px] text-muted-foreground">
              {log.timestamp.toLocaleTimeString()}
            </span>
            <span className={getLogTextColor(log.level)}> {log.message}</span>
          </p>
        );
      })}
    </div>
  );
}

function getLogTextColor(level: LogLevel) {
  switch (level) {
    case "update":
      return "text-blue-500";
    case "info":
      return "text-foreground";
    case "warn":
      return "text-yellow-500";
    case "error":
      return "text-red-500";
  }
}
