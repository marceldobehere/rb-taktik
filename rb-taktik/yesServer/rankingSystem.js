let accountInterface;
let sessionSystem;

async function initApp(_accountInterface, _sessionSystem)
{
    accountInterface = _accountInterface;
    sessionSystem = _sessionSystem;

    console.log("> Initialized ranking system");
}

// Bronze (0) at 600 Elo points, Silver (1) at 800, Gold (2) at 1000, Diamond (3) at 1200,
// and Titanium (4) at 1400. Mastery (5) is achieved at 1800 Elo points,
// marking a player as a true Master. Upon reaching an extraordinary 2400 Elo points,
// players attain the prestigious and exceedingly rare 'Unreal' (6) rank.

const rankNames = ["Bronze", "Silver", "Gold", "Diamond", "Titanium", "Mastery", "Unreal"];

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

//  Victories against opponents of the same rank earn players 10 Elo points,
//  with an additional 3 points awarded for each rank differential between opponents,
//  capped at a maximum of 16 Elo points per win. Similarly,
//  losses against opponents of the same rank or higher result in a deduction of 10 Elo points.
//  Losses against lower-ranked opponents result in a deduction of 3 Elo points per rank difference,
//  up to a maximum of -16 points per loss.

function getEloPointsFromRankWin(winnerRank, loserRank)
{
    let rankDifference = Math.abs(winnerRank - loserRank);
    let points = 10 + 3 * rankDifference;
    if (points > 16)
        points = 16;
    return points;
}

async function playerWonMatch(winnerId, loserId)
{
    if (winnerId === undefined || loserId === undefined || winnerId === loserId)
        return;

    let winner = await accountInterface.getUser(winnerId);
    if (winner === undefined)
        return;

    let loser = await accountInterface.getUser(loserId);
    if (loser === undefined)
        return;

    let winnerRank = winner["rank"];
    if (winnerRank < 600)
        winnerRank = 600;
    let loserRank = loser["rank"];
    if (loserRank < 600)
        loserRank = 600;

    let winnerRankNumber = getRankNumberFromLevel(winnerRank);
    let loserRankNumber = getRankNumberFromLevel(loserRank);

    let winnerPoints = getEloPointsFromRankWin(winnerRankNumber, loserRankNumber);
    winner["rank"] += winnerPoints;
    if (winner["rank"] < 600)
        winner["rank"] = 600;

    let loserPoints = -winnerPoints;
    loser["rank"] += loserPoints;
    if (loser["rank"] < 600)
        loser["rank"] = 600;

    // Additionally, whenever a player experiences a demotion, they incur an extra penalty of 25 points,
    // emphasizing the importance of maintaining skill and consistency.
    let loserRankNumber2 = getRankNumberFromLevel(loserRank);
    if (loserRankNumber2 > loserRankNumber)
    {
        loser["rank"] -= 25;
        if (loser["rank"] < 600)
            loser["rank"] = 600;
    }

    await accountInterface.updateUser(winner.userId, winner);
    await accountInterface.updateUser(loser.userId, loser);
}

module.exports = {initApp, playerWonMatch, getRankNumberFromLevel};


