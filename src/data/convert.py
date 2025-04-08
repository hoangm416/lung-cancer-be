import json
import re

# Đọc dữ liệu từ file JSON
with open("src/data/lusc_tcga_gdc_clinical_data.json", "r", encoding="utf-8-sig") as f:
    data = json.load(f)

# Hàm đổi key: Thay khoảng trắng thành _, loại bỏ ( ) '
def format_keys(obj):
    if isinstance(obj, dict):
        return {re.sub(r"[()\']", "", key).replace(" ", "_").replace("-", "_"): format_keys(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [format_keys(item) for item in obj]
    return obj  # Trả lại value nếu không phải dict hoặc list

# Thực hiện thay đổi key
formatted_data = format_keys(data)

# Lưu lại file mới
with open("final_data_lusc.json", "w", encoding="utf-8") as f:
    json.dump(formatted_data, f, indent=4, ensure_ascii=False)

print("Đã chuyển đổi key thành công!")
