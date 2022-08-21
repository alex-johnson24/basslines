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
    AddedBy,
    AddedByFromJSON,
    AddedByFromJSONTyped,
    AddedByToJSON,
} from './AddedBy';
import {
    TrackDetails,
    TrackDetailsFromJSON,
    TrackDetailsFromJSONTyped,
    TrackDetailsToJSON,
} from './TrackDetails';
import {
    VideoThumbnail,
    VideoThumbnailFromJSON,
    VideoThumbnailFromJSONTyped,
    VideoThumbnailToJSON,
} from './VideoThumbnail';

/**
 * 
 * @export
 * @interface PlaylistTrack
 */
export interface PlaylistTrack {
    /**
     * 
     * @type {Date}
     * @memberof PlaylistTrack
     */
    addedAt?: Date;
    /**
     * 
     * @type {AddedBy}
     * @memberof PlaylistTrack
     */
    addedBy?: AddedBy;
    /**
     * 
     * @type {boolean}
     * @memberof PlaylistTrack
     */
    isLocal?: boolean;
    /**
     * 
     * @type {any}
     * @memberof PlaylistTrack
     */
    primaryColor?: any | null;
    /**
     * 
     * @type {TrackDetails}
     * @memberof PlaylistTrack
     */
    track?: TrackDetails;
    /**
     * 
     * @type {VideoThumbnail}
     * @memberof PlaylistTrack
     */
    videoThumbnail?: VideoThumbnail;
}

export function PlaylistTrackFromJSON(json: any): PlaylistTrack {
    return PlaylistTrackFromJSONTyped(json, false);
}

export function PlaylistTrackFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaylistTrack {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'addedAt': !exists(json, 'added_at') ? undefined : (new Date(json['added_at'])),
        'addedBy': !exists(json, 'added_by') ? undefined : AddedByFromJSON(json['added_by']),
        'isLocal': !exists(json, 'is_local') ? undefined : json['is_local'],
        'primaryColor': !exists(json, 'primary_color') ? undefined : json['primary_color'],
        'track': !exists(json, 'track') ? undefined : TrackDetailsFromJSON(json['track']),
        'videoThumbnail': !exists(json, 'video_thumbnail') ? undefined : VideoThumbnailFromJSON(json['video_thumbnail']),
    };
}

export function PlaylistTrackToJSON(value?: PlaylistTrack | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'added_at': value.addedAt === undefined ? undefined : (value.addedAt.toISOString()),
        'added_by': AddedByToJSON(value.addedBy),
        'is_local': value.isLocal,
        'primary_color': value.primaryColor,
        'track': TrackDetailsToJSON(value.track),
        'video_thumbnail': VideoThumbnailToJSON(value.videoThumbnail),
    };
}

