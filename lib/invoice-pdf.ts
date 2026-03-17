"use client";

import { jsPDF } from "jspdf";
import type { AuthUser } from "@/lib/auth";
import type { ProfileServiceHistory } from "@/lib/profile-static";

const LOGO_URL = "/mizan.png";

const loadImageAsDataUrl = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const downloadInvoicePdf = async (
  service: ProfileServiceHistory,
  user: AuthUser,
  _locale: "bn" | "en",
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFillColor(33, 96, 186);
  doc.triangle(0, 0, 55, 0, 0, 12, "F");
  doc.setFillColor(123, 61, 200);
  doc.triangle(150, 0, 210, 0, 210, 14, "F");
  doc.setFillColor(236, 170, 129);
  doc.triangle(120, 0, 175, 0, 150, 6, "F");

  try {
    const logo = await loadImageAsDataUrl(LOGO_URL);
    doc.addImage(logo, "PNG", 12, 12, 34, 24);
  } catch {
    // Keep PDF generation resilient if the image fetch fails.
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("MIZAN AC SERVICING", 55, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text("657, Hatimbag, Dakshinkhan, Dhaka-1230", 55, 29);
  doc.text("(Bkash - 01665146666), 01949397234", 55, 35);

  doc.setDrawColor(130, 130, 130);
  doc.line(12, 42, 198, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Customer Name:", 12, 53);
  doc.text(user.f_name || "Customer", 46, 53);
  doc.text("Address:", 12, 61);
  doc.text(service.addressEn || service.addressBn, 31, 61);

  doc.text("INVOICE NO:", 145, 53);
  doc.text(service.invoice === "—" ? "N/A" : service.invoice, 184, 53);
  doc.text("DATE:", 160, 61);
  doc.setFont("helvetica", "normal");
  doc.text(service.dateEn || service.dateBn, 184, 61, {
    align: "right",
  });
  doc.setFont("helvetica", "bold");
  doc.text("DUE DATE:", 151, 69);
  doc.setFont("helvetica", "normal");
  doc.text(service.dueDateEn || service.dueDateBn, 184, 69, {
    align: "right",
  });

  const top = 78;
  const col = {
    no: 12,
    description: 24,
    qty: 118,
    unitPrice: 138,
    total: 168,
    end: 198,
  };

  doc.rect(col.no, top, col.end - col.no, 118);
  doc.line(col.description, top, col.description, top + 118);
  doc.line(col.qty, top, col.qty, top + 118);
  doc.line(col.unitPrice, top, col.unitPrice, top + 118);
  doc.line(col.total, top, col.total, top + 118);
  doc.line(col.no, top + 14, col.end, top + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("NO", 15, top + 9);
  doc.text("DESCRIPTION", 27, top + 9);
  doc.text("QTY", 122, top + 9);
  doc.text("UNIT PRICE", 142, top + 9);
  doc.text("TOTAL", 176, top + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let rowY = top + 24;
  service.items.forEach((item, index) => {
    doc.text(String(index + 1), 16, rowY);
    const description = item.descriptionEn || item.descriptionBn;
    const descriptionLines = doc.splitTextToSize(description, 88);
    doc.text(descriptionLines, 27, rowY);
    doc.text(String(item.qty), 125, rowY);
    doc.text(`৳ ${item.unitPrice}`, 143, rowY);
    doc.text(`৳ ${item.total}`, 176, rowY);
    rowY += Math.max(12, descriptionLines.length * 5 + 2);
  });

  doc.setFont("helvetica", "bold");
  doc.rect(12, 196, 116, 32);
  doc.rect(128, 196, 70, 10);
  doc.rect(128, 206, 70, 10);
  doc.rect(128, 216, 70, 12);
  doc.text("PAY TO", 70, 201, { align: "center" });
  doc.text("SUBTOTAL", 150, 202);
  doc.text("ADVANCE", 151, 212);
  doc.text("DUE", 158, 223);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text("Bank Name:", 15, 208);
  doc.text("Account Name / Cash:", 15, 216);
  doc.text("Account No:", 15, 224);
  doc.text("Bkash / Cash", 63, 216);
  doc.text("01665146666", 48, 224);

  doc.text(`৳ ${service.subtotal}`, 190, 202, { align: "right" });
  doc.text(`৳ ${service.amountPaid}`, 190, 212, { align: "right" });
  doc.text(`৳ ${service.due}`, 190, 223, { align: "right" });

  doc.rect(12, 228, 186, 12);
  doc.setFont("helvetica", "bold");
  doc.text("Amount In Words:", 14, 236);
  doc.setFont("helvetica", "normal");
  doc.text(
    service.due === 0
      ? "Paid in full"
      : "Partial payment received",
    53,
    236,
  );

  doc.line(70, 270, 110, 270);
  doc.line(145, 270, 190, 270);
  doc.text("Customer Signed", 90, 278, { align: "center" });
  doc.text("Authorized Signed", 168, 278, { align: "center" });

  doc.save(`${service.invoice === "—" ? service.id : service.invoice}.pdf`);
};
