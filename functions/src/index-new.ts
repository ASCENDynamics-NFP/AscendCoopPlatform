/**
 * Updated index.ts - Export new callable functions alongside existing functions
 */

// Keep all your existing exports
export {createUserProfile} from "./auth/user/triggers/onCreate";
export {onUserRecordDeletion} from "./auth/user/triggers/onDelete";

// Keep existing triggers for essential operations only
export {onCreateAccount} from "./database/accounts/triggers/onCreate";
export {onUpdateAccount} from "./database/accounts/triggers/onUpdate";
export {onWriteContactInfo} from "./database/accounts/sections/contactInfo/onWrite";

// Keep existing HTTP functions
export {getHomepageListings} from "./functions/listings/homepage";
export {submitLead} from "./functions/contactform";
export {deleteAccount} from "./functions/deleteAccount";

// Keep existing chat functions
export {
  createGroupChat,
  addUserToChat,
  removeUserFromChat,
} from "./functions/chats/groupManagement";
export {
  getMessages,
  getUserChats,
  searchMessages,
} from "./functions/chats/pagination";

// Keep essential chat triggers
export {onCreateChat} from "./database/chats/triggers/onCreate";
export {onCreateMessage} from "./database/chats/messages/triggers/onCreate";

// Keep file processing
export {onFileUpload} from "./storage/fileProcessing";
export {
  cleanupOrphanedFiles,
  cleanupChatFiles,
  getChatStorageStats,
} from "./storage/cleanup";

// Keep monitoring
export {collectPerformanceMetrics} from "./monitoring/performance";

// NEW: Account Management API
export {
  createAccount,
  updateAccount,
  getAccount,
  searchAccounts,
  deleteMyAccount,
} from "./api/accounts";

// NEW: Listing Management API
export {
  createListing,
  updateListing,
  applyToListing,
  manageApplication,
  getListingWithApplications,
  searchListings,
  deleteListing,
} from "./api/listings";

// NEW: Relationship Management API
export {
  createRelationship,
  updateRelationship,
  deleteRelationship,
  getRelationships,
  getPendingRequests,
  getRelationshipStats,
  bulkUpdateRelationships,
} from "./api/relationships";

// Remove or comment out the problematic triggers:
// export {onCreateRelatedAccount} from "./database/accounts/relatedAccounts/triggers/onCreate";
// export {onDeleteRelatedAccount} from "./database/accounts/relatedAccounts/triggers/onDelete";
// export {onUpdateRelatedAccount} from "./database/accounts/relatedAccounts/triggers/onUpdate";
// export {onCreateListing} from "./database/listings/triggers/onCreate";
// export {onDeleteListing} from "./database/listings/triggers/onDelete";
// export {onUpdateListing} from "./database/listings/triggers/onUpdate";
// export {onCreateListingsRelatedAccount} from "./database/listings/relatedAccounts/triggers/onCreate";
// export {onUpdateListingsRelatedAccount} from "./database/listings/relatedAccounts/triggers/onUpdate";
