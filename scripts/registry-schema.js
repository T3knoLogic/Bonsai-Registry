/**
 * Extended Bonsai Registry Schema
 * Supports: projects, people, companies, news, partnerships, NFT collections
 */

module.exports = {
  project: {
    id: 0,
    name: '',
    description: '',
    url: '',
    ecosystem: 'icp',
    categories: [],
    tier: 2,
    logoUrl: '',
    createdAt: 0,
    // Extended
    canisterId: '',
    githubUrl: '',
    twitterUrl: '',
    discordUrl: '',
    grantAmount: 0,
    grantTier: '',
    metrics: {} // e.g. { users: 175000, tvl: 1500000 }
  },
  person: {
    id: 0,
    name: '',
    role: '', // founder, artist, engineer, designer
    projectIds: [],
    projectNames: [],
    url: '', // Twitter, LinkedIn, etc.
    description: '',
    ecosystem: 'icp',
    createdAt: 0
  },
  company: {
    id: 0,
    name: '',
    description: '',
    url: '',
    projectIds: [],
    projectNames: [],
    ecosystem: 'icp',
    createdAt: 0
  },
  news: {
    id: 0,
    title: '',
    url: '',
    source: '', // dfinity, medium, etc.
    publishedAt: '',
    summary: '',
    tags: [],
    projectIds: [],
    ecosystem: 'icp',
    createdAt: 0
  },
  partnership: {
    id: 0,
    title: '',
    description: '',
    partners: [], // [projectA, projectB] or [companyA, companyB]
    url: '',
    announcedAt: '',
    ecosystem: 'icp',
    createdAt: 0
  },
  nftCollection: {
    id: 0,
    name: '',
    slug: '',
    url: '',
    floorPrice: '',
    totalSupply: 0,
    marketplace: 'dgdg', // dgdg, entrepot, etc.
    ecosystem: 'icp',
    categories: ['nft'],
    createdAt: 0
  }
};
