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
 * @interface VideoThumbnail
 */
export interface VideoThumbnail {
    /**
     * 
     * @type {any}
     * @memberof VideoThumbnail
     */
    url?: any | null;
}

export function VideoThumbnailFromJSON(json: any): VideoThumbnail {
    return VideoThumbnailFromJSONTyped(json, false);
}

export function VideoThumbnailFromJSONTyped(json: any, ignoreDiscriminator: boolean): VideoThumbnail {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'url': !exists(json, 'url') ? undefined : json['url'],
    };
}

export function VideoThumbnailToJSON(value?: VideoThumbnail | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'url': value.url,
    };
}

