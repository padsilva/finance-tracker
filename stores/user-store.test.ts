import { useUserStore } from "@/stores/user-store";

const mockStorage: Record<string, string> = {};
Storage.prototype.setItem = jest.fn((key, value) => {
  mockStorage[key] = value;
});

describe("useUserStore", () => {
  beforeEach(() => {
    useUserStore.getState().clearUser();
    jest.clearAllMocks();
  });

  it("should initialize with null user", () => {
    expect(useUserStore.getState().user).toBeNull();
  });

  it("should set user", () => {
    const user = { email: "test@example.com", name: "Test User" };
    useUserStore.getState().setUser(user);
    expect(useUserStore.getState().user).toEqual(user);
  });

  it("should update existing user", () => {
    const user = { email: "test@example.com", name: "Test User" };
    useUserStore.getState().setUser(user);
    useUserStore.getState().setUser({ ...user, name: "Updated User" });
    expect(useUserStore.getState().user).toEqual({
      email: "test@example.com",
      name: "Updated User",
    });
  });

  it("should clear user", () => {
    useUserStore
      .getState()
      .setUser({ email: "test@example.com", name: "Test User" });
    useUserStore.getState().clearUser();
    expect(useUserStore.getState().user).toBeNull();
  });

  it("should persist to storage", () => {
    const user = { email: "test@example.com", name: "Test User" };
    useUserStore.getState().setUser(user);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user-storage",
      expect.any(String),
    );
  });
});
