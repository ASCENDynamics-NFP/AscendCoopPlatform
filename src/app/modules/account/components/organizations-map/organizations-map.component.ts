/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
// src/app/modules/account/components/organizations-map/organizations-map.component.ts

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import {Account} from "../../../../../../shared/models/account.model";
import {GoogleMap} from "@angular/google-maps";
import {MarkerClusterer} from "@googlemaps/markerclusterer";

export interface OrganizationMarker {
  organization: Account;
  position: google.maps.LatLngLiteral;
}

// GeoPoint can come in two formats:
// - Firestore serialized format: { _latitude, _longitude }
// - Standard GeoPoint format: { latitude, longitude }
interface GeoPointLike {
  _latitude?: number;
  _longitude?: number;
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: "app-organizations-map",
  templateUrl: "./organizations-map.component.html",
  styleUrls: ["./organizations-map.component.scss"],
})
export class OrganizationsMapComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() organizations: Account[] = [];
  @Input() userLocation: {latitude: number; longitude: number} | null = null;
  @Input() height = "400px";
  @Output() organizationSelected = new EventEmitter<string>();
  @Output() mapBoundsChanged = new EventEmitter<google.maps.LatLngBounds>();

  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  // Map configuration
  center: google.maps.LatLngLiteral = {lat: 39.8283, lng: -98.5795}; // Center of US
  zoom = 4;
  mapOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
  };

  // Markers
  organizationMarkers: OrganizationMarker[] = [];
  selectedOrganization: Account | null = null;
  infoWindowPosition: google.maps.LatLngLiteral | null = null;

  // User location marker options (initialized in ngAfterViewInit when google is available)
  userMarkerOptions: google.maps.MarkerOptions = {};

  private markerClusterer: MarkerClusterer | null = null;
  private markers: google.maps.Marker[] = [];
  private markerListeners: google.maps.MapsEventListener[] = [];
  private initTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes["organizations"]) {
      this.updateMarkers();
    }
    if (changes["userLocation"] && this.userLocation) {
      this.center = {
        lat: this.userLocation.latitude,
        lng: this.userLocation.longitude,
      };
      this.zoom = 10;
    }
  }

  ngAfterViewInit() {
    // Initialize user marker options when google is available
    if (typeof google !== "undefined" && google.maps) {
      this.userMarkerOptions = {
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: "Your Location",
      };
    }
    // Initialize markers after view is ready
    this.initTimeout = setTimeout(() => this.initializeClusterer(), 100);
  }

  ngOnDestroy() {
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
      this.initTimeout = null;
    }
    this.clearClusterer();
  }

  private updateMarkers() {
    this.organizationMarkers = [];

    // Filter to only include groups (organizations)
    const groupsOnly = this.organizations.filter((org) => org.type === "group");

    groupsOnly.forEach((organization) => {
      const position = this.getOrganizationPosition(organization);
      if (position) {
        this.organizationMarkers.push({organization, position});
      }
    });

    // Update clusterer if initialized
    if (this.markerClusterer) {
      this.initializeClusterer();
    }
  }

  private getOrganizationPosition(
    organization: Account,
  ): google.maps.LatLngLiteral | null {
    const addresses = organization.contactInformation?.addresses || [];

    // Find primary address or first address with geopoint
    const primaryAddress = addresses.find(
      (addr: any) => addr.isPrimaryAddress && addr.geopoint,
    );
    const addressWithGeo =
      primaryAddress || addresses.find((addr: any) => addr.geopoint);

    if (!addressWithGeo?.geopoint) {
      return null;
    }

    // Handle both Firestore GeoPoint formats (from backend or serialized)
    const geopoint = addressWithGeo.geopoint as GeoPointLike;
    // Firestore serialized format uses _latitude/_longitude, regular GeoPoint uses latitude/longitude
    const lat = geopoint._latitude ?? geopoint.latitude;
    const lng = geopoint._longitude ?? geopoint.longitude;

    // Validate coordinates are valid numbers within bounds
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return null;
    }

    return {lat, lng};
  }

  private initializeClusterer() {
    if (!this.googleMap?.googleMap || typeof google === "undefined") {
      return;
    }

    this.clearClusterer();

    // Create markers
    this.markers = this.organizationMarkers.map((marker) => {
      const gMarker = new google.maps.Marker({
        position: marker.position,
        icon: this.getMarkerIcon(),
        title: marker.organization.name,
      });

      const listener = gMarker.addListener("click", () => {
        this.onMarkerClick(marker);
      });
      this.markerListeners.push(listener);

      return gMarker;
    });

    // Create clusterer
    this.markerClusterer = new MarkerClusterer({
      map: this.googleMap.googleMap,
      markers: this.markers,
    });

    // Fit bounds to show all markers
    if (this.organizationMarkers.length > 0 && !this.userLocation) {
      this.fitBounds();
    }
  }

  private clearClusterer() {
    // Remove event listeners to prevent memory leaks
    if (typeof google !== "undefined") {
      this.markerListeners.forEach((listener) =>
        google.maps.event.removeListener(listener),
      );
    }
    this.markerListeners = [];

    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
      this.markerClusterer = null;
    }
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  private getMarkerIcon(): google.maps.Symbol | undefined {
    if (typeof google === "undefined") {
      return undefined;
    }

    // Purple color for organizations
    return {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      scale: 6,
      fillColor: "#6f42c1", // Purple to match organization badge
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    };
  }

  private fitBounds() {
    if (
      !this.googleMap?.googleMap ||
      this.organizationMarkers.length === 0 ||
      typeof google === "undefined"
    ) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    this.organizationMarkers.forEach((marker) => {
      bounds.extend(marker.position);
    });

    if (this.userLocation) {
      bounds.extend({
        lat: this.userLocation.latitude,
        lng: this.userLocation.longitude,
      });
    }

    this.googleMap.googleMap.fitBounds(bounds, 50);
  }

  onMarkerClick(marker: OrganizationMarker) {
    this.selectedOrganization = marker.organization;
    this.infoWindowPosition = marker.position;
  }

  onInfoWindowClose() {
    this.selectedOrganization = null;
    this.infoWindowPosition = null;
  }

  onViewDetails() {
    if (this.selectedOrganization?.id) {
      this.organizationSelected.emit(this.selectedOrganization.id);
    }
    this.onInfoWindowClose();
  }

  getOrganizationLocation(organization: Account): string {
    const primaryAddress = organization.contactInformation?.addresses?.find(
      (addr: any) => addr.isPrimaryAddress,
    );
    const address =
      primaryAddress || organization.contactInformation?.addresses?.[0];
    if (address) {
      return `${address.city || ""}${address.city && address.country ? ", " : ""}${address.country || ""}`;
    }
    return "";
  }

  onMapIdle() {
    if (this.googleMap?.googleMap) {
      const bounds = this.googleMap.googleMap.getBounds();
      if (bounds) {
        this.mapBoundsChanged.emit(bounds);
      }
    }
  }
}
