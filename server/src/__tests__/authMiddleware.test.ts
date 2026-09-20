import jwt from "jsonwebtoken";
import { requireAdminAuth, type AuthenticatedRequest } from "../middleware/authMiddleware";
import type { Response } from "express";

function mockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("requireAdminAuth middleware", () => {
  const SECRET = "test-secret-do-not-use-in-production";

  it("rejects requests with no Authorization header", () => {
    const req = { headers: {} } as AuthenticatedRequest;
    const res = mockResponse();
    const next = jest.fn();

    requireAdminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a malformed Authorization header (missing 'Bearer ')", () => {
    const req = { headers: { authorization: "not-a-bearer-token" } } as AuthenticatedRequest;
    const res = mockResponse();
    const next = jest.fn();

    requireAdminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an invalid/garbage token", () => {
    const req = {
      headers: { authorization: "Bearer this.is.not.valid" },
    } as AuthenticatedRequest;
    const res = mockResponse();
    const next = jest.fn();

    requireAdminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an expired token", () => {
    const expiredToken = jwt.sign({ id: "abc", role: "admin" }, SECRET, {
      expiresIn: -10, // already expired
    });
    const req = {
      headers: { authorization: `Bearer ${expiredToken}` },
    } as AuthenticatedRequest;
    const res = mockResponse();
    const next = jest.fn();

    requireAdminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts a valid token and attaches the decoded admin to the request", () => {
    const token = jwt.sign({ id: "admin-123", role: "superadmin" }, SECRET, {
      expiresIn: "1h",
    });
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as AuthenticatedRequest;
    const res = mockResponse();
    const next = jest.fn();

    requireAdminAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.admin).toMatchObject({ id: "admin-123", role: "superadmin" });
    expect(res.status).not.toHaveBeenCalled();
  });
});
