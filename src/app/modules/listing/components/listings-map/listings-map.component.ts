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
// src/app/modules/listing/components/listings-map/listings-map.component.ts

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
import {Listing} from "../../../../../../shared/models/listing.model";
import {GoogleMap} from "@angular/google-maps";
import {MarkerClusterer} from "@googlemaps/markerclusterer";

export interface ListingMarker {
  listing: Listing;
  position: google.maps.LatLngLiteral;
}

@Component({
  selector: "app-listings-map",
  templateUrl: "./listings-map.component.html",
  styleUrls: ["./listings-map.component.scss"],
})
export class ListingsMapComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() listings: Listing[] = [];
  @Input() userLocation: {latitude: number; longitude: number} | null = null;
  @Input() height = "400px";
  @Output() listingSelected = new EventEmitter<string>();
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
  listingMarkers: ListingMarker[] = [];
  selectedListing: Listing | null = null;
  infoWindowPosition: google.maps.LatLngLiteral | null = null;

  // User location marker options (initialized in ngAfterViewInit when google is available)
  userMarkerOptions: google.maps.MarkerOptions = {};

  private markerClusterer: MarkerClusterer | null = null;
  private markers: google.maps.Marker[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes["listings"]) {
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
    setTimeout(() => this.initializeClusterer(), 100);
  }

  ngOnDestroy() {
    this.clearClusterer();
  }

  private updateMarkers() {
    this.listingMarkers = [];

    this.listings.forEach((listing) => {
      const position = this.getListingPosition(listing);
      if (position) {
        this.listingMarkers.push({listing, position});
      }
    });

    // Update clusterer if initialized
    if (this.markerClusterer) {
      this.initializeClusterer();
    }
  }

  private getListingPosition(
    listing: Listing,
  ): google.maps.LatLngLiteral | null {
    const addresses = listing.contactInformation?.addresses || [];

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
    const geopoint = addressWithGeo.geopoint as any;
    // Firestore serialized format uses _latitude/_longitude, regular GeoPoint uses latitude/longitude
    const lat =
      geopoint._latitude !== undefined ? geopoint._latitude : geopoint.latitude;
    const lng =
      geopoint._longitude !== undefined
        ? geopoint._longitude
        : geopoint.longitude;

    if (lat === undefined || lng === undefined) {
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
    this.markers = this.listingMarkers.map((marker) => {
      const gMarker = new google.maps.Marker({
        position: marker.position,
        icon: this.getMarkerIcon(marker.listing.type),
        title: marker.listing.title,
      });

      gMarker.addListener("click", () => {
        this.onMarkerClick(marker);
      });

      return gMarker;
    });

    // Create clusterer
    this.markerClusterer = new MarkerClusterer({
      map: this.googleMap.googleMap,
      markers: this.markers,
    });

    // Fit bounds to show all markers
    if (this.listingMarkers.length > 0 && !this.userLocation) {
      this.fitBounds();
    }
  }

  private clearClusterer() {
    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
      this.markerClusterer = null;
    }
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }

  private getMarkerIcon(type: string): google.maps.Symbol | undefined {
    if (typeof google === "undefined") {
      return undefined;
    }

    const colors: Record<string, string> = {
      volunteer: "#22c55e", // green
      job: "#3b82f6", // blue
      internship: "#f97316", // orange
      gig: "#a855f7", // purple
    };

    return {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      scale: 6,
      fillColor: colors[type] || "#6b7280",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    };
  }

  private fitBounds() {
    if (
      !this.googleMap?.googleMap ||
      this.listingMarkers.length === 0 ||
      typeof google === "undefined"
    ) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    this.listingMarkers.forEach((marker) => {
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

  onMarkerClick(marker: ListingMarker) {
    this.selectedListing = marker.listing;
    this.infoWindowPosition = marker.position;
  }

  onInfoWindowClose() {
    this.selectedListing = null;
    this.infoWindowPosition = null;
  }

  onViewDetails() {
    if (this.selectedListing?.id) {
      this.listingSelected.emit(this.selectedListing.id);
    }
    this.onInfoWindowClose();
  }

  getListingTypeColor(type: string): string {
    const colors: Record<string, string> = {
      volunteer: "success",
      job: "primary",
      internship: "warning",
      gig: "tertiary",
    };
    return colors[type] || "medium";
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
