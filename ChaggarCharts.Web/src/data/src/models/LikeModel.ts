/* tslint:disable */
/* eslint-disable */
/**
 * ChaggarCharts
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
 * @interface LikeModel
 */
export interface LikeModel {
    /**
     * 
     * @type {string}
     * @memberof LikeModel
     */
    songId: string;
    /**
     * 
     * @type {string}
     * @memberof LikeModel
     */
    userId: string;
}

export function LikeModelFromJSON(json: any): LikeModel {
    return LikeModelFromJSONTyped(json, false);
}

export function LikeModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): LikeModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'songId': json['songId'],
        'userId': json['userId'],
    };
}

export function LikeModelToJSON(value?: LikeModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'songId': value.songId,
        'userId': value.userId,
    };
}

