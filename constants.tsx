import React from 'react';
import { IndustryData, FAQItem } from './types';
import { 
  Thermometer, 
  Sun, 
  Waves, 
  Home, 
  Zap, 
  Droplets, 
  Hammer, 
  LayoutTemplate 
} from 'lucide-react';

export const GLOBAL_FAQS: FAQItem[] = [
  { 
    question: "What does Atlas Construction Consulting do?", 
    answer: "Atlas Construction Consulting provides independent construction price audits for Phoenix homeowners. We analyze permitted project valuations and market benchmarks to help homeowners verify pricing before signing contracts." 
  },
  { 
    question: "Is Atlas Construction Consulting a contractor?", 
    answer: "No. Atlas Construction Consulting does not perform construction work. We are an independent price-advocacy and construction intelligence firm." 
  },
  { 
    question: "Does Atlas receive commissions from contractors?", 
    answer: "No. Atlas does not receive commissions, referral fees, or incentives from contractors. Our audits are independent and informational only." 
  },
  { 
    question: "Is this a sales service?", 
    answer: "No. Atlas audits are not sales offers. They are designed to provide pricing clarity so homeowners can make informed decisions." 
  },
  { 
    question: "Who typically uses Atlas audits?", 
    answer: "Homeowners facing major construction decisions such as HVAC replacement, solar installation, roofing, remodeling, or emergency repairs commonly request audits." 
  },
  { 
    question: "Is construction pricing public information?", 
    answer: "Certain construction data, such as permit valuations and project classifications, is public record in Arizona and can be analyzed for market trends." 
  }
];

export const AUDIT_FAQS: FAQItem[] = [
  { 
    question: "What is a construction price audit?", 
    answer: "A construction price audit is an independent review that compares a project’s permitted valuation to recent market data for similar projects. It helps homeowners understand whether pricing aligns with typical costs in their area." 
  },
  { 
    question: "Does a construction price audit provide a quote?", 
    answer: "No. An audit does not provide pricing or estimates. It provides context and benchmarks to help homeowners evaluate existing proposals." 
  },
  { 
    question: "When is the best time to request an audit?", 
    answer: "The best time is after a permit is issued but before a contract is finalized. This is when pricing can still be reviewed and adjusted if necessary." 
  },
  { 
    question: "What information is needed for an audit?", 
    answer: "Basic project details such as industry type, location, and permitted valuation are typically sufficient. In some cases, proposals or contractor names may provide additional context." 
  },
  { 
    question: "Is the audit legally binding?", 
    answer: "No. Audits are informational only and do not constitute legal, financial, or construction advice." 
  },
  { 
    question: "Can an audit confirm if I’m being overcharged?", 
    answer: "An audit can indicate whether pricing significantly exceeds recent market medians. It does not accuse contractors or guarantee outcomes." 
  },
  { 
    question: "What happens if pricing appears elevated?", 
    answer: "Homeowners may proceed, ask questions, or request a second look with another provider. Atlas does not direct decisions." 
  },
  { 
    question: "Is my audit private?", 
    answer: "Yes. Audit reports are delivered via secure links and are not publicly indexed or visible." 
  }
];

export const INDUSTRIES: Record<string, IndustryData> = {
  'hvac': {
    slug: 'hvac',
    name: 'HVAC',
    seoTitle: 'Phoenix HVAC Price Audits Using Permit Data | Atlas',
    seoDescription: 'Independent HVAC price audits for Phoenix homeowners using permit valuations and market benchmarks to identify inflated system pricing.',
    iconName: 'Thermometer',
    heroHeadline: 'Phoenix HVAC Price Audits Powered by Permit Intelligence',
    heroSubheadline: 'We analyze permitted HVAC valuations across Maricopa County to identify inflated system pricing before homeowners lock into oversized or overpriced installs.',
    overpricedAnalysis: [
      'Seasonal demand creates artificial urgency',
      'Private-equity rollups inflate margins',
      'Equipment sizing is often exaggerated to justify higher bids'
    ],
    redFlags: [
      'Oversized tonnage',
      '“Today-only” rebates',
      'Bundled maintenance padding'
    ],
    auditPoints: [
      'Permitted system valuation vs county medians',
      'Tonnage accuracy based on square footage',
      'Labor cost normalization',
      'Contractor permit history & volume patterns'
    ],
    processSteps: [
      'Permit detection in Maricopa County',
      '21-point valuation and sizing audit',
      'Atlas Audit Report delivered to homeowner',
      'Second-look facilitation if discrepancies exist'
    ],
    ctaHeadline: 'Before You Replace Your HVAC, Verify the Price',
    ctaButtonText: 'Request a Free HVAC Price Audit',
    faqs: [
      {
        question: "How do I know if my HVAC quote is fair?",
        answer: "Comparing your project’s permitted valuation against recent HVAC permits in the same market can provide useful context before committing."
      },
      {
        question: "Are HVAC systems commonly oversized?",
        answer: "Yes. Oversizing is a common cause of inflated HVAC pricing and unnecessary long-term operating costs."
      },
      {
        question: "Do HVAC permits show pricing information?",
        answer: "Permits include declared project valuations, which can be analyzed alongside similar installations."
      }
    ]
  },
  'solar': {
    slug: 'solar',
    name: 'Solar',
    seoTitle: 'Phoenix Solar Pricing Audits | Atlas Construction Consulting',
    seoDescription: 'Solar price audits for Phoenix homeowners analyzing permitted system valuations, financing structures, and market pricing trends.',
    iconName: 'Sun',
    heroHeadline: 'Independent Solar Pricing Audits for Phoenix Homeowners',
    heroSubheadline: 'Solar pricing is opaque by design. We analyze permitted solar valuations and financing structures to ensure homeowners aren’t locked into inflated lifetime costs.',
    overpricedAnalysis: [
      'Dealer-fee financing inflation',
      'Lease and PPA misalignment',
      'Equipment upsells disguised as “efficiency upgrades”'
    ],
    redFlags: [
      'Inflated financing fees',
      'Long-term lease value erosion',
      'Panel count inflation'
    ],
    auditPoints: [
      'Permitted system valuation vs installed kW',
      'Financing fee impact analysis',
      'Equipment pricing normalization',
      'Installer permit and completion history'
    ],
    processSteps: [
      'Solar permit detection',
      'Valuation + financing audit',
      'Atlas Audit Report delivery',
      'Independent installer comparison'
    ],
    ctaHeadline: 'Solar Should Reduce Bills — Not Transfer Wealth',
    ctaButtonText: 'Request a Solar Price Audit',
    faqs: [
      {
        question: "Why do solar quotes vary so much?",
        answer: "Solar pricing often varies due to financing structures, dealer fees, and commission-based sales models."
      },
      {
        question: "Are solar permits public record?",
        answer: "Yes. Residential solar permits are public record in Arizona."
      },
      {
        question: "Can financing affect total solar cost?",
        answer: "Yes. Financing can significantly increase lifetime system costs even if monthly payments appear low."
      }
    ]
  },
  'pools': {
    slug: 'pools',
    name: 'Pools',
    seoTitle: 'Phoenix Pool Construction Price Audits | Atlas Consulting',
    seoDescription: 'Independent pool construction price audits using Phoenix permit data to uncover padded bids and change-order driven pricing.',
    iconName: 'Waves',
    heroHeadline: 'Phoenix Pool Construction Price Audits',
    heroSubheadline: 'Pool pricing varies wildly. We analyze permitted pool valuations to ensure design upgrades aren’t hiding unnecessary margin.',
    overpricedAnalysis: [
      'Customization hides padding',
      'Change-order abuse',
      'Seasonal backlog leverage'
    ],
    redFlags: [
      'Inflated “custom” features',
      'Under-scoped base bids',
      'Change-order stacking'
    ],
    auditPoints: [
      'Permitted pool valuation vs scope',
      'Material and finish cost benchmarks',
      'Change-order probability analysis',
      'Builder permit track record'
    ],
    processSteps: [
      'Pool permit identification',
      'Scope-to-value audit',
      'Atlas Audit Report',
      'Second-look builder comparison'
    ],
    ctaHeadline: 'A Pool Is Permanent — Overpaying Shouldn’t Be',
    ctaButtonText: 'Request a Pool Price Audit',
    faqs: [
      {
        question: "Why do pool prices change after contracts are signed?",
        answer: "Change orders and under-scoped base bids are common in pool construction."
      },
      {
        question: "Do pool permits include full project value?",
        answer: "Permits reflect declared project scope and provide a benchmark for comparison."
      },
      {
        question: "Can pool pricing be reviewed before construction starts?",
        answer: "Yes. Reviewing pricing after permitting but before construction provides leverage."
      }
    ]
  },
  'roofing': {
    slug: 'roofing',
    name: 'Roofing',
    seoTitle: 'Phoenix Roofing Price Audits | Atlas Construction Consulting',
    seoDescription: 'Roofing price audits for Phoenix homeowners using permit valuation benchmarks to verify replacement costs before contracts are signed.',
    iconName: 'Home',
    heroHeadline: 'Phoenix Roofing Price Audits Without Sales Pressure',
    heroSubheadline: 'Roofing is often sold in moments of urgency. We verify permitted valuations to ensure pricing reflects materials — not fear.',
    overpricedAnalysis: [
      'Storm-driven urgency',
      'Insurance complexity abuse',
      'Material cost misrepresentation'
    ],
    redFlags: [
      'Emergency fear tactics',
      'Inflated insurance scopes',
      'Material grade swapping'
    ],
    auditPoints: [
      'Permit valuation vs roof size',
      'Material cost normalization',
      'Labor benchmarking',
      'Contractor permit volume'
    ],
    processSteps: [
      'Roofing permit detection',
      'Material & labor valuation audit',
      'Atlas Audit Report delivery',
      'Second-look facilitation'
    ],
    ctaHeadline: 'Urgency Shouldn’t Inflate Roofing Costs',
    ctaButtonText: 'Request a Roofing Price Audit',
    faqs: [
      {
        question: "Why are roofing quotes higher after storms?",
        answer: "Urgency and insurance complexity often inflate pricing beyond material and labor costs."
      },
      {
        question: "Are roofing permits required in Phoenix?",
        answer: "Yes. Most roof replacements require permits."
      },
      {
        question: "Can roofing pricing be benchmarked?",
        answer: "Yes. Recent permitted roofing projects provide market context."
      }
    ]
  },
  'electrical': {
    slug: 'electrical',
    name: 'Electrical',
    seoTitle: 'Phoenix Electrical Upgrade Price Audits | Atlas Consulting',
    seoDescription: 'Independent audits of electrical upgrade pricing using Phoenix permit data and labor benchmarks for homeowner price verification.',
    iconName: 'Zap',
    heroHeadline: 'Phoenix Electrical Upgrade Price Audits',
    heroSubheadline: 'Electrical work is technical — which makes it easy to overprice. We audit permitted valuations to ensure fair market labor and materials.',
    overpricedAnalysis: [
      'Complexity intimidation',
      'Panel upgrade exaggeration',
      'Scope ambiguity'
    ],
    redFlags: [
      'Unnecessary panel upgrades',
      'Bundled "whole home" surge protection',
      'Permit avoidance'
    ],
    auditPoints: [
      'Permit valuation vs scope',
      'Panel sizing justification',
      'Labor cost benchmarks',
      'Contractor compliance history'
    ],
    processSteps: [
      'Electrical permit history review',
      'Scope & load calculation audit',
      'Detailed pricing report',
      'Independent electrician verification'
    ],
    ctaHeadline: 'Electrical Safety Matters — Pricing Should Be Transparent',
    ctaButtonText: 'Request an Electrical Price Audit',
    faqs: [
      {
        question: "Why is electrical work hard to price-check?",
        answer: "Technical complexity and safety concerns limit transparency."
      },
      {
        question: "Are electrical permits public record?",
        answer: "Yes. Electrical permits are accessible in Arizona."
      },
      {
        question: "Are panel upgrades always necessary?",
        answer: "Not always. Some upgrades are recommended without clear justification."
      }
    ]
  },
  'plumbing': {
    slug: 'plumbing',
    name: 'Plumbing',
    seoTitle: 'Phoenix Plumbing Price Audits | Atlas Construction Consulting',
    seoDescription: 'Plumbing price audits using Phoenix permit data to identify inflated repipe and system replacement pricing.',
    iconName: 'Droplets',
    heroHeadline: 'Phoenix Plumbing Price Audits Based on Real Data',
    heroSubheadline: 'Plumbing emergencies often lead to rushed decisions. We verify pricing before urgency turns into overpayment.',
    overpricedAnalysis: [
      'Emergency leverage',
      'System replacement inflation',
      'Limited price transparency'
    ],
    redFlags: [
      'Proprietary water treatment systems',
      'Excessive trenchless sewer premiums',
      'Upselling functional pipes'
    ],
    auditPoints: [
      'Permit valuation vs system scope',
      'Material cost normalization',
      'Labor benchmarks',
      'Contractor permit frequency'
    ],
    processSteps: [
      'Permit search for similar projects',
      'Material & labor cost analysis',
      'Independent audit report',
      'Fair-market comparison'
    ],
    ctaHeadline: 'Fix the Problem — Not the Price',
    ctaButtonText: 'Request a Plumbing Price Audit',
    faqs: [
      {
        question: "Why do plumbing emergencies cost more?",
        answer: "Urgency reduces the ability to compare pricing."
      },
      {
        question: "Do plumbing permits show project value?",
        answer: "Yes. Major plumbing work requires permits with declared valuations."
      },
      {
        question: "Can repipe costs be benchmarked?",
        answer: "Yes. Similar permitted projects provide comparison data."
      }
    ]
  },
  'additions-remodels': {
    slug: 'additions-remodels',
    name: 'Additions & Remodels',
    seoTitle: 'Phoenix Remodel & Addition Price Audits | Atlas Consulting',
    seoDescription: 'Remodel and addition price audits using permit intelligence to help Phoenix homeowners avoid scope creep and budget overruns.',
    iconName: 'LayoutTemplate',
    heroHeadline: 'Phoenix Remodel & Addition Price Audits',
    heroSubheadline: 'Remodels fail when pricing lacks discipline. We audit permitted valuations to protect budgets before contracts lock in.',
    overpricedAnalysis: [
      'Scope creep',
      'Allowance manipulation',
      'Change-order dependence'
    ],
    redFlags: [
      'Vague "allowances" for finishes',
      'Undefined change order fees',
      'Lack of lien waiver process'
    ],
    auditPoints: [
      'Permit valuation vs scope',
      'Allowance realism',
      'Trade cost normalization',
      'Contractor history'
    ],
    processSteps: [
      'Neighborhood permit comp analysis',
      'Scope & allowance audit',
      'Valuation report delivery',
      'Contractor bid leveling'
    ],
    ctaHeadline: 'Control the Budget Before the First Hammer',
    ctaButtonText: 'Request a Remodel Price Audit',
    faqs: [
      {
        question: "Why do remodels exceed initial budgets?",
        answer: "Allowances and change orders frequently drive cost increases."
      },
      {
        question: "Do remodel permits reflect total project scope?",
        answer: "Permits establish baseline scope and valuation."
      },
      {
        question: "Can remodel pricing be audited before work starts?",
        answer: "Yes. This is when audits are most effective."
      }
    ]
  },
  'concrete-flatwork': {
    slug: 'concrete-flatwork',
    name: 'Concrete / Flatwork',
    seoTitle: 'Phoenix Concrete & Flatwork Price Audits | Atlas Consulting',
    seoDescription: 'Concrete pricing audits using Phoenix permit data and material benchmarks to detect inflated flatwork bids.',
    iconName: 'Hammer',
    heroHeadline: 'Phoenix Concrete & Flatwork Price Audits',
    heroSubheadline: 'Concrete pricing is often padded under “site conditions.” We audit real market inputs to verify fairness.',
    overpricedAnalysis: [
      'Concrete pricing fluctuates with cement commodities',
      'Labor is the wildcard',
      'Phantom yardage charges'
    ],
    redFlags: [
      'PSI strength misrepresentation',
      'Rebar/Mesh omission',
      'Thickness reduction (3" vs 4")'
    ],
    auditPoints: [
      'Cubic yardage calculation',
      'Reinforcement schedule check',
      'Pump truck necessity audit',
      'Finish grade labor rate'
    ],
    processSteps: [
      'Volumetric data verification',
      'Market rate labor analysis',
      'Audit report generation',
      'Fair price verification'
    ],
    ctaHeadline: 'Concrete Costs Should Be Measured — Not Assumed',
    ctaButtonText: 'Request a Concrete Price Audit',
    faqs: [
      {
        question: "Why does concrete pricing vary so much?",
        answer: "Labor assumptions and site condition claims often inflate costs."
      },
      {
        question: "Are flatwork permits public?",
        answer: "Yes. Concrete and flatwork permits are public record."
      },
      {
        question: "Can concrete pricing be verified before pouring?",
        answer: "Yes. Reviewing recent permitted projects helps validate pricing."
      }
    ]
  }
};

export const STEPS = [
  {
    title: 'Detection',
    description: 'We analyze real-time permit data to establish a baseline for your specific project type in your zip code.'
  },
  {
    title: 'Analysis',
    description: 'Our 21-point valuation audit breaks down material costs, labor hours, and reasonable overhead margins.'
  },
  {
    title: 'Advocacy',
    description: 'We act as your independent expert, reviewing quotes and identifying red flags, omissions, or price gouging.'
  },
  {
    title: 'Execution',
    description: 'Proceed with confidence. If requested, we facilitate a "second look" from our vetted, data-backed network.'
  }
];

export const ICON_MAP: Record<string, React.ElementType> = {
  Thermometer,
  Sun,
  Waves,
  Home,
  Zap,
  Droplets,
  LayoutTemplate,
  Hammer
};