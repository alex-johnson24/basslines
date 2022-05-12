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
    GenreModel,
    GenreModelFromJSON,
    GenreModelFromJSONTyped,
    GenreModelToJSON,
} from './GenreModel';
import {
    Image,
    ImageFromJSON,
    ImageFromJSONTyped,
    ImageToJSON,
} from './Image';
import {
    LikeModel,
    LikeModelFromJSON,
    LikeModelFromJSONTyped,
    LikeModelToJSON,
} from './LikeModel';
import {
    UserModel,
    UserModelFromJSON,
    UserModelFromJSONTyped,
    UserModelToJSON,
} from './UserModel';

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
    title: string;
    /**
     * 
     * @type {string}
     * @memberof SongModel
     */
    artist: string;
    /**
     * 
     * @type {string}
     * @memberof SongModel
     */
    link?: string | null;
    /**
     * 
     * @type {Array<Image>}
     * @memberof SongModel
     */
    images?: Array<Image> | null;
    /**
     * 
     * @type {string}
     * @memberof SongModel
     */
    id?: string | null;
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
     * @type {UserModel}
     * @memberof SongModel
     */
    reviewer?: UserModel;
    /**
     * 
     * @type {number}
     * @memberof SongModel
     */
    rating?: number | null;
    /**
     * 
     * @type {Date}
     * @memberof SongModel
     */
    submitteddate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof SongModel
     */
    createdatetime?: Date | null;
    /**
     * 
     * @type {Array<LikeModel>}
     * @memberof SongModel
     */
    likes?: Array<LikeModel> | null;
}

export function SongModelFromJSON(json: any): SongModel {
    return SongModelFromJSONTyped(json, false);
}

export function SongModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): SongModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'title': json['title'],
        'artist': json['artist'],
        'link': !exists(json, 'link') ? undefined : json['link'],
        'images': !exists(json, 'images') ? undefined : (json['images'] === null ? null : (json['images'] as Array<any>).map(ImageFromJSON)),
        'id': !exists(json, 'id') ? undefined : json['id'],
        'genre': !exists(json, 'genre') ? undefined : GenreModelFromJSON(json['genre']),
        'user': !exists(json, 'user') ? undefined : UserModelFromJSON(json['user']),
        'reviewer': !exists(json, 'reviewer') ? undefined : UserModelFromJSON(json['reviewer']),
        'rating': !exists(json, 'rating') ? undefined : json['rating'],
        'submitteddate': !exists(json, 'submitteddate') ? undefined : (json['submitteddate'] === null ? null : new Date(json['submitteddate'])),
        'createdatetime': !exists(json, 'createdatetime') ? undefined : (json['createdatetime'] === null ? null : new Date(json['createdatetime'])),
        'likes': !exists(json, 'likes') ? undefined : (json['likes'] === null ? null : (json['likes'] as Array<any>).map(LikeModelFromJSON)),
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
        'link': value.link,
        'images': value.images === undefined ? undefined : (value.images === null ? null : (value.images as Array<any>).map(ImageToJSON)),
        'id': value.id,
        'genre': GenreModelToJSON(value.genre),
        'user': UserModelToJSON(value.user),
        'reviewer': UserModelToJSON(value.reviewer),
        'rating': value.rating,
        'submitteddate': value.submitteddate === undefined ? undefined : (value.submitteddate === null ? null : value.submitteddate.toISOString()),
        'createdatetime': value.createdatetime === undefined ? undefined : (value.createdatetime === null ? null : value.createdatetime.toISOString()),
        'likes': value.likes === undefined ? undefined : (value.likes === null ? null : (value.likes as Array<any>).map(LikeModelToJSON)),
    };
}

