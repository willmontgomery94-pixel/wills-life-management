exports.handler = async function (event) {
  const SUPA_URL = "https://igpmsxxnvzbnbnmyumfn.supabase.co";
  const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncG1zeHhudnpibmJubXl1bWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzYwMTUsImV4cCI6MjA5NDM1MjAxNX0.ucTwrrsXZkVlGWyTzU1svLpr2RXyBjOCV6UoK3FpRhU";

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, apikey, Authorization, Prefer",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  // Strip the /.netlify/functions/proxy prefix to get the Supabase path
  // e.g. /.netlify/functions/proxy/rest/v1/pay?id=eq.1
  const path = event.path.replace("/.netlify/functions/proxy", "") || "/";
  const qs   = event.rawQuery ? "?" + event.rawQuery : "";
  const url  = SUPA_URL + path + qs;

  const supaHeaders = {
    "Content-Type": "application/json",
    "apikey": SUPA_KEY,
    "Authorization": "Bearer " + SUPA_KEY,
  };

  // Forward Prefer header if present
  if (event.headers["prefer"]) {
    supaHeaders["Prefer"] = event.headers["prefer"];
  }

  try {
    const response = await fetch(url, {
      method:  event.httpMethod,
      headers: supaHeaders,
      body:    ["GET","HEAD","DELETE"].includes(event.httpMethod) ? undefined : event.body,
    });

    const text = await response.text();
    return {
      statusCode: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: text || "[]",
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
