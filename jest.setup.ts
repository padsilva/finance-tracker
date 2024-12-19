import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

beforeAll(() => {
  // Ensure fake timers are used
  jest.useFakeTimers();

  global.ResizeObserver = class ResizeObserver {
    observe() {
      /* ResizeObserver needs to be mocked */
    }
    unobserve() {
      /* ResizeObserver needs to be mocked */
    }
    disconnect() {
      /* ResizeObserver needs to be mocked */
    }
  };
});

afterEach(() => {
  console.log("passei no setup");
  cleanup();
  jest.clearAllMocks();
});

afterAll(() => {
  // Reset timers
  jest.useRealTimers();
});
