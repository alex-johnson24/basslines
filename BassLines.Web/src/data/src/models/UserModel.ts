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
import {
    UserRole,
    UserRoleFromJSON,
    UserRoleFromJSONTyped,
    UserRoleToJSON,
} from './UserRole';

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
     * @type {string}
     * @memberof UserModel
     */
    firstName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserModel
     */
    lastName?: string | null;
    /**
     * 
     * @type {UserRole}
     * @memberof UserModel
     */
    role?: UserRole;
    /**
     * 
     * @type {string}
     * @memberof UserModel
     */
    studioId?: string;
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
        'firstName': !exists(json, 'firstName') ? undefined : json['firstName'],
        'lastName': !exists(json, 'lastName') ? undefined : json['lastName'],
        'role': !exists(json, 'role') ? undefined : UserRoleFromJSON(json['role']),
        'studioId': !exists(json, 'studioId') ? undefined : json['studioId'],
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
        'firstName': value.firstName,
        'lastName': value.lastName,
        'role': UserRoleToJSON(value.role),
        'studioId': value.studioId,
    };
}

