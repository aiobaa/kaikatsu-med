require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// =====================
// 利用者：診療開始ボタン
// =====================
app.get("/start", (req, res) => {
  let records = [];

  try {
    const file = fs.readFileSync("data.json", "utf8");
    records = JSON.parse(file);
  } catch (e) {
    records = [];
  }

  records.push({
    action: "診療開始ボタン押下",
    time: new Date().toISOString()
  });

  fs.writeFileSync("data.json", JSON.stringify(records, null, 2));

  res.send(`
    <h2>接続中です...</h2>
    <p>スタッフの案内をお待ちください</p>
  `);
});

// =====================
// スタッフ用：入力保存
// =====================
app.post("/submit", (req, res) => {
  const data = req.body;

  let records = [];

  try {
    const file = fs.readFileSync("data.json", "utf8");
    records = JSON.parse(file);
  } catch (e) {
    records = [];
  }

  records.push({
    ...data,
    time: new Date().toISOString(),
  });

  fs.writeFileSync("data.json", JSON.stringify(records, null, 2));

  res.send(`
    <h2>送信完了</h2>
    <a href="/">戻る</a>
  `);
});

// =====================
// 管理画面
// =====================
app.get("/admin", (req, res) => {
  let records = [];

  try {
    const file = fs.readFileSync("data.json", "utf8");
    records = JSON.parse(file);
  } catch (e) {
    records = [];
  }

  if (records.length === 0) {
    return res.send("<h2>データはありません</h2>");
  }

  let html = "<h2>管理画面</h2><table border='1'><tr>";

  Object.keys(records[0]).forEach((key) => {
    html += `<th>${key}</th>`;
  });

  html += "</tr>";

  records.forEach((record) => {
    html += "<tr>";
    Object.values(record).forEach((val) => {
      html += `<td>${val}</td>`;
    });
    html += "</tr>";
  });

  html += "</table>";

  res.send(html);
});

// =====================
// サーバー起動
// =====================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});