-- Tests for verify_cwt_obj — covers all field-validation exits,
-- including the three security fixes applied to cwt.lua.
local cwt = require("cwt")

-- Minimal valid cwt_obj that passes all field checks up to the crypto call.
-- Signature "dGVzdA" decodes to bytes "test" (valid, non-nil).
local function base_obj()
    return {
        valid       = true,
        verified    = false,   -- matches what load_cwt initialises
        header      = { chain = "ethereum", x5c = {"fakepem"}, alg = "secp256k1" },
        payload     = { time = os.time() },
        raw_header  = "aGVsbG8",   -- arbitrary base64url-safe string
        raw_payload = "d29ybGQ",
        signature   = "dGVzdA",
    }
end

describe("verify_cwt_obj — field validation", function()

    it("returns immediately when cwt_obj.valid is false", function()
        local obj = { valid = false, verified = false, reason = "pre-existing" }
        local result = cwt._verify_cwt_obj({ exp = 300 }, obj, "CWT")
        assert.equals("pre-existing", result.reason)
        assert.is_false(result.verified)
    end)

    it("returns error when exp is missing from auth_conf", function()
        local result = cwt._verify_cwt_obj({}, base_obj(), "CWT")
        assert.equals("Missing exp config", result.reason)
        assert.is_false(result.verified)
    end)

    it("returns error when chain is missing from token header", function()
        local obj = base_obj()
        obj.header.chain = nil
        local result = cwt._verify_cwt_obj({ exp = 300 }, obj, "CWT")
        assert.equals("No chain supplied", result.reason)
        assert.is_false(result.verified)
    end)

    -- ── SECURITY FIX: x5c nil dereference (CRITICAL) ─────────────────────────

    it("[sec] does NOT crash when x5c field is absent (was nil[1] panic)", function()
        local obj = base_obj()
        obj.header.x5c = nil
        local ok, result = pcall(cwt._verify_cwt_obj, { exp = 300 }, obj, "CWT")
        assert.is_true(ok, "must not throw a Lua runtime error")
        assert.equals("No public key supplied", result.reason)
        assert.is_false(result.verified)
    end)

    it("[sec] does NOT crash when x5c is a string instead of a table", function()
        local obj = base_obj()
        obj.header.x5c = "not-a-table"
        local ok, result = pcall(cwt._verify_cwt_obj, { exp = 300 }, obj, "CWT")
        assert.is_true(ok, "must not throw a Lua runtime error")
        assert.equals("No public key supplied", result.reason)
    end)

    it("[sec] returns error when x5c is an empty table", function()
        local obj = base_obj()
        obj.header.x5c = {}
        local result = cwt._verify_cwt_obj({ exp = 300 }, obj, "CWT")
        assert.equals("No public key supplied", result.reason)
    end)

    -- ── SECURITY FIX: PEM size limit (MEDIUM) ────────────────────────────────

    it("[sec] rejects a PEM larger than 4096 bytes", function()
        local obj = base_obj()
        obj.header.x5c = { string.rep("A", 4097) }
        local result = cwt._verify_cwt_obj({ exp = 300 }, obj, "CWT")
        assert.equals("Public key too large", result.reason)
        assert.is_false(result.verified)
    end)

    it("[sec] accepts a PEM of exactly 4096 bytes (passes size check)", function()
        local obj = base_obj()
        obj.header.x5c = { string.rep("A", 4096) }
        local result = cwt._verify_cwt_obj({ exp = 300 }, obj, "CWT")
        assert.not_equals("Public key too large", result.reason)
    end)

    -- ── remaining field checks ────────────────────────────────────────────────

    it("returns error when time is missing from payload", function()
        local obj = base_obj()
        obj.payload.time = nil
        local result = cwt._verify_cwt_obj({ exp = 300 }, obj, "CWT")
        assert.equals("No time supplied", result.reason)
    end)

    it("returns error for a token outside the expiration window", function()
        local obj = base_obj()
        obj.payload.time = os.time() - 400   -- 400 s ago, window is 300 s
        local result = cwt._verify_cwt_obj({ exp = 300 }, obj, "CWT")
        assert.equals("Token has expired", result.reason)
    end)

    it("returns error for an unrecognised chain", function()
        local obj = base_obj()
        obj.header.chain = "solana"
        local result = cwt._verify_cwt_obj({ exp = 300 }, obj, "CWT")
        assert.is_not_nil(result.reason:find("Unsupported chain"))
        assert.is_false(result.verified)
    end)

end)
