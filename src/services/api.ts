export type InspirationTodo = {
  id: number;
  todo: string;
  completed: boolean;
};

type DummyJsonResponse = {
  todos: InspirationTodo[];
};

type TimeApiResponse = {
  dateTime?: string;
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  seconds?: number;
  second?: number;
};

type LocalTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export type ViewerClock = {
  dateKey: string;
  msUntilNextQuote: number;
  receivedAt: number;
  source: "api" | "device";
};

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function getViewerTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function getLocalDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getDateKeyFromParts(parts: LocalTimeParts) {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function getMsUntilNextLocalMidnight(parts: LocalTimeParts) {
  const elapsedToday =
    parts.hour * MS_PER_HOUR +
    parts.minute * MS_PER_MINUTE +
    parts.second * MS_PER_SECOND;

  return Math.max(MS_PER_DAY - elapsedToday, 0);
}

function getPartsFromDate(date: Date): LocalTimeParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
}

function getPartsFromTimeApi(data: TimeApiResponse): LocalTimeParts | null {
  if (
    typeof data.year === "number" &&
    typeof data.month === "number" &&
    typeof data.day === "number" &&
    typeof data.hour === "number" &&
    typeof data.minute === "number"
  ) {
    return {
      year: data.year,
      month: data.month,
      day: data.day,
      hour: data.hour,
      minute: data.minute,
      second: data.seconds ?? data.second ?? 0,
    };
  }

  const match = data.dateTime?.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/
  );

  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6] ?? 0),
  };
}

function getClockFromParts(parts: LocalTimeParts, source: ViewerClock["source"]): ViewerClock {
  return {
    dateKey: getDateKeyFromParts(parts),
    msUntilNextQuote: getMsUntilNextLocalMidnight(parts),
    receivedAt: Date.now(),
    source,
  };
}

export function getDeviceClockSnapshot(date = new Date()): ViewerClock {
  return getClockFromParts(getPartsFromDate(date), "device");
}

export function formatCountdown(ms: number) {
  const safeMs = Math.max(ms, 0);
  const totalSeconds = Math.ceil(safeMs / MS_PER_SECOND);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${pad(minutes)}m`;
  if (minutes > 0) return `${minutes}m ${pad(seconds)}s`;
  return `${seconds}s`;
}

export async function fetchViewerClock(timeZone = getViewerTimeZone()) {
  try {
    const response = await fetch(
      `https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(timeZone)}`
    );

    if (!response.ok) {
      throw new Error("Unable to load viewer time");
    }

    const data = (await response.json()) as TimeApiResponse;
    const parts = getPartsFromTimeApi(data);

    if (!parts) {
      throw new Error("Invalid viewer time response");
    }

    return getClockFromParts(parts, "api");
  } catch {
    return getDeviceClockSnapshot();
  }
}

function hashDateKey(dateKey: string) {
  return dateKey.split("").reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) >>> 0;
  }, 0);
}

export function chooseDailyInspiration(
  todos: InspirationTodo[],
  dateKey = getLocalDateKey()
) {
  if (todos.length === 0) {
    throw new Error("No inspiration available");
  }

  return todos[hashDateKey(dateKey) % todos.length];
}

export async function fetchDailyInspiration(dateKey = getLocalDateKey()) {
  const response = await fetch("https://dummyjson.com/todos");

  if (!response.ok) {
    throw new Error("Unable to load inspiration");
  }

  const data = (await response.json()) as DummyJsonResponse;
  const todos = data.todos ?? [];

  return chooseDailyInspiration(todos, dateKey);
}
