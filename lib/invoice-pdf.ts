"use client";

import type { AuthUser } from "@/lib/auth";
import type { ProfileServiceHistory } from "@/lib/profile-static";

const LOGO_URL = "/mizan.png";
const PAGE_WIDTH = 210;
const PAGE_PADDING = 12;
const CONTENT_LEFT = PAGE_PADDING;
const CONTENT_RIGHT = PAGE_WIDTH - PAGE_PADDING;

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

const formatPdfMoney = (value: number) =>
  `Tk ${new Intl.NumberFormat("en-US").format(Math.round(value || 0))}`;

const getAmountWords = (service: ProfileServiceHistory) => {
  if (service.due <= 0) return "Paid in full";
  if (service.amountPaid <= 0) return "Payment pending";
  return "Partial payment received";
};

export const downloadInvoicePdf = async (
  service: ProfileServiceHistory,
  user: AuthUser,
) => {
  const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFillColor(33, 96, 186);
  doc.triangle(0, 0, 58, 0, 0, 12, "F");
  doc.setFillColor(123, 61, 200);
  doc.triangle(166, 0, 210, 0, 210, 14, "F");
  doc.setFillColor(236, 170, 129);
  doc.triangle(118, 0, 166, 0, 150, 7, "F");

  try {
    const logo = await loadImageAsDataUrl(LOGO_URL);
    doc.addImage(logo, "PNG", 16, 12, 28, 20);
  } catch {
    // Keep PDF generation resilient if the image fetch fails.
  }

  doc.setTextColor(14, 18, 29);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("MIZAN AC SERVICING", 62, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("657, Hatimbag, Dakshinkhan, Dhaka-1230", 62, 29);
  doc.text("(Bkash - 01665146666), 01949397234", 62, 35);

  doc.setDrawColor(164, 171, 184);
  doc.setLineWidth(0.45);
  doc.line(12, 42, 198, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Customer Name:", 12, 55);
  doc.text("Address:", 12, 67);
  doc.text("INVOICE NO:", 136, 55);
  doc.text("DATE:", 151, 67);
  doc.text("DUE DATE:", 136, 79);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(user.f_name || "Customer", 49, 55);
  doc.text(service.addressEn || service.addressBn || "—", 32, 67);
  doc.text(service.invoice === "—" ? "N/A" : service.invoice, CONTENT_RIGHT, 55, {
    align: "right",
  });
  doc.text(service.dateEn || service.dateBn || "—", CONTENT_RIGHT, 67, {
    align: "right",
  });
  doc.text(service.dueDateEn || service.dueDateBn || "—", CONTENT_RIGHT, 79, {
    align: "right",
  });

  const tableTop = 88;
  const tableBottom = 222;
  const tableX = CONTENT_LEFT;
  const tableW = CONTENT_RIGHT - CONTENT_LEFT;
  const headerHeight = 14;
  const descriptionX = tableX + 14;
  const qtyX = tableX + 112;
  const unitPriceX = tableX + 132;
  const totalX = tableX + 162;

  doc.setDrawColor(166, 174, 188);
  doc.rect(tableX, tableTop, tableW, tableBottom - tableTop);
  doc.line(descriptionX, tableTop, descriptionX, tableBottom);
  doc.line(qtyX, tableTop, qtyX, tableBottom);
  doc.line(unitPriceX, tableTop, unitPriceX, tableBottom);
  doc.line(totalX, tableTop, totalX, tableBottom);
  doc.line(tableX, tableTop + headerHeight, CONTENT_RIGHT, tableTop + headerHeight);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("NO", tableX + 6, tableTop + 9);
  doc.text("DESCRIPTION", descriptionX + 3, tableTop + 9);
  doc.text("QTY", qtyX + 4, tableTop + 9);
  doc.text("UNIT PRICE", unitPriceX + 4, tableTop + 9);
  doc.text("TOTAL", totalX + 8, tableTop + 9);

  let rowY = tableTop + 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);

  service.items.forEach((item, index) => {
    const description = item.descriptionEn || item.descriptionBn || "Service item";
    const descriptionLines = doc.splitTextToSize(description, 92);
    const rowHeight = Math.max(10, descriptionLines.length * 4.8);

    doc.text(String(index + 1), tableX + 4, rowY);
    doc.text(descriptionLines, descriptionX + 3, rowY);
    doc.text(String(item.qty), qtyX + 9, rowY, { align: "center" });
    doc.text(formatPdfMoney(item.unitPrice), unitPriceX + 27, rowY, { align: "right" });
    doc.text(formatPdfMoney(item.total), CONTENT_RIGHT - 4, rowY, { align: "right" });

    rowY += rowHeight + 3;
  });

  const footerTop = 222;
  const footerBottom = 258;
  const leftFooterW = 118;
  const rightFooterX = tableX + leftFooterW;
  const rightFooterW = tableW - leftFooterW;

  doc.rect(tableX, footerTop, leftFooterW, footerBottom - footerTop);
  doc.rect(rightFooterX, footerTop, rightFooterW, footerBottom - footerTop);
  doc.line(rightFooterX, footerTop + 12, CONTENT_RIGHT, footerTop + 12);
  doc.line(rightFooterX, footerTop + 24, CONTENT_RIGHT, footerTop + 24);

  doc.setFont("helvetica", "bold");
  doc.text("PAY TO", tableX + leftFooterW / 2, footerTop + 7, { align: "center" });
  doc.text("SUBTOTAL", rightFooterX + 14, footerTop + 8);
  doc.text("ADVANCE", rightFooterX + 14, footerTop + 20);
  doc.text("DUE", rightFooterX + 25, footerTop + 32);

  doc.setFont("helvetica", "normal");
  doc.text("Bank Name:", tableX + 3, footerTop + 14);
  doc.text("Account Name / Cash:", tableX + 3, footerTop + 24);
  doc.text("Account No:", tableX + 3, footerTop + 34);
  doc.text("Bkash / Cash", tableX + 50, footerTop + 24);
  doc.text("01665146666", tableX + 40, footerTop + 34);

  doc.text(formatPdfMoney(service.subtotal), CONTENT_RIGHT - 3, footerTop + 8, { align: "right" });
  doc.text(formatPdfMoney(service.amountPaid), CONTENT_RIGHT - 3, footerTop + 20, { align: "right" });
  doc.text(formatPdfMoney(service.due), CONTENT_RIGHT - 3, footerTop + 32, { align: "right" });

  doc.rect(tableX, footerBottom, tableW, 12);
  doc.setFont("helvetica", "bold");
  doc.text("Amount In Words:", tableX + 3, footerBottom + 8);
  doc.setFont("helvetica", "normal");
  doc.text(getAmountWords(service), tableX + 42, footerBottom + 8);

  const signatureLineY = 279;

  doc.setDrawColor(120, 126, 138);
  doc.line(34, signatureLineY, 98, signatureLineY);
  doc.line(118, signatureLineY, 184, signatureLineY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Customer Signed", 66, signatureLineY + 6, { align: "center" });
  doc.text("Authorized Signed", 151, signatureLineY + 6, { align: "center" });

  doc.save(`${service.invoice === "—" ? service.id : service.invoice}.pdf`);
};
