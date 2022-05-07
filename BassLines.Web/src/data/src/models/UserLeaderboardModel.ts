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
 * @interface UserLeaderboardModel
 */
export interface UserLeaderboardModel {
    /**
     * 
     * @type {string}
     * @memberof UserLeaderboardModel
     */
    name?: string | null;
    /**
     * 
     * @type {number}
     * @memberof UserLeaderboardModel
     */
    average?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UserLeaderboardModel
     */
    uniqueGenres?: number;
    /**
     * 
     * @type {string}
     * @memberof UserLeaderboardModel
     */
    highestRatedSong?: string | null;
    /**
     * 
     * @type {number}
     * @memberof UserLeaderboardModel
     */
    highestRating?: number | null;
    /**
     * 
     * @type {string}
     * @memberof UserLeaderboardModel
     */
    lowestRatedSong?: string | null;
    /**
     * 
     * @type {number}
     * @memberof UserLeaderboardModel
     */
    lowestRating?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UserLeaderboardModel
     */
    daysWon?: number;
    /**
     * 
     * @type {string}
     * @memberof UserLeaderboardModel
     */
    mostLikedSong?: string | null;
    /**
     * 
     * @type {number}
     * @memberof UserLeaderboardModel
     */
    likesOnMostLikedSong?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UserLeaderboardModel
     */
    numberOfLikes?: number;
    /**
     * 
     * @type {number}
     * @memberof UserLeaderboardModel
     */
    songsAdded?: number;
    medalsEarned?: number;
    /**
     * 
     * @type {number}
     * @memberof UserLeaderboardModel
     */
    submissionsCount?: number;
}

export function UserLeaderboardModelFromJSON(json: any): UserLeaderboardModel {
    return UserLeaderboardModelFromJSONTyped(json, false);
}

export function UserLeaderboardModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserLeaderboardModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'average': !exists(json, 'average') ? undefined : json['average'],
        'uniqueGenres': !exists(json, 'uniqueGenres') ? undefined : json['uniqueGenres'],
        'highestRatedSong': !exists(json, 'highestRatedSong') ? undefined : json['highestRatedSong'],
        'highestRating': !exists(json, 'highestRating') ? undefined : json['highestRating'],
        'lowestRatedSong': !exists(json, 'lowestRatedSong') ? undefined : json['lowestRatedSong'],
        'lowestRating': !exists(json, 'lowestRating') ? undefined : json['lowestRating'],
        'daysWon': !exists(json, 'daysWon') ? undefined : json['daysWon'],
        'mostLikedSong': !exists(json, 'mostLikedSong') ? undefined : json['mostLikedSong'],
        'likesOnMostLikedSong': !exists(json, 'likesOnMostLikedSong') ? undefined : json['likesOnMostLikedSong'],
        'numberOfLikes': !exists(json, 'numberOfLikes') ? undefined : json['numberOfLikes'],
        'songsAdded': !exists(json, 'songsAdded') ? undefined : json['songsAdded'],
        'medalsEarned': !exists(json, 'medalsEarned') ? undefined : json['medalsEarned'],
        'submissionsCount': !exists(json, 'submissionsCount') ? undefined : json['submissionsCount'],
    };
}

export function UserLeaderboardModelToJSON(value?: UserLeaderboardModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'average': value.average,
        'uniqueGenres': value.uniqueGenres,
        'highestRatedSong': value.highestRatedSong,
        'highestRating': value.highestRating,
        'lowestRatedSong': value.lowestRatedSong,
        'lowestRating': value.lowestRating,
        'daysWon': value.daysWon,
        'mostLikedSong': value.mostLikedSong,
        'likesOnMostLikedSong': value.likesOnMostLikedSong,
        'numberOfLikes': value.numberOfLikes,
        'songsAdded': value.songsAdded,
        'medalsEarned': value.medalsEarned,
        'submissionsCount': value.submissionsCount,
    };
}

