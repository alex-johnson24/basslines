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
 * @interface TrackFeatures
 */
export interface TrackFeatures {
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    danceability?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    energy?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    key?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    loudness?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    mode?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    speechiness?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    acousticness?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    instrumentalness?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    liveness?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    valence?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    tempo?: number | null;
    /**
     * 
     * @type {string}
     * @memberof TrackFeatures
     */
    type?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TrackFeatures
     */
    id?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TrackFeatures
     */
    uri?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TrackFeatures
     */
    trackHref?: string | null;
    /**
     * 
     * @type {string}
     * @memberof TrackFeatures
     */
    analysisUrl?: string | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    durationMs?: number | null;
    /**
     * 
     * @type {number}
     * @memberof TrackFeatures
     */
    timeSignature?: number | null;
}

export function TrackFeaturesFromJSON(json: any): TrackFeatures {
    return TrackFeaturesFromJSONTyped(json, false);
}

export function TrackFeaturesFromJSONTyped(json: any, ignoreDiscriminator: boolean): TrackFeatures {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'danceability': !exists(json, 'danceability') ? undefined : json['danceability'],
        'energy': !exists(json, 'energy') ? undefined : json['energy'],
        'key': !exists(json, 'key') ? undefined : json['key'],
        'loudness': !exists(json, 'loudness') ? undefined : json['loudness'],
        'mode': !exists(json, 'mode') ? undefined : json['mode'],
        'speechiness': !exists(json, 'speechiness') ? undefined : json['speechiness'],
        'acousticness': !exists(json, 'acousticness') ? undefined : json['acousticness'],
        'instrumentalness': !exists(json, 'instrumentalness') ? undefined : json['instrumentalness'],
        'liveness': !exists(json, 'liveness') ? undefined : json['liveness'],
        'valence': !exists(json, 'valence') ? undefined : json['valence'],
        'tempo': !exists(json, 'tempo') ? undefined : json['tempo'],
        'type': !exists(json, 'type') ? undefined : json['type'],
        'id': !exists(json, 'id') ? undefined : json['id'],
        'uri': !exists(json, 'uri') ? undefined : json['uri'],
        'trackHref': !exists(json, 'track_href') ? undefined : json['track_href'],
        'analysisUrl': !exists(json, 'analysis_url') ? undefined : json['analysis_url'],
        'durationMs': !exists(json, 'duration_ms') ? undefined : json['duration_ms'],
        'timeSignature': !exists(json, 'time_signature') ? undefined : json['time_signature'],
    };
}

export function TrackFeaturesToJSON(value?: TrackFeatures | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'danceability': value.danceability,
        'energy': value.energy,
        'key': value.key,
        'loudness': value.loudness,
        'mode': value.mode,
        'speechiness': value.speechiness,
        'acousticness': value.acousticness,
        'instrumentalness': value.instrumentalness,
        'liveness': value.liveness,
        'valence': value.valence,
        'tempo': value.tempo,
        'type': value.type,
        'id': value.id,
        'uri': value.uri,
        'track_href': value.trackHref,
        'analysis_url': value.analysisUrl,
        'duration_ms': value.durationMs,
        'time_signature': value.timeSignature,
    };
}

