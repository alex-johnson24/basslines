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
 * @interface Context
 */
export interface Context {
    /**
     * 
     * @type {string}
     * @memberof Context
     */
    type?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Context
     */
    href?: string | null;
    /**
     * 
     * @type {ExternalUrls}
     * @memberof Context
     */
    externalUrls?: ExternalUrls;
    /**
     * 
     * @type {string}
     * @memberof Context
     */
    uri?: string | null;
}

export function ContextFromJSON(json: any): Context {
    return ContextFromJSONTyped(json, false);
}

export function ContextFromJSONTyped(json: any, ignoreDiscriminator: boolean): Context {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': !exists(json, 'type') ? undefined : json['type'],
        'href': !exists(json, 'href') ? undefined : json['href'],
        'externalUrls': !exists(json, 'external_urls') ? undefined : ExternalUrlsFromJSON(json['external_urls']),
        'uri': !exists(json, 'uri') ? undefined : json['uri'],
    };
}

export function ContextToJSON(value?: Context | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': value.type,
        'href': value.href,
        'external_urls': ExternalUrlsToJSON(value.externalUrls),
        'uri': value.uri,
    };
}
