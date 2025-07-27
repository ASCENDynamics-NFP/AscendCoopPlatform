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
 ********************************************************************************/
// functions/test/account.spec.ts

import {expect} from "chai";
import * as sinon from "sinon";
const proxyquire = require("proxyquire");

describe("onCreateAccount", () => {
  function setup() {
    const addStub = sinon.stub().resolves();
    const collectionStub = sinon.stub().returns({add: addStub});

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

    return {handler, addStub, collectionStub};
  }

  it("creates a Volunteer project for qualifying accounts", async () => {
    const {handler, addStub, collectionStub} = setup();
    const snapshot = {
      data: () => ({
        type: "group",
        groupType: "Nonprofit",
        groupDetails: {groupType: "Nonprofit"},
      }),
      ref: {collection: collectionStub},
    };
    await handler({data: snapshot, params: {accountId: "a"}});
    expect(collectionStub.calledWith("projects")).to.be.true;
    expect(
      addStub.calledWith({name: "Volunteer", accountId: "a", archived: false}),
    ).to.be.true;
  });

  it("does nothing for other account types", async () => {
    const {handler, addStub, collectionStub} = setup();
    const snapshot = {
      data: () => ({type: "user"}),
      ref: {collection: collectionStub},
    };
    await handler({data: snapshot, params: {accountId: "a"}});
    expect(addStub.notCalled).to.be.true;
  });
});
