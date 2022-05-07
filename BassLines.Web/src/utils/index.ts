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
 * @returns parsed spotify type and id as a key value pair
 */
export const parseSpotifyId = (url: string) => {
  try {
    const tuple = url
      .split("https://open.spotify.com/")[1]
      .split("?")[0]
      .split("/");
    return { [tuple[0]]: tuple[1] };
  } catch (e) {
    return {error: true};
  }
};