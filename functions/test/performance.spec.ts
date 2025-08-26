import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  addDoc,
  getDocs,
  query,
  limit,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import {expect} from "chai";

let testEnv: RulesTestEnvironment;

describe("Performance Tests", function () {
  this.timeout(30000); // Increase timeout for performance tests

  beforeEach(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "test-project",
      firestore: {
        rules: `
          service cloud.firestore {
            match /databases/{database}/documents {
              match /timeEntries/{entryId} {
                allow read, write: if request.auth != null;
              }
            }
          }
        `,
      },
    });
  });

  afterEach(async () => {
    await testEnv.cleanup();
  });

  it("should handle multiple time entries efficiently", async function () {
    this.timeout(15000);

    const firestore = testEnv.authenticatedContext("user1").firestore();
    const timeEntriesRef = collection(firestore, "timeEntries");

    // Create 20 time entries
    console.log("Creating test entries...");
    for (let i = 0; i < 20; i++) {
      const entry = {
        userId: "user1",
        projectId: "project1",
        description: `Task ${i}`,
        duration: 3600,
        date: Timestamp.fromDate(new Date()),
        status: "pending",
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
      };

      await addDoc(timeEntriesRef, entry);
    }

    // Test query performance
    console.log("Testing query performance...");
    const startTime = Date.now();
    const q = query(
      timeEntriesRef,
      where("userId", "==", "user1"),
      orderBy("date", "desc"),
      limit(10),
    );
    const snapshot = await getDocs(q);
    const endTime = Date.now();

    // Verify results
    expect(snapshot.docs.length).to.equal(10);
    expect(endTime - startTime).to.be.lessThan(3000); // Should complete in under 3 seconds
    console.log(`Query completed in ${endTime - startTime}ms`);
  });
});
