// @ts-ignore
import * as Fetch from "whatwg-fetch";
import { BaseAPI, Configuration, Middleware, ResponseContext } from "./src";

export type ApiConstructor<T extends BaseAPI> = new (
  config: Configuration
) => T;

const unauthenticatedResponseHandlerMiddleware: Middleware = {
  post: async (context: ResponseContext): Promise<Response | void> => {
    if (context.response.status === 401) {
      console.warn("Received 401 from API, redirecting to login service"); // tslint:disable-line no-console
      if (document.location) {
        document.location.href = "./login";
      }
    }
  },
};

const call = <T extends BaseAPI>(api: ApiConstructor<T>): T => {
  return new api(
    new Configuration({
      fetchApi: Fetch.fetch,
      basePath: window.__API_URL__.includes("__API_URL__") ? "https://localhost:5001" :  window.__API_URL__, // for production
      middleware: [unauthenticatedResponseHandlerMiddleware],
    })
  );
};

export { call };
