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
 * @interface PlayContextRequest
 */
export interface PlayContextRequest {
    /**
     * 
     * @type {string}
     * @memberof PlayContextRequest
     */
    contextUri?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof PlayContextRequest
     */
    uris?: Array<string> | null;
    /**
     * 
     * @type {number}
     * @memberof PlayContextRequest
     */
    positionMs?: number | null;
}

export function PlayContextRequestFromJSON(json: any): PlayContextRequest {
    return PlayContextRequestFromJSONTyped(json, false);
}

export function PlayContextRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlayContextRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'contextUri': !exists(json, 'context_uri') ? undefined : json['context_uri'],
        'uris': !exists(json, 'uris') ? undefined : json['uris'],
        'positionMs': !exists(json, 'position_ms') ? undefined : json['position_ms'],
    };
}

export function PlayContextRequestToJSON(value?: PlayContextRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'context_uri': value.contextUri,
        'uris': value.uris,
        'position_ms': value.positionMs,
    };
}

