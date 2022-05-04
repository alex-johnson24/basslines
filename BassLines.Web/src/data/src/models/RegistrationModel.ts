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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface RegistrationModel
 */
export interface RegistrationModel {
    /**
     * 
     * @type {string}
     * @memberof RegistrationModel
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof RegistrationModel
     */
    password: string;
    /**
     * 
     * @type {string}
     * @memberof RegistrationModel
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof RegistrationModel
     */
    lastName: string;
}

export function RegistrationModelFromJSON(json: any): RegistrationModel {
    return RegistrationModelFromJSONTyped(json, false);
}

export function RegistrationModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): RegistrationModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'username': json['username'],
        'password': json['password'],
        'firstName': json['firstName'],
        'lastName': json['lastName'],
    };
}

export function RegistrationModelToJSON(value?: RegistrationModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'username': value.username,
        'password': value.password,
        'firstName': value.firstName,
        'lastName': value.lastName,
    };
}

