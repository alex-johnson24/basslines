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
 * @interface SpotifyProfile
 */
export interface SpotifyProfile {
    /**
     * 
     * @type {string}
     * @memberof SpotifyProfile
     */
    name?: string | null;
    /**
     * 
     * @type {string}
     * @memberof SpotifyProfile
     */
    spotifyId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof SpotifyProfile
     */
    link?: string | null;
    /**
     * 
     * @type {number}
     * @memberof SpotifyProfile
     */
    followers?: number;
    /**
     * 
     * @type {string}
     * @memberof SpotifyProfile
     */
    photoUrl?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof SpotifyProfile
     */
    premium?: boolean;
}

export function SpotifyProfileFromJSON(json: any): SpotifyProfile {
    return SpotifyProfileFromJSONTyped(json, false);
}

export function SpotifyProfileFromJSONTyped(json: any, ignoreDiscriminator: boolean): SpotifyProfile {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'spotifyId': !exists(json, 'spotifyId') ? undefined : json['spotifyId'],
        'link': !exists(json, 'link') ? undefined : json['link'],
        'followers': !exists(json, 'followers') ? undefined : json['followers'],
        'photoUrl': !exists(json, 'photoUrl') ? undefined : json['photoUrl'],
        'premium': !exists(json, 'premium') ? undefined : json['premium'],
    };
}

export function SpotifyProfileToJSON(value?: SpotifyProfile | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'spotifyId': value.spotifyId,
        'link': value.link,
        'followers': value.followers,
        'photoUrl': value.photoUrl,
        'premium': value.premium,
    };
}

