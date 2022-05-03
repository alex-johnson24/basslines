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
 * @interface DailyRatingModel
 */
export interface DailyRatingModel {
    /**
     * 
     * @type {Date}
     * @memberof DailyRatingModel
     */
    submittedDate?: Date;
    /**
     * 
     * @type {number}
     * @memberof DailyRatingModel
     */
    rating?: number | null;
    /**
     * 
     * @type {string}
     * @memberof DailyRatingModel
     */
    title?: string | null;
    /**
     * 
     * @type {string}
     * @memberof DailyRatingModel
     */
    artist?: string | null;
}

export function DailyRatingModelFromJSON(json: any): DailyRatingModel {
    return DailyRatingModelFromJSONTyped(json, false);
}

export function DailyRatingModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): DailyRatingModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'submittedDate': !exists(json, 'submittedDate') ? undefined : (new Date(json['submittedDate'])),
        'rating': !exists(json, 'rating') ? undefined : json['rating'],
        'title': !exists(json, 'title') ? undefined : json['title'],
        'artist': !exists(json, 'artist') ? undefined : json['artist'],
    };
}

export function DailyRatingModelToJSON(value?: DailyRatingModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'submittedDate': value.submittedDate === undefined ? undefined : (value.submittedDate.toISOString()),
        'rating': value.rating,
        'title': value.title,
        'artist': value.artist,
    };
}

