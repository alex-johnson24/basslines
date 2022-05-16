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
 * @interface Image
 */
export interface Image {
    /**
     * 
     * @type {number}
     * @memberof Image
     */
    height?: number;
    /**
     * 
     * @type {string}
     * @memberof Image
     */
    url?: string | null;
    /**
     * 
     * @type {number}
     * @memberof Image
     */
    width?: number;
}

export function ImageFromJSON(json: any): Image {
    return ImageFromJSONTyped(json, false);
}

export function ImageFromJSONTyped(json: any, ignoreDiscriminator: boolean): Image {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'height': !exists(json, 'height') ? undefined : json['height'],
        'url': !exists(json, 'url') ? undefined : json['url'],
        'width': !exists(json, 'width') ? undefined : json['width'],
    };
}

export function ImageToJSON(value?: Image | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'height': value.height,
        'url': value.url,
        'width': value.width,
    };
}

