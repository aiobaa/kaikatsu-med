require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let responses = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit", (req, res) => {
  const {
    store = "",
    booth = "",
    employeeType = "",
    useReason = "",
    reaction = "",
    notes = ""
  } = req.body;

  const record = {
    time: new Date().toLocaleString("ja-JP"),
    store,
    booth,
    employeeType,
    useReason,
    reaction,
    notes
  };

  responses.unshift(record);
  res.redirect("/admin");
});

app.get("/admin", (req, res) => {
  const rows = responses.map((r, i) => {
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${r.time}</td>
        <td>${r.store}</td>
        <td>${r.booth}</td>
        <td>${r.employeeType}</td>
        <td>${r.useReason}</td>
        <td>${r.reaction}</td>
        <td>${r.notes}</td>
      </tr>
    `;
  }).join("");

  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <title>快活プロトタイプ 管理画面</title>
      <style>
        body { font-family: sans-serif; padding: 24px; }
        h1 { margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ccc; padding: 8px; font-size: 14px; vertical-align: top; }
        th { background: #f5f5f5; }
        a.button {
          display: inline-block;
          margin-bottom: 16px;
          padding: 10px 14px;
          background: #333;
          color: white;
          text-decoration: none;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <h1>快活プロトタイプ 管理画面</h1>
      <a class="button" href="/">入力画面へ戻る</a>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>日時</th>
            <th>店舗</th>
            <th>ブース</th>
            <th>利用者</th>
            <th>利用目的</th>
            <th>反応</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          ${rows || "<tr><td colspan='8'>まだデータはありません</td></tr>"}
        </tbody>
      </table>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});