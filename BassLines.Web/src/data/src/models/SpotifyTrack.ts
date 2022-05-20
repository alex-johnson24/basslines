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
    SpotifyAlbum,
    SpotifyAlbumFromJSON,
    SpotifyAlbumFromJSONTyped,
    SpotifyAlbumToJSON,
} from './SpotifyAlbum';
import {
    SpotifyBase,
    SpotifyBaseFromJSON,
    SpotifyBaseFromJSONTyped,
    SpotifyBaseToJSON,
} from './SpotifyBase';

/**
 * 
 * @export
 * @interface SpotifyTrack
 */
export interface SpotifyTrack {
    /**
     * 
     * @type {string}
     * @memberof SpotifyTrack
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof SpotifyTrack
     */
    artist: string;
    /**
     * 
     * @type {string}
     * @memberof SpotifyTrack
     */
    link?: string | null;
    /**
     * 
     * @type {number}
     * @memberof SpotifyTrack
     */
    durationSeconds?: number | null;
    /**
     * 
     * @type {boolean}
     * @memberof SpotifyTrack
     */
    explicit?: boolean | null;
    /**
     * 
     * @type {number}
     * @memberof SpotifyTrack
     */
    popularity?: number | null;
    /**
     * 
     * @type {string}
     * @memberof SpotifyTrack
     */
    spotifyId?: string | null;
    /**
     * 
     * @type {SpotifyAlbum}
     * @memberof SpotifyTrack
     */
    album?: SpotifyAlbum;
    /**
     * 
     * @type {SpotifyBase}
     * @memberof SpotifyTrack
     */
    artistDetails?: SpotifyBase;
}

export function SpotifyTrackFromJSON(json: any): SpotifyTrack {
    return SpotifyTrackFromJSONTyped(json, false);
}

export function SpotifyTrackFromJSONTyped(json: any, ignoreDiscriminator: boolean): SpotifyTrack {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'title': json['title'],
        'artist': json['artist'],
        'link': !exists(json, 'link') ? undefined : json['link'],
        'durationSeconds': !exists(json, 'durationSeconds') ? undefined : json['durationSeconds'],
        'explicit': !exists(json, 'explicit') ? undefined : json['explicit'],
        'popularity': !exists(json, 'popularity') ? undefined : json['popularity'],
        'spotifyId': !exists(json, 'spotifyId') ? undefined : json['spotifyId'],
        'album': !exists(json, 'album') ? undefined : SpotifyAlbumFromJSON(json['album']),
        'artistDetails': !exists(json, 'artistDetails') ? undefined : SpotifyBaseFromJSON(json['artistDetails']),
    };
}

export function SpotifyTrackToJSON(value?: SpotifyTrack | null): any {
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
        'durationSeconds': value.durationSeconds,
        'explicit': value.explicit,
        'popularity': value.popularity,
        'spotifyId': value.spotifyId,
        'album': SpotifyAlbumToJSON(value.album),
        'artistDetails': SpotifyBaseToJSON(value.artistDetails),
    };
}

