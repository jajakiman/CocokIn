import { describe, expect, it } from "vitest";

import { classifySolutionCategory } from "./solution-category";

describe("classifySolutionCategory", () => {
  it("classifies common UMKM solutions into persisted categories", () => {
    expect(classifySolutionCategory("Sistem Kasir POS", "Stok dan laporan harian")).toBe("OPERATIONS_POS");
    expect(classifySolutionCategory("Katalog Produk", "Order online dan keranjang")).toBe("CATALOG_COMMERCE");
    expect(classifySolutionCategory("Dashboard Penjualan", "Analitik transaksi")).toBe("DATA_ANALYTICS");
    expect(classifySolutionCategory("Kampanye Instagram", "SEO dan iklan digital")).toBe("DIGITAL_MARKETING");
    expect(classifySolutionCategory("Company Profile", "Website dan identitas merek")).toBe("WEBSITE_BRANDING");
  });
});
