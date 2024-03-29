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
    SpotifyAlbumDetails,
    SpotifyAlbumDetailsFromJSON,
    SpotifyAlbumDetailsFromJSONTyped,
    SpotifyAlbumDetailsToJSON,
} from './SpotifyAlbumDetails';
import {
    SpotifyAlbumTrack,
    SpotifyAlbumTrackFromJSON,
    SpotifyAlbumTrackFromJSONTyped,
    SpotifyAlbumTrackToJSON,
} from './SpotifyAlbumTrack';
import {
    SpotifyArtistDetails,
    SpotifyArtistDetailsFromJSON,
    SpotifyArtistDetailsFromJSONTyped,
    SpotifyArtistDetailsToJSON,
} from './SpotifyArtistDetails';
import {
    TrackFeatures,
    TrackFeaturesFromJSON,
    TrackFeaturesFromJSONTyped,
    TrackFeaturesToJSON,
} from './TrackFeatures';

/**
 * 
 * @export
 * @interface SpotifyTrackDetails
 */
export interface SpotifyTrackDetails {
    /**
     * 
     * @type {string}
     * @memberof SpotifyTrackDetails
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof SpotifyTrackDetails
     */
    artist: string;
    /**
     * 
     * @type {string}
     * @memberof SpotifyTrackDetails
     */
    link?: string | null;
    /**
     * 
     * @type {number}
     * @memberof SpotifyTrackDetails
     */
    durationSeconds?: number | null;
    /**
     * 
     * @type {boolean}
     * @memberof SpotifyTrackDetails
     */
    explicit?: boolean | null;
    /**
     * 
     * @type {number}
     * @memberof SpotifyTrackDetails
     */
    popularity?: number | null;
    /**
     * 
     * @type {string}
     * @memberof SpotifyTrackDetails
     */
    spotifyId?: string | null;
    /**
     * 
     * @type {SpotifyAlbumDetails}
     * @memberof SpotifyTrackDetails
     */
    album?: SpotifyAlbumDetails;
    /**
     * 
     * @type {SpotifyArtistDetails}
     * @memberof SpotifyTrackDetails
     */
    artistDetails?: SpotifyArtistDetails;
    /**
     * 
     * @type {TrackFeatures}
     * @memberof SpotifyTrackDetails
     */
    features?: TrackFeatures;
    /**
     * 
     * @type {Array<SpotifyAlbumTrack>}
     * @memberof SpotifyTrackDetails
     */
    recommendedTracks?: Array<SpotifyAlbumTrack> | null;
}

export function SpotifyTrackDetailsFromJSON(json: any): SpotifyTrackDetails {
    return SpotifyTrackDetailsFromJSONTyped(json, false);
}

export function SpotifyTrackDetailsFromJSONTyped(json: any, ignoreDiscriminator: boolean): SpotifyTrackDetails {
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
        'album': !exists(json, 'album') ? undefined : SpotifyAlbumDetailsFromJSON(json['album']),
        'artistDetails': !exists(json, 'artistDetails') ? undefined : SpotifyArtistDetailsFromJSON(json['artistDetails']),
        'features': !exists(json, 'features') ? undefined : TrackFeaturesFromJSON(json['features']),
        'recommendedTracks': !exists(json, 'recommendedTracks') ? undefined : (json['recommendedTracks'] === null ? null : (json['recommendedTracks'] as Array<any>).map(SpotifyAlbumTrackFromJSON)),
    };
}

export function SpotifyTrackDetailsToJSON(value?: SpotifyTrackDetails | null): any {
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
        'album': SpotifyAlbumDetailsToJSON(value.album),
        'artistDetails': SpotifyArtistDetailsToJSON(value.artistDetails),
        'features': TrackFeaturesToJSON(value.features),
        'recommendedTracks': value.recommendedTracks === undefined ? undefined : (value.recommendedTracks === null ? null : (value.recommendedTracks as Array<any>).map(SpotifyAlbumTrackToJSON)),
    };
}

