// Bronze (0) at 600 Elo points, Silver (1) at 800, Gold (2) at 1000, Diamond (3) at 1200,
// and Titanium (4) at 1400. Mastery (5) is achieved at 1800 Elo points,
// marking a player as a true Master. Upon reaching an extraordinary 2400 Elo points,
// players attain the prestigious and exceedingly rare 'Unreal' (6) rank.

const rankNames = ["Bronze", "Silver", "Gold", "Diamond", "Titanium", "Mastery", "Unreal"];
const rankPathStart = "/shared/images/Ranked Icons/";
const rankImages = [
    "Bronze Rank Icon.png", "Silver Rank Icon.png",
    "Golden Rank Icon.png", "Diamond Rank Icon.png",
    "Titanium Rank Icon.png", "Mastery Rank Icon.png",
    "Unreal Rank Icon.png"
];

function getRankNumberFromLevel(rank)
{
    if (rank < 600)
        rank = 600;

    rank = Math.floor(rank / 100);

    if (rank >= 24)
        return 6; // Unreal
    if (rank >= 18)
        return 5; // Mastery
    if (rank >= 14)
        return 4; // Titanium
    if (rank >= 12)
        return 3; // Diamond
    if (rank >= 10)
        return 2; // Gold
    if (rank >= 8)
        return 1; // Silver
    return 0; // Bronze
}

function getRankNameFromLevel(rank)
{
    return rankNames[getRankNumberFromLevel(rank)];
}

function getRankImageFromLevel(rank)
{
    return rankPathStart + rankImages[getRankNumberFromLevel(rank)];
}