const FILTERED_WEB_WARNINGS = [
  "[Reanimated] Reduced motion setting is enabled on this device.",
  "Animated: `useNativeDriver` is not supported because the native animated module is missing.",
  "props.pointerEvents is deprecated. Use style.pointerEvents",
];

type FilteredConsole = Console & {
  __taskflowWarningFilterInstalled?: boolean;
};

function shouldFilterWarning(args: unknown[]) {
  const message = args
    .map((arg) => (typeof arg === "string" ? arg : ""))
    .join(" ");

  return FILTERED_WEB_WARNINGS.some((warning) => message.includes(warning));
}

const filteredConsole = console as FilteredConsole;

if (__DEV__ && !filteredConsole.__taskflowWarningFilterInstalled) {
  const originalWarn = console.warn.bind(console);

  console.warn = (...args: unknown[]) => {
    if (shouldFilterWarning(args)) {
      return;
    }

    originalWarn(...args);
  };

  filteredConsole.__taskflowWarningFilterInstalled = true;
}
