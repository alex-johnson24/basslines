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

/**
 * 
 * @export
 * @enum {string}
 */
export enum UserRole {
    Contributor = 'Contributor',
    Reviewer = 'Reviewer',
    Administrator = 'Administrator'
}

export function UserRoleFromJSON(json: any): UserRole {
    return UserRoleFromJSONTyped(json, false);
}

export function UserRoleFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserRole {
    return json as UserRole;
}

export function UserRoleToJSON(value?: UserRole | null): any {
    return value as any;
}

