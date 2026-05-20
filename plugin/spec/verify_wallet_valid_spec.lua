local cwt = require("cwt")

describe("verify_wallet_valid", function()

    describe("CWT type — wallet compared against consumer config", function()

        it("returns true when wallet matches config", function()
            local ok, err = cwt._verify_wallet_valid("CWT", "abc123", { wallet = "abc123" })
            assert.is_true(ok)
            assert.is_nil(err)
        end)

        it("returns false for a non-matching wallet", function()
            local ok, err = cwt._verify_wallet_valid("CWT", "abc123", { wallet = "different" })
            assert.is_false(ok)
            assert.equals("Invalid wallet", err)
        end)

        it("strips 0x prefix from config wallet before comparing", function()
            local ok = cwt._verify_wallet_valid("CWT", "abc123", { wallet = "0xabc123" })
            assert.is_true(ok)
        end)

        it("returns false when wallet config key is absent", function()
            local ok, err = cwt._verify_wallet_valid("CWT", "abc123", {})
            assert.is_false(ok)
            assert.equals("Missing wallet config", err)
        end)

    end)

    describe("CWT_ENT type — wallet verified via external URL", function()

        it("returns false when verify_url is not configured", function()
            local ok, err = cwt._verify_wallet_valid("CWT_ENT", "wallet1", { usr = "grp1" })
            assert.is_false(ok)
            assert.equals("Missing verify_url config", err)
        end)

        it("returns false when the HTTP request fails (stub returns error)", function()
            -- resty.http stub always returns nil, "http stub"
            local ok, err = cwt._verify_wallet_valid(
                "CWT_ENT", "wallet1",
                { usr = "grp1", verify_url = "http://127.0.0.1/verify", verify_timeout = 1 }
            )
            assert.is_false(ok)
            assert.is_not_nil(err:find("Failed to request verify_url"))
        end)

    end)

end)
