/**
 * Listing Management API - Callable functions for listing operations
 */
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import {
  ListingService,
  CreateListingRequest,
} from "../../services/listingService";

/**
 * Create a new listing
 */
export const createListing = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const data = request.data as CreateListingRequest & {
      ownerAccountId?: string;
    };

    // Validate required fields
    if (!data.title || !data.organization || !data.type) {
      throw new HttpsError(
        "invalid-argument",
        "Title, organization, and type are required",
      );
    }

    // Validate listing type (aligned with shared ListingType)
    const validTypes = ["volunteer", "job", "internship", "gig"];
    if (!validTypes.includes(data.type)) {
      throw new HttpsError("invalid-argument", "Invalid listing type");
    }

    try {
      const result = await ListingService.createListing(userId, data);

      logger.info(`Listing created via API: ${result.listingId}`, {
        userId,
        listingType: data.type,
        category: data.category,
      });

      return {
        success: true,
        listingId: result.listingId,
        listing: result.listing,
      };
    } catch (error) {
      logger.error("Listing creation failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Listing creation failed");
    }
  },
);

/**
 * Update an existing listing
 */
export const updateListing = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {listingId, updates} = request.data as {
      listingId: string;
      updates: Partial<CreateListingRequest>;
    };

    if (!listingId) {
      throw new HttpsError("invalid-argument", "Listing ID is required");
    }

    try {
      await ListingService.updateListing({
        listingId,
        updates,
        userId,
      });

      logger.info(`Listing updated via API: ${listingId}`, {
        userId,
        updatedFields: Object.keys(updates),
      });

      return {
        success: true,
        message: "Listing updated successfully",
      };
    } catch (error) {
      logger.error("Listing update failed:", error);
      if (error instanceof HttpsError) throw error;
      const err = error as any;
      // Surface root cause via details for better client-side toasts
      throw new HttpsError("internal", "Listing update failed", {
        message: err?.message || String(err),
        code: err?.code,
        stack: err?.stack,
      });
    }
  },
);

/**
 * Apply to a listing
 */
export const applyToListing = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {
      listingId,
      notes,
      customMessage,
      resumeUrl,
      coverLetterUrl,
      firstName,
      lastName,
      email,
      phone,
    } = request.data as {
      listingId: string;
      notes?: string;
      customMessage?: string;
      resumeUrl?: string | null;
      coverLetterUrl?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
    };

    if (!listingId) {
      throw new HttpsError("invalid-argument", "Listing ID is required");
    }

    try {
      await ListingService.applyToListing({
        listingId,
        applicantId: userId,
        notes,
        customMessage,
        resumeUrl,
        coverLetterUrl,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        email: email ?? null,
        phone: phone ?? null,
      });

      logger.info(`Application submitted via API`, {
        listingId,
        applicantId: userId,
      });

      return {
        success: true,
        message: "Application submitted successfully",
      };
    } catch (error) {
      logger.error("Application submission failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Application submission failed");
    }
  },
);

/** Save a listing */
export const saveListing = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid)
      throw new HttpsError("unauthenticated", "User must be authenticated");
    const userId = request.auth.uid;
    const {listingId} = request.data as {listingId: string};
    if (!listingId)
      throw new HttpsError("invalid-argument", "Listing ID is required");
    try {
      await ListingService.saveListing(userId, listingId);
      return {success: true};
    } catch (error) {
      logger.error("Save listing failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Save listing failed");
    }
  },
);

/** Unsave a listing */
export const unsaveListing = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid)
      throw new HttpsError("unauthenticated", "User must be authenticated");
    const userId = request.auth.uid;
    const {listingId} = request.data as {listingId: string};
    if (!listingId)
      throw new HttpsError("invalid-argument", "Listing ID is required");
    try {
      await ListingService.unsaveListing(userId, listingId);
      return {success: true};
    } catch (error) {
      logger.error("Unsave listing failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Unsave listing failed");
    }
  },
);

/** Remove my application (applicant self-removal) */
export const removeMyApplication = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }
    const userId = request.auth.uid;
    const {listingId} = request.data as {listingId: string};
    if (!listingId) {
      throw new HttpsError("invalid-argument", "Listing ID is required");
    }
    try {
      await ListingService.removeApplication(listingId, userId, userId);
      return {success: true};
    } catch (error) {
      logger.error("Remove application failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Remove application failed");
    }
  },
);

/**
 * Manage applications (accept/reject)
 */
export const manageApplication = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {listingId, applicantId, status, notes} = request.data as {
      listingId: string;
      applicantId: string;
      status: "accepted" | "declined";
      notes?: string;
    };

    if (!listingId || !applicantId || !status) {
      throw new HttpsError(
        "invalid-argument",
        "Listing ID, applicant ID, and status are required",
      );
    }

    if (!["accepted", "declined"].includes(status)) {
      throw new HttpsError(
        "invalid-argument",
        'Status must be "accepted" or "declined"',
      );
    }

    try {
      await ListingService.updateApplicationStatus(
        listingId,
        applicantId,
        status,
        userId,
        notes,
      );

      logger.info(`Application status updated via API`, {
        listingId,
        applicantId,
        status,
        managedBy: userId,
      });

      return {
        success: true,
        message: `Application ${status} successfully`,
      };
    } catch (error) {
      logger.error("Application management failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Application management failed");
    }
  },
);

/**
 * Get listing details with applicant info (for owners)
 */
export const getListingWithApplications = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {listingId} = request.data as {listingId: string};

    if (!listingId) {
      throw new HttpsError("invalid-argument", "Listing ID is required");
    }

    try {
      const result = await ListingService.getListingWithApplications(
        listingId,
        userId,
      );

      return {
        success: true,
        listing: result.listing,
        applications: result.applications,
      };
    } catch (error) {
      logger.error("Get listing with applications failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to retrieve listing details");
    }
  },
);

/**
 * Applicant updates their own application (notes/files)
 */
export const updateMyApplication = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "256MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {
      listingId,
      notes,
      resumeUrl,
      coverLetterUrl,
      firstName,
      lastName,
      email,
      phone,
    } = request.data as {
      listingId: string;
      notes?: string | null;
      resumeUrl?: string | null;
      coverLetterUrl?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
    };

    if (!listingId) {
      throw new HttpsError("invalid-argument", "Listing ID is required");
    }

    try {
      await ListingService.updateApplicantApplication(listingId, userId, {
        notes: notes ?? null,
        resumeUrl: resumeUrl ?? null,
        coverLetterUrl: coverLetterUrl ?? null,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        email: email ?? null,
        phone: phone ?? null,
      });
      return {success: true};
    } catch (error) {
      logger.error("Update my application failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to update application");
    }
  },
);

/**
 * Search listings with advanced filters
 */
export const searchListings = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 30,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {
      query,
      type,
      category,
      location,
      remote,
      skills,
      hoursPerWeekMin,
      hoursPerWeekMax,
      limit = 20,
      startAfter,
    } = request.data as {
      query?: string;
      type?: string;
      category?: string;
      location?: {latitude: number; longitude: number; radius?: number};
      remote?: boolean;
      skills?: string[];
      hoursPerWeekMin?: number;
      hoursPerWeekMax?: number;
      limit?: number;
      startAfter?: string;
    };

    try {
      const results = await ListingService.searchListings({
        query,
        type,
        category,
        location,
        remote,
        skills,
        hoursPerWeekMin,
        hoursPerWeekMax,
        limit: Math.min(limit, 50), // Cap at 50
        startAfter,
        requesterId: userId,
      });

      return {
        success: true,
        listings: results.listings,
        hasMore: results.hasMore,
        nextCursor: results.nextCursor,
      };
    } catch (error) {
      logger.error("Listing search failed:", error);
      throw new HttpsError("internal", "Search failed");
    }
  },
);

/**
 * Delete a listing
 */
export const deleteListing = onCall(
  {
    region: "us-central1",
    enforceAppCheck: false,
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const userId = request.auth.uid;
    const {listingId} = request.data as {listingId: string};

    if (!listingId) {
      throw new HttpsError("invalid-argument", "Listing ID is required");
    }

    try {
      await ListingService.deleteListing(listingId, userId);

      logger.info(`Listing deleted via API: ${listingId}`, {
        userId,
      });

      return {
        success: true,
        message: "Listing deleted successfully",
      };
    } catch (error) {
      logger.error("Listing deletion failed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Listing deletion failed");
    }
  },
);
