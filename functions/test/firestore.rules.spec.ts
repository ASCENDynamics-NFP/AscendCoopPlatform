import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {setDoc, doc} from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

describe("timeEntries create rules", () => {
  let testEnv: RulesTestEnvironment;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "rules-test",
      firestore: {
        rules: fs.readFileSync(
          path.join(__dirname, "..", "..", "firestore.rules"),
          "utf8",
        ),
      },
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      // Create group account and related user documents
      await setDoc(doc(db, "accounts/group1"), {type: "group"});
      await setDoc(doc(db, "accounts/group1/relatedAccounts/user1"), {
        status: "accepted",
        access: "user",
        type: "user",
      });
      await setDoc(doc(db, "accounts/group1/relatedAccounts/admin1"), {
        status: "accepted",
        access: "admin",
        type: "user",
      });
    });
  });

  it("allows non-admin create when status pending", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();
    await assertSucceeds(
      setDoc(doc(db, "accounts/group1/timeEntries/entry1"), {
        userId: "user1",
        status: "pending",
      }),
    );
  });

  it("denies non-admin create with non pending status", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();
    await assertFails(
      setDoc(doc(db, "accounts/group1/timeEntries/entry1"), {
        userId: "user1",
        status: "approved",
      }),
    );
  });

  it("allows admin create with any status", async () => {
    const ctx = testEnv.authenticatedContext("admin1");
    const db = ctx.firestore();
    await assertSucceeds(
      setDoc(doc(db, "accounts/group1/timeEntries/entry1"), {
        userId: "admin1",
        status: "approved",
      }),
    );
  });
});
