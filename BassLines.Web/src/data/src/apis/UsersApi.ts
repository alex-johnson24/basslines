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
    LoginModel,
    LoginModelFromJSON,
    LoginModelToJSON,
    RegistrationModel,
    RegistrationModelFromJSON,
    RegistrationModelToJSON,
    ResetPasswordModel,
    ResetPasswordModelFromJSON,
    ResetPasswordModelToJSON,
    UserLeaderboardModel,
    UserLeaderboardModelFromJSON,
    UserLeaderboardModelToJSON,
    UserMetricsModel,
    UserMetricsModelFromJSON,
    UserMetricsModelToJSON,
    UserModel,
    UserModelFromJSON,
    UserModelToJSON,
} from '../models';

export interface ApiUsersGetPasswordResetTokenGetRequest {
    username?: string;
}

export interface ApiUsersPostRequest {
    registrationModel?: RegistrationModel;
}

export interface ApiUsersResetUserPasswordPostRequest {
    resetPasswordModel?: ResetPasswordModel;
}

export interface ApiUsersSignInPostRequest {
    loginModel?: LoginModel;
}

export interface ApiUsersUserMetricsGetRequest {
    userId?: string;
}

/**
 * 
 */
export class UsersApi extends runtime.BaseAPI {

    /**
     */
    async apiUsersGetPasswordResetTokenGetRaw(requestParameters: ApiUsersGetPasswordResetTokenGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        if (requestParameters.username !== undefined) {
            queryParameters['username'] = requestParameters.username;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Users/GetPasswordResetToken`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiUsersGetPasswordResetTokenGet(requestParameters: ApiUsersGetPasswordResetTokenGetRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiUsersGetPasswordResetTokenGetRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiUsersLeaderboardMetricsGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<UserLeaderboardModel>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Users/LeaderboardMetrics`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(UserLeaderboardModelFromJSON));
    }

    /**
     */
    async apiUsersLeaderboardMetricsGet(initOverrides?: RequestInit): Promise<Array<UserLeaderboardModel>> {
        const response = await this.apiUsersLeaderboardMetricsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async apiUsersLogoutGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Users/Logout`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiUsersLogoutGet(initOverrides?: RequestInit): Promise<void> {
        await this.apiUsersLogoutGetRaw(initOverrides);
    }

    /**
     */
    async apiUsersPostRaw(requestParameters: ApiUsersPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Users`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RegistrationModelToJSON(requestParameters.registrationModel),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiUsersPost(requestParameters: ApiUsersPostRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiUsersPostRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiUsersResetUserPasswordPostRaw(requestParameters: ApiUsersResetUserPasswordPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Users/ResetUserPassword`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ResetPasswordModelToJSON(requestParameters.resetPasswordModel),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiUsersResetUserPasswordPost(requestParameters: ApiUsersResetUserPasswordPostRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiUsersResetUserPasswordPostRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiUsersSignInPostRaw(requestParameters: ApiUsersSignInPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<UserModel>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Users/SignIn`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LoginModelToJSON(requestParameters.loginModel),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserModelFromJSON(jsonValue));
    }

    /**
     */
    async apiUsersSignInPost(requestParameters: ApiUsersSignInPostRequest, initOverrides?: RequestInit): Promise<UserModel> {
        const response = await this.apiUsersSignInPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiUsersStudioUsersGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<UserModel>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Users/StudioUsers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(UserModelFromJSON));
    }

    /**
     */
    async apiUsersStudioUsersGet(initOverrides?: RequestInit): Promise<Array<UserModel>> {
        const response = await this.apiUsersStudioUsersGetRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async apiUsersUserMetricsGetRaw(requestParameters: ApiUsersUserMetricsGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<UserMetricsModel>> {
        const queryParameters: any = {};

        if (requestParameters.userId !== undefined) {
            queryParameters['userId'] = requestParameters.userId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Users/UserMetrics`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserMetricsModelFromJSON(jsonValue));
    }

    /**
     */
    async apiUsersUserMetricsGet(requestParameters: ApiUsersUserMetricsGetRequest, initOverrides?: RequestInit): Promise<UserMetricsModel> {
        const response = await this.apiUsersUserMetricsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
