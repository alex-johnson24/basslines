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
    LoginModel,
    LoginModelFromJSON,
    LoginModelToJSON,
    RegistrationModel,
    RegistrationModelFromJSON,
    RegistrationModelToJSON,
    UserModel,
    UserModelFromJSON,
    UserModelToJSON,
} from '../models';

export interface UsersPostRequest {
    registrationModel?: RegistrationModel;
}

export interface UsersSignInPostRequest {
    loginModel?: LoginModel;
}

/**
 * 
 */
export class UsersApi extends runtime.BaseAPI {

    /**
     */
    async usersPostRaw(requestParameters: UsersPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/Users`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RegistrationModelToJSON(requestParameters.registrationModel),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async usersPost(requestParameters: UsersPostRequest, initOverrides?: RequestInit): Promise<void> {
        await this.usersPostRaw(requestParameters, initOverrides);
    }

    /**
     */
    async usersSignInPostRaw(requestParameters: UsersSignInPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<UserModel>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/Users/SignIn`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LoginModelToJSON(requestParameters.loginModel),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserModelFromJSON(jsonValue));
    }

    /**
     */
    async usersSignInPost(requestParameters: UsersSignInPostRequest, initOverrides?: RequestInit): Promise<UserModel> {
        const response = await this.usersSignInPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
