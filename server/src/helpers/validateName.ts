export function isValidName(name: string): boolean {
  if (!name || name.length < 2) {
    return false;
  }

  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    return false;
  }

  return true;
}
