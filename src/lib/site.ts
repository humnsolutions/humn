export const site = {
  name: "HUMN Solutions",
  shortName: "HUMN",
  tagline: "People, but better.",
  email: "humnsolutions@gmail.com",
  phone: "+92 333 4729450",
  phoneHref: "+923334729450",
  nav: [
    { label: "What we do", href: "/services" },
    { label: "Why HUMN", href: "/why-humn" },
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
  ],
} as const;

export type Service = {
  index: string;
  slug: string;
  name: string;
  oneLiner: string;
  blurb: string;
  format: string;
  coverageLabel: string;
  coverage: string[];
};

export const servicesIntro =
  "At HUMN, we help organizations build stronger teams. Whether that means finding the right person for a role, taking HR off your plate entirely, or training your team to actually perform better, we start the same way: we sit with you, understand the real problem, and build the right solution around it.";

export const services: Service[] = [
  {
    index: "01",
    slug: "recruitment-headhunting",
    name: "Recruitment & Headhunting",
    oneLiner: "The right person, not just the first resume.",
    blurb:
      "We find the people who actually fit, not just the first resume that lands in the inbox. Whether you already have a job description or you don't know where to start, we sit with you, understand the role, and go find the right person for it.",
    format: "End-to-end search · any industry, any seniority",
    coverageLabel: "What we cover",
    coverage: [
      "End-to-end recruitment and headhunting",
      "Job description design — built together with you, if you don't have one",
      "Candidate sourcing and screening",
      "Roles across industries and seniority levels",
    ],
  },
  {
    index: "02",
    slug: "hr-outsourcing",
    name: "HR Outsourcing",
    oneLiner: "HR off your plate, without hiring a department.",
    blurb:
      "Every growing team hits the same wall: too much HR work, not enough hands. We take the HR load off your team's plate — resumes, payroll, policies, day-to-day HR operations — so your business runs smoothly without you having to build an HR department from scratch.",
    format: "Full or partial · ongoing support",
    coverageLabel: "What we cover",
    coverage: [
      "Full or partial HR outsourcing",
      "Payroll and HR operations support",
      "Policy design and compliance support",
      "Ongoing HR support as your team grows",
    ],
  },
  {
    index: "03",
    slug: "corporate-training-development",
    name: "Corporate Training & Development",
    oneLiner: "Training that people actually remember.",
    blurb:
      "Training that people actually remember. We don't do the \u201Cshow up, talk for two hours, and disappear\u201D style of training. We sit with your team first, diagnose the real problem, and build a session designed specifically around it.",
    format: "Sessions built around your team · in person or remote",
    coverageLabel: "Training focus areas",
    coverage: [
      "Leadership & people management",
      "Communication & soft skills",
      "Workplace productivity",
      "Technology & digital adoption",
    ],
  },
];

export const founder = {
  kicker: "A message from the founder",
  lead: "Hi, I'm the founder of HUMN, and I'd like to formally apologize for every terrible training session, ghosted job application, and HR nightmare you've experienced before finding us.",
  paragraphs: [
    "We started this company because we got tired of watching good businesses run on chaos. Recruitment processes that ghost candidates harder than a bad Tinder date. Trainings so boring they should come with a legal disclaimer. HR departments held together by one overworked person, three spreadsheets, and pure hope.",
    "So we built something better. We actually sit with you before doing anything, which apparently counts as revolutionary in this industry. We find people who fit, not just people who applied first. We train teams in ways that don't make them check the clock every four minutes. And we'll happily take your entire HR headache off your hands if you ask nicely.",
    "Is this message unnecessarily dramatic for a company that mostly deals with job descriptions and training decks? Yes. Do I regret it? Also no.",
    "If your team needs any of the above, you know where to find us.",
  ],
  signoff: "Founder, HUMN",
  signoffNote: "professionally serious, occasionally not",
} as const;

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  /** Portrait at /public/team/<slug>.jpeg — falls back to initials if it's missing. */
  image: string;
  bio: string;
};

export const team: TeamMember[] = [
  {
    name: "Dr. Qamar Iqbal",
    role: "Chairman",
    initials: "QI",
    image: "/team/qamar-iqbal.jpeg",
    bio: "Dr. Qamar Iqbal brings decades of leadership experience and strategic insight to HUMN, guiding the company's vision with the same discipline and integrity that has defined his career. His counsel continues to shape HUMN's direction as it grows.",
  },
  {
    name: "Abdullah Qamar, CHRP",
    role: "Founder & CEO",
    initials: "AQ",
    image: "/team/abdullah-qamar.jpeg",
    bio: "Abdullah started HUMN because he was tired of watching good companies run on chaos, bad training, ghosted candidates, and HR departments held together by one overworked person and three spreadsheets. He now spends most of his time building the fix and occasionally reposting memes about it.",
  },
  {
    name: "Izhab Latif",
    role: "Training & Development Specialist",
    initials: "IL",
    image: "/team/izhab-latif.jpeg",
    bio: "Izhab has been talking his way into (and out of) situations since kindergarten. These days he puts that talent to better use, running training sessions people actually stay awake for, which apparently still counts as innovative in this industry.",
  },
  {
    name: "Nimra Khalid",
    role: "Manager, Talent Solutions",
    initials: "NK",
    image: "/team/nimra-khalid.jpeg",
    bio: "Nimra finds the people other recruiters give up looking for. She reads a job description like a puzzle, not a template, and has a track record of matching candidates who actually stick around, no ghosting involved, from either side.",
  },
  {
    name: "Nawas Raza",
    role: "Creative Content Lead",
    initials: "NR",
    image: "/team/nawas.jpeg",
    bio: "Nawas is the reason HUMN's posts have opinions about fonts, doodled robots, and at least one meme involving a resignation letter drafted over an ID card renewal. He turns \"we should post something\" into whatever chaos you just scrolled past, and somehow makes HR content genuinely funny, which should not be possible.",
  },
];
