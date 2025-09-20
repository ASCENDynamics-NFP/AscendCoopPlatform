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
  /** Optional: Post on behalf of this account (e.g., a group). Defaults to caller (userId). */
  ownerAccountId?: string;
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
   * Recursively remove properties with value undefined from an object or array.
   * Preserves Firestore Timestamp instances and other non-plain objects.
   */
  private static stripUndefined<T>(value: T): T {
    if (Array.isArray(value)) {
      // Sanitize each element in the array
      return value
        .map((v) => this.stripUndefined(v))
        .filter((v) => v !== undefined) as unknown as T;
    }

    if (value && typeof value === "object") {
      // Preserve special objects like Firestore Timestamp
      if (
        (value as any) instanceof Timestamp ||
        (value as any).toDate?.call // heuristic: objects with toDate() like Timestamp
      ) {
        return value;
      }

      const result: any = Array.isArray(value) ? [] : {};
      for (const [k, v] of Object.entries(value as any)) {
        if (v === undefined) continue;
        const cleaned = this.stripUndefined(v as any);
        if (cleaned !== undefined) result[k] = cleaned;
      }
      return result as T;
    }

    // Primitives: return as-is (undefined is handled by callers)
    return value;
  }

  /** Normalize various timestamp shapes to Admin SDK Timestamp */
  private static toAdminTimestamp(value: any): any {
    if (value == null) return value;
    if (value instanceof Timestamp) return value;
    try {
      // Firestore client Timestamp JSON-ish shape
      if (
        typeof value === "object" &&
        typeof (value as any)._seconds === "number"
      ) {
        const seconds = (value as any)._seconds as number;
        const nanos = (value as any)._nanoseconds as number | undefined;
        const ms = seconds * 1000 + Math.floor((nanos || 0) / 1_000_000);
        return Timestamp.fromMillis(ms);
      }
      // Date instance
      if (value instanceof Date) {
        return Timestamp.fromDate(value);
      }
      // ISO string
      if (typeof value === "string") {
        const ms = Date.parse(value);
        if (!Number.isNaN(ms)) return Timestamp.fromMillis(ms);
      }
      // Objects with toDate() (client Timestamp)
      if (typeof (value as any)?.toDate === "function") {
        const d = (value as any).toDate();
        if (d instanceof Date) return Timestamp.fromDate(d);
      }
    } catch (_) {
      // Fall-through: return original value
    }
    return value;
  }

  /**
   * Whitelist and sanitize update fields to avoid invalid Firestore writes.
   */
  private static sanitizeListingUpdates(updates: any): any {
    if (!updates || typeof updates !== "object") return {};

    const allowedKeys = new Set([
      "title",
      "organization",
      "description",
      "type",
      "category",
      "status",
      "remote",
      "contactInformation",
      "requirements",
      "skills",
      "timeCommitment",
      "iconImage",
      "heroImage",
      // Note: intentionally excluding createdAt/createdBy/ownerAccountId/etc
    ]);

    const result: any = {};
    for (const [key, value] of Object.entries(updates)) {
      if (!allowedKeys.has(key)) continue;
      if (key === "timeCommitment" && value && typeof value === "object") {
        const tc: any = {...(value as any)};
        if ("startDate" in tc)
          tc.startDate = this.toAdminTimestamp(tc.startDate);
        if ("endDate" in tc) tc.endDate = this.toAdminTimestamp(tc.endDate);
        result.timeCommitment = tc;
        continue;
      }
      if (key === "contactInformation" && value && typeof value === "object") {
        const ci = {...(value as any)};
        if (Array.isArray(ci.addresses)) {
          ci.addresses = ci.addresses.map((addr: any) => ({
            street: addr?.street,
            city: addr?.city,
            state: addr?.state,
            zipCode: addr?.zipCode,
            country: addr?.country,
            remote: addr?.remote,
          }));
        }
        result.contactInformation = ci;
        continue;
      }
      result[key] = value;
    }

    return this.stripUndefined(result);
  }
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

      // Determine the owner account (defaults to caller)
      const ownerAccountId = data.ownerAccountId || userId;

      // Validate user has permission to create listings for the selected owner account
      await this.validateListingPermissions(
        userId,
        "create",
        undefined,
        ownerAccountId,
      );

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
        ownerAccountId,
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
        ownerAccountId,
        listingData,
        userId,
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

      const listingRef = db.collection("listings").doc(request.listingId);

      // Get current listing data
      const listingDoc = await listingRef.get();
      if (!listingDoc.exists) {
        throw new HttpsError("not-found", "Listing not found");
      }

      const currentData = listingDoc.data()!;
      let updates: any = {
        ...ListingService.sanitizeListingUpdates(request.updates),
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

      // Remove undefined fields recursively to satisfy Firestore constraints
      updates = ListingService.stripUndefined(updates);

      // Update main listing document (standalone commit)
      const mainBatch = db.batch();
      mainBatch.update(listingRef, updates);
      await mainBatch.commit();

      // Also immediately update the owner's mirrored relatedListing document so
      // profile pages reflect new status/title without waiting on collection group sync
      try {
        const ownerId = currentData.ownerAccountId;
        if (ownerId) {
          const ownerRelatedRef = db
            .collection("accounts")
            .doc(ownerId)
            .collection("relatedListings")
            .doc(request.listingId);
          const mirrorUpdates: any = ListingService.stripUndefined({
            title: updates.title,
            organization: updates.organization,
            type: updates.type,
            remote: updates.remote,
            iconImage: updates.iconImage,
            status: updates.status,
            lastModifiedAt: updates.lastModifiedAt,
            lastModifiedBy: updates.lastModifiedBy,
          });
          if (Object.keys(mirrorUpdates).length > 0) {
            await ownerRelatedRef.set(mirrorUpdates, {merge: true});
          }
        }
      } catch (mirrorErr) {
        logger.warn(
          "Owner relatedListing mirror update failed (non-fatal):",
          mirrorErr,
        );
      }

      // Best-effort update of mirrored related listings; do not await
      // Any errors are handled internally and won't impact the response
      this.updateRelatedListingDocumentsBestEffort(
        request.listingId,
        updates,
      ).catch((err) =>
        logger.warn(
          "Best-effort relatedListings update rejected (non-fatal):",
          err,
        ),
      );
      logger.info(`Listing updated successfully: ${request.listingId}`);
    } catch (error) {
      logger.error("Error updating listing:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update listing", {
        message: (error as any)?.message || String(error),
        code: (error as any)?.code,
      });
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
      // Do not delete the relatedListing record — only clear saved flag to
      // preserve applicant/owner relationships and history unless explicitly deleted.
      await db
        .collection("accounts")
        .doc(userId)
        .collection("relatedListings")
        .doc(listingId)
        .set(
          {
            isSaved: false,
            lastModifiedAt: Timestamp.now(),
            lastModifiedBy: userId,
          },
          {merge: true},
        );
      logger.info("Listing unsaved (flag cleared)", {listingId, userId});
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
    ownerAccountId?: string,
  ): Promise<void> {
    if (action === "create") {
      // If creating for a specific owner account (e.g., group), ensure user is owner/admin/mod
      const targetOwnerId = ownerAccountId || userId;
      const ownerDoc = await db.collection("accounts").doc(targetOwnerId).get();
      if (!ownerDoc.exists) {
        throw new HttpsError("not-found", "Owner account not found");
      }
      const owner = ownerDoc.data() as any;
      if (targetOwnerId === userId) return; // posting as self
      // For groups, allow if user is in adminIds/moderatorIds
      if (owner.type === "group") {
        const inAdmins = Array.isArray(owner.adminIds)
          ? owner.adminIds.includes(userId)
          : false;
        const inMods = Array.isArray(owner.moderatorIds)
          ? owner.moderatorIds.includes(userId)
          : false;
        if (inAdmins || inMods) return;
      }
      throw new HttpsError(
        "permission-denied",
        "Insufficient permissions to post for this account",
      );
    }

    if (listingId) {
      // Check if user owns or has admin access to the listing
      const listingDoc = await db.collection("listings").doc(listingId).get();
      if (!listingDoc.exists) {
        throw new HttpsError("not-found", "Listing not found");
      }

      const listing = listingDoc.data() as any;
      const ownerId = listing.ownerAccountId as string | undefined;

      // If user created the listing, allow
      if (listing.createdBy === userId) {
        return;
      }

      // If there is no owner account recorded, restrict to creator only
      if (!ownerId) {
        throw new HttpsError(
          "permission-denied",
          "Insufficient permissions for this listing",
        );
      }

      // If user is the owner account id itself, allow
      if (ownerId === userId) {
        return;
      }

      // Check if user has admin/manager role in the owner account
      const relatedAccountDoc = await db
        .collection("accounts")
        .doc(ownerId)
        .collection("relatedAccounts")
        .doc(userId)
        .get();

      if (relatedAccountDoc.exists) {
        const relation = relatedAccountDoc.data() as any;
        const statusOk = relation?.status === "accepted";
        const access = relation?.access;
        const accessOk = ["admin", "moderator"].includes(access);
        if (statusOk && accessOk) {
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
    ownerAccountId: string,
    listingData: any,
    createdByUserId?: string,
  ): Promise<void> {
    // Get account data for relationships
    const accountDoc = await db
      .collection("accounts")
      .doc(ownerAccountId)
      .get();
    if (!accountDoc.exists) return;

    const account = accountDoc.data()!;

    // Create relatedAccount document
    const relatedAccount = {
      id: ownerAccountId,
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
      createdBy: createdByUserId || ownerAccountId,
      lastModifiedAt: Timestamp.now(),
      lastModifiedBy: createdByUserId || ownerAccountId,
    };

    // Create relatedListing document
    const relatedListing = {
      id: listingId,
      accountId: ownerAccountId,
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
      createdBy: createdByUserId || ownerAccountId,
      lastModifiedAt: Timestamp.now(),
      lastModifiedBy: createdByUserId || ownerAccountId,
    };

    batch.set(
      db
        .collection("listings")
        .doc(listingId)
        .collection("relatedAccounts")
        .doc(ownerAccountId),
      relatedAccount,
    );

    batch.set(
      db
        .collection("accounts")
        .doc(ownerAccountId)
        .collection("relatedListings")
        .doc(listingId),
      relatedListing,
    );
  }

  private static async updateRelatedListingDocumentsBestEffort(
    listingId: string,
    updates: any,
  ): Promise<void> {
    try {
      // Query all mirrored relatedListings for this listing id
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
      } as Record<string, unknown>;

      // Filter out undefined values
      const filteredUpdates = Object.fromEntries(
        Object.entries(listingUpdates).filter(
          ([, value]) => value !== undefined,
        ),
      );

      // Even if no field updates, we may still want to clean up stray docs
      const docs = relatedListingsQuery.docs;

      // First, apply field updates where applicable
      if (Object.keys(filteredUpdates).length > 0 && docs.length > 0) {
        const updateChunkSize = 450;
        for (let i = 0; i < docs.length; i += updateChunkSize) {
          const chunk = docs.slice(i, i + updateChunkSize);
          const batch = db.batch();
          chunk.forEach((doc) => batch.update(doc.ref, filteredUpdates as any));
          await batch.commit();
        }
      }

      // Cleanup: remove relatedListings that are neither owner/applicant/participant nor saved
      if (docs.length > 0) {
        const deleteChunkSize = 450;
        const toDelete = docs.filter((d) => {
          const data = d.data() as any;
          const rel = data?.relationship;
          const isSaved = data?.isSaved === true;
          const allowed =
            rel === "owner" || rel === "applicant" || rel === "participant";
          return !allowed && !isSaved; // remove unsaved docs without a valid relationship
        });
        for (let i = 0; i < toDelete.length; i += deleteChunkSize) {
          const chunk = toDelete.slice(i, i + deleteChunkSize);
          const batch = db.batch();
          chunk.forEach((doc) => batch.delete(doc.ref));
          if (chunk.length > 0) await batch.commit();
        }
      }
    } catch (err: any) {
      // Do not fail primary update due to secondary mirror issues (e.g., missing index)
      logger.warn(
        "Best-effort update of relatedListings failed (non-fatal):",
        err,
      );
    }
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

      const listingRef = db.collection("listings").doc(listingId);

      // 1) Identify accounts from listing's relatedAccounts to remove their relatedListings docs
      const relatedAccountsSnap = await listingRef
        .collection("relatedAccounts")
        .get();
      const relatedAccountIds = relatedAccountsSnap.docs.map((d) => d.id);

      // 2) Remove accounts/*/relatedListings/{listingId} for all related accounts (owner, applicants, participants)
      await this.deleteInChunks(
        relatedAccountIds.map((accountId) =>
          db
            .collection("accounts")
            .doc(accountId)
            .collection("relatedListings")
            .doc(listingId),
        ),
      );

      // 3) Disassociate any time entries that referenced this listing
      await this.disassociateTimeEntriesFromListing(listingId, userId);

      // 4) Delete listing subcollections: relatedAccounts and listing-level timeEntries copies only
      const subcols = ["relatedAccounts", "timeEntries"];
      for (const sub of subcols) {
        const subSnap = await listingRef.collection(sub).get();
        await this.deleteInChunks(subSnap.docs.map((d) => d.ref));
      }

      // 5) Delete the main listing document
      await listingRef.delete();

      // 6) Best-effort: in case there are any stray relatedListings elsewhere (e.g., legacy), try CG cleanup without failing
      this.cleanupRelatedListingsBestEffort(listingId).catch((err) =>
        logger.warn("Best-effort CG cleanup failed (non-fatal):", err),
      );

      logger.info(`Listing deleted with all relations: ${listingId}`);
    } catch (error) {
      logger.error("Error deleting listing:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to delete listing", {
        message: (error as any)?.message || String(error),
        code: (error as any)?.code,
      });
    }
  }

  /**
   * Find all time entries that reference this listing and remove the association.
   * Updates both the main timeEntries doc and the account's timeEntries mirror.
   */
  private static async disassociateTimeEntriesFromListing(
    listingId: string,
    userId: string,
  ): Promise<void> {
    const now = Timestamp.now();
    const snap = await db
      .collection("timeEntries")
      .where("listingId", "==", listingId)
      .get();

    if (snap.empty) return;

    // Each entry requires up to 2 updates (main + account mirror)
    const chunkSize = 200; // keep well below 500 writes per batch
    for (let i = 0; i < snap.docs.length; i += chunkSize) {
      const chunk = snap.docs.slice(i, i + chunkSize);
      const batch = db.batch();
      chunk.forEach((doc) => {
        const data = doc.data() as any;
        batch.update(doc.ref, {
          listingId: null,
          lastModifiedAt: now,
          lastModifiedBy: userId,
        });
        if (data.accountId) {
          const accountMirrorRef = db
            .collection("accounts")
            .doc(data.accountId)
            .collection("timeEntries")
            .doc(doc.id);
          batch.update(accountMirrorRef, {
            listingId: null,
            lastModifiedAt: now,
            lastModifiedBy: userId,
          });
        }
      });
      await batch.commit();
    }
  }

  /** Delete a list of DocumentReferences in batch chunks */
  private static async deleteInChunks(
    refs: FirebaseFirestore.DocumentReference[],
    chunkSize: number = 450,
  ): Promise<void> {
    for (let i = 0; i < refs.length; i += chunkSize) {
      const chunk = refs.slice(i, i + chunkSize);
      const batch = db.batch();
      chunk.forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
  }

  /** Best-effort cleanup via collection group query (non-fatal) */
  private static async cleanupRelatedListingsBestEffort(
    listingId: string,
  ): Promise<void> {
    try {
      const cg = await db
        .collectionGroup("relatedListings")
        .where("id", "==", listingId)
        .get();
      await this.deleteInChunks(cg.docs.map((d) => d.ref));
    } catch (e) {
      // Non-fatal
      logger.warn("CG cleanup warning:", e);
    }
  }
}
