import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load the .env.local file since Next.js uses it by default
dotenv.config({ path: '.env.local' });

// Inlined MOCK_HANDLES to avoid TS-to-JS pathing issues
const MOCK_HANDLES = [
  '@MemeInshallah',
  '@VAR_Reviewer',
  '@TrollFooty26',
  '@PulisicLebron',
  '@DarwinChaos',
  '@PepRoulette',
  '@xG_Nerd',
  '@Siuuuu_Central',
  '@MudrykPace',
  '@SundayLeaguePro',
  '@BaldFraudTactics',
  '@WengerOut2004'
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables.");
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file.");
  process.exit(1);
}

// Initialize Supabase with the Service Role Key to bypass RLS for bot insertions
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const startingMemes = [
  { url: 'https://ffjnldlguyewuojppvrf.supabase.co/storage/v1/object/public/memes/h.jpg', team: 'ESP', caption: 'Bro switched Nationality and still didn\'t make it to the World Cup  😭 😭 😭' },
  { url: 'https://ffjnldlguyewuojppvrf.supabase.co/storage/v1/object/public/memes/hall.jpeg', team: 'NOR', caption: 'Boys been in North Carolina for one day and acting like this haha' },
  { url: 'https://ffjnldlguyewuojppvrf.supabase.co/storage/v1/object/public/memes/HJ5VXDMXUAAxmnr.jpg', team: 'FIFA', caption: 'Me watching Mexico-South Africa game at school again, but this time I\'m the janitor' },
  { url: 'https://ffjnldlguyewuojppvrf.supabase.co/storage/v1/object/public/memes/HJrITbJXgAASCY-.jpg', team: 'USA', caption: 'So which pdf i\'m opening football or soccer? ' },
  { url: 'https://ffjnldlguyewuojppvrf.supabase.co/storage/v1/object/public/memes/olise.jpg', team: 'FRA', caption: 'Considering whether having Mbappe as a regular teammate is a good idea' },
  { url: 'https://ffjnldlguyewuojppvrf.supabase.co/storage/v1/object/public/memes/pessi.png', team: 'SUI', caption: 'Just realised we\'re not gonna see the usual Shaqiri wonder strike we see at every major tournament' },
  { url: 'https://ffjnldlguyewuojppvrf.supabase.co/storage/v1/object/public/memes/rob.jpg', team: 'SCO', caption: 'Just watching the Scotland game and thinking, they might be the first team in history to withdraw from a tournament due to sunburn' },
  { url: 'https://ffjnldlguyewuojppvrf.supabase.co/storage/v1/object/public/memes/ronal.png', team: 'POR', caption: 'I\'ve seen this before' },
];

async function runSeedBot() {
  console.log("Starting VAR-Cade Database Seed Bot... 🤖⚽");

  console.log("Cleaning up old memes...");
  const { error: deleteError } = await supabase.from('memes').delete().neq('id', 'dummy_id_to_match_all');
  if (deleteError) {
    console.error("❌ Failed to delete old memes:", deleteError);
  } else {
    console.log("🧹 Database wiped clean.");
  }

  for (const meme of startingMemes) {
    const randomHandle = MOCK_HANDLES[Math.floor(Math.random() * MOCK_HANDLES.length)];
    const randomUpvotes = Math.floor(Math.random() * (500 - 50 + 1) + 50); // Randomize between 50-500
    const randomDownvotes = Math.floor(Math.random() * (20 - 0 + 1) + 0);  // Randomize between 0-20

    console.log(`Seeding meme for ${meme.team} by ${randomHandle}...`);

    // We map your requested conceptual columns to the actual columns used in the VAR-Cade app
    const { error } = await supabase.from('memes').insert({
      image_url: meme.url,
      team_id: meme.team,
      handle: randomHandle,
      caption: meme.caption,
      golazos: randomUpvotes,
      red_cards: randomDownvotes
    });

    if (error) {
      console.error(`❌ Error inserting meme for ${meme.team}:`, error.message);
    } else {
      console.log(`✅ Success! Seeded meme for ${meme.team} with ${randomUpvotes} upvotes (golazos).`);
    }
  }

  console.log("Seed Bot finished execution! 🏁");
}

runSeedBot();
