
export const dispatchEvent = (name: string, data?: any) => {
  const event = new CustomEvent(name, { detail: data });
  window.dispatchEvent(event);
};

export const listenForEvent = (name: string, handler: (e: any) => void) => {
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
}; 