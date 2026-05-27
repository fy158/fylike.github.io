import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BAIDU_MAP_AK = process.env.BAIDU_MAP_AK;
const BAIDU_MAP_URL = 'https://api.map.baidu.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const location = searchParams.get('location');
    const radius = searchParams.get('radius') || '5000';
    
    if (!BAIDU_MAP_AK) {
      return NextResponse.json({ error: '百度地图 AK 未配置' }, { status: 500 });
    }

    const response = await axios.get(`${BAIDU_MAP_URL}/place/v2/search`, {
      params: {
        query,
        location,
        radius,
        output: 'json',
        ak: BAIDU_MAP_AK
      }
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '操作失败';
    console.error('地图搜索错误:', msg);
    return NextResponse.json({ error: '地图搜索失败' }, { status: 500 });
  }
}
