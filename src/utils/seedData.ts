export const MOCK_HANDLES = [
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

export function getRandomHandle(): string {
  const randomIndex = Math.floor(Math.random() * MOCK_HANDLES.length);
  return MOCK_HANDLES[randomIndex];
}
