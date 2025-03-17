const fs = require("fs");

// Đọc file JSON
const rawData = fs.readFileSync("luad_tcga_gdc_clinical_data.json", "utf-8");
const jsonData = JSON.parse(rawData);

// Hàm đổi key từ có dấu cách thành không dấu cách
function removeSpacesFromKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeSpacesFromKeys);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/\s+/g, "_"), // Thay dấu cách thành "_"
        removeSpacesFromKeys(value),
      ])
    );
  }
  return obj;
}

// Xử lý JSON
const cleanedData = removeSpacesFromKeys(jsonData);

// Ghi lại vào file mới
fs.writeFileSync("cleaned_data.json", JSON.stringify(cleanedData, null, 2));

console.log("JSON đã được làm sạch và lưu vào cleaned_data.json");
