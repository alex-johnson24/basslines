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
 * @interface AddedBy
 */
export interface AddedBy {
    /**
     * 
     * @type {ExternalUrls}
     * @memberof AddedBy
     */
    externalUrls?: ExternalUrls;
    /**
     * 
     * @type {string}
     * @memberof AddedBy
     */
    href?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AddedBy
     */
    id?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AddedBy
     */
    type?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AddedBy
     */
    uri?: string | null;
}

export function AddedByFromJSON(json: any): AddedBy {
    return AddedByFromJSONTyped(json, false);
}

export function AddedByFromJSONTyped(json: any, ignoreDiscriminator: boolean): AddedBy {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'externalUrls': !exists(json, 'external_urls') ? undefined : ExternalUrlsFromJSON(json['external_urls']),
        'href': !exists(json, 'href') ? undefined : json['href'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'type': !exists(json, 'type') ? undefined : json['type'],
        'uri': !exists(json, 'uri') ? undefined : json['uri'],
    };
}

export function AddedByToJSON(value?: AddedBy | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'external_urls': ExternalUrlsToJSON(value.externalUrls),
        'href': value.href,
        'id': value.id,
        'type': value.type,
        'uri': value.uri,
    };
}

