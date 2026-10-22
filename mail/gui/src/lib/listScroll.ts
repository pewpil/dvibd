let value = 0;

export function readScroll(): number {
  return value;
}

export function writeScroll(next: number): void {
  value = next;
}

export function resetScroll(): void {
  value = 0;
}
