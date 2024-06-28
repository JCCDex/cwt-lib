import { EthereumWebToken, BitcoinWebToken, JingtumWebToken, RippleWebToken } from "../src";

describe("WebToken", () => {
  describe("JingtumWebToken", () => {
    it("should sign and verify when is secp256k1", () => {
      const seeds = [
        "sajoigynKobrB8U59g1puxu8GM7Hg",
        "00469cfdd66844f8268eddf3123f5c0e05af24166ce083225f3306e5a10d630dc1",
        "469cfdd66844f8268eddf3123f5c0e05af24166ce083225f3306e5a10d630dc1"
      ];
      for (const seed of seeds) {
        const webToken = new JingtumWebToken(seed);
        const token = webToken.sign({
          usr: "jingtum_secp256k1",
          time: 123456
        });
        expect(token).toEqual(
          "eyJhbGciOiJzZWNwMjU2azEiLCJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1GWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RRZ0FFTVRxOXVhdENOQVhXSFV2U2tPYm0wOTd0cDFJVVAyZVJcbjFyKzU4T3ljNHoyeTNaSFBobFN3K01JUTBHczRkSVZDcHFiMmJjcE9aTkpvUEY5TzYxSEJiQT09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iXSwidHlwZSI6IkNXVCIsImNoYWluIjoiamluZ3R1bSJ9.eyJ1c3IiOiJqaW5ndHVtX3NlY3AyNTZrMSIsInRpbWUiOjEyMzQ1Nn0.MEUCIH546Iz3wqdTgTLHJg3czMbQqLVJHj9iddqXPIr6MnG9AiEAkvKelTLl-ZWvCNJ9O8rWHhksuggz_jgg8wEM44mf9xk"
        );
        const result = webToken.verify(token);
        expect(result).toEqual(true);
      }
    });

    it("should sign and verify when is ed25519", () => {
      const seeds = [
        "sEdVrj9hBjNTPGnm4qN4iVXSQv7KMzB",
        "ED8158dad1de9d8e5ea0e71f63460fdee008f98ec0e68e2390b9b76d34340d87f0"
      ];
      for (const seed of seeds) {
        const webToken = new JingtumWebToken(seed);
        const token = webToken.sign({
          usr: "jingtum_ed25519",
          time: 123456
        });
        expect(token).toEqual(
          "eyJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1Db3dCUVlESzJWd0F5RUFPREVoam8rdzlDN2JmaUZueUl1UnE1RDQ5VjBjZ1hxUE9hVllWclFDMTVzPVxuLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tXG4iXSwidHlwZSI6IkNXVCIsImNoYWluIjoiamluZ3R1bSIsImFsZyI6ImVkMjU1MTkifQ.eyJ1c3IiOiJqaW5ndHVtX2VkMjU1MTkiLCJ0aW1lIjoxMjM0NTZ9.LWbHcA6KzFlhVeBGGo49R5kkQm4MvszKhNUBvH-mRo8YADqx9uBPdByUPYihtNBtQOtzFj4H-jQReMfWggRTCw"
        );
        const result = webToken.verify(token);
        expect(result).toEqual(true);
      }
    });
  });

  describe("RippleWebToken", () => {
    it("should sign and verify when is secp256k1", () => {
      const webToken = new RippleWebToken("snhfP8ByWeWKWYNWBnr2avbxGCZwt");
      const token = webToken.sign({
        usr: "ripple_secp256k1",
        time: 123456
      });
      expect(token).toEqual(
        "eyJhbGciOiJzZWNwMjU2azEiLCJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1GWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RRZ0FFRVBqa0hyNzhkL0hLWStydEJKeUIzUmJ0Z2kzRkFDbEFcbmVLSkFjcmNrdTlQem4yZ2JYdWtxZFBDY1piNWE5WTd4MGNIUXlGNTdWZVZ3NHFST0dVWEZ5QT09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iXSwidHlwZSI6IkNXVCIsImNoYWluIjoicmlwcGxlIn0.eyJ1c3IiOiJyaXBwbGVfc2VjcDI1NmsxIiwidGltZSI6MTIzNDU2fQ.MEYCIQC3eDWgR4x1CloEpwXleU_78mSxeInkkitIoUqLXj5QsgIhAORpP_e3_EgJsN2SoGLlFVxPYvbpXxM0xstIa3H7uyZN"
      );
      const result = webToken.verify(token);
      expect(result).toEqual(true);
    });

    it("should sign and verify when is ed25519", () => {
      const webToken = new RippleWebToken("sEdTSMh6UwzwexTFEkyvXc5bxWzTs2n");
      const token = webToken.sign({
        usr: "ripple_ed25519",
        time: 123456
      });
      expect(token).toEqual(
        "eyJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1Db3dCUVlESzJWd0F5RUFZSkQ4T1NTdWpYd0hienhBZFFNYUcvZXJkQVRtYllndTVmZVdmRjhRdWJZPVxuLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tXG4iXSwidHlwZSI6IkNXVCIsImNoYWluIjoicmlwcGxlIiwiYWxnIjoiZWQyNTUxOSJ9.eyJ1c3IiOiJyaXBwbGVfZWQyNTUxOSIsInRpbWUiOjEyMzQ1Nn0.6OIV2UMf5XljJufU85SEBkQxXH_OoalViw4RLpDwa-wt9T7hUCT3FyEKDm_cB63YuyUVFrBxnxuuMzthBHUIDA"
      );
      const result = webToken.verify(token);
      expect(result).toEqual(true);
    });
  });

  describe("EthereumWebToken", () => {
    it("should sign and verify when", () => {
      const webToken = new EthereumWebToken("105d31c6d6b19fdac7e3873572f5e1cd787afe912344a4bf3984d94b0cbb8876");
      const token = webToken.sign({
        usr: "zhye",
        time: 123456
      });
      expect(token).toEqual(
        "eyJhbGciOiJzZWNwMjU2azEiLCJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1GWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RRZ0FFaWJpcmx6eEtnZ0EzNWp1TUNtSmRhbUNDZ0hhOE9ZSkdcbk9HMFlIRzYxMUk5UDdrTEFBYlNqNGg0SFJHeUNSZnA0Ky9ndkxtcGU1Uis3UFV2bDNHU0NvZz09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iXSwidHlwZSI6IkNXVCIsImNoYWluIjoiZXRoZXJldW0ifQ.eyJ1c3IiOiJ6aHllIiwidGltZSI6MTIzNDU2fQ.MEUCIE3axEM6gUxa241Zh34qxRgdK6xvb0XIfhYb3iDdhF6eAiEApW_VSSQD0SywwWkgTir9zJSqi1gyV9jlsSrpruuHxd8"
      );
      const result = webToken.verify(token);
      expect(result).toEqual(true);
    });
  });

  describe("BitcoinWebToken", () => {
    it("should sign and verify when", () => {
      const webToken = new BitcoinWebToken("b9d70b775092fc32eea9868c719eda3dbc8e11fae28be95e0a5bd6bf432d3732");
      const token = webToken.sign({
        usr: "bitcoin_secp256k1",
        time: 123456
      });
      expect(token).toEqual(
        "eyJhbGciOiJzZWNwMjU2azEiLCJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1GWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RRZ0FFS1duUnc4K3V5SXhYZkxEbXFKbGR3WUlzRlpMTWcrdG5cbmdZd3NxZWZpMGVBNjZRdUJuMTNVcG96cHJrdGIvb2pCNlBKYm1YRi8ydUJuK1d6SlUvVVpRQT09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iXSwidHlwZSI6IkNXVCIsImNoYWluIjoiYml0Y29pbiJ9.eyJ1c3IiOiJiaXRjb2luX3NlY3AyNTZrMSIsInRpbWUiOjEyMzQ1Nn0.MEUCIQDOzoyh20XQIF5fejukzAliBOvBXgxUYCzROEMxapFaDQIgZ5ou9whhrTSCZeuoa8UijA5fMh-tjZx4QAteHXzx5Jg"
      );
      const result = webToken.verify(token);
      expect(result).toEqual(true);
    });
  });
});
