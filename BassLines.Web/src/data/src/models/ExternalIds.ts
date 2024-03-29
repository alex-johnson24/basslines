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
 * @interface ExternalIds
 */
export interface ExternalIds {
    /**
     * 
     * @type {string}
     * @memberof ExternalIds
     */
    upc?: string | null;
}

export function ExternalIdsFromJSON(json: any): ExternalIds {
    return ExternalIdsFromJSONTyped(json, false);
}

export function ExternalIdsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExternalIds {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'upc': !exists(json, 'upc') ? undefined : json['upc'],
    };
}

export function ExternalIdsToJSON(value?: ExternalIds | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'upc': value.upc,
    };
}

