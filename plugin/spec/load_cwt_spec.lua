local cwt = require("cwt")
local helpers = _G.test_helpers

describe("load_cwt", function()

    it("parses a valid 3-part token into a cwt_obj", function()
        local token = helpers.make_cwt_token(
            { type = "CWT", chain = "ethereum", alg = "secp256k1", x5c = {"fakepem"} },
            { usr = "user1", time = os.time() }
        )
        local obj = cwt._load_cwt(token)
        assert.is_true(obj.valid)
        assert.is_false(obj.verified)
        assert.equals("CWT",      obj.header.type)
        assert.equals("ethereum", obj.header.chain)
        assert.equals("user1",    obj.payload.usr)
    end)

    it("preserves raw_header and raw_payload for signature verification", function()
        local token = helpers.make_cwt_token(
            { type = "CWT", chain = "ripple" },
            { usr = "u", time = os.time() }
        )
        local parts = {}
        for p in token:gmatch("[^%.]+") do parts[#parts+1] = p end
        local obj = cwt._load_cwt(token)
        assert.equals(parts[1], obj.raw_header)
        assert.equals(parts[2], obj.raw_payload)
        assert.equals(parts[3], obj.signature)
    end)

    it("returns valid=false for a 2-part token", function()
        local obj = cwt._load_cwt("part1.part2")
        assert.is_false(obj.valid)
        assert.equals("invalid cwt string", obj.reason)
    end)

    it("returns valid=false for a 1-part token", function()
        local obj = cwt._load_cwt("onlyone")
        assert.is_false(obj.valid)
        assert.equals("invalid cwt string", obj.reason)
    end)

    it("returns valid=false for an empty string", function()
        local obj = cwt._load_cwt("")
        assert.is_false(obj.valid)
        assert.equals("invalid cwt string", obj.reason)
    end)

    it("returns valid=false when header is not valid JSON", function()
        local b = helpers.b64url_encode
        local token = b("{invalid json}") .. "." .. b('{"usr":"u","time":1}') .. ".sig"
        local obj = cwt._load_cwt(token)
        assert.is_false(obj.valid)
        assert.is_not_nil(obj.reason:find("invalid header"))
    end)

    it("returns valid=false when payload is not valid JSON", function()
        local b = helpers.b64url_encode
        local token = b('{"type":"CWT","chain":"ethereum"}') .. "." .. b("{bad}") .. ".sig"
        local obj = cwt._load_cwt(token)
        assert.is_false(obj.valid)
        assert.is_not_nil(obj.reason:find("invalid payload"))
    end)

end)
