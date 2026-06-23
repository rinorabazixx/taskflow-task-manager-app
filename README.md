# TaskFlow

TaskFlow is a modern personal task manager built with Expo, TypeScript, AsyncStorage, and Expo Router. It keeps the feature set focused: create tasks, review details, complete work, delete items safely, and bring in a small daily prompt from DummyJSON.

## Features

- Task list with add, details, complete, and delete flows
- Real-time search with a 300ms debounce
- All, Active, and Completed filters
- Local persistence with AsyncStorage
- DummyJSON daily inspiration card with loading, error, retry, and refresh states
- Swipe actions for complete and delete
- Automatic dark mode
- Haptic feedback for important actions
- Pull-to-refresh
- Accessible labels and 44x44 minimum touch targets on interactive controls

## Tech Stack

- Expo SDK 56
- TypeScript in strict mode
- Expo Router
- AsyncStorage
- React Native Paper
- React Native Reanimated
- React Native Gesture Handler
- UUID
- Jest

## Architecture

The app uses Expo Router for file-based navigation and a single `TaskContext` in `src/hooks/useTasks.ts` for task state. State is intentionally simple because the app only needs add, delete, toggle, and load operations. AsyncStorage is isolated in `src/services/storage.ts`, and the DummyJSON call lives in `src/services/api.ts`.

```text
src/
  components/
  screens/
  hooks/
  services/
  types/
  constants/
  utils/
```

## Installation

```bash
npm install
```

## Running

```bash
npx expo start
```

Use the Expo CLI output to open the app on Android, iOS, or web.

## Testing

```bash
npm test
npm run typecheck
```

The test suite covers validation and task operations. UI tests are intentionally omitted to keep the submission focused and realistic for the task scope.

## Screenshots

Screenshots can be captured from Expo Go or a simulator after running the app:

- Task list with inspiration card
- Add task form with validation
- Task details with delete confirmation
- Dark mode task list

## Design Decisions

- A single context is enough for the app's four task operations.
- AsyncStorage failures fall back gracefully and never crash the UI.
- DummyJSON Todos is directly related to task management, so the public API feature feels natural.
- The task model only includes `id`, `title`, `description`, `completed`, and `createdAt` to avoid unnecessary product complexity.
- Animations are limited to task completion, task removal, and navigation transitions.

## Tradeoffs

- The app does not include priorities, due dates, tags, or categories because they were outside the brief.
- The inspiration item is random on refresh rather than cached separately.
- Tests focus on business rules and task operations rather than full screen rendering.

## Future Considerations

- Add screenshot-based UI documentation for the README.
- Add optional due dates only if the product requirements expand.
- Add lightweight end-to-end tests once the navigation flow stabilizes.
