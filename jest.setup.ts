import "@testing-library/jest-dom";

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

afterAll(() => {
  // Reset timers
  jest.useRealTimers();
});
