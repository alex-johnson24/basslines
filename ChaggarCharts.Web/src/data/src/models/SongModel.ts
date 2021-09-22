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
import {
    GenreModel,
    GenreModelFromJSON,
    GenreModelFromJSONTyped,
    GenreModelToJSON,
    UserModel,
    UserModelFromJSON,
    UserModelFromJSONTyped,
    UserModelToJSON,
} from './';

/**
 * 
 * @export
 * @interface SongModel
 */
export interface SongModel {
    /**
     * 
     * @type {string}
     * @memberof SongModel
     */
    title?: string | null;
    /**
     * 
     * @type {string}
     * @memberof SongModel
     */
    artist?: string | null;
    /**
     * 
     * @type {GenreModel}
     * @memberof SongModel
     */
    genre?: GenreModel;
    /**
     * 
     * @type {UserModel}
     * @memberof SongModel
     */
    user?: UserModel;
    /**
     * 
     * @type {number}
     * @memberof SongModel
     */
    rating?: number | null;
}

export function SongModelFromJSON(json: any): SongModel {
    return SongModelFromJSONTyped(json, false);
}

export function SongModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): SongModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'title': !exists(json, 'title') ? undefined : json['title'],
        'artist': !exists(json, 'artist') ? undefined : json['artist'],
        'genre': !exists(json, 'genre') ? undefined : GenreModelFromJSON(json['genre']),
        'user': !exists(json, 'user') ? undefined : UserModelFromJSON(json['user']),
        'rating': !exists(json, 'rating') ? undefined : json['rating'],
    };
}

export function SongModelToJSON(value?: SongModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'artist': value.artist,
        'genre': GenreModelToJSON(value.genre),
        'user': UserModelToJSON(value.user),
        'rating': value.rating,
    };
}


