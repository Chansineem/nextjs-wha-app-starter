// ตัวจัดรูปแบบที่ใช้ร่วมกันใน Admin Dashboard

const thbFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

/** จัดรูปแบบเงินบาท เช่น ฿1,234 */
export function formatTHB(amount: number): string {
  return thbFormatter.format(amount);
}

/** จัดรูปแบบวันที่แบบไทย เช่น 10/6/2569 */
export function formatThaiDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("th-TH");
}
