import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {setDoc, doc, getDoc, deleteDoc} from "firebase/firestore";
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

  it("allows user to update their own draft entries", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();
    await assertSucceeds(
      setDoc(doc(db, "accounts/group1/timeEntries/entry1"), {
        userId: "user1",
        status: "draft",
        projectId: "project1",
        hours: 8,
      }),
    );
  });

  it("denies user updating approved entries", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();

    // First set up an approved entry
    await testEnv.withSecurityRulesDisabled(async (context: any) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, "accounts/group1/timeEntries/entry2"), {
        userId: "user1",
        status: "approved",
        projectId: "project1",
        hours: 8,
      });
    });

    await assertFails(
      setDoc(doc(db, "accounts/group1/timeEntries/entry2"), {
        userId: "user1",
        status: "approved",
        projectId: "project1",
        hours: 10,
      }),
    );
  });

  it("allows admin to update any entry", async () => {
    const ctx = testEnv.authenticatedContext("admin1");
    const db = ctx.firestore();
    await assertSucceeds(
      setDoc(doc(db, "accounts/group1/timeEntries/entry1"), {
        userId: "user1",
        status: "approved",
        projectId: "project1",
        hours: 8,
      }),
    );
  });

  it("denies user updating another user's entries", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();

    // First set up another user's entry
    await testEnv.withSecurityRulesDisabled(async (context: any) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, "accounts/group1/timeEntries/entry3"), {
        userId: "user2",
        status: "draft",
        projectId: "project1",
        hours: 8,
      });
    });

    await assertFails(
      setDoc(doc(db, "accounts/group1/timeEntries/entry3"), {
        userId: "user2",
        status: "draft",
        projectId: "project1",
        hours: 10,
      }),
    );
  });
});

describe("timeEntries delete rules", () => {
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
      await setDoc(doc(db, "accounts/group1/timeEntries/draftEntry"), {
        userId: "user1",
        status: "draft",
        projectId: "project1",
      });
      await setDoc(doc(db, "accounts/group1/timeEntries/approvedEntry"), {
        userId: "user1",
        status: "approved",
        projectId: "project1",
      });
    });
  });

  it("allows user to delete their own draft entries", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();
    await assertSucceeds(
      deleteDoc(doc(db, "accounts/group1/timeEntries/draftEntry")),
    );
  });

  it("denies user deleting approved entries", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();
    await assertFails(
      deleteDoc(doc(db, "accounts/group1/timeEntries/approvedEntry")),
    );
  });

  it("allows admin to delete any entry", async () => {
    const ctx = testEnv.authenticatedContext("admin1");
    const db = ctx.firestore();
    await assertSucceeds(
      deleteDoc(doc(db, "accounts/group1/timeEntries/approvedEntry")),
    );
  });

  it("denies outsider deleting entries", async () => {
    const ctx = testEnv.authenticatedContext("outsider");
    const db = ctx.firestore();
    await assertFails(
      deleteDoc(doc(db, "accounts/group1/timeEntries/draftEntry")),
    );
  });
});

describe("timeEntries read rules", () => {
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
      await setDoc(doc(db, "accounts/group1/timeEntries/entry1"), {
        userId: "user1",
        status: "draft",
        projectId: "project1",
      });
    });
  });

  it("allows group member to read time entries", async () => {
    const ctx = testEnv.authenticatedContext("user1");
    const db = ctx.firestore();
    await assertSucceeds(getDoc(doc(db, "accounts/group1/timeEntries/entry1")));
  });

  it("denies outsider reading time entries", async () => {
    const ctx = testEnv.authenticatedContext("outsider");
    const db = ctx.firestore();
    await assertFails(getDoc(doc(db, "accounts/group1/timeEntries/entry1")));
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
    await assertSucceeds(getDoc(doc(db, "accounts/group1/projects/project1")));
  });

  it("denies read to unrelated user", async () => {
    const ctx = testEnv.authenticatedContext("outsider");
    const db = ctx.firestore();
    await assertFails(getDoc(doc(db, "accounts/group1/projects/project1")));
  });
});
