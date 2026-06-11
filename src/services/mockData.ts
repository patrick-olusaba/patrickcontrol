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
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
    mediaType: 'image',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    caption: 'Morning coffee + deep work = productivity heaven ☕ No meetings, just flow state.',
    platforms: ['instagram', 'tiktok'],
    status: 'scheduled',
    scheduledAt: getWeekDay(2, 14, 0),
    hashtags: ['#DeepWork', '#MorningRoutine'],
    mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    mediaType: 'image',
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
    mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    mediaType: 'image',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    caption: 'New tutorial dropping this Friday — building a full-stack app from scratch in under an hour. Who\'s tuning in? 👀',
    platforms: ['instagram'],
    status: 'scheduled',
    scheduledAt: getWeekDay(5, 12, 0),
    hashtags: ['#CodingTutorial', '#FullStack'],
    mediaUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
    mediaType: 'image',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p6',
    caption: 'Thread on lessons learned from 5 years of building side projects. Need to polish the ending before publishing.',
    platforms: ['instagram', 'tiktok', 'facebook'],
    status: 'draft',
    hashtags: ['#BuildInPublic', '#LessonsLearned'],
    mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80',
    mediaType: 'image',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p7',
    caption: 'Workspace tour — my desk setup and the tools I use daily for coding and content creation.',
    platforms: ['instagram'],
    status: 'draft',
    hashtags: ['#DeskSetup', '#TechLife'],
    mediaUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&q=80',
    mediaType: 'image',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p8',
    caption: 'Big announcement coming soon… something I\'ve been working on quietly for 3 months 👀 Stay tuned.',
    platforms: ['instagram', 'facebook'],
    status: 'draft',
    hashtags: ['#ComingSoon', '#Announcement'],
    mediaUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80',
    mediaType: 'image',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p9',
    caption: 'My top 5 VS Code extensions that genuinely changed how I code. Which ones do you use?',
    platforms: ['tiktok', 'instagram'],
    status: 'draft',
    hashtags: ['#VSCode', '#DevTools', '#CodingLife'],
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

// ── Published Posts ─────────────────────────────────────────
export const fetchPublishedPosts = async (): Promise<import('../types').PublishedPost[]> => [
  {
    id: 'pub1', caption: 'Just shipped a side project! 🚀', platforms: ['instagram', 'facebook'],
    status: 'published', hashtags: ['#BuildInPublic', '#TechLife'],
    createdAt: daysAgo(7), publishedAt: daysAgo(7),
    stats: { likes: 1240, comments: 89, shares: 56, reach: 18200 },
  },
  {
    id: 'pub2', caption: 'Morning coffee + deep work = magic ☕', platforms: ['instagram', 'tiktok'],
    status: 'published', hashtags: ['#DeepWork', '#MorningRoutine'],
    createdAt: daysAgo(5), publishedAt: daysAgo(5),
    stats: { likes: 890, comments: 45, shares: 23, reach: 12400 },
  },
  {
    id: 'pub3', caption: 'Quick AI hot take — the best tools save 10 minutes a day', platforms: ['tiktok'],
    status: 'published', hashtags: ['#TechThoughts', '#AItools'],
    createdAt: daysAgo(4), publishedAt: daysAgo(4),
    stats: { likes: 2100, comments: 134, shares: 78, reach: 28500 },
  },
  {
    id: 'pub4', caption: 'Weekend setup 🌿 What are you all reading?', platforms: ['instagram', 'facebook', 'whatsapp'],
    status: 'published', hashtags: ['#WeekendVibes', '#CurrentlyReading'],
    createdAt: daysAgo(3), publishedAt: daysAgo(3),
    stats: { likes: 670, comments: 52, shares: 18, reach: 9400 },
  },
  {
    id: 'pub5', caption: 'New tutorial: build a full-stack app in under an hour', platforms: ['instagram', 'tiktok', 'facebook'],
    status: 'published', hashtags: ['#CodingTutorial', '#FullStack'],
    createdAt: daysAgo(2), publishedAt: daysAgo(2),
    stats: { likes: 3400, comments: 210, shares: 145, reach: 42000 },
  },
  {
    id: 'pub6', caption: 'Desk setup tour — tools I use daily', platforms: ['instagram'],
    status: 'published', hashtags: ['#DeskSetup', '#TechLife'],
    createdAt: daysAgo(1), publishedAt: daysAgo(1),
    stats: { likes: 1560, comments: 98, shares: 42, reach: 19600 },
  },
];

// ── Post Templates ──────────────────────────────────────────
export const fetchTemplates = async (): Promise<import('../types').PostTemplate[]> => [
  {
    id: 'tpl1', name: 'Product Launch', platforms: ['instagram', 'facebook', 'tiktok'],
    caption: '🚀 Excited to share what we\'ve been working on!\n\nIntroducing [name] — built to [solve problem].\n\n👉 Check it out: [link]\n\n#BuildInPublic #LaunchDay',
    hashtags: ['#BuildInPublic', '#LaunchDay', '#NewRelease', '#TechLaunch'],
    createdAt: daysAgo(30),
  },
  {
    id: 'tpl2', name: 'Morning Routine', platforms: ['instagram'],
    caption: '☀️ Morning routine breakdown:\n\n• 6am — Wake up, no phone\n• 6:30 — Coffee + journal\n• 7am — Deep work block\n• 12pm — Check messages\n\nWhat does your morning look like?',
    hashtags: ['#MorningRoutine', '#DeepWork', '#Productivity'],
    createdAt: daysAgo(20),
  },
  {
    id: 'tpl3', name: 'Tech Tip Tuesday', platforms: ['tiktok', 'instagram'],
    caption: '💡 Quick tip:\n\nStop doing [X] and start doing [Y].\n\nHere\'s why:\n1. Reason one\n2. Reason two\n3. Reason three\n\nSave this for later 📌',
    hashtags: ['#TechTips', '#DevTips', '#LearnToCode'],
    createdAt: daysAgo(14),
  },
  {
    id: 'tpl4', name: 'Weekly Recap', platforms: ['facebook', 'instagram'],
    caption: '📊 This week in review:\n\n✅ Shipped: [feature]\n📚 Read: [book]\n🎯 Learning: [topic]\n💭 Thought: [insight]\n\nHow was your week?',
    hashtags: ['#WeeklyRecap', '#BuildInPublic', '#DevLife'],
    createdAt: daysAgo(10),
  },
];

// ── Media Items ─────────────────────────────────────────────
export const fetchMediaItems = async (): Promise<import('../types').MediaItem[]> => [
  { id: 'm1', url: '', type: 'image', postId: 'pub1', caption: 'Side project launch', createdAt: daysAgo(7) },
  { id: 'm2', url: '', type: 'image', postId: 'pub2', caption: 'Morning coffee setup', createdAt: daysAgo(5) },
  { id: 'm3', url: '', type: 'video', postId: 'pub3', caption: 'AI hot take video', createdAt: daysAgo(4) },
  { id: 'm4', url: '', type: 'image', postId: 'pub4', caption: 'Weekend reading', createdAt: daysAgo(3) },
  { id: 'm5', url: '', type: 'video', postId: 'pub5', caption: 'Tutorial thumbnail', createdAt: daysAgo(2) },
  { id: 'm6', url: '', type: 'image', postId: 'pub6', caption: 'Desk setup photo', createdAt: daysAgo(1) },
];

// ── App Settings ────────────────────────────────────────────
export const fetchSettings = async (): Promise<import('../types').AppSettings> => ({
  profileName: 'Patrick',
  profileBio: 'Building in public. Sharing tech tips, side projects, and morning routines.',
  profileAvatar: '',
  timezone: 'Africa/Lagos',
  emailNotifications: true,
  pushNotifications: false,
  autoSchedule: true,
  connectedAccounts: [
    { platform: 'instagram', handle: '@patrick', connected: true, followers: 12400 },
    { platform: 'tiktok', handle: '@patrick', connected: true, followers: 8500 },
    { platform: 'facebook', handle: 'Patrick Page', connected: true, followers: 4100 },
    { platform: 'whatsapp', handle: '+234 800 000 0000', connected: false, followers: 0 },
  ],
});

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

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 86400 * 1000).toISOString();
}
