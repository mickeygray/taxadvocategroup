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
      name: "What makes Tax Advocate Group different from other tax firms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We follow a structured three-phase process—Investigation, Compliance, and Resolution—that ensures we fully understand your situation before recommending a path forward. Our team includes enrolled agents and tax attorneys licensed in all 50 states, and we back our work with a money-back guarantee.",
      },
    },
    {
      "@type": "Question",
      name: "How does the tax resolution process work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We file Power of Attorney to pull your IRS transcripts and assess your full tax picture. Next, we bring all unfiled returns current. Finally, we negotiate the best available resolution: an installment agreement, Offer in Compromise, penalty abatement, or Currently Not Collectible status.",
      },
    },
    {
      "@type": "Question",
      name: "What is an Offer in Compromise, and will I qualify?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An Offer in Compromise lets you settle IRS debt for less than you owe. Qualification depends on income, expenses, assets, and ability to pay. We analyze your financials against the IRS formula during your free consultation so you'll know upfront whether an OIC is realistic.",
      },
    },
    {
      "@type": "Question",
      name: "Can you stop a wage garnishment or bank levy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Once we file Power of Attorney, we contact the IRS or state agency to request an immediate release or reduction of the levy. In many cases, we can get garnishments stopped within days by demonstrating financial hardship or proposing an alternative arrangement.",
      },
    },
    {
      "@type": "Question",
      name: "Do you handle state tax problems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We work with all 50 state tax authorities in addition to the IRS. State agencies have their own garnishment and lien procedures, and we know how to navigate each one.",
      },
    },
    {
      "@type": "Question",
      name: "What do I need for my free consultation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Just your most recent IRS notice (if you have one) and a general idea of the tax years involved. We handle the rest, including pulling your IRS transcripts. Call 1-800-517-1807 or fill out our contact form to get started.",
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
  image: "https://www.taxadvocategroup.com/images/hero-19.png",
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

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `https://www.taxadvocategroup.com${item.path}`,
  })),
});
