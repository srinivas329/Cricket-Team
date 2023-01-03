const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API-1
app.get("/players/", async (request, response) => {
  const sqlQuery = `SELECT * FROM cricket_team ORDER BY player_id`;
  const result = await db.all(sqlQuery);
  response.send(result);
});

//API-2
app.post("/players/", async (request, response) => {
  const data = request.body;
  const { player_name, jersey_number, role } = data;
  const addData = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES('${player_name}','${jersey_number}','${role}')`;
  const result = await db.run(addData);
  const PlayedId = result.lastID;
  response.send({ Player_id: PlayedId });
});

//API-3
app.get("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const sqlQuery = `SELECT * FROM cricket_team WHERE player_id = ${player_id}`;
  const result = await db.get(sqlQuery);
  response.send(result);
});

//API-4
app.put("/players/:playerId/", async (request, response) => {
  const { player_id } = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const sqlQuery = `UPDATE cricket_team SET player_name='${player_name}', jersey_number= '${jersey_number}', role = '${role}'`;
  await db.run(sqlQuery);
  response.send("Player Details Updated");
});

//API-5
app.delete("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const sqlQuery = `DELETE FROM cricket_team WHERE player_id = ${player_id}`;
  await db.run(sqlQuery);
  response.send("Player Removed");
});

module.exports = app;
