process.loadEnvFile();

const url = process.env.APPS_SCRIPT_URL;
if (!url) {
  console.error("ERROR: APPS_SCRIPT_URL not set in .env");
  process.exit(1);
}

let jsonInput;
if (process.argv[2]) {
  jsonInput = process.argv[2];
} else {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  jsonInput = Buffer.concat(chunks).toString();
}

let data;
try {
  data = JSON.parse(jsonInput);
} catch {
  console.error("ERROR: Invalid JSON input");
  process.exit(1);
}

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    redirect: "follow",
  });
  const text = await res.text();
  console.log(text);
} catch (err) {
  console.error("ERROR: POST failed -", err.message);
  process.exit(1);
}
