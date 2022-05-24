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

const getBasePath = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return "https://app.basslines.co";
    case "staging":
      return "https://dev.basslines.co";
    default:
      return "https://localhost:5001";
  }
};

const call = <T extends BaseAPI>(api: ApiConstructor<T>): T => {
  return new api(
    new Configuration({
      fetchApi: Fetch.fetch,
      basePath: getBasePath(), // for production
      middleware: [unauthenticatedResponseHandlerMiddleware],
    })
  );
};

export { call };
