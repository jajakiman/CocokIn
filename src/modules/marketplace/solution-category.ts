import type { SolutionCategory } from "@prisma/client";

export function classifySolutionCategory(title: string, scope: string): SolutionCategory {
  const text = `${title} ${scope}`.toLowerCase();
  if (/pos|kasir|inventori|stok|operasional/.test(text)) return "OPERATIONS_POS";
  if (/dashboard|analitik|analytics|laporan data/.test(text)) return "DATA_ANALYTICS";
  if (/seo|iklan|kampanye|marketing|media sosial|instagram/.test(text)) return "DIGITAL_MARKETING";
  if (/katalog|e-commerce|order|checkout|keranjang|toko online/.test(text)) return "CATALOG_COMMERCE";
  if (/website|landing|company profile|branding|merek/.test(text)) return "WEBSITE_BRANDING";
  return "OTHER";
}
