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
    Actions,
    ActionsFromJSON,
    ActionsFromJSONTyped,
    ActionsToJSON,
} from './Actions';
import {
    Context,
    ContextFromJSON,
    ContextFromJSONTyped,
    ContextToJSON,
} from './Context';
import {
    Device,
    DeviceFromJSON,
    DeviceFromJSONTyped,
    DeviceToJSON,
} from './Device';
import {
    TrackDetails,
    TrackDetailsFromJSON,
    TrackDetailsFromJSONTyped,
    TrackDetailsToJSON,
} from './TrackDetails';

/**
 * 
 * @export
 * @interface SpotifyPlaybackState
 */
export interface SpotifyPlaybackState {
    /**
     * 
     * @type {Device}
     * @memberof SpotifyPlaybackState
     */
    device?: Device;
    /**
     * 
     * @type {string}
     * @memberof SpotifyPlaybackState
     */
    repeatState?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof SpotifyPlaybackState
     */
    shuffleState?: boolean;
    /**
     * 
     * @type {Context}
     * @memberof SpotifyPlaybackState
     */
    context?: Context;
    /**
     * 
     * @type {number}
     * @memberof SpotifyPlaybackState
     */
    timestamp?: number | null;
    /**
     * 
     * @type {number}
     * @memberof SpotifyPlaybackState
     */
    progressMs?: number | null;
    /**
     * 
     * @type {boolean}
     * @memberof SpotifyPlaybackState
     */
    isPlaying?: boolean;
    /**
     * 
     * @type {string}
     * @memberof SpotifyPlaybackState
     */
    currentlyPlayingType?: string | null;
    /**
     * 
     * @type {Actions}
     * @memberof SpotifyPlaybackState
     */
    actions?: Actions;
    /**
     * 
     * @type {TrackDetails}
     * @memberof SpotifyPlaybackState
     */
    item?: TrackDetails;
}

export function SpotifyPlaybackStateFromJSON(json: any): SpotifyPlaybackState {
    return SpotifyPlaybackStateFromJSONTyped(json, false);
}

export function SpotifyPlaybackStateFromJSONTyped(json: any, ignoreDiscriminator: boolean): SpotifyPlaybackState {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'device': !exists(json, 'device') ? undefined : DeviceFromJSON(json['device']),
        'repeatState': !exists(json, 'repeat_state') ? undefined : json['repeat_state'],
        'shuffleState': !exists(json, 'shuffle_state') ? undefined : json['shuffle_state'],
        'context': !exists(json, 'context') ? undefined : ContextFromJSON(json['context']),
        'timestamp': !exists(json, 'timestamp') ? undefined : json['timestamp'],
        'progressMs': !exists(json, 'progress_ms') ? undefined : json['progress_ms'],
        'isPlaying': !exists(json, 'is_playing') ? undefined : json['is_playing'],
        'currentlyPlayingType': !exists(json, 'currently_playing_type') ? undefined : json['currently_playing_type'],
        'actions': !exists(json, 'actions') ? undefined : ActionsFromJSON(json['actions']),
        'item': !exists(json, 'item') ? undefined : TrackDetailsFromJSON(json['item']),
    };
}

export function SpotifyPlaybackStateToJSON(value?: SpotifyPlaybackState | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'device': DeviceToJSON(value.device),
        'repeat_state': value.repeatState,
        'shuffle_state': value.shuffleState,
        'context': ContextToJSON(value.context),
        'timestamp': value.timestamp,
        'progress_ms': value.progressMs,
        'is_playing': value.isPlaying,
        'currently_playing_type': value.currentlyPlayingType,
        'actions': ActionsToJSON(value.actions),
        'item': TrackDetailsToJSON(value.item),
    };
}
