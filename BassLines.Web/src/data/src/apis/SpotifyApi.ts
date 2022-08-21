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


import * as runtime from '../runtime';
import {
    AddTracksToPlaylistRequest,
    AddTracksToPlaylistRequestFromJSON,
    AddTracksToPlaylistRequestToJSON,
    ArtistDetails,
    ArtistDetailsFromJSON,
    ArtistDetailsToJSON,
    CreatePlaylistRequest,
    CreatePlaylistRequestFromJSON,
    CreatePlaylistRequestToJSON,
    MyDevices,
    MyDevicesFromJSON,
    MyDevicesToJSON,
    PlayContextRequest,
    PlayContextRequestFromJSON,
    PlayContextRequestToJSON,
    PlaylistTrackSearchRoot,
    PlaylistTrackSearchRootFromJSON,
    PlaylistTrackSearchRootToJSON,
    SongBaseWithImages,
    SongBaseWithImagesFromJSON,
    SongBaseWithImagesToJSON,
    SpotifyPlaybackState,
    SpotifyPlaybackStateFromJSON,
    SpotifyPlaybackStateToJSON,
    SpotifyPlaylist,
    SpotifyPlaylistFromJSON,
    SpotifyPlaylistToJSON,
    SpotifyProfile,
    SpotifyProfileFromJSON,
    SpotifyProfileToJSON,
    SpotifyTrack,
    SpotifyTrackFromJSON,
    SpotifyTrackToJSON,
    SpotifyTrackDetails,
    SpotifyTrackDetailsFromJSON,
    SpotifyTrackDetailsToJSON,
    TrackSavedReference,
    TrackSavedReferenceFromJSON,
    TrackSavedReferenceToJSON,
    TransferStateRequest,
    TransferStateRequestFromJSON,
    TransferStateRequestToJSON,
} from '../models';

export interface ApiSpotifyAddSongsToPlaylistPostRequest {
    addTracksToPlaylistRequest?: AddTracksToPlaylistRequest;
}

export interface ApiSpotifyAddToQueueSpotifyIdPostRequest {
    spotifyId: string;
}

export interface ApiSpotifyArtistsFromTrackIdsPostRequest {
    requestBody?: Array<string>;
}

export interface ApiSpotifyCheckSavedPostRequest {
    requestBody?: Array<string>;
}

export interface ApiSpotifyCreatePlaylistPostRequest {
    createPlaylistRequest?: CreatePlaylistRequest;
}

export interface ApiSpotifyModelGetRequest {
    code?: string;
}

export interface ApiSpotifyNextOrPreviousNextOrPreviousPostRequest {
    nextOrPrevious: string;
}

export interface ApiSpotifyPlayPutRequest {
    playContextRequest?: PlayContextRequest;
}

export interface ApiSpotifyPlayerPutRequest {
    transferStateRequest?: TransferStateRequest;
}

export interface ApiSpotifyPlaylistTracksPlaylistIdDeleteRequest {
    playlistId: string;
    trackUri?: string;
}

export interface ApiSpotifyPlaylistTracksPlaylistIdGetRequest {
    playlistId: string;
    page?: number;
}

export interface ApiSpotifyPlaylistsGetRequest {
    basslinesOnly?: boolean;
}

export interface ApiSpotifySaveOrRemoveIdPutRequest {
    id: string;
    save?: boolean;
}

export interface ApiSpotifySearchArtistGetRequest {
    query?: string;
    pageSize?: number;
}

export interface ApiSpotifySearchGetRequest {
    query?: string;
}

export interface ApiSpotifyShufflePutRequest {
    shuffle?: boolean;
}

export interface ApiSpotifyTrackIdDetailsGetRequest {
    id: string;
}

export interface ApiSpotifyTrackIdGetRequest {
    id: string;
}

export interface ApiSpotifyTracksPostRequest {
    requestBody?: Array<string>;
}

export interface ApiSpotifyUpdatePlaylistPutRequest {
    createPlaylistRequest?: CreatePlaylistRequest;
}

/**
 * 
 */
export class SpotifyApi extends runtime.BaseAPI {

    /**
     */
    async apiSpotifyAddSongsToPlaylistPostRaw(requestParameters: ApiSpotifyAddSongsToPlaylistPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Spotify/add-songs-to-playlist`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AddTracksToPlaylistRequestToJSON(requestParameters.addTracksToPlaylistRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyAddSongsToPlaylistPost(requestParameters: ApiSpotifyAddSongsToPlaylistPostRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyAddSongsToPlaylistPostRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiSpotifyAddToQueueSpotifyIdPostRaw(requestParameters: ApiSpotifyAddToQueueSpotifyIdPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.spotifyId === null || requestParameters.spotifyId === undefined) {
            throw new runtime.RequiredError('spotifyId','Required parameter requestParameters.spotifyId was null or undefined when calling apiSpotifyAddToQueueSpotifyIdPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/add-to-queue/{spotifyId}`.replace(`{${"spotifyId"}}`, encodeURIComponent(String(requestParameters.spotifyId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyAddToQueueSpotifyIdPost(requestParameters: ApiSpotifyAddToQueueSpotifyIdPostRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyAddToQueueSpotifyIdPostRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiSpotifyArtistsFromTrackIdsPostRaw(requestParameters: ApiSpotifyArtistsFromTrackIdsPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<ArtistDetails>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Spotify/artists-from-trackIds`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ArtistDetailsFromJSON));
    }

    /**
     */
    async apiSpotifyArtistsFromTrackIdsPost(requestParameters: ApiSpotifyArtistsFromTrackIdsPostRequest, initOverrides?: RequestInit): Promise<Array<ArtistDetails>> {
        const response = await this.apiSpotifyArtistsFromTrackIdsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyCheckSavedPostRaw(requestParameters: ApiSpotifyCheckSavedPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<TrackSavedReference>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Spotify/check-saved`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TrackSavedReferenceFromJSON));
    }

    /**
     */
    async apiSpotifyCheckSavedPost(requestParameters: ApiSpotifyCheckSavedPostRequest, initOverrides?: RequestInit): Promise<Array<TrackSavedReference>> {
        const response = await this.apiSpotifyCheckSavedPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyCreatePlaylistPostRaw(requestParameters: ApiSpotifyCreatePlaylistPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<SpotifyPlaylist>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Spotify/create-playlist`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreatePlaylistRequestToJSON(requestParameters.createPlaylistRequest),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SpotifyPlaylistFromJSON(jsonValue));
    }

    /**
     */
    async apiSpotifyCreatePlaylistPost(requestParameters: ApiSpotifyCreatePlaylistPostRequest, initOverrides?: RequestInit): Promise<SpotifyPlaylist> {
        const response = await this.apiSpotifyCreatePlaylistPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyDevicesGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<MyDevices>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/devices`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MyDevicesFromJSON(jsonValue));
    }

    /**
     */
    async apiSpotifyDevicesGet(initOverrides?: RequestInit): Promise<MyDevices> {
        const response = await this.apiSpotifyDevicesGetRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     */
    async apiSpotifyGet(initOverrides?: RequestInit): Promise<string> {
        const response = await this.apiSpotifyGetRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyMeGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<SpotifyProfile>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/me`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SpotifyProfileFromJSON(jsonValue));
    }

    /**
     */
    async apiSpotifyMeGet(initOverrides?: RequestInit): Promise<SpotifyProfile> {
        const response = await this.apiSpotifyMeGetRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyModelGetRaw(requestParameters: ApiSpotifyModelGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        if (requestParameters.code !== undefined) {
            queryParameters['code'] = requestParameters.code;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/model`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyModelGet(requestParameters: ApiSpotifyModelGetRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyModelGetRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiSpotifyNextOrPreviousNextOrPreviousPostRaw(requestParameters: ApiSpotifyNextOrPreviousNextOrPreviousPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.nextOrPrevious === null || requestParameters.nextOrPrevious === undefined) {
            throw new runtime.RequiredError('nextOrPrevious','Required parameter requestParameters.nextOrPrevious was null or undefined when calling apiSpotifyNextOrPreviousNextOrPreviousPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/next-or-previous/{nextOrPrevious}`.replace(`{${"nextOrPrevious"}}`, encodeURIComponent(String(requestParameters.nextOrPrevious))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyNextOrPreviousNextOrPreviousPost(requestParameters: ApiSpotifyNextOrPreviousNextOrPreviousPostRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyNextOrPreviousNextOrPreviousPostRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiSpotifyPausePutRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/pause`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyPausePut(initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyPausePutRaw(initOverrides);
    }

    /**
     */
    async apiSpotifyPlayPutRaw(requestParameters: ApiSpotifyPlayPutRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Spotify/play`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: PlayContextRequestToJSON(requestParameters.playContextRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyPlayPut(requestParameters: ApiSpotifyPlayPutRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyPlayPutRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiSpotifyPlaybackStateGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<SpotifyPlaybackState>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/playback-state`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SpotifyPlaybackStateFromJSON(jsonValue));
    }

    /**
     */
    async apiSpotifyPlaybackStateGet(initOverrides?: RequestInit): Promise<SpotifyPlaybackState> {
        const response = await this.apiSpotifyPlaybackStateGetRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyPlayerPutRaw(requestParameters: ApiSpotifyPlayerPutRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Spotify/player`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: TransferStateRequestToJSON(requestParameters.transferStateRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyPlayerPut(requestParameters: ApiSpotifyPlayerPutRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyPlayerPutRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiSpotifyPlaylistTracksPlaylistIdDeleteRaw(requestParameters: ApiSpotifyPlaylistTracksPlaylistIdDeleteRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.playlistId === null || requestParameters.playlistId === undefined) {
            throw new runtime.RequiredError('playlistId','Required parameter requestParameters.playlistId was null or undefined when calling apiSpotifyPlaylistTracksPlaylistIdDelete.');
        }

        const queryParameters: any = {};

        if (requestParameters.trackUri !== undefined) {
            queryParameters['trackUri'] = requestParameters.trackUri;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/playlist-tracks/{playlistId}`.replace(`{${"playlistId"}}`, encodeURIComponent(String(requestParameters.playlistId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyPlaylistTracksPlaylistIdDelete(requestParameters: ApiSpotifyPlaylistTracksPlaylistIdDeleteRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyPlaylistTracksPlaylistIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiSpotifyPlaylistTracksPlaylistIdGetRaw(requestParameters: ApiSpotifyPlaylistTracksPlaylistIdGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<PlaylistTrackSearchRoot>> {
        if (requestParameters.playlistId === null || requestParameters.playlistId === undefined) {
            throw new runtime.RequiredError('playlistId','Required parameter requestParameters.playlistId was null or undefined when calling apiSpotifyPlaylistTracksPlaylistIdGet.');
        }

        const queryParameters: any = {};

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/playlist-tracks/{playlistId}`.replace(`{${"playlistId"}}`, encodeURIComponent(String(requestParameters.playlistId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PlaylistTrackSearchRootFromJSON(jsonValue));
    }

    /**
     */
    async apiSpotifyPlaylistTracksPlaylistIdGet(requestParameters: ApiSpotifyPlaylistTracksPlaylistIdGetRequest, initOverrides?: RequestInit): Promise<PlaylistTrackSearchRoot> {
        const response = await this.apiSpotifyPlaylistTracksPlaylistIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyPlaylistsGetRaw(requestParameters: ApiSpotifyPlaylistsGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<SpotifyPlaylist>>> {
        const queryParameters: any = {};

        if (requestParameters.basslinesOnly !== undefined) {
            queryParameters['basslinesOnly'] = requestParameters.basslinesOnly;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/playlists`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(SpotifyPlaylistFromJSON));
    }

    /**
     */
    async apiSpotifyPlaylistsGet(requestParameters: ApiSpotifyPlaylistsGetRequest, initOverrides?: RequestInit): Promise<Array<SpotifyPlaylist>> {
        const response = await this.apiSpotifyPlaylistsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyRefreshGetRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/refresh`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyRefreshGet(initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyRefreshGetRaw(initOverrides);
    }

    /**
     */
    async apiSpotifySaveOrRemoveIdPutRaw(requestParameters: ApiSpotifySaveOrRemoveIdPutRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<TrackSavedReference>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling apiSpotifySaveOrRemoveIdPut.');
        }

        const queryParameters: any = {};

        if (requestParameters.save !== undefined) {
            queryParameters['save'] = requestParameters.save;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/save-or-remove/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TrackSavedReferenceFromJSON(jsonValue));
    }

    /**
     */
    async apiSpotifySaveOrRemoveIdPut(requestParameters: ApiSpotifySaveOrRemoveIdPutRequest, initOverrides?: RequestInit): Promise<TrackSavedReference> {
        const response = await this.apiSpotifySaveOrRemoveIdPutRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifySearchArtistGetRaw(requestParameters: ApiSpotifySearchArtistGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<ArtistDetails>> {
        const queryParameters: any = {};

        if (requestParameters.query !== undefined) {
            queryParameters['query'] = requestParameters.query;
        }

        if (requestParameters.pageSize !== undefined) {
            queryParameters['pageSize'] = requestParameters.pageSize;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/search/artist`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ArtistDetailsFromJSON(jsonValue));
    }

    /**
     */
    async apiSpotifySearchArtistGet(requestParameters: ApiSpotifySearchArtistGetRequest, initOverrides?: RequestInit): Promise<ArtistDetails> {
        const response = await this.apiSpotifySearchArtistGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifySearchGetRaw(requestParameters: ApiSpotifySearchGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<SongBaseWithImages>>> {
        const queryParameters: any = {};

        if (requestParameters.query !== undefined) {
            queryParameters['query'] = requestParameters.query;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/search`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(SongBaseWithImagesFromJSON));
    }

    /**
     */
    async apiSpotifySearchGet(requestParameters: ApiSpotifySearchGetRequest, initOverrides?: RequestInit): Promise<Array<SongBaseWithImages>> {
        const response = await this.apiSpotifySearchGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyShufflePutRaw(requestParameters: ApiSpotifyShufflePutRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        if (requestParameters.shuffle !== undefined) {
            queryParameters['shuffle'] = requestParameters.shuffle;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/shuffle`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyShufflePut(requestParameters: ApiSpotifyShufflePutRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyShufflePutRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiSpotifyTrackIdDetailsGetRaw(requestParameters: ApiSpotifyTrackIdDetailsGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<SpotifyTrackDetails>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling apiSpotifyTrackIdDetailsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/track/{id}/details`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SpotifyTrackDetailsFromJSON(jsonValue));
    }

    /**
     */
    async apiSpotifyTrackIdDetailsGet(requestParameters: ApiSpotifyTrackIdDetailsGetRequest, initOverrides?: RequestInit): Promise<SpotifyTrackDetails> {
        const response = await this.apiSpotifyTrackIdDetailsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyTrackIdGetRaw(requestParameters: ApiSpotifyTrackIdGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<SpotifyTrack>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling apiSpotifyTrackIdGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/Spotify/track/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SpotifyTrackFromJSON(jsonValue));
    }

    /**
     */
    async apiSpotifyTrackIdGet(requestParameters: ApiSpotifyTrackIdGetRequest, initOverrides?: RequestInit): Promise<SpotifyTrack> {
        const response = await this.apiSpotifyTrackIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyTracksPostRaw(requestParameters: ApiSpotifyTracksPostRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Array<SpotifyTrackDetails>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Spotify/tracks`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(SpotifyTrackDetailsFromJSON));
    }

    /**
     */
    async apiSpotifyTracksPost(requestParameters: ApiSpotifyTracksPostRequest, initOverrides?: RequestInit): Promise<Array<SpotifyTrackDetails>> {
        const response = await this.apiSpotifyTracksPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiSpotifyUpdatePlaylistPutRaw(requestParameters: ApiSpotifyUpdatePlaylistPutRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/Spotify/update-playlist`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: CreatePlaylistRequestToJSON(requestParameters.createPlaylistRequest),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiSpotifyUpdatePlaylistPut(requestParameters: ApiSpotifyUpdatePlaylistPutRequest, initOverrides?: RequestInit): Promise<void> {
        await this.apiSpotifyUpdatePlaylistPutRaw(requestParameters, initOverrides);
    }

}
