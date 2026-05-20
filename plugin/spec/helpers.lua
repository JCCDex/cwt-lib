-- spec/helpers.lua  — loaded by busted BEFORE any spec file
-- Sets up ngx + APISIX stubs so cwt.lua can be required without OpenResty.
-- All stubs must be in place before the first require("cwt").

-- ── pure-Lua base64 (index-based, compatible with Lua 5.1 / 5.4 / 5.5) ─────
local B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
local b64idx = {}
for i = 1, #B64 do b64idx[B64:sub(i, i)] = i - 1 end

local function encode_base64(s)
    local t = {}
    for i = 1, #s, 3 do
        local b1, b2, b3 = s:byte(i, i + 2)
        b2 = b2 or 0; b3 = b3 or 0
        local n = b1 * 65536 + b2 * 256 + b3
        t[#t+1] = B64:sub(math.floor(n / 262144) % 64 + 1, math.floor(n / 262144) % 64 + 1)
        t[#t+1] = B64:sub(math.floor(n / 4096)   % 64 + 1, math.floor(n / 4096)   % 64 + 1)
        t[#t+1] = B64:sub(math.floor(n / 64)     % 64 + 1, math.floor(n / 64)     % 64 + 1)
        t[#t+1] = B64:sub(n % 64 + 1,                      n % 64 + 1)
    end
    local p = #s % 3
    if     p == 1 then t[#t] = "="; t[#t-1] = "="
    elseif p == 2 then t[#t] = "=" end
    return table.concat(t)
end

local function decode_base64(s)
    s = s:gsub("[^" .. B64 .. "=]", "")
    local t = {}
    for i = 1, #s, 4 do
        local c1 = b64idx[s:sub(i,   i  )] or 0
        local c2 = b64idx[s:sub(i+1, i+1)] or 0
        local c3 = b64idx[s:sub(i+2, i+2)] or 0
        local c4 = b64idx[s:sub(i+3, i+3)] or 0
        local n  = c1 * 262144 + c2 * 4096 + c3 * 64 + c4
        t[#t+1] = string.char(math.floor(n / 65536) % 256)
        if s:sub(i+2, i+2) ~= "=" then t[#t+1] = string.char(math.floor(n / 256) % 256) end
        if s:sub(i+3, i+3) ~= "=" then t[#t+1] = string.char(n % 256) end
    end
    return table.concat(t)
end

local function b64url_encode(s)
    return encode_base64(s):gsub("%+", "-"):gsub("/", "_"):gsub("=", "")
end

local function encode_args(t)
    local parts = {}
    for k, v in pairs(t) do
        local ev = tostring(v):gsub("([^%w%-_%.~])", function(c)
            return string.format("%%%02X", c:byte())
        end)
        parts[#parts+1] = tostring(k) .. "=" .. ev
    end
    table.sort(parts)
    return table.concat(parts, "&")
end

-- ── ngx global stub ───────────────────────────────────────────────────────────
_G.ngx = {
    time              = os.time,
    encode_base64     = encode_base64,
    decode_base64     = decode_base64,
    encode_args       = encode_args,
    HTTP_UNAUTHORIZED = 401,
    HTTP_OK           = 200,
    log  = { info = function() end, error = function() end, warn = function() end },
    re   = { gmatch = function() return function() return nil end, nil end },
    req  = { get_headers = function() return {} end, get_uri_args = function() return {} end },
    var  = setmetatable({}, { __index = function() return nil end }),
    say  = print,
}

-- ── cjson ─────────────────────────────────────────────────────────────────────
local ok, cjson_lib = pcall(require, "cjson.safe")
if not ok then
    ok, cjson_lib = pcall(require, "cjson")
    if not ok then error("lua-cjson required: luarocks install lua-cjson") end
    package.loaded["cjson.safe"] = cjson_lib
end

-- ── apisix stubs ──────────────────────────────────────────────────────────────
package.loaded["apisix.core"] = {
    log  = { info = function() end, error = function() end, warn = function() end },
    json = {
        delay_encode = function(x) return tostring(x) end,
        decode       = cjson_lib.decode,
        encode       = cjson_lib.encode,
    },
    schema = {
        TYPE_CONSUMER = "consumer",
        check = function(schema, conf)
            if schema.required then
                for _, f in ipairs(schema.required) do
                    if conf[f] == nil then
                        return false, 'property "' .. f .. '" is required'
                    end
                end
            end
            return true
        end,
    },
    request = {
        header       = function() return nil end,
        set_header   = function() end,
        get_uri_args = function() return {} end,
        set_uri_args = function() end,
    },
}

package.loaded["apisix.consumer"] = {
    plugin       = function() return nil end,
    consumers_kv = function() return nil end,
}

-- ── resty stubs (crypto — not reached in pure unit tests) ────────────────────
package.loaded["resty.openssl"] = {}
package.loaded["resty.openssl.pkey"] = {
    -- Returns nil + error so verify_*_cwt returns gracefully instead of crashing
    new = function() return nil, "pkey stub: crypto not available in unit tests" end,
}
package.loaded["resty.openssl.digest"] = {
    new = function() return nil, "digest stub: crypto not available in unit tests" end,
}
package.loaded["resty.string"]         = { to_hex = function(s) return s end }
package.loaded["resty.http"] = {
    new = function()
        return {
            set_timeout  = function() end,
            request_uri  = function() return nil, "http stub" end,
        }
    end,
}

-- ── codec / keccak stubs ──────────────────────────────────────────────────────
-- Both files use LuaJIT-specific features (table.new, FFI 1L literals) that
-- are not compatible with standard Lua 5.x.  Our unit tests never reach the
-- crypto code paths, so minimal stubs are sufficient.
package.loaded["apisix.plugins.cwt.codec"] = {
    base58jingtum = { encode = function(s) return "jAddr" end },
    base58ripple  = { encode = function(s) return "rAddr" end },
    base58bitcoin = { encode = function(s) return "btcAddr" end },
}
package.loaded["apisix.plugins.cwt.keccak"] = {
    keccak256 = function(s) return string.rep("\0", 32) end,
    keccak512 = function(s) return string.rep("\0", 64) end,
}

-- ── enable _TEST exports in cwt.lua ──────────────────────────────────────────
_TEST = true

-- ── test helper utilities exposed to all specs ───────────────────────────────
_G.test_helpers = {
    b64url_encode = b64url_encode,

    -- Build a minimal 3-part CWT string from Lua tables
    make_cwt_token = function(header_tbl, payload_tbl)
        local h = b64url_encode(cjson_lib.encode(header_tbl))
        local p = b64url_encode(cjson_lib.encode(payload_tbl))
        return h .. "." .. p .. ".dGVzdA"   -- "test" as placeholder signature
    end,
}
