import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kb = searchParams.get("kb");
    
    if (!kb) {
      return NextResponse.json({ error: "Missing kb parameter" }, { status: 400 });
    }

    // Strip 'KB' prefix if present
    const kbNumber = kb.replace(/kb/i, "");

    // Fetch from MSRC API
    const msrcUrl = `https://api.msrc.microsoft.com/sug/v2.0/en-US/affectedProduct?$filter=kbArticles/any(a:a/articleName eq '${kbNumber}')`;
    const response = await fetch(msrcUrl);
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from MSRC API" }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract unique CVEs
    const cveMap = new Map();
    if (data.value && Array.isArray(data.value)) {
      data.value.forEach((item: any) => {
        if (item.cveNumber && !cveMap.has(item.cveNumber)) {
          cveMap.set(item.cveNumber, {
            cveNumber: item.cveNumber,
            releaseDate: item.releaseDate,
            severity: item.severity,
            impact: item.impact,
            product: item.product
          });
        }
      });
    }

    return NextResponse.json(Array.from(cveMap.values()));
  } catch (error: any) {
    console.error("Error fetching KB info:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}