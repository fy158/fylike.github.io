import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BAIDU_MAP_AK = process.env.BAIDU_MAP_AK;
const BAIDU_MAP_URL = 'https://api.map.baidu.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const mode = searchParams.get('mode') || 'driving';
    
    if (!BAIDU_MAP_AK) {
      return NextResponse.json({ error: '百度地图 AK 未配置' }, { status: 500 });
    }

    const modeMap: Record<string, string> = {
      driving: 'driving',
      walking: 'walking',
      transit: 'transit',
      riding: 'riding'
    };

    const response = await axios.get(`${BAIDU_MAP_URL}/direction/v2/${modeMap[mode]}`, {
      params: {
        origin,
        destination,
        output: 'json',
        ak: BAIDU_MAP_AK
      }
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '操作失败';
    console.error('路线规划错误:', msg);
    return NextResponse.json({ error: '路线规划失败' }, { status: 500 });
  }
}
