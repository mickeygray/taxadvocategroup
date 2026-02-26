// utils/structuredData.js — Tax Advocate Group

const organization = {
  "@type": "Organization",
  name: "Tax Advocate Group",
  url: "https://www.taxadvocategroup.com",
  logo: "https://www.taxadvocategroup.com/images/tax-advocate-group-logo-small.png",
  telephone: "+1-800-517-1807",
  address: {
    "@type": "PostalAddress",
    streetAddress: "21625 Prairie Street, Suite #200",
    addressLocality: "Chatsworth",
    addressRegion: "CA",
    postalCode: "91331",
    addressCountry: "US",
  },
};

export const orgSchema = {
  "@context": "https://schema.org",
  ...organization,
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Tax Advocate Group",
  image:
    "https://www.taxadvocategroup.com/images/tax-advocate-group-logo-small.png",
  url: "https://www.taxadvocategroup.com",
  telephone: "+1-800-517-1807",
  priceRange: "$$",
  address: organization.address,
  geo: {
    "@type": "GeoCoordinates",
    latitude: 34.2572,
    longitude: -118.5981,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "07:00",
    closes: "17:00",
  },
  areaServed: { "@type": "Country", name: "US" },
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What services does Tax Advocate Group offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer tax preparation, tax consultation, tax resolution, tax negotiation, and protection plans. Whether you need help with IRS notices, tax debt settlement, or proactive planning, we have the expertise to assist you.",
      },
    },
    {
      "@type": "Question",
      name: "How does the tax resolution process work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The process begins with a free consultation to understand your tax issues and financial situation. From there, we identify the best resolution options, such as installment agreements, penalty abatements, or offers in compromise. We handle all communication with the IRS on your behalf.",
      },
    },
    {
      "@type": "Question",
      name: "What is an Offer in Compromise, and how do I qualify?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An Offer in Compromise allows taxpayers to settle their tax debt for less than the full amount owed. Eligibility depends on your financial situation, ability to pay, and compliance history. Tax Advocate Group can evaluate whether you qualify.",
      },
    },
    {
      "@type": "Question",
      name: "Can you help with state tax issues?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we assist with state tax issues including back taxes, liens, garnishments, and penalties. Our team is experienced in dealing with both federal and state tax authorities across all 50 states.",
      },
    },
    {
      "@type": "Question",
      name: "Will you represent me in an IRS audit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide full audit representation to protect your rights and ensure your case is handled properly.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get started?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Call us at 1-800-517-1807 or fill out our contact form for a free consultation. We'll review your situation, answer your questions, and recommend the best solutions for your tax challenges.",
      },
    },
  ],
};

export const serviceSchema = (name, description, serviceType) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  provider: organization,
  areaServed: { "@type": "Country", name: "US" },
  serviceType,
});

export const blogPostingSchema = (blog) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: blog.contentTitle,
  description: blog.teaser,
  image: blog.image?.startsWith("http")
    ? blog.image
    : `https://www.taxadvocategroup.com${blog.image}`,
  author: organization,
  publisher: {
    "@type": "Organization",
    name: "Tax Advocate Group",
    logo: {
      "@type": "ImageObject",
      url: "https://www.taxadvocategroup.com/images/tax-advocate-group-logo-small.png",
    },
  },
  url: `https://www.taxadvocategroup.com/tax-news/${blog.id}`,
  mainEntityOfPage: `https://www.taxadvocategroup.com/tax-news/${blog.id}`,
});

export const statePageSchema = (state) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: `${state.name} Tax Relief Services`,
  description:
    state.summary ||
    `Tax relief and resolution services for ${state.name} residents. Help with ${state.taxAuthority} and IRS issues.`,
  provider: organization,
  areaServed: {
    "@type": "State",
    name: state.name,
    containedInPlace: { "@type": "Country", name: "US" },
  },
  serviceType: "Tax Relief",
  url: `https://www.taxadvocategroup.com/state-tax-guide/${state.slug}`,
});
