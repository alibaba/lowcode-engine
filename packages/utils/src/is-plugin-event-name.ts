export function isPluginEventName(eventName: string): boolean {
  if (!eventName) {
    return false;
  }

  const eventSegments = eventName.split(':');
  return (eventSegments.length > 1 && eventSegments[0].length > 0);
}
