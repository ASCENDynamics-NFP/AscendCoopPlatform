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
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import {Listing} from "../../../../../../shared/models/listing.model";
import {GoogleMap, MapInfoWindow} from "@angular/google-maps";
import {MarkerClusterer} from "@googlemaps/markerclusterer";

export interface ListingMarker {
  listing: Listing;
  position: google.maps.LatLngLiteral;
}

@Component({
  standalone: false,
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
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

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
  infoWindowPosition: google.maps.LatLngLiteral = {lat: 39.8283, lng: -98.5795};

  // User location marker options (initialized in ngAfterViewInit when google is available)
  userMarkerOptions: google.maps.MarkerOptions = {};

  private markerClusterer: MarkerClusterer | null = null;
  private markers: google.maps.Marker[] = [];
  private markerListeners: google.maps.MapsEventListener[] = [];
  // Prevent fitBounds() from re-running when Ionic restores the cached view
  // and the listings$ observable re-emits. Only fit on the very first load.
  private boundsInitialized = false;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

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

      const listener = gMarker.addListener("click", () => {
        // Marker events fire outside Angular's zone — run() re-enters it
        // so that change detection updates @if before the info window opens.
        this.ngZone.run(() => this.onMarkerClick(marker));
      });
      this.markerListeners.push(listener);

      return gMarker;
    });

    // Create clusterer
    this.markerClusterer = new MarkerClusterer({
      map: this.googleMap.googleMap,
      markers: this.markers,
    });

    // Fit bounds to show all markers — only on first load so the user's
    // zoom/pan is preserved when navigating back to this page.
    if (
      this.listingMarkers.length > 0 &&
      !this.userLocation &&
      !this.boundsInitialized
    ) {
      this.boundsInitialized = true;
      this.fitBounds();
    }
  }

  private clearClusterer() {
    if (typeof google !== "undefined") {
      this.markerListeners.forEach((l) => google.maps.event.removeListener(l));
    }
    this.markerListeners = [];
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
    // detectChanges() ensures @if (selectedListing) renders its content
    // before the InfoWindow opens — marker events fire outside Angular's
    // zone so automatic CD would be too late.
    this.cdr.detectChanges();
    this.infoWindow?.open();
  }

  onInfoWindowClose() {
    this.infoWindow?.close();
    this.selectedListing = null;
    // Keep infoWindowPosition at last location — position binding requires non-null
  }

  onViewDetails() {
    if (this.selectedListing?.id) {
      this.listingSelected.emit(this.selectedListing.id);
    }
    this.onInfoWindowClose();
  }

  getListingLocation(listing: Listing): string {
    const addresses = listing.contactInformation?.addresses || [];
    const primary =
      addresses.find((a: any) => a.isPrimaryAddress) || addresses[0];
    if (!primary) return "";
    const parts = [primary.city, primary.state].filter(Boolean);
    return parts.join(", ");
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
      // Initialize clusterer here — guaranteed the map instance is ready
      if (!this.markerClusterer) {
        this.initializeClusterer();
      }
      const bounds = this.googleMap.googleMap.getBounds();
      if (bounds) {
        this.mapBoundsChanged.emit(bounds);
      }
    }
  }
}
