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
    ExternalUrls,
    ExternalUrlsFromJSON,
    ExternalUrlsFromJSONTyped,
    ExternalUrlsToJSON,
} from './ExternalUrls';

/**
 * 
 * @export
 * @interface PlaylistOwner
 */
export interface PlaylistOwner {
    /**
     * 
     * @type {string}
     * @memberof PlaylistOwner
     */
    displayName?: string | null;
    /**
     * 
     * @type {ExternalUrls}
     * @memberof PlaylistOwner
     */
    externalUrls?: ExternalUrls;
    /**
     * 
     * @type {string}
     * @memberof PlaylistOwner
     */
    href?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistOwner
     */
    id?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistOwner
     */
    type?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PlaylistOwner
     */
    uri?: string | null;
}

export function PlaylistOwnerFromJSON(json: any): PlaylistOwner {
    return PlaylistOwnerFromJSONTyped(json, false);
}

export function PlaylistOwnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaylistOwner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'displayName': !exists(json, 'display_name') ? undefined : json['display_name'],
        'externalUrls': !exists(json, 'external_urls') ? undefined : ExternalUrlsFromJSON(json['external_urls']),
        'href': !exists(json, 'href') ? undefined : json['href'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'type': !exists(json, 'type') ? undefined : json['type'],
        'uri': !exists(json, 'uri') ? undefined : json['uri'],
    };
}

export function PlaylistOwnerToJSON(value?: PlaylistOwner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'display_name': value.displayName,
        'external_urls': ExternalUrlsToJSON(value.externalUrls),
        'href': value.href,
        'id': value.id,
        'type': value.type,
        'uri': value.uri,
    };
}

