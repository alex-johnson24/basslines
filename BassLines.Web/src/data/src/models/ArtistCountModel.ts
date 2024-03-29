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
 * @interface ArtistCountModel
 */
export interface ArtistCountModel {
    /**
     * 
     * @type {string}
     * @memberof ArtistCountModel
     */
    artist?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ArtistCountModel
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof ArtistCountModel
     */
    trackRefLink?: string | null;
}

export function ArtistCountModelFromJSON(json: any): ArtistCountModel {
    return ArtistCountModelFromJSONTyped(json, false);
}

export function ArtistCountModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): ArtistCountModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'artist': !exists(json, 'artist') ? undefined : json['artist'],
        'count': !exists(json, 'count') ? undefined : json['count'],
        'trackRefLink': !exists(json, 'trackRefLink') ? undefined : json['trackRefLink'],
    };
}

export function ArtistCountModelToJSON(value?: ArtistCountModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'artist': value.artist,
        'count': value.count,
        'trackRefLink': value.trackRefLink,
    };
}

