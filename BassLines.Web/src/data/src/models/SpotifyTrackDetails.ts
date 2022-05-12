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
    Image,
    ImageFromJSON,
    ImageFromJSONTyped,
    ImageToJSON,
} from './Image';
import {
    SpotifyAlbum,
    SpotifyAlbumFromJSON,
    SpotifyAlbumFromJSONTyped,
    SpotifyAlbumToJSON,
} from './SpotifyAlbum';
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
     * @type {Array<Image>}
     * @memberof SpotifyTrackDetails
     */
    images?: Array<Image> | null;
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
     * @type {SpotifyArtistDetails}
     * @memberof SpotifyTrackDetails
     */
    artistDetails?: SpotifyArtistDetails;
    /**
     * 
     * @type {SpotifyAlbum}
     * @memberof SpotifyTrackDetails
     */
    album?: SpotifyAlbum;
    /**
     * 
     * @type {TrackFeatures}
     * @memberof SpotifyTrackDetails
     */
    features?: TrackFeatures;
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
        'images': !exists(json, 'images') ? undefined : (json['images'] === null ? null : (json['images'] as Array<any>).map(ImageFromJSON)),
        'durationSeconds': !exists(json, 'durationSeconds') ? undefined : json['durationSeconds'],
        'explicit': !exists(json, 'explicit') ? undefined : json['explicit'],
        'popularity': !exists(json, 'popularity') ? undefined : json['popularity'],
        'spotifyId': !exists(json, 'spotifyId') ? undefined : json['spotifyId'],
        'artistDetails': !exists(json, 'artistDetails') ? undefined : SpotifyArtistDetailsFromJSON(json['artistDetails']),
        'album': !exists(json, 'album') ? undefined : SpotifyAlbumFromJSON(json['album']),
        'features': !exists(json, 'features') ? undefined : TrackFeaturesFromJSON(json['features']),
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
        'images': value.images === undefined ? undefined : (value.images === null ? null : (value.images as Array<any>).map(ImageToJSON)),
        'durationSeconds': value.durationSeconds,
        'explicit': value.explicit,
        'popularity': value.popularity,
        'spotifyId': value.spotifyId,
        'artistDetails': SpotifyArtistDetailsToJSON(value.artistDetails),
        'album': SpotifyAlbumToJSON(value.album),
        'features': TrackFeaturesToJSON(value.features),
    };
}

