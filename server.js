require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT || 5000;
// Middleware
connectDB();
app.use(express.json());
app.use(cors());

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.TAXAD_API_KEY,
  },
});

// Handle Contact Form Submission
app.post("/send-email", async (req, res) => {
  const { name, email, message, phone } = req.body;
  console.log(req.body);
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const mailOptions = {
    from: "inquiry@taxadvocategroup.com",
    to: "office@taxadvocategroup.com",
    subject: `New Inquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email. Try again later." });
  }
});

// Serve Dynamic Sitemap
app.get("/sitemap.xml", async (req, res) => {
  const links = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/about-us", changefreq: "monthly", priority: 0.7 },
    { url: "/our-tax-services", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-relief", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-resolution", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-negotiation", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-protection-plans", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-faqs", changefreq: "monthly", priority: 0.6 },
    { url: "/contact-us", changefreq: "yearly", priority: 0.5 },
    { url: "/tax-news", changefreq: "weekly", priority: 0.6 },
    { url: "/state-tax-guide", changefreq: "monthly", priority: 0.8 },
    { url: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
    { url: "/terms-of-service", changefreq: "yearly", priority: 0.3 },
  ];

  // Add state tax guide pages
  const statesSlugs = [
    "state-income-tax-help-alabama", "state-income-tax-help-alaska",
    "state-income-tax-help-arizona", "state-income-tax-help-arkansas",
    "state-income-tax-help-california", "state-income-tax-help-colorado",
    "state-income-tax-help-connecticut", "state-income-tax-help-delaware",
    "state-income-tax-help-florida", "state-income-tax-help-georgia",
    "state-income-tax-help-hawaii", "state-income-tax-help-idaho",
    "state-income-tax-help-illinois", "state-income-tax-help-indiana",
    "state-income-tax-help-iowa", "state-income-tax-help-kansas",
    "state-income-tax-help-kentucky", "state-income-tax-help-louisiana",
    "state-income-tax-help-maine", "state-income-tax-help-maryland",
    "state-income-tax-help-massachusetts", "state-income-tax-help-michigan",
    "state-income-tax-help-minnesota", "state-income-tax-help-mississippi",
    "state-income-tax-help-missouri", "state-income-tax-help-montana",
    "state-income-tax-help-nebraska", "state-income-tax-help-nevada",
    "state-income-tax-help-new-hampshire", "state-income-tax-help-new-jersey",
    "state-income-tax-help-new-mexico", "state-income-tax-help-new-york",
    "state-income-tax-help-north-carolina", "state-income-tax-help-north-dakota",
    "state-income-tax-help-ohio", "state-income-tax-help-oklahoma",
    "state-income-tax-help-oregon", "state-income-tax-help-pennsylvania",
    "state-income-tax-help-rhode-island", "state-income-tax-help-south-carolina",
    "state-income-tax-help-south-dakota", "state-income-tax-help-tennessee",
    "state-income-tax-help-texas", "state-income-tax-help-utah",
    "state-income-tax-help-vermont", "state-income-tax-help-virginia",
    "state-income-tax-help-washington", "state-income-tax-help-west-virginia",
    "state-income-tax-help-wisconsin", "state-income-tax-help-wyoming",
  ];
  statesSlugs.forEach((slug) => {
    links.push({
      url: `/state-tax-guide/${slug}`,
      changefreq: "monthly",
      priority: 0.6,
    });
  });

  // Add dynamic blog posts
  const blogRoutes = ["understanding-tax-relief", "irs-negotiation-tips"];
  blogRoutes.forEach((slug) => {
    links.push({
      url: `/tax-news/${slug}`,
      changefreq: "monthly",
      priority: 0.6,
    });
  });

  // Create a sitemap stream
  const stream = new SitemapStream({
    hostname: "https://www.taxadvocategroup.com",
  });

  // Convert stream to XML by pushing links
  const xml = await streamToPromise(Readable.from(links)).then((data) => {
    links.forEach((link) => stream.write(link));
    stream.end();
    return data;
  });

  res.header("Content-Type", "application/xml");
  res.send(xml);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
