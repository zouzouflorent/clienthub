const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/clients", async (req, res) => {
  const snap = await db.collection("clients").get();
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(data);
});

app.post("/createClient", async (req, res) => {
  const { name, email, phone } = req.body;
  const ref = await db.collection("clients").add({ name, email, phone });
  res.json({ id: ref.id });
});

exports.api = functions.https.onRequest(app);
