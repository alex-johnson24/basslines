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
 * @interface GenreCountModel
 */
export interface GenreCountModel {
    /**
     * 
     * @type {string}
     * @memberof GenreCountModel
     */
    genre?: string | null;
    /**
     * 
     * @type {number}
     * @memberof GenreCountModel
     */
    count?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof GenreCountModel
     */
    spotifyLinks?: Array<string> | null;
}

export function GenreCountModelFromJSON(json: any): GenreCountModel {
    return GenreCountModelFromJSONTyped(json, false);
}

export function GenreCountModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): GenreCountModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'genre': !exists(json, 'genre') ? undefined : json['genre'],
        'count': !exists(json, 'count') ? undefined : json['count'],
        'spotifyLinks': !exists(json, 'spotifyLinks') ? undefined : json['spotifyLinks'],
    };
}

export function GenreCountModelToJSON(value?: GenreCountModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'genre': value.genre,
        'count': value.count,
        'spotifyLinks': value.spotifyLinks,
    };
}

