import { NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const BAIDU_MAP_AK = process.env.BAIDU_MAP_AK;

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'AI地图助手服务运行中',
    deepseek: DEEPSEEK_API_KEY ? '已配置' : '未配置',
    baiduMap: BAIDU_MAP_AK ? '已配置' : '未配置'
  });
}
