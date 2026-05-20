local cwt = require("cwt")

describe("check_expiration", function()

    it("returns false when token_time is nil", function()
        assert.is_false(cwt._check_expiration(nil, 300))
    end)

    it("returns true for a token issued right now", function()
        assert.is_true(cwt._check_expiration(os.time(), 300))
    end)

    it("returns false when token is older than expiration window", function()
        assert.is_false(cwt._check_expiration(os.time() - 400, 300))
    end)

    it("returns false when token is dated too far in the future", function()
        assert.is_false(cwt._check_expiration(os.time() + 400, 300))
    end)

    it("returns true when token is just within the past boundary", function()
        assert.is_true(cwt._check_expiration(os.time() - 299, 300))
    end)

    it("returns true when token is just within the future boundary", function()
        assert.is_true(cwt._check_expiration(os.time() + 299, 300))
    end)

    it("handles a minimal expiration window of 1 second", function()
        assert.is_true(cwt._check_expiration(os.time(),      1))
        assert.is_false(cwt._check_expiration(os.time() - 2, 1))
        assert.is_false(cwt._check_expiration(os.time() + 2, 1))
    end)

end)
