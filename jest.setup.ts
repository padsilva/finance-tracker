import "@testing-library/jest-dom";

beforeAll(() => {
  // Ensure fake timers are used
  jest.useFakeTimers();
});

afterAll(() => {
  // Reset timers
  jest.useRealTimers();
});
