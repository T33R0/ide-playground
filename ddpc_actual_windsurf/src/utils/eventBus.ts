/**
 * Dispatches a custom event with optional data
 * @param name - The name of the event
 * @param data - Optional data to pass with the event
 */
export const dispatchEvent = (name: string, data?: unknown): void => {
  const event = new CustomEvent(name, { detail: data });
  window.dispatchEvent(event);
};

/**
 * Listens for a custom event and executes the handler when the event is triggered
 * @param name - The name of the event to listen for
 * @param handler - The function to execute when the event is triggered
 * @returns A cleanup function to remove the event listener
 */
export const listenForEvent = <T = unknown>(
  name: string, 
  handler: (event: CustomEvent<T>) => void
): (() => void) => {
  const eventHandler = (event: Event) => {
    handler(event as CustomEvent<T>);
  };
  
  window.addEventListener(name, eventHandler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener(name, eventHandler);
  };
};

// Export types for better type safety
export interface NotificationEvent {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

declare global {
  interface WindowEventMap {
    'show:notification': CustomEvent<NotificationEvent>;
    // Add more custom events here as needed
  }
}
