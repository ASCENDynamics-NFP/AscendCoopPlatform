import {expect} from "chai";
import * as sinon from "sinon";
const proxyquire = require("proxyquire");

describe("onCreateAccount", () => {
  function setup() {
    const addStub = sinon.stub().resolves();
    const projectsCollectionStub = sinon.stub().returns({add: addStub});
    const docStub = sinon.stub().returns({collection: projectsCollectionStub});
    const collectionStub = sinon.stub().returns({doc: docStub});
    const firestoreFn: any = sinon.stub().returns({collection: collectionStub});
    firestoreFn.FieldValue = {serverTimestamp: sinon.stub()};
    const adminStub = {firestore: firestoreFn};

    let handler: any;
    proxyquire("../src/database/accounts/triggers/onCreate", {
      "../../../../utils/firebase": {admin: adminStub},
      "firebase-functions/logger": {info: sinon.stub(), error: sinon.stub()},
      "firebase-functions/v2/firestore": {
        onDocumentCreated: (_cfg: any, fn: any) => {
          handler = fn;
          return fn;
        },
      },
    });

    return {handler, addStub, collectionStub, docStub, projectsCollectionStub};
  }

  it("adds volunteer project for supported group types", async () => {
    const {handler, addStub, collectionStub, docStub, projectsCollectionStub} = setup();
    const snapshot = {
      data: () => ({groupDetails: {groupType: "Nonprofit"}}),
    } as any;
    await handler({data: snapshot, params: {accountId: "a"}} as any);
    expect(collectionStub.calledWith("accounts")).to.be.true;
    expect(docStub.calledWith("a")).to.be.true;
    expect(projectsCollectionStub.calledWith("projects")).to.be.true;
    expect(addStub.calledOnce).to.be.true;
  });

  it("does not add project for unsupported group types", async () => {
    const {handler, addStub} = setup();
    const snapshot = {
      data: () => ({groupDetails: {groupType: "Business"}}),
    } as any;
    await handler({data: snapshot, params: {accountId: "a"}} as any);
    expect(addStub.called).to.be.false;
  });
});
