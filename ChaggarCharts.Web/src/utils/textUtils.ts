export const MAX_LIMITED_FIELD_LENGTH = 30;

export function limitStringLength(input: string) {
    if (input.length <= MAX_LIMITED_FIELD_LENGTH) return input;

    return input.substr(0, MAX_LIMITED_FIELD_LENGTH) + "...";
}

export function getCookieByName(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }