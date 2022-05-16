export interface SpotifyPlayerState {
  timestamp?: number;
  context?: Context;
  duration?: number;
  paused?: boolean;
  shuffle?: boolean;
  position?: number;
  loading?: boolean;
  repeat_mode?: number;
  track_window?: TrackWindow;
  restrictions?: Restrictions;
  disallows?: Disallows;
  playback_id?: string;
  playback_quality?: string;
  playback_features?: PlaybackFeatures;
}
export interface Context {
  uri: string;
  metadata: Metadata;
}
export interface Metadata {
  name: string;
  uri: string;
  url: string;
  current_item: PreviousItemsEntityOrNextItemsEntityOrCurrentItem;
  previous_items?: PreviousItemsEntityOrNextItemsEntityOrCurrentItem[] | null;
  next_items?: PreviousItemsEntityOrNextItemsEntityOrCurrentItem[] | null;
  options: Options;
  restrictions: Restrictions1;
}
export interface PreviousItemsEntityOrNextItemsEntityOrCurrentItem {
  name: string;
  uri: string;
  url: string;
  uid: string;
  content_type: string;
  artists?: ArtistsEntityOrGroup[] | null;
  images?: ImagesEntity[] | null;
  estimated_duration: number;
  group: ArtistsEntityOrGroup;
}
export interface ArtistsEntityOrGroup {
  name: string;
  uri: string;
  url: string;
}
export interface ImagesEntity {
  url: string;
  height: number;
  width: number;
  size: string;
}
export interface Options {
  shuffled: boolean;
  repeat_mode: string;
}
export interface Restrictions1 {
  pause?: null[] | null;
  resume?: null[] | null;
  seek?: null[] | null;
  skip_next?: null[] | null;
  skip_prev?: null[] | null;
  toggle_repeat_context?: null[] | null;
  toggle_repeat_track?: null[] | null;
  toggle_shuffle?: null[] | null;
  peek_next?: null[] | null;
  peek_prev?: null[] | null;
}
export interface TrackWindow {
  current_track: NextTracksEntityOrPreviousTracksEntityOrCurrentTrack;
  next_tracks?: NextTracksEntityOrPreviousTracksEntityOrCurrentTrack[] | null;
  previous_tracks?:
    | NextTracksEntityOrPreviousTracksEntityOrCurrentTrack[]
    | null;
}
export interface NextTracksEntityOrPreviousTracksEntityOrCurrentTrack {
  id: string;
  uri: string;
  type: string;
  uid: string;
  linked_from: LinkedFrom;
  media_type: string;
  track_type: string;
  name: string;
  duration_ms: number;
  artists?: ArtistsEntityOrGroup[] | null;
  album: Album;
  is_playable: boolean;
}
export interface LinkedFrom {
  uri?: null;
  id?: null;
}
export interface Album {
  name: string;
  uri: string;
  images?: ImagesEntity[] | null;
}
export interface Restrictions {
  disallow_seeking_reasons?: null[] | null;
  disallow_skipping_next_reasons?: null[] | null;
  disallow_skipping_prev_reasons?: null[] | null;
  disallow_toggling_repeat_context_reasons?: null[] | null;
  disallow_toggling_repeat_track_reasons?: null[] | null;
  disallow_toggling_shuffle_reasons?: null[] | null;
  disallow_peeking_next_reasons?: null[] | null;
  disallow_peeking_prev_reasons?: null[] | null;
  disallow_pausing_reasons?: string[] | null;
}
export interface Disallows {
  seeking: boolean;
  skipping_next: boolean;
  skipping_prev: boolean;
  toggling_repeat_context: boolean;
  toggling_repeat_track: boolean;
  toggling_shuffle: boolean;
  peeking_next: boolean;
  peeking_prev: boolean;
  pausing: boolean;
}
export interface PlaybackFeatures {
  hifi_status: string;
}
