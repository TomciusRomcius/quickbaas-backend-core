export function navigateStringPath(head: unknown, path: string): unknown {
  const pathParts = path.split('.');

  let ref = head;
  for (let pathPart of pathParts) {
    if (!ref) continue;
    ref = ref[pathPart];
  }

  return ref;
}
