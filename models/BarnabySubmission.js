// models/BarnabySubmission.js
const mongoose = require("mongoose");

const barnabySubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    contactPref: { type: String, enum: ["email", "phone", "both"], required: true },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    // Tax Situation Intake
    issues: [String],
    balanceBand: String,
    noticeType: String,
    taxScope: String,
    state: String,
    filerType: String,
    intakeSummary: String,

    // Question & Answer
    question: { type: String, required: true },
    answer: { type: String, required: true },

    // Conversation History (from cookie)
    conversationHistory: [
      {
        q: String,
        a: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    aiSummary: String,

    // Session Metadata
    ipAddress: String,
    userAgent: String,
    sessionDuration: Number,
    questionsAsked: Number,

    status: {
      type: String,
      enum: ["submitted", "contacted", "scheduled", "converted", "archived"],
      default: "submitted",
    },

    notes: String,
    followUpDate: Date,
    assignedTo: String,

    source: { type: String, default: "tax-barnaby-widget" },
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
  },
  { timestamps: true }
);

barnabySubmissionSchema.index({ email: 1 });
barnabySubmissionSchema.index({ phone: 1 });
barnabySubmissionSchema.index({ createdAt: -1 });
barnabySubmissionSchema.index({ status: 1 });

barnabySubmissionSchema.virtual("displayName").get(function () {
  return this.name || this.email;
});

barnabySubmissionSchema.methods.formatForEmail = function () {
  const issueLabels = {
    balance_due: "Balance due",
    irs_notice: "IRS notice",
    unfiled: "Unfiled returns",
    levy_lien: "Levy/Lien",
    audit: "Audit/Exam",
  };
  const amountLabels = {
    lt10k: "Under $10k",
    "10to50k": "$10k-$50k",
    gt50k: "Over $50k",
    unsure: "Not sure",
  };
  const noticeLabels = {
    none: "No notice",
    cp504: "CP504",
    levy: "Levy / Final notice",
    other: "Something else",
  };

  return {
    name: this.name,
    email: this.email,
    phone: this.phone || "Not provided",
    contactPref: this.contactPref,
    issues: this.issues?.map((id) => issueLabels[id] || id).join(", ") || "None",
    amount: amountLabels[this.balanceBand] || this.balanceBand || "Not provided",
    notice: noticeLabels[this.noticeType] || this.noticeType || "Not provided",
    taxScope: this.taxScope || "Not provided",
    state: this.state || "Not applicable",
    filerType: this.filerType || "Not provided",
    summary: this.intakeSummary || "Not provided",
    question: this.question,
    answer: this.answer,
    conversationHistory: this.conversationHistory || [],
    questionsAsked: this.questionsAsked || 0,
    submittedAt: this.createdAt,
  };
};

module.exports = mongoose.model("BarnabySubmission", barnabySubmissionSchema);
