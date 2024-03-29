/* tslint:disable */
/* eslint-disable */
/**
 * BassLines
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    ModelValidationState,
    ModelValidationStateFromJSON,
    ModelValidationStateToJSON,
    SongModel,
    SongModelFromJSON,
    SongModelToJSON,
} from '../models';

export interface ApiSongsPostRequest {
    songModel?: SongModel;
}

export interface ApiSongsPutRequest {
    songModel?: SongModel;
}

export interface ApiSongsSongSearchGetRequest {
    search?: string;
}

export interface ApiSongsSubmissionDateSubmitDateStringGetRequest {
    submitDateString: string;
}

/**
 * 
 */
export class SongsApi extends runtime.BaseAPI {

    /**
     */
    async apiSongsGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<SongModel>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Songs`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(SongModelFromJSON));
    }

    /**
     */
    async apiSongsGet(initOverrides?: RequestInit): Promise<Array<SongModel>> {
        const response = await this.apiSongsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSongsPostRaw(requestParameters: ApiSongsPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<SongModel>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Songs`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SongModelToJSON(requestParameters.songModel),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SongModelFromJSON(jsonValue));
    }

    /**
     */
    async apiSongsPost(requestParameters: ApiSongsPostRequest, initOverrides?: RequestInit): Promise<SongModel> {
        const response = await this.apiSongsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSongsPutRaw(requestParameters: ApiSongsPutRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<SongModel>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Songs`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SongModelToJSON(requestParameters.songModel),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SongModelFromJSON(jsonValue));
    }

    /**
     */
    async apiSongsPut(requestParameters: ApiSongsPutRequest, initOverrides?: RequestInit): Promise<SongModel> {
        const response = await this.apiSongsPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSongsSongSearchGetRaw(requestParameters: ApiSongsSongSearchGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<SongModel>>> {
        const queryParameters: any = {};

        if (requestParameters.search !== undefined) {
            queryParameters['search'] = requestParameters.search;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Songs/SongSearch`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(SongModelFromJSON));
    }

    /**
     */
    async apiSongsSongSearchGet(requestParameters: ApiSongsSongSearchGetRequest, initOverrides?: RequestInit): Promise<Array<SongModel>> {
        const response = await this.apiSongsSongSearchGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSongsSubmissionDateSubmitDateStringGetRaw(requestParameters: ApiSongsSubmissionDateSubmitDateStringGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<SongModel>>> {
        if (requestParameters.submitDateString === null || requestParameters.submitDateString === undefined) {
            throw new runtime.RequiredError('submitDateString','Required parameter requestParameters.submitDateString was null or undefined when calling apiSongsSubmissionDateSubmitDateStringGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Songs/SubmissionDate/{submitDateString}`.replace(`{${"submitDateString"}}`, encodeURIComponent(String(requestParameters.submitDateString))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(SongModelFromJSON));
    }

    /**
     */
    async apiSongsSubmissionDateSubmitDateStringGet(requestParameters: ApiSongsSubmissionDateSubmitDateStringGetRequest, initOverrides?: RequestInit): Promise<Array<SongModel>> {
        const response = await this.apiSongsSubmissionDateSubmitDateStringGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
