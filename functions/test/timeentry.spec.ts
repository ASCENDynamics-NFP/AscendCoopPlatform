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
 *********************************************************************************/
// functions/test/timeentry.spec.ts

import {expect} from "chai";
import * as sinon from "sinon";
const proxyquire = require("proxyquire");

describe("onUpdateTimeEntry", () => {
  function setup() {
    const updateStub = sinon.stub().resolves();
    const docStub = sinon.stub().returns({update: updateStub});
    const incrementStub = sinon.stub().returnsArg(0);

    const firestoreFn: any = sinon.stub().returns({doc: docStub});
    firestoreFn.FieldValue = {increment: incrementStub};

    const adminStub = {firestore: firestoreFn};

    let handler: any;
    proxyquire("../src/database/timeEntries/triggers/onUpdate", {
      "../../../../utils/firebase": {admin: adminStub},
      "firebase-functions/logger": {info: sinon.stub(), error: sinon.stub()},
      "firebase-functions/v2/firestore": {
        onDocumentUpdated: (_cfg: any, fn: any) => {
          handler = fn;
          return fn;
        },
      },
    });

    return {handler, updateStub, incrementStub, docStub};
  }

  it("increments hours when approved", async () => {
    const {handler, updateStub, incrementStub, docStub} = setup();
    const before = {data: () => ({status: "pending", userId: "u", hours: 2})};
    const after = {data: () => ({status: "approved", userId: "u", hours: 2})};
    await handler({data: {before, after}, params: {accountId: "a", entryId: "e"}});
    expect(docStub.calledWith("accounts/u")).to.be.true;
    expect(incrementStub.calledWith(2)).to.be.true;
    expect(updateStub.calledOnce).to.be.true;
  });

  it("decrements hours when approval is removed", async () => {
    const {handler, updateStub, incrementStub, docStub} = setup();
    const before = {data: () => ({status: "approved", userId: "u", hours: 3})};
    const after = {data: () => ({status: "pending", userId: "u", hours: 3})};
    await handler({data: {before, after}, params: {accountId: "a", entryId: "e"}});
    expect(docStub.calledWith("accounts/u")).to.be.true;
    expect(incrementStub.calledWith(-3)).to.be.true;
    expect(updateStub.calledOnce).to.be.true;
  });
});

