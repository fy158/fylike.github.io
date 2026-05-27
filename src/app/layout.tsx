/**
 * 根布局组件
 * 包含全局元数据和基础布局结构
 */

import type { Metadata } from 'next';
import './globals.css';
import { MusicProvider } from '@/contexts/MusicContext';
import AudioVisualizer from '@/components/AudioVisualizer';
import HideDevTools from '@/components/HideDevTools';
import { SimpleAuthProvider } from '@/components/SimpleAuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ScrollProgress from '@/components/ScrollProgress';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: '桃小淘 - 记录美好时光',
  description: '一个记录美好瞬间、分享生活点滴的温暖角落。',
  keywords: '相册, 记录, 生活, 照片',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <SimpleAuthProvider>
            <ProtectedRoute>
              <MusicProvider>
                <ScrollProgress />
                <HideDevTools />
                <AudioVisualizer />
                {children}
              </MusicProvider>
            </ProtectedRoute>
          </SimpleAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
