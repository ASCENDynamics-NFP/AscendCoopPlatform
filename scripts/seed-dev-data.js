/*
 * scripts/seed-dev-data.js
 *
 * Populates the ascendcoopplatform-dev Firestore with realistic mock
 * listings (with geopoints) and group accounts (organizations).
 *
 * Usage:
 *   node scripts/seed-dev-data.js
 *
 * Requirements:
 *   - firebase-admin installed in functions/node_modules (already present)
 *   - Application Default Credentials OR GOOGLE_APPLICATION_CREDENTIALS env var.
 *     Easiest for dev: run  `firebase login` then
 *     `gcloud auth application-default login` once, or set
 *     GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
 *
 * The script is idempotent: it uses fixed document IDs so re-running it
 * only overwrites the same documents rather than duplicating data.
 */

const path = require("path");

// Reuse firebase-admin from the functions workspace so we don't need a
// separate install.
const admin = require(
  path.join(__dirname, "../functions/node_modules/firebase-admin"),
);

const PROJECT_ID = "ascendcoopplatform-dev";

admin.initializeApp({projectId: PROJECT_ID});

const db = admin.firestore();
const GeoPoint = admin.firestore.GeoPoint;
const Timestamp = admin.firestore.Timestamp;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
const now = Timestamp.now();

function ts(offsetDays = 0) {
  return Timestamp.fromMillis(Date.now() + offsetDays * 86_400_000);
}

// ---------------------------------------------------------------------------
// Mock organizations (type: "group" accounts)
// ---------------------------------------------------------------------------
const ORGS = [
  {
    id: "org-greenroots-chicago",
    name: "GreenRoots Chicago",
    tagline: "Urban gardening and food justice for all",
    description:
      "GreenRoots Chicago cultivates community gardens across the South Side, providing fresh produce and hands-on environmental education to underserved neighborhoods.",
    type: "group",
    status: "active",
    email: "hello@greenrootschicago.example.org",
    iconImage: "https://picsum.photos/seed/greenroots/200/200",
    heroImage: "https://picsum.photos/seed/greenrootshero/800/400",
    webLinks: [
      {
        name: "Website",
        url: "https://greenrootschicago.example.org",
        category: "Website",
      },
    ],
    contactInformation: {
      addresses: [
        {
          name: "Main Office",
          street: "6200 S Cottage Grove Ave",
          city: "Chicago",
          state: "IL",
          zipcode: "60637",
          country: "US",
          formatted: "6200 S Cottage Grove Ave, Chicago, IL 60637",
          geopoint: new GeoPoint(41.7815, -87.6063),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [
        {number: "+1-312-555-0101", type: "office", isEmergencyNumber: false},
      ],
      emails: [{name: "General", email: "hello@greenrootschicago.example.org"}],
      preferredMethodOfContact: "Email",
    },
    groupDetails: {
      groupType: "Nonprofit",
      groupObjectivesMissionStatement:
        "To build food sovereignty and ecological resilience in Chicago's underserved communities.",
      supportedLanguages: ["English", "Spanish"],
    },
    groupCategoriesInterests: {
      primaryCategory: "Environment",
      secondaryCategories: ["Food Security", "Community Service"],
      tagsKeywords: ["gardening", "food justice", "urban farming"],
    },
    legalAgreements: {
      termsOfService: {accepted: true, datetime: now, version: "1.0"},
      privacyPolicy: {accepted: true, datetime: now, version: "1.0"},
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "org-techbridge-nyc",
    name: "TechBridge NYC",
    tagline: "Closing the digital divide one class at a time",
    description:
      "TechBridge NYC provides free coding bootcamps, digital literacy workshops, and refurbished laptops to low-income residents across the five boroughs.",
    type: "group",
    status: "active",
    email: "info@techbridgenyc.example.org",
    iconImage: "https://picsum.photos/seed/techbridge/200/200",
    heroImage: "https://picsum.photos/seed/techbridgehero/800/400",
    webLinks: [
      {
        name: "Website",
        url: "https://techbridgenyc.example.org",
        category: "Website",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/company/techbridge-nyc-example",
        category: "Social Media",
      },
    ],
    contactInformation: {
      addresses: [
        {
          name: "Headquarters",
          street: "350 5th Ave",
          city: "New York",
          state: "NY",
          zipcode: "10118",
          country: "US",
          formatted: "350 5th Ave, New York, NY 10118",
          geopoint: new GeoPoint(40.7484, -73.9856),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [
        {number: "+1-212-555-0202", type: "office", isEmergencyNumber: false},
      ],
      emails: [{name: "General", email: "info@techbridgenyc.example.org"}],
      preferredMethodOfContact: "Email",
    },
    groupDetails: {
      groupType: "Nonprofit",
      groupObjectivesMissionStatement:
        "Bridging the digital divide through education, access, and community support.",
      supportedLanguages: ["English", "Spanish", "Mandarin"],
    },
    groupCategoriesInterests: {
      primaryCategory: "Education",
      secondaryCategories: ["Technology", "Digital Literacy"],
      tagsKeywords: ["coding", "bootcamp", "digital equity"],
    },
    legalAgreements: {
      termsOfService: {accepted: true, datetime: now, version: "1.0"},
      privacyPolicy: {accepted: true, datetime: now, version: "1.0"},
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "org-homeward-la",
    name: "Homeward LA",
    tagline: "Stable housing for every Angeleno",
    description:
      "Homeward LA connects unhoused individuals with emergency shelter, transitional housing, legal aid, and wraparound social services throughout Los Angeles County.",
    type: "group",
    status: "active",
    email: "connect@homewardla.example.org",
    iconImage: "https://picsum.photos/seed/homeward/200/200",
    heroImage: "https://picsum.photos/seed/homewardhero/800/400",
    webLinks: [
      {
        name: "Website",
        url: "https://homewardla.example.org",
        category: "Website",
      },
    ],
    contactInformation: {
      addresses: [
        {
          name: "Main Office",
          street: "221 S Figueroa St",
          city: "Los Angeles",
          state: "CA",
          zipcode: "90012",
          country: "US",
          formatted: "221 S Figueroa St, Los Angeles, CA 90012",
          geopoint: new GeoPoint(34.0522, -118.2437),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [
        {number: "+1-213-555-0303", type: "office", isEmergencyNumber: false},
      ],
      emails: [{name: "General", email: "connect@homewardla.example.org"}],
      preferredMethodOfContact: "Email",
    },
    groupDetails: {
      groupType: "Nonprofit",
      groupObjectivesMissionStatement:
        "End homelessness in Los Angeles through housing-first, trauma-informed services.",
      supportedLanguages: ["English", "Spanish", "Korean"],
    },
    groupCategoriesInterests: {
      primaryCategory: "Housing",
      secondaryCategories: ["Social Services", "Advocacy"],
      tagsKeywords: ["housing", "homelessness", "social services"],
    },
    legalAgreements: {
      termsOfService: {accepted: true, datetime: now, version: "1.0"},
      privacyPolicy: {accepted: true, datetime: now, version: "1.0"},
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "org-brightminds-houston",
    name: "BrightMinds Houston",
    tagline: "After-school tutoring for underserved youth",
    description:
      "BrightMinds Houston delivers free after-school STEM and literacy tutoring to K-12 students across Houston's Title I schools, partnering with local universities for volunteer tutors.",
    type: "group",
    status: "active",
    email: "tutors@brightmindshouston.example.org",
    iconImage: "https://picsum.photos/seed/brightminds/200/200",
    heroImage: "https://picsum.photos/seed/brightmindshero/800/400",
    webLinks: [
      {
        name: "Website",
        url: "https://brightmindshouston.example.org",
        category: "Website",
      },
    ],
    contactInformation: {
      addresses: [
        {
          name: "Program Center",
          street: "1001 Avenida De Las Americas",
          city: "Houston",
          state: "TX",
          zipcode: "77010",
          country: "US",
          formatted: "1001 Avenida De Las Americas, Houston, TX 77010",
          geopoint: new GeoPoint(29.7604, -95.3698),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [
        {number: "+1-713-555-0404", type: "office", isEmergencyNumber: false},
      ],
      emails: [
        {
          name: "Volunteer Desk",
          email: "tutors@brightmindshouston.example.org",
        },
      ],
      preferredMethodOfContact: "Email",
    },
    groupDetails: {
      groupType: "Nonprofit",
      groupObjectivesMissionStatement:
        "Empower the next generation through accessible, high-quality academic support.",
      supportedLanguages: ["English", "Spanish", "Vietnamese"],
    },
    groupCategoriesInterests: {
      primaryCategory: "Education",
      secondaryCategories: ["Youth Development", "STEM"],
      tagsKeywords: ["tutoring", "stem", "after-school"],
    },
    legalAgreements: {
      termsOfService: {accepted: true, datetime: now, version: "1.0"},
      privacyPolicy: {accepted: true, datetime: now, version: "1.0"},
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "org-coopworks-portland",
    name: "CoopWorks Portland",
    tagline: "Worker-owned futures in the Pacific Northwest",
    description:
      "CoopWorks Portland incubates worker cooperatives, offering business planning workshops, legal support, and peer-to-peer mentorship for aspiring co-op founders.",
    type: "group",
    status: "active",
    email: "hello@coopworkspdx.example.org",
    iconImage: "https://picsum.photos/seed/coopworks/200/200",
    heroImage: "https://picsum.photos/seed/coopworkshero/800/400",
    webLinks: [
      {
        name: "Website",
        url: "https://coopworkspdx.example.org",
        category: "Website",
      },
    ],
    contactInformation: {
      addresses: [
        {
          name: "Co-op Hub",
          street: "1120 NW Couch St",
          city: "Portland",
          state: "OR",
          zipcode: "97209",
          country: "US",
          formatted: "1120 NW Couch St, Portland, OR 97209",
          geopoint: new GeoPoint(45.5231, -122.6765),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [
        {number: "+1-503-555-0505", type: "office", isEmergencyNumber: false},
      ],
      emails: [{name: "General", email: "hello@coopworkspdx.example.org"}],
      preferredMethodOfContact: "Email",
    },
    groupDetails: {
      groupType: "Worker Cooperative",
      groupObjectivesMissionStatement:
        "Build a democratic economy by supporting the growth of worker-owned businesses.",
      supportedLanguages: ["English"],
    },
    groupCategoriesInterests: {
      primaryCategory: "Economic Justice",
      secondaryCategories: ["Worker Cooperatives", "Community Development"],
      tagsKeywords: ["cooperative", "worker-owned", "economic democracy"],
    },
    legalAgreements: {
      termsOfService: {accepted: true, datetime: now, version: "1.0"},
      privacyPolicy: {accepted: true, datetime: now, version: "1.0"},
    },
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

// ---------------------------------------------------------------------------
// Mock listings — each references one of the orgs above
// ---------------------------------------------------------------------------
const LISTINGS = [
  // --- GreenRoots Chicago ---
  {
    id: "listing-greenroots-garden-coord",
    title: "Community Garden Coordinator",
    description:
      "Help plan and manage weekend planting sessions at our Woodlawn garden site. You'll coordinate 10-20 volunteers, order supplies, and track harvest yields.",
    type: "volunteer",
    organization: "GreenRoots Chicago",
    ownerAccountId: "org-greenroots-chicago",
    ownerAccountType: "group",
    remote: false,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing1/200/200",
    skills: [
      {name: "Project Management", level: "intermediate", required: true},
      {name: "Community Outreach", level: "beginner", required: false},
    ],
    timeCommitment: {
      hoursPerWeek: 8,
      duration: "6 months",
      schedule: "Saturdays 9am–5pm",
      startDate: ts(14),
      isFlexible: false,
    },
    requirements: ["Must be 18+", "Reliable transportation to South Side"],
    responsibilities: [
      "Coordinate volunteer schedules",
      "Manage planting and harvest logistics",
      "Report weekly yield data",
    ],
    benefits: ["Free CSA share", "Letter of recommendation"],
    contactInformation: {
      addresses: [
        {
          name: "Woodlawn Garden Site",
          street: "6200 S Cottage Grove Ave",
          city: "Chicago",
          state: "IL",
          zipcode: "60637",
          country: "US",
          formatted: "6200 S Cottage Grove Ave, Chicago, IL 60637",
          geopoint: new GeoPoint(41.7815, -87.6063),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [],
      emails: [
        {name: "Volunteer", email: "volunteer@greenrootschicago.example.org"},
      ],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "listing-greenroots-social-media",
    title: "Social Media & Storytelling Intern",
    description:
      "Create compelling Instagram and TikTok content showcasing our gardens, volunteers, and harvest events. 10 hrs/week, fully remote.",
    type: "internship",
    organization: "GreenRoots Chicago",
    ownerAccountId: "org-greenroots-chicago",
    ownerAccountType: "group",
    remote: true,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing2/200/200",
    skills: [
      {name: "Social Media", level: "intermediate", required: true},
      {name: "Graphic Design", level: "beginner", required: false},
    ],
    timeCommitment: {
      hoursPerWeek: 10,
      duration: "3 months",
      schedule: "Flexible",
      startDate: ts(7),
      isFlexible: true,
    },
    requirements: ["Portfolio of social media work"],
    responsibilities: [
      "Post 4x/week",
      "Create monthly recap video",
      "Respond to comments",
    ],
    benefits: ["Internship credit", "Portfolio pieces"],
    contactInformation: {
      addresses: [
        {
          name: "Remote",
          city: "Chicago",
          state: "IL",
          country: "US",
          geopoint: new GeoPoint(41.8781, -87.6298),
          isPrimaryAddress: true,
          remote: true,
        },
      ],
      phoneNumbers: [],
      emails: [
        {
          name: "Internships",
          email: "internships@greenrootschicago.example.org",
        },
      ],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
  // --- TechBridge NYC ---
  {
    id: "listing-techbridge-python-instructor",
    title: "Python Bootcamp Instructor",
    description:
      "Teach a 10-week introductory Python course to adults transitioning careers. Curriculum provided; you bring enthusiasm and patience.",
    type: "volunteer",
    organization: "TechBridge NYC",
    ownerAccountId: "org-techbridge-nyc",
    ownerAccountType: "group",
    remote: false,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing3/200/200",
    skills: [
      {name: "Python", level: "advanced", required: true},
      {name: "Teaching", level: "intermediate", required: true},
    ],
    timeCommitment: {
      hoursPerWeek: 6,
      duration: "10 weeks",
      schedule: "Tuesday/Thursday evenings 6–9pm",
      startDate: ts(21),
      isFlexible: false,
    },
    requirements: ["2+ years professional Python experience"],
    responsibilities: [
      "Deliver lectures",
      "Grade projects",
      "Hold office hours",
    ],
    benefits: ["Certificate of service", "Networking with alumni"],
    contactInformation: {
      addresses: [
        {
          name: "Empire State Training Center",
          street: "350 5th Ave",
          city: "New York",
          state: "NY",
          zipcode: "10118",
          country: "US",
          formatted: "350 5th Ave, New York, NY 10118",
          geopoint: new GeoPoint(40.7484, -73.9856),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [],
      emails: [{name: "Programs", email: "programs@techbridgenyc.example.org"}],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "listing-techbridge-fullstack-dev",
    title: "Full-Stack Developer (Part-Time Contract)",
    description:
      "Build and maintain our volunteer-matching web app. React frontend, Node.js/Express backend, Firebase. 20 hrs/week, remote-friendly.",
    type: "gig",
    organization: "TechBridge NYC",
    ownerAccountId: "org-techbridge-nyc",
    ownerAccountType: "group",
    remote: true,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing4/200/200",
    skills: [
      {name: "TypeScript", level: "advanced", required: true},
      {name: "Node.js", level: "intermediate", required: true},
      {name: "Angular", level: "intermediate", required: false},
    ],
    timeCommitment: {
      hoursPerWeek: 20,
      duration: "Ongoing",
      schedule: "Flexible",
      startDate: ts(0),
      isFlexible: true,
    },
    requirements: ["GitHub portfolio", "Must be authorized to work in US"],
    responsibilities: ["Ship features", "Code review", "Write tests"],
    benefits: ["Competitive contract rate", "Flexible schedule"],
    contactInformation: {
      addresses: [
        {
          name: "Remote / NYC HQ",
          street: "350 5th Ave",
          city: "New York",
          state: "NY",
          zipcode: "10118",
          country: "US",
          formatted: "350 5th Ave, New York, NY 10118",
          geopoint: new GeoPoint(40.7528, -73.9772),
          isPrimaryAddress: true,
          remote: true,
        },
      ],
      phoneNumbers: [],
      emails: [{name: "Hiring", email: "jobs@techbridgenyc.example.org"}],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
  // --- Homeward LA ---
  {
    id: "listing-homeward-case-manager",
    title: "Volunteer Case Manager",
    description:
      "Support our case management team by conducting intake interviews, connecting clients to housing resources, and following up on referrals.",
    type: "volunteer",
    organization: "Homeward LA",
    ownerAccountId: "org-homeward-la",
    ownerAccountType: "group",
    remote: false,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing5/200/200",
    skills: [
      {name: "Community Outreach", level: "intermediate", required: true},
      {name: "Data Analysis", level: "beginner", required: false},
    ],
    timeCommitment: {
      hoursPerWeek: 12,
      duration: "1 year",
      schedule: "Weekdays 9am–1pm",
      startDate: ts(30),
      isFlexible: false,
    },
    requirements: [
      "Background check required",
      "Social work or related field preferred",
    ],
    responsibilities: [
      "Conduct intake interviews",
      "Maintain case notes",
      "Coordinate referrals",
    ],
    benefits: ["Free trauma-informed care training", "Reference letter"],
    contactInformation: {
      addresses: [
        {
          name: "Downtown Resource Center",
          street: "221 S Figueroa St",
          city: "Los Angeles",
          state: "CA",
          zipcode: "90012",
          country: "US",
          formatted: "221 S Figueroa St, Los Angeles, CA 90012",
          geopoint: new GeoPoint(34.0522, -118.2437),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [],
      emails: [
        {name: "Volunteers", email: "volunteers@homewardla.example.org"},
      ],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "listing-homeward-grants-writer",
    title: "Grant Writer (Part-Time)",
    description:
      "Research and write grant applications to foundations and government agencies. 15 hrs/week. Hybrid — attend monthly strategy meetings in person.",
    type: "job",
    organization: "Homeward LA",
    ownerAccountId: "org-homeward-la",
    ownerAccountType: "group",
    remote: false,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing6/200/200",
    skills: [
      {name: "Grant Writing", level: "advanced", required: true},
      {name: "Data Analysis", level: "intermediate", required: false},
    ],
    timeCommitment: {
      hoursPerWeek: 15,
      duration: "12 months",
      schedule: "Flexible + monthly in-person",
      startDate: ts(14),
      isFlexible: true,
    },
    requirements: [
      "3+ years grant writing experience",
      "Nonprofit sector preferred",
    ],
    responsibilities: [
      "Write and submit 4+ grants/month",
      "Track submission deadlines",
      "Compile outcome reports",
    ],
    benefits: ["Competitive hourly rate", "Hybrid flexibility"],
    contactInformation: {
      addresses: [
        {
          name: "Homeward LA Office",
          street: "221 S Figueroa St",
          city: "Los Angeles",
          state: "CA",
          zipcode: "90012",
          country: "US",
          formatted: "221 S Figueroa St, Los Angeles, CA 90012",
          geopoint: new GeoPoint(34.049, -118.256),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [],
      emails: [{name: "HR", email: "hr@homewardla.example.org"}],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
  // --- BrightMinds Houston ---
  {
    id: "listing-brightminds-math-tutor",
    title: "Middle School Math Tutor",
    description:
      "Tutor 6th–8th grade students in pre-algebra and algebra after school. Sessions are held at our program center; virtual option available.",
    type: "volunteer",
    organization: "BrightMinds Houston",
    ownerAccountId: "org-brightminds-houston",
    ownerAccountType: "group",
    remote: false,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing7/200/200",
    skills: [
      {name: "Teaching", level: "intermediate", required: true},
      {name: "Mentoring", level: "beginner", required: false},
    ],
    timeCommitment: {
      hoursPerWeek: 4,
      duration: "1 semester",
      schedule: "Mon/Wed 3:30–5:30pm",
      startDate: ts(10),
      isFlexible: false,
    },
    requirements: ["Background check", "College sophomore or above"],
    responsibilities: [
      "Run 2 sessions/week",
      "Track student progress",
      "Communicate with parents",
    ],
    benefits: ["Service learning credit", "End-of-year recognition"],
    contactInformation: {
      addresses: [
        {
          name: "BrightMinds Program Center",
          street: "1001 Avenida De Las Americas",
          city: "Houston",
          state: "TX",
          zipcode: "77010",
          country: "US",
          formatted: "1001 Avenida De Las Americas, Houston, TX 77010",
          geopoint: new GeoPoint(29.7604, -95.3698),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [],
      emails: [
        {name: "Tutors", email: "tutors@brightmindshouston.example.org"},
      ],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "listing-brightminds-stem-instructor",
    title: "Weekend STEM Workshop Facilitator",
    description:
      "Design and lead Saturday STEM workshops (robotics, coding, chemistry demos) for K-5 students. All materials provided.",
    type: "volunteer",
    organization: "BrightMinds Houston",
    ownerAccountId: "org-brightminds-houston",
    ownerAccountType: "group",
    remote: false,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing8/200/200",
    skills: [
      {name: "Teaching", level: "intermediate", required: true},
      {name: "JavaScript", level: "beginner", required: false},
    ],
    timeCommitment: {
      hoursPerWeek: 5,
      duration: "6 months",
      schedule: "Saturdays 10am–3pm",
      startDate: ts(7),
      isFlexible: false,
    },
    requirements: ["Enthusiasm for STEM education"],
    responsibilities: [
      "Prepare workshop materials",
      "Facilitate activities",
      "Debrief with program staff",
    ],
    benefits: ["Free professional development workshops", "Reference letter"],
    contactInformation: {
      addresses: [
        {
          name: "BrightMinds Program Center",
          street: "1001 Avenida De Las Americas",
          city: "Houston",
          state: "TX",
          zipcode: "77010",
          country: "US",
          formatted: "1001 Avenida De Las Americas, Houston, TX 77010",
          geopoint: new GeoPoint(29.764, -95.375),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [],
      emails: [
        {name: "Programs", email: "programs@brightmindshouston.example.org"},
      ],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
  // --- CoopWorks Portland ---
  {
    id: "listing-coopworks-biz-advisor",
    title: "Co-op Business Development Advisor",
    description:
      "Provide one-on-one business planning mentorship to co-op founders in our 6-month incubator cohort. Meet bi-weekly with 2–3 teams.",
    type: "volunteer",
    organization: "CoopWorks Portland",
    ownerAccountId: "org-coopworks-portland",
    ownerAccountType: "group",
    remote: false,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing9/200/200",
    skills: [
      {name: "Project Management", level: "advanced", required: true},
      {name: "Marketing", level: "intermediate", required: false},
    ],
    timeCommitment: {
      hoursPerWeek: 6,
      duration: "6 months",
      schedule: "Bi-weekly evenings",
      startDate: ts(14),
      isFlexible: true,
    },
    requirements: ["5+ years in business development or consulting"],
    responsibilities: [
      "Mentor 2–3 co-op teams",
      "Review business plans",
      "Attend cohort demos",
    ],
    benefits: ["Equity co-op membership discount", "Networking events"],
    contactInformation: {
      addresses: [
        {
          name: "CoopWorks Hub",
          street: "1120 NW Couch St",
          city: "Portland",
          state: "OR",
          zipcode: "97209",
          country: "US",
          formatted: "1120 NW Couch St, Portland, OR 97209",
          geopoint: new GeoPoint(45.5231, -122.6765),
          isPrimaryAddress: true,
          remote: false,
        },
      ],
      phoneNumbers: [],
      emails: [{name: "Advisors", email: "advisors@coopworkspdx.example.org"}],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "listing-coopworks-comms-coordinator",
    title: "Communications Coordinator (Part-Time Job)",
    description:
      "Manage our newsletter, social media, and press outreach. 20 hrs/week. Help amplify cooperative economy stories across the Pacific Northwest.",
    type: "job",
    organization: "CoopWorks Portland",
    ownerAccountId: "org-coopworks-portland",
    ownerAccountType: "group",
    remote: true,
    status: "active",
    iconImage: "https://picsum.photos/seed/listing10/200/200",
    skills: [
      {name: "Marketing", level: "intermediate", required: true},
      {name: "Social Media", level: "intermediate", required: true},
      {name: "Event Planning", level: "beginner", required: false},
    ],
    timeCommitment: {
      hoursPerWeek: 20,
      duration: "12 months",
      schedule: "Flexible",
      startDate: ts(0),
      isFlexible: true,
    },
    requirements: [
      "Strong written communication",
      "Experience with Mailchimp or similar",
    ],
    responsibilities: [
      "Write monthly newsletter",
      "Manage 3 social channels",
      "Draft press releases",
    ],
    benefits: ["Hourly wage", "Remote-friendly", "Values-aligned team"],
    contactInformation: {
      addresses: [
        {
          name: "CoopWorks Hub",
          street: "1120 NW Couch St",
          city: "Portland",
          state: "OR",
          zipcode: "97209",
          country: "US",
          formatted: "1120 NW Couch St, Portland, OR 97209",
          geopoint: new GeoPoint(45.52, -122.68),
          isPrimaryAddress: true,
          remote: true,
        },
      ],
      phoneNumbers: [],
      emails: [{name: "Hiring", email: "jobs@coopworkspdx.example.org"}],
      preferredMethodOfContact: "Email",
    },
    createdAt: now,
    updatedAt: now,
  },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
async function seed() {
  console.log(`Seeding project: ${PROJECT_ID}`);

  // Accounts (organizations)
  const accountsBatch = db.batch();
  for (const org of ORGS) {
    const {id, ...data} = org;
    accountsBatch.set(db.collection("accounts").doc(id), data, {merge: true});
  }
  await accountsBatch.commit();
  console.log(`✔ Wrote ${ORGS.length} organization accounts`);

  // Listings
  const listingsBatch = db.batch();
  for (const listing of LISTINGS) {
    const {id, ...data} = listing;
    listingsBatch.set(db.collection("listings").doc(id), data, {merge: true});
  }
  await listingsBatch.commit();
  console.log(`✔ Wrote ${LISTINGS.length} listings`);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
