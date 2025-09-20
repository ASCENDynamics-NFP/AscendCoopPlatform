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
// functions/test/homepage.spec.ts

import {expect} from "chai";
import * as sinon from "sinon";
import proxyquire from "proxyquire";
const adminStub = {
  firestore: sinon.stub(),
  apps: [],
  initializeApp: sinon.stub(),
};
const {getHomepageListings} = proxyquire("../src/functions/listings/homepage", {
  "../../utils/firebase": {admin: adminStub},
  cors: () => (req: any, res: any, cb: any) => cb(),
});
import type {Request, Response} from "express";

describe("getHomepageListings", () => {
  function createRes(): Response {
    const res = {headers: {}} as unknown as Response;
    (res as any).status = sinon.stub().returns(res);
    (res as any).json = sinon.stub().returns(res);
    (res as any).send = sinon.stub().returns(res);
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

  afterEach(() => {
    sinon.restore();
  });

  it("returns listings sorted by distance", async () => {
    const getStub = sinon.stub().resolves({
      docs: [
        {
          id: "1",
          data: () => ({
            contactInformation: {
              addresses: [{geopoint: {latitude: 0, longitude: 1}}],
            },
          }),
        },
        {
          id: "2",
          data: () => ({
            contactInformation: {
              addresses: [{geopoint: {latitude: 0, longitude: 0.5}}],
            },
          }),
        },
        {
          id: "3",
          data: () => ({contactInformation: {addresses: [{remote: true}]}}),
        },
      ],
    });
    const query = {
      where: sinon.stub().returnsThis(),
      limit: sinon.stub().returnsThis(),
      get: getStub,
    };
    adminStub.firestore.returns({
      collection: sinon.stub().returns(query),
    } as any);
    const req = {
      method: "GET",
      headers: {origin: "x"},
      query: {limit: "2", latitude: "0", longitude: "0"},
    } as unknown as Request;
    const res = createRes();
    await getHomepageListings(req, res);
    expect(((res as any).status as sinon.SinonStub).calledWith(200)).to.be.true;
    const data = ((res as any).json as sinon.SinonStub).firstCall.args[0];
    expect(data).to.be.an("array").with.length(2);
    expect(data[0].id).to.equal("3");
    adminStub.firestore.reset();
  });
});
