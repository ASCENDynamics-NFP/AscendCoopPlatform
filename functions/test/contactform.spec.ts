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

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
// src/functions/test/contactform.spec.ts

import {expect} from "chai";
import * as sinon from "sinon";
import proxyquire from "proxyquire";

const mockDefineString = sinon.stub().returns({
  value: () => "test@example.com",
});

const {submitLead} = proxyquire("../src/functions/contactform", {
  "firebase-functions/params": {
    defineString: mockDefineString,
  },
  "firebase-functions/logger": {
    info: sinon.stub(),
    error: sinon.stub(),
  },
  "../utils/firebase": {
    admin: {
      firestore: () => ({
        collection: () => ({
          add: sinon.stub().resolves(),
        }),
        FieldValue: {
          serverTimestamp: sinon.stub(),
        },
      }),
    },
  },
  nodemailer: {
    createTransport: sinon.stub().returns({
      sendMail: sinon.stub().resolves(),
    }),
  },
});

import type {Request, Response} from "express";

describe("submitLead", () => {
  function createRes() {
    const res = {} as unknown as Response;
    (res as any).status = sinon.stub().returns(res);
    (res as any).send = sinon.stub().returns(res);
    (res as any).json = sinon.stub().returns(res);
    (res as any).set = sinon.stub().returns(res);
    (res as any).setHeader = sinon.stub().returns(res);
    (res as any).getHeader = sinon.stub().returns(res);
    (res as any).end = sinon.stub().returns(res);
    (res as any).on = sinon.stub().returns(res);
    (res as any).write = sinon.stub().returns(res);
    (res as any).writeHead = sinon.stub().returns(res);
    (res as any).headersSent = false;
    (res as any).locals = {};
    return res;
  }

  it("returns 405 for non POST methods", async () => {
    const req = {method: "GET", headers: {origin: "x"}} as unknown as Request;
    const res = createRes();
    await submitLead(req, res);
    expect(((res as any).status as sinon.SinonStub).calledWith(405)).to.be.true;
    expect(((res as any).send as sinon.SinonStub).called).to.be.true;
  });

  it("returns 400 when required fields are missing", async () => {
    const req = {
      method: "POST",
      headers: {origin: "x"},
      body: {name: "a"},
    } as unknown as Request;
    const res = createRes();
    await submitLead(req, res);
    expect(((res as any).status as sinon.SinonStub).calledWith(400)).to.be.true;
    expect(((res as any).send as sinon.SinonStub).called).to.be.true;
  });
});
