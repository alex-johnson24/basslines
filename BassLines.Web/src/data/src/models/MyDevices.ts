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
    Device,
    DeviceFromJSON,
    DeviceFromJSONTyped,
    DeviceToJSON,
} from './Device';

/**
 * 
 * @export
 * @interface MyDevices
 */
export interface MyDevices {
    /**
     * 
     * @type {Array<Device>}
     * @memberof MyDevices
     */
    devices?: Array<Device> | null;
}

export function MyDevicesFromJSON(json: any): MyDevices {
    return MyDevicesFromJSONTyped(json, false);
}

export function MyDevicesFromJSONTyped(json: any, ignoreDiscriminator: boolean): MyDevices {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'devices': !exists(json, 'devices') ? undefined : (json['devices'] === null ? null : (json['devices'] as Array<any>).map(DeviceFromJSON)),
    };
}

export function MyDevicesToJSON(value?: MyDevices | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'devices': value.devices === undefined ? undefined : (value.devices === null ? null : (value.devices as Array<any>).map(DeviceToJSON)),
    };
}
