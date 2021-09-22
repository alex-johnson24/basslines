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

import { exists, mapValues } from '../runtime';
import {
    UserRole,
    UserRoleFromJSON,
    UserRoleFromJSONTyped,
    UserRoleToJSON,
} from './';

/**
 * 
 * @export
 * @interface UserModel
 */
export interface UserModel {
    /**
     * 
     * @type {string}
     * @memberof UserModel
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof UserModel
     */
    username?: string | null;
    /**
     * 
     * @type {UserRole}
     * @memberof UserModel
     */
    role?: UserRole;
}

export function UserModelFromJSON(json: any): UserModel {
    return UserModelFromJSONTyped(json, false);
}

export function UserModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'username': !exists(json, 'username') ? undefined : json['username'],
        'role': !exists(json, 'role') ? undefined : UserRoleFromJSON(json['role']),
    };
}

export function UserModelToJSON(value?: UserModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'username': value.username,
        'role': UserRoleToJSON(value.role),
    };
}


