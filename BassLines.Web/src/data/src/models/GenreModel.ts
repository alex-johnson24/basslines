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
 * @interface GenreModel
 */
export interface GenreModel {
    /**
     * 
     * @type {string}
     * @memberof GenreModel
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof GenreModel
     */
    name?: string | null;
}

export function GenreModelFromJSON(json: any): GenreModel {
    return GenreModelFromJSONTyped(json, false);
}

export function GenreModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): GenreModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
    };
}

export function GenreModelToJSON(value?: GenreModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
    };
}

