/**
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/
// functions/test/onCreateAccount.spec.ts

import {expect} from "chai";
import * as sinon from "sinon";
const proxyquire = require("proxyquire");

describe("onCreateAccount", () => {
  function setup() {
    const addStub = sinon.stub().resolves();
    const projectsCollectionStub = sinon.stub().returns({add: addStub});
    const docStub = sinon.stub().returns({collection: projectsCollectionStub});
    const collectionStub = sinon.stub().returns({doc: docStub});

    let handler: any;
    proxyquire("../src/database/accounts/triggers/onCreate/index", {
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
    const {handler, addStub, projectsCollectionStub} = setup();
    const snapshot = {
      data: () => ({
        type: "group",
        groupType: "Nonprofit",
        groupDetails: {groupType: "Nonprofit"},
      }),
      ref: {collection: projectsCollectionStub},
    } as any;
    await handler({data: snapshot, params: {accountId: "a"}} as any);
    expect(projectsCollectionStub.calledWith("projects")).to.be.true;
    expect(addStub.calledOnce).to.be.true;
  });

  it("does not add project for unsupported group types", async () => {
    const {handler, addStub} = setup();
    const snapshot = {
      data: () => ({groupDetails: {groupType: "Business"}}),
      ref: {collection: sinon.stub()},
    } as any;
    await handler({data: snapshot, params: {accountId: "a"}} as any);
    expect(addStub.called).to.be.false;
  });
});
