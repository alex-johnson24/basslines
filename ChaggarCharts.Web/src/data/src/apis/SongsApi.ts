/* tslint:disable */
/* eslint-disable */
/**
 * ChaggarCharts
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
    SongModel,
    SongModelFromJSON,
    SongModelToJSON,
} from '../models';

export interface SongsSubmissionDateSubmitDateStringGetRequest {
    submitDateString: string | null;
}

/**
 * 
 */
export class SongsApi extends runtime.BaseAPI {

    /**
     */
    async songsGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<SongModel>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/Songs`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(SongModelFromJSON));
    }

    /**
     */
    async songsGet(initOverrides?: RequestInit): Promise<Array<SongModel>> {
        const response = await this.songsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async songsSubmissionDateSubmitDateStringGetRaw(requestParameters: SongsSubmissionDateSubmitDateStringGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<SongModel>>> {
        if (requestParameters.submitDateString === null || requestParameters.submitDateString === undefined) {
            throw new runtime.RequiredError('submitDateString','Required parameter requestParameters.submitDateString was null or undefined when calling songsSubmissionDateSubmitDateStringGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/Songs/SubmissionDate/{submitDateString}`.replace(`{${"submitDateString"}}`, encodeURIComponent(String(requestParameters.submitDateString))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(SongModelFromJSON));
    }

    /**
     */
    async songsSubmissionDateSubmitDateStringGet(requestParameters: SongsSubmissionDateSubmitDateStringGetRequest, initOverrides?: RequestInit): Promise<Array<SongModel>> {
        const response = await this.songsSubmissionDateSubmitDateStringGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
