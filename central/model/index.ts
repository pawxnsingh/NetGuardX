import { Schema, model } from "mongoose"; // i guess types errors will arise

// IP Range Schema
const IPRangeSchema = new Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
});

// Rule Schema
const RuleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  ipAddresses: [String],
  ipRanges: [IPRangeSchema],
  urlPattern: String,
  methods: [
    {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    },
  ],
  headers: [
    {
      key: String,
      value: String,
    },
  ],
  bodyPatterns: [String],
  action: { type: String, enum: ["ALLOW", "BLOCK", "LOG"], required: true },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

// Policy Schema
const PolicySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  rules: [{ type: Schema.Types.ObjectId, ref: "Rule" }],
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

// Request Log Schema
const RequestLogSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  method: String,
  url: String,
  headers: Object,
  body: String,
  action: { type: String, enum: ["ALLOWED", "BLOCKED", "LOGGED"] },
  matchedRule: { type: Schema.Types.ObjectId, ref: "Rule" },
  responseStatus: Number,
  responseTime: Number,
});

// Create models
const IPRange = model("IPRange", IPRangeSchema);
const Rule =model("Rule", RuleSchema);
const Policy = model("Policy", PolicySchema);
const RequestLog = model("RequestLog", RequestLogSchema);

module.exports = { IPRange, Rule, Policy, RequestLog };
