// src/app/testing/test-utilities.ts

import {Provider, InjectionToken} from "@angular/core";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {FirebaseApp} from "@angular/fire/compat";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {of} from "rxjs";

// Mock Firebase Functions
export class MockAngularFireFunctions {
  httpsCallable(name: string) {
    return () => of({success: true, data: {}});
  }
}

// Mock Firestore
export class MockAngularFirestore {
  collection(path: string) {
    return {
      doc: (id: string) => ({
        valueChanges: () => of({}),
        get: () => of({}),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      }),
      valueChanges: () => of([]),
      snapshotChanges: () => of([]),
      add: () => Promise.resolve({id: "mock-id"}),
    };
  }

  doc(path: string) {
    return {
      valueChanges: () => of({}),
      get: () => of({}),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    };
  }
}

// Mock Firebase Storage
export class MockAngularFireStorage {
  ref(path: string) {
    return {
      put: () => ({
        percentageChanges: () => of(100),
        snapshotChanges: () => of({state: "success"}),
      }),
      getDownloadURL: () => of("mock-url"),
    };
  }

  upload(path: string, data: any) {
    return {
      percentageChanges: () => of(100),
      snapshotChanges: () => of({state: "success"}),
    };
  }
}

// Firebase config mock
export const mockFirebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-auth-domain",
  projectId: "mock-project-id",
  storageBucket: "mock-storage-bucket",
  messagingSenderId: "mock-sender-id",
  appId: "mock-app-id",
};

// Mock Firebase App
export class MockFirebaseApp {
  name = "test-app";
  options = mockFirebaseConfig;
}

// Standard Firebase providers for tests
export function getFirebaseTestProviders(): Provider[] {
  return [
    {provide: AngularFireFunctions, useClass: MockAngularFireFunctions},
    {provide: AngularFirestore, useClass: MockAngularFirestore},
    {provide: AngularFireStorage, useClass: MockAngularFireStorage},
    {provide: FIREBASE_OPTIONS, useValue: mockFirebaseConfig},
    {provide: "angularfire2.app.options", useValue: mockFirebaseConfig},
    {provide: FirebaseApp, useClass: MockFirebaseApp},
  ];
}
