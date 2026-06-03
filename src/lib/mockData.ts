export type Team = {
  id: string;
  name: string;
  group: string;
  flag: string; // ISO country code or emoji
  themeColor: string; // For dynamic theming background
};

export type Match = {
  id: string;
  date: string;
  team1Id: string;
  team2Id: string;
};

export type Meme = {
  id: string;
  imageUrl: string;
  handle: string;
  teamId: string;
  caption: string;
  golazos: number;
  redCards: number;
  timestamp: string;
};

export type UserLeaderboardEntry = {
  handle: string;
  golazos: number;
};

export type UserProfile = {
  handle: string;
  memeKarma: number;
  currentPrediction: string | null;
};

export const TEAMS: Team[] = [
  { id: "ARG", name: "Argentina", group: "A", flag: "🇦🇷", themeColor: "from-blue-400/50 via-dark-bg to-white/10" },
  { id: "AUS", name: "Australia", group: "B", flag: "🇦🇺", themeColor: "from-yellow-500/50 via-dark-bg to-green-800/20" },
  { id: "AUT", name: "Austria", group: "C", flag: "🇦🇹", themeColor: "from-red-600/50 via-dark-bg to-white/10" },
  { id: "BEL", name: "Belgium", group: "D", flag: "🇧🇪", themeColor: "from-red-600/50 via-dark-bg to-yellow-500/20" },
  { id: "BRA", name: "Brazil", group: "E", flag: "🇧🇷", themeColor: "from-green-500/50 via-dark-bg to-yellow-400/20" },
  { id: "CAN", name: "Canada", group: "F", flag: "🇨🇦", themeColor: "from-red-600/50 via-dark-bg to-white/10" },
  { id: "CHI", name: "Chile", group: "G", flag: "🇨🇱", themeColor: "from-red-600/50 via-dark-bg to-blue-800/20" },
  { id: "COL", name: "Colombia", group: "H", flag: "🇨🇴", themeColor: "from-yellow-400/50 via-dark-bg to-red-600/20" },
  { id: "CRC", name: "Costa Rica", group: "I", flag: "🇨🇷", themeColor: "from-red-600/50 via-dark-bg to-blue-800/20" },
  { id: "CRO", name: "Croatia", group: "J", flag: "🇭🇷", themeColor: "from-red-600/50 via-dark-bg to-white/10" },
  { id: "CZE", name: "Czechia", group: "K", flag: "🇨🇿", themeColor: "from-red-600/50 via-dark-bg to-blue-800/20" },
  { id: "DEN", name: "Denmark", group: "L", flag: "🇩🇰", themeColor: "from-red-600/50 via-dark-bg to-white/10" },
  { id: "ECU", name: "Ecuador", group: "A", flag: "🇪🇨", themeColor: "from-yellow-400/50 via-dark-bg to-blue-800/20" },
  { id: "EGY", name: "Egypt", group: "B", flag: "🇪🇬", themeColor: "from-red-600/50 via-dark-bg to-black/20" },
  { id: "ENG", name: "England", group: "C", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", themeColor: "from-white/50 via-dark-bg to-red-600/20" },
  { id: "ESP", name: "Spain", group: "D", flag: "🇪🇸", themeColor: "from-red-600/50 via-dark-bg to-yellow-500/20" },
  { id: "FRA", name: "France", group: "E", flag: "🇫🇷", themeColor: "from-blue-800/50 via-dark-bg to-red-600/20" },
  { id: "GER", name: "Germany", group: "F", flag: "🇩🇪", themeColor: "from-white/50 via-dark-bg to-black/20" },
  { id: "GHA", name: "Ghana", group: "G", flag: "🇬🇭", themeColor: "from-red-600/50 via-dark-bg to-yellow-500/20" },
  { id: "IRN", name: "Iran", group: "H", flag: "🇮🇷", themeColor: "from-green-600/50 via-dark-bg to-red-600/20" },
  { id: "ITA", name: "Italy", group: "I", flag: "🇮🇹", themeColor: "from-blue-600/50 via-dark-bg to-white/10" },
  { id: "JAM", name: "Jamaica", group: "J", flag: "🇯🇲", themeColor: "from-yellow-400/50 via-dark-bg to-green-600/20" },
  { id: "JPN", name: "Japan", group: "K", flag: "🇯🇵", themeColor: "from-blue-800/50 via-dark-bg to-white/10" },
  { id: "KOR", name: "South Korea", group: "L", flag: "🇰🇷", themeColor: "from-red-600/50 via-dark-bg to-blue-800/20" },
  { id: "KSA", name: "Saudi Arabia", group: "A", flag: "🇸🇦", themeColor: "from-green-600/50 via-dark-bg to-white/10" },
  { id: "MAR", name: "Morocco", group: "B", flag: "🇲🇦", themeColor: "from-red-600/50 via-dark-bg to-green-800/20" },
  { id: "MEX", name: "Mexico", group: "C", flag: "🇲🇽", themeColor: "from-green-600/50 via-dark-bg to-red-600/20" },
  { id: "NED", name: "Netherlands", group: "D", flag: "🇳🇱", themeColor: "from-orange-500/50 via-dark-bg to-white/10" },
  { id: "NGA", name: "Nigeria", group: "E", flag: "🇳🇬", themeColor: "from-green-600/50 via-dark-bg to-white/10" },
  { id: "NOR", name: "Norway", group: "F", flag: "🇳🇴", themeColor: "from-red-600/50 via-dark-bg to-blue-800/20" },
  { id: "NZL", name: "New Zealand", group: "G", flag: "🇳🇿", themeColor: "from-white/50 via-dark-bg to-black/20" },
  { id: "PAN", name: "Panama", group: "H", flag: "🇵🇦", themeColor: "from-red-600/50 via-dark-bg to-blue-800/20" },
  { id: "PER", name: "Peru", group: "I", flag: "🇵🇪", themeColor: "from-white/50 via-dark-bg to-red-600/20" },
  { id: "POL", name: "Poland", group: "J", flag: "🇵🇱", themeColor: "from-white/50 via-dark-bg to-red-600/20" },
  { id: "POR", name: "Portugal", group: "K", flag: "🇵🇹", themeColor: "from-red-600/50 via-dark-bg to-green-800/20" },
  { id: "QAT", name: "Qatar", group: "L", flag: "🇶🇦", themeColor: "from-red-900/50 via-dark-bg to-white/10" },
  { id: "RSA", name: "South Africa", group: "A", flag: "🇿🇦", themeColor: "from-yellow-400/50 via-dark-bg to-green-600/20" },
  { id: "SEN", name: "Senegal", group: "B", flag: "🇸🇳", themeColor: "from-green-600/50 via-dark-bg to-yellow-400/20" },
  { id: "SRB", name: "Serbia", group: "C", flag: "🇷🇸", themeColor: "from-red-600/50 via-dark-bg to-blue-800/20" },
  { id: "SUI", name: "Switzerland", group: "D", flag: "🇨🇭", themeColor: "from-red-600/50 via-dark-bg to-white/10" },
  { id: "SWE", name: "Sweden", group: "E", flag: "🇸🇪", themeColor: "from-yellow-400/50 via-dark-bg to-blue-600/20" },
  { id: "TUN", name: "Tunisia", group: "F", flag: "🇹🇳", themeColor: "from-red-600/50 via-dark-bg to-white/10" },
  { id: "UAE", name: "UAE", group: "G", flag: "🇦🇪", themeColor: "from-white/50 via-dark-bg to-red-600/20" },
  { id: "URU", name: "Uruguay", group: "H", flag: "🇺🇾", themeColor: "from-blue-400/50 via-dark-bg to-black/20" },
  { id: "USA", name: "USA", group: "I", flag: "🇺🇸", themeColor: "from-blue-800/50 via-dark-bg to-red-600/20" },
  { id: "UZB", name: "Uzbekistan", group: "J", flag: "🇺🇿", themeColor: "from-blue-600/50 via-dark-bg to-green-600/20" },
  { id: "WAL", name: "Wales", group: "K", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", themeColor: "from-red-600/50 via-dark-bg to-green-800/20" },
  { id: "UKR", name: "Ukraine", group: "L", flag: "🇺🇦", themeColor: "from-yellow-400/50 via-dark-bg to-blue-600/20" },
  { id: "CIV", name: "Côte d'Ivoire", group: "A", flag: "🇨🇮", themeColor: "from-orange-500/50 via-dark-bg to-green-600/20" },
  { id: "FIFA", name: "Global", group: "ALL", flag: "🌐", themeColor: "from-blue-900/50 via-dark-bg to-white/10" },
];

export const MATCHES: Match[] = [
  { id: "match1", date: "June 11", team1Id: "MEX", team2Id: "RSA" },
  { id: "match2", date: "June 11", team1Id: "KOR", team2Id: "CZE" },
  { id: "match3", date: "June 12", team1Id: "CAN", team2Id: "BIH" }, // Note: We might not have CAN and BIH in teams, so I'll substitute or add them
  { id: "match4", date: "June 12", team1Id: "USA", team2Id: "PAR" },
];

export const INITIAL_MEMES: Meme[] = [
  {
    id: "m1",
    imageUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    handle: "@mexico_fan_99",
    teamId: "MEX",
    caption: "When you realize you're playing at the Azteca again.",
    golazos: 1450,
    redCards: 20,
    timestamp: new Date().toISOString(),
  },
  {
    id: "m2",
    imageUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    handle: "@usa_soccer_eagle",
    teamId: "USA",
    caption: "It's called soccer now, deal with it.",
    golazos: 2300,
    redCards: 500,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
  },
  {
    id: "m3",
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6bbe1dbeaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    handle: "@messi_goat",
    teamId: "ARG",
    caption: "Another World Cup? Just another day at the office.",
    golazos: 8000,
    redCards: 12,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hr ago
  },
  {
    id: "m4",
    imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    handle: "@its_coming_home_26",
    teamId: "ENG",
    caption: "Is this finally the year?",
    golazos: 500,
    redCards: 1200, // English self-deprecation
    timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hr ago
  }
];

export const INITIAL_LEADERBOARD: UserLeaderboardEntry[] = [
  { handle: "@messi_goat", golazos: 8000 },
  { handle: "@usa_soccer_eagle", golazos: 2300 },
  { handle: "@mexico_fan_99", golazos: 1450 },
  { handle: "@its_coming_home_26", golazos: 500 },
  { handle: "@football_memer", golazos: 300 },
];
