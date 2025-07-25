import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {setDoc, doc, getDoc} from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

describe("timeEntries create rules", () => {
  let testEnv: RulesTestEnvironment;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "rules-test",
      firestore: {
        host: "127.0.0.1",
        port: 8080,
        rules: fs.readFileSync(
          path.join(__dirname, "..", "..", "firestore.rules"),
          "utf8",
        ),
      },
    });
  });

  after(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (context: any) => {
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
      await setDoc(doc(db, "accounts/group1/projects/project1"), {
        archived: false,
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
        projectId: "project1",
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
        projectId: "project1",
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
        projectId: "project1",
      }),
    );
  });

  it("denies create with invalid projectId", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();
    await assertFails(
      setDoc(doc(db, "accounts/group1/timeEntries/entryInvalid"), {
        userId: "user1",
        status: "pending",
        projectId: "bad",
      }),
    );
  });
});

describe("timeEntries update rules", () => {
  let testEnv: RulesTestEnvironment;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "rules-test",
      firestore: {
        host: "127.0.0.1",
        port: 8080,
        rules: fs.readFileSync(
          path.join(__dirname, "..", "..", "firestore.rules"),
          "utf8",
        ),
      },
    });
  });

  after(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (context: any) => {
      const db = context.firestore();
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
      await setDoc(doc(db, "accounts/group1/projects/project1"), {
        archived: false,
      });
      await setDoc(doc(db, "accounts/group1/timeEntries/entry1"), {
        userId: "user1",
        status: "pending",
        projectId: "project1",
      });
    });
  });

  it("denies update with invalid projectId", async () => {
    const ctx = testEnv.authenticatedContext("admin1");
    const db = ctx.firestore();
    await assertFails(
      setDoc(doc(db, "accounts/group1/timeEntries/entry1"), {
        userId: "user1",
        status: "pending",
        projectId: "bad",
      }),
    );
  });
});

describe("project read rules", () => {
  let testEnv: RulesTestEnvironment;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "rules-test",
      firestore: {
        host: "127.0.0.1",
        port: 8080,
        rules: fs.readFileSync(
          path.join(__dirname, "..", "..", "firestore.rules"),
          "utf8",
        ),
      },
    });
  });

  after(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (context: any) => {
      const db = context.firestore();
      await setDoc(doc(db, "accounts/group1"), {type: "group"});
      await setDoc(doc(db, "accounts/group1/relatedAccounts/user1"), {
        status: "accepted",
        access: "user",
        type: "user",
      });
      await setDoc(doc(db, "accounts/group1/projects/project1"), {name: "p"});
    });
  });

  it("allows accepted member to read project", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();
    await assertSucceeds(
      getDoc(doc(db, "accounts/group1/projects/project1")),
    );
  });

  it("denies read to unrelated user", async () => {
    const ctx = testEnv.authenticatedContext("outsider");
    const db = ctx.firestore();
    await assertFails(
      getDoc(doc(db, "accounts/group1/projects/project1")),
    );
  });
});
