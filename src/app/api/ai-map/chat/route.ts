import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { messages, location } = await request.json();
    
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({ 
        error: 'DeepSeek API Key 未配置' 
      }, { status: 500 });
    }

    const systemPrompt = `你是 AI 地图助手，可以帮助用户：
1. 回答一般问题
2. 推荐附近地点（餐厅、景点、酒店等）
3. 规划路线
4. 解释地理位置信息

当前用户位置：${location || '未知'}

当用户询问附近地点时，请提供具体建议，包括类型和推荐理由。`;

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: response.data.choices[0].message.content,
      usage: response.data.usage
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '操作失败';
    console.error('DeepSeek API 错误:', msg);
    return NextResponse.json({
      success: false,
      error: msg
    }, { status: 500 });
  }
}
