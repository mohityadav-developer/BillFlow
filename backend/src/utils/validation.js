function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}
function requireFields(body, fields) {
  return fields.filter((field) => !String(body[field] ?? "").trim());
}
module.exports = { isEmail, requireFields };
