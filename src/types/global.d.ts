declare function setTimeout(
  callback: (...args: any[]) => void,
  ms: number,
  ...args: any[]
): number;

declare interface Window {
  customConfig: unknown;
}
