import {Timestamp} from "@angular/fire/firestore";

// Preparing data before creating a new document in Firestore
export function prepareDataForCreate(data: any, userId: string) {
  const timestamp = Timestamp.now();
  return {
    ...data,
    createdBy: userId,
    createdDate: timestamp,
    lastModifiedBy: userId,
    lastModifiedDate: timestamp,
  };
}

// Preparing data before updating an existing document in Firestore
export function prepareDataForUpdate(data: any, userId: string) {
  const timestamp = Timestamp.now();
  return {
    ...data,
    lastModifiedBy: userId,
    lastModifiedDate: timestamp,
  };
}
