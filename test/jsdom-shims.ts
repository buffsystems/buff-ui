// What jsdom lacks and the components call: pointer capture and pointer events, scrolling an
// item into view, resize observing. No-ops are enough — the tests check behaviour, not layout.
export function shimLayoutApis(): void {
  const proto = window.HTMLElement.prototype as unknown as Record<string, unknown>
  proto.hasPointerCapture ??= () => false
  proto.setPointerCapture ??= () => {}
  proto.releasePointerCapture ??= () => {}
  proto.scrollIntoView ??= () => {}
  const global = globalThis as unknown as Record<string, unknown>
  // jsdom has no PointerEvent: a MouseEvent with a pointer id keeps clientX/clientY.
  global.PointerEvent ??= class extends MouseEvent {
    pointerId: number
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 1
    }
  }
  global.ResizeObserver ??= class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
}
