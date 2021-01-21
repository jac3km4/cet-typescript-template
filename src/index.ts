
Game.GetStatsDataSystem().SetDifficulty("VeryHard")

let quality: gamedataQuality =
  Game
    .Raw
    .RPGManager
    .GetItemQuality(float(1));
