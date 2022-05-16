export type KeyValuePairs = { [key: string]: string };

export const getQueryParams = () => {
  return window.location
    .toString()
    .split("?")[1]
    .split("&")
    .reduce((params: KeyValuePairs, query: string) => {
      params[query.split("=")[0]] = query.split("=")[1];
      return params;
    }, {});
};

/**
 * Builds the query portion of a request URL
 * @param params key/value pairs
 * @returns query string
 */
export const buildQueryString = (params?: KeyValuePairs) => {
  if (!params) return "";
  return Object.entries(params).reduce((queryStr, [key, value], i, a) => {
    queryStr += key + "=" + value;
    if (i !== a.length - 1) {
      queryStr += "&";
    }
    return queryStr;
  }, "?");
};

/**
 * Extracts the unique spotify entity ID from URL
 * @param url
 * @returns [id: string, isValid: boolean]
 */
export const parseSpotifyId = (url: string): [string, boolean, string?] => {
  try {
    const tuple = url
      .split("https://open.spotify.com/")[1]
      .split("?")[0]
      .split("/" || "");
    return [tuple[1], tuple[0] === "track" ?? false, tuple[0]];
  } catch (e) {
    return [undefined, false];
  }
};

/**
 * converts seconds to a user-friendly string
 * @param seconds 
 * @returns string 'm:ss'
 */
export const convertSecondsToLengthString = (seconds?: number) => {
  if (!seconds) return undefined;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);

  return `${m}:${s < 10 ? "0" : ""}${s}`
}