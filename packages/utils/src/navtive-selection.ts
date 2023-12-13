export let nativeSelectionEnabled = true;

const preventSelection = (e: Event) => {
  if (nativeSelectionEnabled) {
    return null;
  }
  e.preventDefault();
  e.stopPropagation();
  return false;
};
document.addEventListener('selectstart', preventSelection, true);
document.addEventListener('dragstart', preventSelection, true);

export function setNativeSelection(enableFlag: boolean) {
  nativeSelectionEnabled = enableFlag;
}
