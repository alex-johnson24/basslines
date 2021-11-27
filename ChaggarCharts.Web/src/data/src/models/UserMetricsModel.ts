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
    ArtistCountModel,
    ArtistCountModelFromJSON,
    ArtistCountModelFromJSONTyped,
    ArtistCountModelToJSON,
    DailyRatingModel,
    DailyRatingModelFromJSON,
    DailyRatingModelFromJSONTyped,
    DailyRatingModelToJSON,
    GenreCountModel,
    GenreCountModelFromJSON,
    GenreCountModelFromJSONTyped,
    GenreCountModelToJSON,
} from './';

/**
 * 
 * @export
 * @interface UserMetricsModel
 */
export interface UserMetricsModel {
    /**
     * 
     * @type {Array<DailyRatingModel>}
     * @memberof UserMetricsModel
     */
    dailyRatings?: Array<DailyRatingModel> | null;
    /**
     * 
     * @type {Array<GenreCountModel>}
     * @memberof UserMetricsModel
     */
    topGenres?: Array<GenreCountModel> | null;
    /**
     * 
     * @type {Array<DailyRatingModel>}
     * @memberof UserMetricsModel
     */
    topSongs?: Array<DailyRatingModel> | null;
    /**
     * 
     * @type {Array<ArtistCountModel>}
     * @memberof UserMetricsModel
     */
    topArtists?: Array<ArtistCountModel> | null;
    /**
     * 
     * @type {number}
     * @memberof UserMetricsModel
     */
    averageRating?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UserMetricsModel
     */
    songSubmissionCount?: number;
    /**
     * 
     * @type {number}
     * @memberof UserMetricsModel
     */
    uniqueArtistCount?: number;
    /**
     * 
     * @type {number}
     * @memberof UserMetricsModel
     */
    uniqueGenreCount?: number;
}

export function UserMetricsModelFromJSON(json: any): UserMetricsModel {
    return UserMetricsModelFromJSONTyped(json, false);
}

export function UserMetricsModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserMetricsModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'dailyRatings': !exists(json, 'dailyRatings') ? undefined : (json['dailyRatings'] === null ? null : (json['dailyRatings'] as Array<any>).map(DailyRatingModelFromJSON)),
        'topGenres': !exists(json, 'topGenres') ? undefined : (json['topGenres'] === null ? null : (json['topGenres'] as Array<any>).map(GenreCountModelFromJSON)),
        'topSongs': !exists(json, 'topSongs') ? undefined : (json['topSongs'] === null ? null : (json['topSongs'] as Array<any>).map(DailyRatingModelFromJSON)),
        'topArtists': !exists(json, 'topArtists') ? undefined : (json['topArtists'] === null ? null : (json['topArtists'] as Array<any>).map(ArtistCountModelFromJSON)),
        'averageRating': !exists(json, 'averageRating') ? undefined : json['averageRating'],
        'songSubmissionCount': !exists(json, 'songSubmissionCount') ? undefined : json['songSubmissionCount'],
        'uniqueArtistCount': !exists(json, 'uniqueArtistCount') ? undefined : json['uniqueArtistCount'],
        'uniqueGenreCount': !exists(json, 'uniqueGenreCount') ? undefined : json['uniqueGenreCount'],
    };
}

export function UserMetricsModelToJSON(value?: UserMetricsModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'dailyRatings': value.dailyRatings === undefined ? undefined : (value.dailyRatings === null ? null : (value.dailyRatings as Array<any>).map(DailyRatingModelToJSON)),
        'topGenres': value.topGenres === undefined ? undefined : (value.topGenres === null ? null : (value.topGenres as Array<any>).map(GenreCountModelToJSON)),
        'topSongs': value.topSongs === undefined ? undefined : (value.topSongs === null ? null : (value.topSongs as Array<any>).map(DailyRatingModelToJSON)),
        'topArtists': value.topArtists === undefined ? undefined : (value.topArtists === null ? null : (value.topArtists as Array<any>).map(ArtistCountModelToJSON)),
        'averageRating': value.averageRating,
        'songSubmissionCount': value.songSubmissionCount,
        'uniqueArtistCount': value.uniqueArtistCount,
        'uniqueGenreCount': value.uniqueGenreCount,
    };
}

