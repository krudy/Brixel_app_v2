const axios = require("axios");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");

const consumerKey = process.env.BRICKLINK_CONSUMER_KEY;
const consumerSecret = process.env.BRICKLINK_CONSUMER_SECRET;
const tokenValue = process.env.BRICKLINK_TOKEN_VALUE;
const tokenSecret = process.env.BRICKLINK_TOKEN_SECRET;

const oauth = OAuth({
  consumer: { key: consumerKey, secret: consumerSecret },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

async function getAvgPrice(itemNo = "3001", colorId = 1) {
  const url = `https://api.bricklink.com/api/store/v1/items/part/${itemNo}/price?color_id=${colorId}`;
  
  const requestData = { url, method: "GET" };
  const headers = oauth.toHeader(
    oauth.authorize(requestData, { key: tokenValue, secret: tokenSecret })
  );

  try {
    const res = await axios.get(url, { headers });
    const priceDetail = res.data.data?.avg_price ?? null;
    return priceDetail;
  } catch (err) {
    console.error("BrickLink API error:", err.message);
    return null;
  }
}

module.exports = { getAvgPrice };