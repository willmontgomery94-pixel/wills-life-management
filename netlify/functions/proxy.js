exports.handler = async function (event) {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxx7AX6OrDSHfEmF4V70hkGFYzGWoDh76yfs3DK0ZkIvGr8ZkSvhvnEr2bJZM0lV0U/exec";

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  const url =
    event.httpMethod === "GET"
      ? `${APPS_SCRIPT_URL}?${new URLSearchParams(event.queryStringParameters || {})}`
      : APPS_SCRIPT_URL;

  const fetchOptions =
    event.httpMethod === "POST"
      ? { method:"POST", headers:{"Content-Type":"text/plain"}, body:event.body, redirect:"follow" }
      : { method:"GET", redirect:"follow" };

  try {
    const response = await fetch(url, fetchOptions);
    const text = await response.text();
    return { statusCode:200, headers:{...headers,"Content-Type":"application/json"}, body:text };
  } catch(err) {
    return { statusCode:500, headers, body:JSON.stringify({ok:false,error:err.message}) };
  }
};
