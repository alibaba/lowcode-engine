export function isInSimulator() {
  return Boolean((window as any).__is_simulator_env__);
}
