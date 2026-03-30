export function validateRequired(label: string, value: string) {
  if (!value.trim()) {
    return `${label} on pakollinen.`;
  }

  return null;
}

export function validateEmail(value: string) {
  if (!value.trim()) {
    return "Sahkoposti on pakollinen.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value.trim())) {
    return "Anna sahkoposti oikeassa muodossa.";
  }

  return null;
}

export function validatePassword(value: string) {
  if (!value.trim()) {
    return "Salasana on pakollinen.";
  }

  if (value.trim().length < 6) {
    return "Salasanassa tulee olla vahintaan 6 merkkia.";
  }

  return null;
}
