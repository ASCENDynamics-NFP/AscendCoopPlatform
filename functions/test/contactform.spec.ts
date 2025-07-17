import {expect} from "chai";
import * as sinon from "sinon";
const proxyquire = require("proxyquire");

const {submitLead} = proxyquire("../src/functions/contactform", {
  "firebase-functions": {
    config: () => ({gmail: {email: "test@example.com", password: "pwd"}}),
  },
});
import {Request, Response} from "express";

describe("submitLead", () => {
  function createRes() {
    const res: any = {};
    res.status = sinon.stub().returns(res);
    res.send = sinon.stub().returns(res);
    res.setHeader = sinon.stub();
    res.getHeader = sinon.stub();
    res.end = sinon.stub();
    res.on = sinon.stub();
    return res as Response;
  }

  it("returns 405 for non POST methods", async () => {
    const req = {method: "GET", headers: {origin: "x"}} as unknown as Request;
    const res = createRes();
    await submitLead(req, res);
    expect((res.status as sinon.SinonStub).calledWith(405)).to.be.true;
    expect((res.send as sinon.SinonStub).called).to.be.true;
  });

  it("returns 400 when required fields are missing", async () => {
    const req = {method: "POST", headers: {origin: "x"}, body: {name: "a"}} as unknown as Request;
    const res = createRes();
    await submitLead(req, res);
    expect((res.status as sinon.SinonStub).calledWith(400)).to.be.true;
    expect((res.send as sinon.SinonStub).called).to.be.true;
  });
});
