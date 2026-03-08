import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

const LAND_KNOWLEDGE = {
  'মিউটেশন': { response: '✅ **মিউটেশন** | Land Manual 1990 | e-Mutation Portal | ৳২০০ | ১৫ দিন\n💰 [১৯৯ টাকা ফর্ম | ২,৯৯৯ টাকা গাইড]', metadata: { area: 'property' } },
  'সীমানা': { response: '✅ **সীমানা ঝগড়া** | Partition Act 1893 | AC Land Form-6\n💰 [২৯৯ টাকা | ৪,৯৯৯ টাকা]', metadata: { area: 'property' } },
  'rajuk': { response: '✅ **RAJUK ফ্ল্যাট** | Apartment Act 2023 | Consumer Tribunal\n💰 [৪৯৯ টাকা | ৯,৯৯৯ টাকা]', metadata: { area: 'property' } }
};

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  
  const topic = Object.keys(LAND_KNOWLEDGE).find(t => message.toLowerCase().includes(t)) || 'unknown';
  const data = LAND_KNOWLEDGE[topic as keyof typeof LAND_KNOWLEDGE] || 
    { response: '✅ মিউটেশন | সীমানা ঝগড়া | RAJUK ফ্ল্যাট লিখুন\n💰 ৯৯-১৯,৯৯৯ টাকা', metadata: {} };
  
  return NextResponse.json({ response: data.response, metadata: data.metadata });
}
