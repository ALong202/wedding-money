import express from "express";
import cors from "cors";
import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

// --- Setup __dirname để serve static ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// --- Hàm bỏ dấu tiếng Việt
function normalizeString(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .toLowerCase()
    .trim();
}

// --- Load Excel ---
const workbook = XLSX.readFile("data.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// --- Debug ---
// console.log("Loaded data:", data);

// --- API tìm kiếm ---
app.get("/search", (req, res) => {
  const q = normalizeString(req.query.q || "");

  const results = data.filter((item) => {
    const name = normalizeString(item.name);
    return name.includes(q);
  });

  res.json({
    query: req.query.q || "",
    count: results.length,
    data: results,
  });
});

// --- Chạy server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
