import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections, AnalyticsDocument, ObjectId, isMongoConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - Fetch analytics data
export async function GET(request: NextRequest) {
  // Return mock data if MongoDB is not configured
  if (!isMongoConfigured()) {
    return NextResponse.json({
      totals: {
        views: 24500,
        clicks: 12800,
        shares: 2945,
        engagementRate: "4.2",
      },
      dailyStats: [],
      message: "Using mock data - Database not configured",
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");
    const contentId = searchParams.get("contentId");

    const collection = await getCollection<AnalyticsDocument>(Collections.ANALYTICS);
    
    // Build query
    const query: Record<string, unknown> = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    if (contentId) {
      query.contentId = new ObjectId(contentId);
    }

    const data = await collection
      .find(query)
      .sort({ date: 1 })
      .toArray();

    // Aggregate totals
    const totals = data.reduce(
      (acc, item) => ({
        views: acc.views + item.views,
        clicks: acc.clicks + item.clicks,
        shares: acc.shares + item.shares,
        engagement: acc.engagement + item.engagement,
      }),
      { views: 0, clicks: 0, shares: 0, engagement: 0 }
    );

    // Format for charts
    const dailyStats = data.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      views: item.views,
      clicks: item.clicks,
      shares: item.shares,
    }));

    return NextResponse.json({
      totals: {
        ...totals,
        engagementRate: totals.views > 0 
          ? ((totals.clicks + totals.shares) / totals.views * 100).toFixed(2)
          : 0,
      },
      dailyStats,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// POST - Record analytics event
export async function POST(request: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ success: true, message: "Mock analytics - Database not configured" });
  }

  try {
    const body = await request.json();
    
    const collection = await getCollection<AnalyticsDocument>(Collections.ANALYTICS);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await collection.updateOne(
      {
        contentId: new ObjectId(body.contentId),
        date: today,
      },
      {
        $inc: {
          views: body.views || 0,
          clicks: body.clicks || 0,
          shares: body.shares || 0,
          engagement: body.engagement || 0,
        },
        $setOnInsert: {
          contentId: new ObjectId(body.contentId),
          teamId: body.teamId ? new ObjectId(body.teamId) : undefined,
          date: today,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      { error: "Failed to record analytics" },
      { status: 500 }
    );
  }
}
