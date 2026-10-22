/** Join class names, skipping the falsy ones: `cx('ui-btn', block && 'ui-btn--block')`. */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
