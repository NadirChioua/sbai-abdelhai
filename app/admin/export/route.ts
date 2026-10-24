import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { RANGES, exportRows, parseRange } from "@/lib/admin-data";

/** CSV export (Excel-friendly: UTF-8 BOM, semicolons) of leads or raw events. */
export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.redirect(new URL("/admin/login", request.url));
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") === "events" ? "events" : "leads";
  const range = parseRange(url.searchParams.get("range") ?? undefined);
  const rows = await exportRows(kind, RANGES[range].days);

  const cols = rows[0] ? Object.keys(rows[0]) : [];
  const cell = (v: unknown) => {
    const s = v instanceof Date ? v.toISOString() : v == null ? "" : String(v);
    return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "﻿" + [cols.join(";"), ...rows.map((r) => cols.map((c) => cell(r[c])).join(";"))].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sbai-${kind}-${range}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
