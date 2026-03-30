export const PET_PROFILE_PHOTO_SIZE = 400;
export const PET_PROFILE_PHOTO_PRESET = "square_400" as const;

export interface PickedPetPhoto {
  originalName: string;
  storedName: string;
}

export function getPetPhotoPresetLabel() {
  return `${PET_PROFILE_PHOTO_SIZE} × ${PET_PROFILE_PHOTO_SIZE}`;
}

export function normalizePetPhotoLabel(label: string) {
  const trimmed = label.trim();
  return trimmed || undefined;
}

export function createUniquePetPhotoName(originalName: string) {
  const trimmed = originalName.trim() || "kuva.jpg";
  const extMatch = trimmed.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
  const baseName = trimmed.replace(/\.[^/.]+$/, "");
  const safeBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32) || "lemmikki";

  return `${safeBase}-${crypto.randomUUID()}.${ext}`;
}

export async function pickPetPhoto(): Promise<PickedPetPhoto | null> {
  const doc = (globalThis as { document?: { createElement: (tag: string) => any } }).document;

  if (!doc) {
    return null;
  }

  return new Promise((resolve) => {
    const input = doc.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files?.[0];

      if (!file) {
        resolve(null);
        return;
      }

      resolve({
        originalName: file.name,
        storedName: createUniquePetPhotoName(file.name),
      });
    };

    input.click();
  });
}
