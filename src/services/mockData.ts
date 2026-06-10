// ============================================================
// PatrickControl – Mock Data Service (Personal)
// Replace with real API calls when a backend is ready.
// ============================================================

import type {
  Post,
  Comment,
  Hashtag,
  TeamMember,
  DashboardMetrics,
  HashtagBundle,
} from '../types';

// ── Dashboard ──────────────────────────────────────────────
export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => ({
  scheduledPosts: 8,
  drafts: 4,
  newComments: 42,
  totalReach: '31.7K',
  pendingApprovals: 2,
});

// ── Posts ──────────────────────────────────────────────────
export const fetchPosts = async (): Promise<Post[]> => [
  {
    id: 'p1',
    caption: 'Just shipped a side project I\'ve been tinkering with for months. The feeling never gets old 🚀\n#BuildInPublic #IndieDev',
    platforms: ['instagram', 'facebook'],
    status: 'scheduled',
    scheduledAt: getWeekDay(1, 10, 0),
    hashtags: ['#BuildInPublic', '#TechLife'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    caption: 'Morning coffee + deep work = productivity heaven ☕ No meetings, just flow state.',
    platforms: ['instagram', 'tiktok'],
    status: 'scheduled',
    scheduledAt: getWeekDay(2, 14, 0),
    hashtags: ['#DeepWork', '#MorningRoutine'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    caption: 'Quick hot take: the best AI tools aren\'t the flashiest ones — they\'re the ones that quietly save you 10 minutes every day.',
    platforms: ['tiktok'],
    status: 'scheduled',
    scheduledAt: getWeekDay(3, 9, 30),
    hashtags: ['#TechThoughts', '#AItools'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p4',
    caption: 'Weekend setup 🌿 Good book, good playlist, good vibes. What are you all reading right now?',
    platforms: ['instagram', 'facebook', 'whatsapp'],
    status: 'scheduled',
    scheduledAt: getWeekDay(4, 16, 0),
    hashtags: ['#WeekendVibes', '#CurrentlyReading'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    caption: 'New tutorial dropping this Friday — building a full-stack app from scratch in under an hour. Who\'s tuning in? 👀',
    platforms: ['instagram'],
    status: 'scheduled',
    scheduledAt: getWeekDay(5, 12, 0),
    hashtags: ['#CodingTutorial', '#FullStack'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p6',
    caption: 'Draft: Thread on lessons learned from 5 years of building side projects. Need to polish the ending.',
    platforms: ['instagram', 'tiktok', 'facebook'],
    status: 'draft',
    hashtags: ['#BuildInPublic', '#LessonsLearned'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p7',
    caption: 'Draft: Workspace tour — my desk setup and the tools I use daily.',
    platforms: ['instagram'],
    status: 'draft',
    hashtags: ['#DeskSetup', '#TechLife'],
    createdAt: new Date().toISOString(),
  },
];

// ── Comments ───────────────────────────────────────────────
export const fetchComments = async (): Promise<Comment[]> => [
  {
    id: 'c1',
    author: 'Tolu A.',
    text: 'Love the side project energy! What stack did you use? 🔥',
    platform: 'instagram',
    createdAt: hoursAgo(1),
    replied: false,
  },
  {
    id: 'c2',
    author: 'Zara M.',
    text: 'This is exactly the motivation I needed today. Keep building! 💪',
    platform: 'tiktok',
    createdAt: hoursAgo(2),
    replied: false,
  },
  {
    id: 'c3',
    author: 'David K.',
    text: 'Any plans to open-source this one? Would love to contribute.',
    platform: 'facebook',
    createdAt: hoursAgo(3),
    replied: false,
  },
  {
    id: 'c4',
    author: 'Nneka O.',
    text: 'Your deep work routine is goals. How do you block distractions?',
    platform: 'instagram',
    createdAt: hoursAgo(5),
    replied: true,
  },
  {
    id: 'c5',
    author: 'Emeka C.',
    text: 'Great perspective on AI tools. Which ones are in your daily stack?',
    platform: 'whatsapp',
    createdAt: hoursAgo(7),
    replied: false,
  },
  {
    id: 'c6',
    author: 'Amina S.',
    text: 'That tutorial sounds amazing — please include deployment steps! 🚀',
    platform: 'facebook',
    createdAt: hoursAgo(10),
    replied: false,
  },
];

// ── Hashtags (dynamic — new set each load) ──────────────────
const HASHTAG_POOL = [
  // Tech & Dev
  '#BuildInPublic', '#TechLife', '#IndieDev', '#CodeNewbie', '#FullStack',
  '#DevCommunity', '#LearnToCode', '#DevLife', '#SoftwareEngineer', '#OpenSource',
  '#WebDev', '#AppDev', '#CodingLife', '#TechTwitter', '#DevTwitter',
  // AI & Future
  '#AItools', '#GenerativeAI', '#MachineLearning', '#FutureOfWork', '#TechTrends',
  '#PromptEngineering', '#AIAgents', '#Automation', '#NoCode', '#LowCode',
  // Productivity
  '#DeepWork', '#MorningRoutine', '#FocusMode', '#DailyRoutine', '#GoalSetting',
  '#TimeManagement', '#AtomicHabits', '#ProductivityHacks', '#WorkSmarter',
  // Content Creation
  '#CodingTutorial', '#TechThoughts', '#DevTips', '#LearnInPublic', '#ShipFast',
  '#SideProject', '#StartupLife', '#CreatorEconomy', '#DigitalCreator',
  // Lifestyle
  '#WeekendVibes', '#DeskSetup', '#CurrentlyReading', '#DailyLife', '#WorkLifeBalance',
  '#RemoteWork', '#DigitalNomad', '#CoffeeLover', '#MorningVibes', '#StudyGram',
  // Design & UX
  '#UIDesign', '#UXDesign', '#DesignSystems', '#FrontEnd', '#CSSArt',
  '#DesignInspo', '#MinimalDesign', '#DarkMode', '#Typography',
];

function shufflePick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function formatReach(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const fetchHashtags = async (): Promise<Hashtag[]> => {
  const picked = shufflePick(HASHTAG_POOL, 15);
  return picked.map((tag) => {
    const reach = randomBetween(800, 35000);
    return { tag, reach, displayReach: formatReach(reach) };
  });
};

// ── Hashtag Bundles ────────────────────────────────────────
export const fetchHashtagBundles = async (): Promise<HashtagBundle[]> => [
  {
    id: 'b1',
    name: 'Tech & Dev Bundle',
    tags: ['#BuildInPublic', '#IndieDev', '#TechLife', '#CodeNewbie', '#FullStack'],
  },
  {
    id: 'b2',
    name: 'Productivity Bundle',
    tags: ['#DeepWork', '#MorningRoutine', '#FocusMode', '#DailyRoutine', '#GoalSetting'],
  },
  {
    id: 'b3',
    name: 'Content Creator Bundle',
    tags: ['#CodingTutorial', '#DevCommunity', '#TechThoughts', '#LearnToCode', '#DevLife'],
  },
  {
    id: 'b4',
    name: 'Lifestyle Bundle',
    tags: ['#WeekendVibes', '#DeskSetup', '#CurrentlyReading', '#DailyLife', '#WorkLifeBalance'],
  },
];

// ── Team Members ───────────────────────────────────────────
export const fetchTeamMembers = async (): Promise<TeamMember[]> => [
  { id: 't1', name: 'Patrick',    role: 'Admin',          active: true },
  { id: 't2', name: 'Tolu A.',    role: 'Content Writer',  active: true },
  { id: 't3', name: 'Zara M.',    role: 'Social Manager',  active: true },
  { id: 't4', name: 'David K.',   role: 'Designer',        active: false },
];

// ── Helpers ────────────────────────────────────────────────
function getWeekDay(dow: number, hour: number, minute: number): string {
  const now = new Date();
  const day = now.getDay();
  const diff = dow - day;
  const d = new Date(now);
  d.setDate(now.getDate() + diff);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}
