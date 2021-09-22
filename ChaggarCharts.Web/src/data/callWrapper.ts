// @ts-ignore
import * as Fetch from "whatwg-fetch";
import { BaseAPI, Configuration, Middleware, ResponseContext } from "./src";

type ApiConstructor<T extends BaseAPI> = new (config: Configuration) => T;

const unauthenticatedResponseHandlerMiddleware: Middleware = {
  post: async (context: ResponseContext): Promise<Response | void> => {
    if (context.response.status === 401) {
      console.warn("Received 401 from API, redirecting to login service"); // tslint:disable-line no-console
      if (document.location) {
        document.location.href = "/login";
      }
    }
  },
};

const call = <T extends BaseAPI>(api: ApiConstructor<T>): T => {
  return new api(
    new Configuration({
      fetchApi: Fetch.fetch,
      basePath: "http://localhost:5000", // We can change this once we have environment variables setup to track prod, test, and local
      middleware: [unauthenticatedResponseHandlerMiddleware],
    })
  );
};

export { call }