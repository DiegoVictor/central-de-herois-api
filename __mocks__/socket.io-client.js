export const emit = jest.fn();

export const to = jest.fn(() => ({ emit }));

export const connect = jest.fn();

export const on = jest.fn();

export const io = () => ({
  to,
  emit,
  on,
  connect,
});
