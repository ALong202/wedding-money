import express from "express";
import cors from "cors";
import XLSX from "xlsx";

const app = express();
app.use(cors());

// Load Excel file
const workbook = XLSX.readFile("data.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// Simple search API
app.get("/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase();

  const results = data.filter(item =>
    String(item.name || "").toLowerCase().includes(q)
  );

  res.json({
    query: q,
    count: results.length,
    data: results
  });
});

// Render requires your app to listen on PORT env variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
