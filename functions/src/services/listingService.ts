/**
 * Listing Service - Centralized business logic for listing operations
 */
import {getFirestore, Timestamp, WriteBatch} from "firebase-admin/firestore";
import {logger} from "firebase-functions/v2";
import {HttpsError} from "firebase-functions/v2/https";
import * as functions from "firebase-functions/v2";
import {NotificationService} from "./notificationService";

const db = getFirestore();

export interface CreateListingRequest {
  title: string;
  organization: string;
  description: string;
  type: "volunteer" | "job" | "event" | "project";
  category: string;
  status: "active" | "inactive" | "draft";
  remote: boolean;
  contactInformation: {
    emails?: Array<{email: string; type?: string}>;
    phoneNumbers?: Array<{number: string; type?: string}>;
    addresses?: Array<{
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      remote?: boolean;
    }>;
  };
  requirements?: string[];
  skills?: string[];
  timeCommitment?: {
    hoursPerWeek?: number;
    duration?: string;
    schedule?: string;
  };
  iconImage?: string;
  heroImage?: string;
}

export interface UpdateListingRequest {
  listingId: string;
  updates: Partial<CreateListingRequest>;
  userId: string;
}

export interface ApplyToListingRequest {
  listingId: string;
  applicantId: string;
  notes?: string;
  customMessage?: string;
  resumeUrl?: string | null;
  coverLetterUrl?: string | null;
}

export class ListingService {
  /**
   * Create a new listing with all related setup
   */
  static async createListing(
    userId: string,
    data: CreateListingRequest,
  ): Promise<{listingId: string; listing: any}> {
    try {
      const batch = db.batch();
      const listingRef = db.collection("listings").doc();
      const listingId = listingRef.id;

      // Validate user has permission to create listings
      await this.validateListingPermissions(userId, "create");

      // Geocode addresses if provided
      const geocodedAddresses = await this.geocodeAddresses(
        data.contactInformation.addresses || [],
      );

      const listingData = {
        id: listingId,
        title: data.title,
        organization: data.organization,
        description: data.description,
        type: data.type,
        category: data.category,
        status: data.status,
        remote: data.remote,
        contactInformation: {
          ...data.contactInformation,
          addresses: geocodedAddresses,
        },
        requirements: data.requirements || [],
        skills: data.skills || [],
        timeCommitment: data.timeCommitment || {},
        iconImage: data.iconImage || null,
        heroImage: data.heroImage || null,
        ownerAccountId: userId,
        createdAt: Timestamp.now(),
        createdBy: userId,
        lastModifiedAt: Timestamp.now(),
        lastModifiedBy: userId,
      };

      // Create listing document
      batch.set(listingRef, listingData);

      // Create owner relationship documents
      await this.createOwnerRelationships(
        batch,
        listingId,
        userId,
        listingData,
      );

      await batch.commit();

      logger.info(`Listing created successfully: ${listingId}`, {
        userId,
        type: data.type,
        category: data.category,
      });

      return {listingId, listing: listingData};
    } catch (error) {
      logger.error("Error creating listing:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to create listing");
    }
  }

  /**
   * Update listing with validation and side effects
   */
  static async updateListing(request: UpdateListingRequest): Promise<void> {
    try {
      // Validate user has permission to update this listing
      await this.validateListingPermissions(
        request.userId,
        "update",
        request.listingId,
      );

      const batch = db.batch();
      const listingRef = db.collection("listings").doc(request.listingId);

      // Get current listing data
      const listingDoc = await listingRef.get();
      if (!listingDoc.exists) {
        throw new HttpsError("not-found", "Listing not found");
      }

      const currentData = listingDoc.data()!;
      const updates: any = {
        ...request.updates,
        lastModifiedAt: Timestamp.now(),
        lastModifiedBy: request.userId,
      };

      // Handle address geocoding if addresses changed
      if (request.updates.contactInformation?.addresses) {
        const geocodedAddresses = await this.geocodeAddresses(
          request.updates.contactInformation.addresses,
        );
        updates.contactInformation = {
          ...currentData.contactInformation,
          ...request.updates.contactInformation,
          addresses: geocodedAddresses,
        };
      }

      // Update main listing document
      batch.update(listingRef, updates);

      // Update all related documents
      await this.updateRelatedListingDocuments(
        batch,
        request.listingId,
        updates,
      );

      await batch.commit();
      logger.info(`Listing updated successfully: ${request.listingId}`);
    } catch (error) {
      logger.error("Error updating listing:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update listing");
    }
  }

  /**
   * Apply to a listing
   */
  static async applyToListing(request: ApplyToListingRequest): Promise<void> {
    try {
      // Validate listing exists and is active
      const listingDoc = await db
        .collection("listings")
        .doc(request.listingId)
        .get();
      if (!listingDoc.exists) {
        throw new HttpsError("not-found", "Listing not found");
      }

      const listing = listingDoc.data()!;
      if (listing.status !== "active") {
        throw new HttpsError("failed-precondition", "Listing is not active");
      }

      // Check if already applied
      const existingApplication = await db
        .collection("listings")
        .doc(request.listingId)
        .collection("relatedAccounts")
        .doc(request.applicantId)
        .get();

      if (existingApplication.exists) {
        throw new HttpsError(
          "already-exists",
          "Already applied to this listing",
        );
      }

      // Get applicant data
      const applicantDoc = await db
        .collection("accounts")
        .doc(request.applicantId)
        .get();
      if (!applicantDoc.exists) {
        throw new HttpsError("not-found", "Applicant account not found");
      }

      const applicant = applicantDoc.data()!;
      const batch = db.batch();

      // Create relatedAccount document (under listing)
      const relatedAccount = {
        id: request.applicantId,
        listingId: request.listingId,
        name: applicant.name,
        email: applicant.email,
        phone: applicant.phone || null,
        iconImage: applicant.iconImage || null,
        status: "pending",
        relationship: "applicant",
        applicationDate: Timestamp.now(),
        notes: request.notes || null,
        customMessage: request.customMessage || null,
        resumeUrl: request.resumeUrl || null,
        coverLetterUrl: request.coverLetterUrl || null,
        createdAt: Timestamp.now(),
        createdBy: request.applicantId,
        lastModifiedAt: Timestamp.now(),
        lastModifiedBy: request.applicantId,
      };

      // Create relatedListing document (under applicant account)
      const relatedListing = {
        id: request.listingId,
        accountId: request.applicantId,
        title: listing.title,
        organization: listing.organization,
        type: listing.type,
        remote: listing.remote || false,
        iconImage: listing.iconImage || null,
        status: listing.status,
        relationship: "applicant",
        applicationDate: Timestamp.now(),
        notes: request.notes || null,
        createdAt: Timestamp.now(),
        createdBy: request.applicantId,
        lastModifiedAt: Timestamp.now(),
        lastModifiedBy: request.applicantId,
      };

      // Add to batch
      batch.set(
        db
          .collection("listings")
          .doc(request.listingId)
          .collection("relatedAccounts")
          .doc(request.applicantId),
        relatedAccount,
      );

      batch.set(
        db
          .collection("accounts")
          .doc(request.applicantId)
          .collection("relatedListings")
          .doc(request.listingId),
        relatedListing,
      );

      await batch.commit();

      logger.info(`Application submitted successfully`, {
        listingId: request.listingId,
        applicantId: request.applicantId,
      });

      // Send notification to listing owner
      try {
        await NotificationService.notifyListingApplication(
          listing.createdBy,
          request.applicantId,
          applicant.name || "Someone",
          request.listingId,
          listing.title || "Untitled Listing",
        );
      } catch (notificationError) {
        logger.error(
          "Failed to send application notification:",
          notificationError,
        );
        // Don't fail the whole operation for notification failures
      }
    } catch (error) {
      logger.error("Error applying to listing:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to apply to listing");
    }
  }

  /** Save a listing for a user */
  static async saveListing(userId: string, listingId: string): Promise<void> {
    try {
      const listingDoc = await db.collection("listings").doc(listingId).get();
      if (!listingDoc.exists)
        throw new HttpsError("not-found", "Listing not found");
      const listing = listingDoc.data()!;
      await db
        .collection("accounts")
        .doc(userId)
        .collection("relatedListings")
        .doc(listingId)
        .set(
          {
            id: listingId,
            accountId: userId,
            title: listing.title,
            organization: listing.organization,
            type: listing.type,
            remote: listing.remote || false,
            iconImage: listing.iconImage || null,
            status: listing.status,
            isSaved: true,
            applicationDate: Timestamp.now(),
            createdAt: Timestamp.now(),
            createdBy: userId,
            lastModifiedAt: Timestamp.now(),
            lastModifiedBy: userId,
          },
          {merge: true},
        );
      logger.info("Listing saved", {listingId, userId});
    } catch (error) {
      logger.error("Error saving listing:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to save listing");
    }
  }

  /** Unsave a listing for a user */
  static async unsaveListing(userId: string, listingId: string): Promise<void> {
    try {
      await db
        .collection("accounts")
        .doc(userId)
        .collection("relatedListings")
        .doc(listingId)
        .delete();
      logger.info("Listing unsaved", {listingId, userId});
    } catch (error) {
      logger.error("Error unsaving listing:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to unsave listing");
    }
  }

  /**
   * Accept or reject an application
   */
  static async updateApplicationStatus(
    listingId: string,
    applicantId: string,
    status: "accepted" | "declined",
    userId: string,
    notes?: string,
  ): Promise<void> {
    try {
      // Validate user has permission to manage this listing
      await this.validateListingPermissions(userId, "manage", listingId);

      // Get listing data for notification
      const listingDoc = await db.collection("listings").doc(listingId).get();
      if (!listingDoc.exists) {
        throw new HttpsError("not-found", "Listing not found");
      }
      const listing = listingDoc.data()!;

      const batch = db.batch();
      const now = Timestamp.now();

      // Update relatedAccount document
      const relatedAccountRef = db
        .collection("listings")
        .doc(listingId)
        .collection("relatedAccounts")
        .doc(applicantId);

      const relatedListingRef = db
        .collection("accounts")
        .doc(applicantId)
        .collection("relatedListings")
        .doc(listingId);

      const updates = {
        status,
        notes: notes || null,
        reviewedAt: now,
        reviewedBy: userId,
        lastModifiedAt: now,
        lastModifiedBy: userId,
      };

      batch.update(relatedAccountRef, updates);
      batch.update(relatedListingRef, updates);

      await batch.commit();

      logger.info(`Application status updated`, {
        listingId,
        applicantId,
        status,
        reviewedBy: userId,
      });

      // Send notification to applicant about status change
      try {
        await NotificationService.notifyApplicationUpdate(
          applicantId,
          listingId,
          listing.title || "Untitled Listing",
          status,
        );
      } catch (notificationError) {
        logger.error(
          "Failed to send status update notification:",
          notificationError,
        );
        // Don't fail the whole operation for notification failures
      }
    } catch (error) {
      logger.error("Error updating application status:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update application status");
    }
  }

  // Private helper methods
  private static async validateListingPermissions(
    userId: string,
    action: "create" | "update" | "manage",
    listingId?: string,
  ): Promise<void> {
    if (action === "create") {
      // Check if user has an active account
      const userDoc = await db.collection("accounts").doc(userId).get();
      if (!userDoc.exists) {
        throw new HttpsError(
          "permission-denied",
          "Account required to create listings",
        );
      }
      return;
    }

    if (listingId) {
      // Check if user owns or has admin access to the listing
      const listingDoc = await db.collection("listings").doc(listingId).get();
      if (!listingDoc.exists) {
        throw new HttpsError("not-found", "Listing not found");
      }

      const listing = listingDoc.data()!;
      if (listing.ownerAccountId === userId || listing.createdBy === userId) {
        return; // Owner has full access
      }

      // Check if user has admin role in the owner account
      const relatedAccountDoc = await db
        .collection("accounts")
        .doc(listing.ownerAccountId)
        .collection("relatedAccounts")
        .doc(userId)
        .get();

      if (relatedAccountDoc.exists) {
        const relation = relatedAccountDoc.data();
        if (
          relation?.status === "active" &&
          ["admin", "manager"].includes(relation?.relationship)
        ) {
          return;
        }
      }

      throw new HttpsError(
        "permission-denied",
        "Insufficient permissions for this listing",
      );
    }
  }

  private static async geocodeAddresses(addresses: any[]): Promise<any[]> {
    // Implementation would depend on your geocoding utility
    // For now, return addresses as-is
    return addresses;
  }

  private static async createOwnerRelationships(
    batch: WriteBatch,
    listingId: string,
    userId: string,
    listingData: any,
  ): Promise<void> {
    // Get account data for relationships
    const accountDoc = await db.collection("accounts").doc(userId).get();
    if (!accountDoc.exists) return;

    const account = accountDoc.data()!;

    // Create relatedAccount document
    const relatedAccount = {
      id: userId,
      listingId: listingId,
      name: account.name,
      email: account.email,
      phone: account.phone || null,
      iconImage: account.iconImage || null,
      status: "active",
      relationship: "owner",
      applicationDate: Timestamp.now(),
      notes: null,
      createdAt: Timestamp.now(),
      createdBy: userId,
      lastModifiedAt: Timestamp.now(),
      lastModifiedBy: userId,
    };

    // Create relatedListing document
    const relatedListing = {
      id: listingId,
      accountId: userId,
      title: listingData.title,
      organization: listingData.organization,
      type: listingData.type,
      remote: listingData.remote || false,
      iconImage: listingData.iconImage || null,
      status: listingData.status,
      relationship: "owner",
      applicationDate: Timestamp.now(),
      notes: null,
      createdAt: Timestamp.now(),
      createdBy: userId,
      lastModifiedAt: Timestamp.now(),
      lastModifiedBy: userId,
    };

    batch.set(
      db
        .collection("listings")
        .doc(listingId)
        .collection("relatedAccounts")
        .doc(userId),
      relatedAccount,
    );

    batch.set(
      db
        .collection("accounts")
        .doc(userId)
        .collection("relatedListings")
        .doc(listingId),
      relatedListing,
    );
  }

  private static async updateRelatedListingDocuments(
    batch: WriteBatch,
    listingId: string,
    updates: any,
  ): Promise<void> {
    // Update all relatedListing documents that reference this listing
    const relatedListingsQuery = await db
      .collectionGroup("relatedListings")
      .where("id", "==", listingId)
      .get();

    const listingUpdates = {
      title: updates.title,
      organization: updates.organization,
      type: updates.type,
      remote: updates.remote,
      iconImage: updates.iconImage,
      status: updates.status,
      lastModifiedAt: updates.lastModifiedAt,
      lastModifiedBy: updates.lastModifiedBy,
    };

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(listingUpdates).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    relatedListingsQuery.docs.forEach((doc) => {
      batch.update(doc.ref, filteredUpdates);
    });
  }

  /**
   * Get listing with applications (for owners/admins)
   */
  static async getListingWithApplications(
    listingId: string,
    userId: string,
  ): Promise<{listing: any; applications: any[]}> {
    try {
      // Validate user has permission to view applications
      await this.validateListingPermissions(userId, "manage", listingId);

      const [listingDoc, applicationsSnapshot] = await Promise.all([
        db.collection("listings").doc(listingId).get(),
        db
          .collection("listings")
          .doc(listingId)
          .collection("relatedAccounts")
          .get(),
      ]);

      if (!listingDoc.exists) {
        throw new HttpsError("not-found", "Listing not found");
      }

      const listing = {id: listingDoc.id, ...listingDoc.data()};
      const applications = applicationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {listing, applications};
    } catch (error) {
      logger.error("Error getting listing with applications:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to get listing details");
    }
  }

  /**
   * Search listings with advanced filters
   */
  static async searchListings(options: {
    query?: string;
    type?: string;
    category?: string;
    location?: {latitude: number; longitude: number; radius?: number};
    remote?: boolean;
    skills?: string[];
    limit?: number;
    startAfter?: string;
    requesterId: string;
  }): Promise<{
    listings: any[];
    hasMore: boolean;
    nextCursor?: string;
  }> {
    try {
      // Input validation
      if (options.limit && (options.limit < 1 || options.limit > 50)) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Limit must be between 1 and 50",
        );
      }

      if (options.location) {
        const {latitude, longitude, radius} = options.location;
        if (
          typeof latitude !== "number" ||
          typeof longitude !== "number" ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "Invalid location coordinates",
          );
        }
        if (radius && (radius < 1 || radius > 100)) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "Radius must be between 1 and 100 km",
          );
        }
      }

      if (options.skills && options.skills.length > 10) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Maximum 10 skills allowed in search",
        );
      }

      const limit = Math.min(options.limit || 20, 50);

      let query = db
        .collection("listings")
        .where("status", "==", "active")
        .limit(limit + 1);

      // Apply filters that can be done at database level
      if (options.type) {
        query = query.where("type", "==", options.type);
      }

      if (options.category) {
        query = query.where("category", "==", options.category);
      }

      if (options.remote !== undefined) {
        query = query.where("remote", "==", options.remote);
      }

      // Apply pagination
      if (options.startAfter) {
        const startAfterDoc = await db
          .collection("listings")
          .doc(options.startAfter)
          .get();
        if (startAfterDoc.exists) {
          query = query.startAfter(startAfterDoc);
        }
      }

      const snapshot = await query.get();
      let listings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Apply location filtering (post-query for geographic search)
      if (options.location && !options.remote) {
        const {latitude, longitude, radius = 25} = options.location;
        listings = listings.filter((listing) => {
          if (!listing.location?.coordinates) return false;
          const distance = this.calculateDistance(
            latitude,
            longitude,
            listing.location.coordinates.latitude,
            listing.location.coordinates.longitude,
          );
          return distance <= radius;
        });
      }

      // Apply skills filtering
      if (options.skills && options.skills.length > 0) {
        const skillsLower = options.skills.map((s) => s.toLowerCase());
        listings = listings.filter((listing) => {
          if (!listing.requiredSkills || !Array.isArray(listing.requiredSkills))
            return false;
          const listingSkills = listing.requiredSkills.map((s: string) =>
            s.toLowerCase(),
          );
          return skillsLower.some((skill) =>
            listingSkills.some((listingSkill: string) =>
              listingSkill.includes(skill),
            ),
          );
        });
      }

      // Apply text search (title, description)
      if (options.query) {
        const queryLower = options.query.toLowerCase();
        listings = listings.filter((listing) => {
          const searchText = [
            listing.title || "",
            listing.description || "",
            listing.category || "",
          ]
            .join(" ")
            .toLowerCase();
          return searchText.includes(queryLower);
        });
      }

      // Determine pagination
      const hasMore = listings.length > limit;
      const resultListings = listings.slice(0, limit);

      // Remove sensitive data and add computed fields
      const publicListings = resultListings.map((listing) => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        type: listing.type,
        category: listing.category,
        status: listing.status,
        requiredSkills: listing.requiredSkills,
        remote: listing.remote,
        location: listing.location
          ? {
              address: listing.location.address,
              city: listing.location.city,
              state: listing.location.state,
              country: listing.location.country,
            }
          : null,
        budget: listing.budget,
        timeCommitment: listing.timeCommitment,
        applicationCount: listing.applicationCount || 0,
        createdBy: listing.createdBy,
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt,
      }));

      return {
        listings: publicListings,
        hasMore,
        nextCursor: hasMore
          ? resultListings[resultListings.length - 1].id
          : undefined,
      };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      logger.error("Error searching listings:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to search listings",
      );
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Delete a listing and all related data
   */
  static async deleteListing(listingId: string, userId: string): Promise<void> {
    try {
      // Validate user has permission to delete this listing
      await this.validateListingPermissions(userId, "manage", listingId);

      const batch = db.batch();

      // Delete main listing document
      batch.delete(db.collection("listings").doc(listingId));

      // Delete all related documents
      const subcollections = ["relatedAccounts", "timeEntries"];

      for (const subcollection of subcollections) {
        const subColRef = db
          .collection("listings")
          .doc(listingId)
          .collection(subcollection);
        const docs = await subColRef.get();
        docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      }

      // Remove this listing from accounts' relatedListings
      const relatedListingsQuery = await db
        .collectionGroup("relatedListings")
        .where("id", "==", listingId)
        .get();

      relatedListingsQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      logger.info(
        `Listing and related documents deleted successfully: ${listingId}`,
      );
    } catch (error) {
      logger.error("Error deleting listing:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to delete listing");
    }
  }
}
