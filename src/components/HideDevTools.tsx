/**
 * 隐藏 Next.js 开发工具栏
 * 仅针对已知的 Next.js Dev Tools 特定元素
 */

'use client';

import { useEffect } from 'react';

export default function HideDevTools() {
  useEffect(() => {
    function hideDevTools() {
      // 仅移除已知的 Next.js Dev Tools 特定元素
      const selectors = [
        '[aria-label="Open Next.js Dev Tools"]',
        '[aria-label="Collapse issues badge"]',
        '__next-build-watcher',
      ];

      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            (el as HTMLElement).style.display = 'none';
          });
        } catch (_e) {
          // ignore
        }
      });
    }

    // 立即执行一次
    hideDevTools();

    // 用 MutationObserver 持续监听
    const observer = new MutationObserver(() => {
      hideDevTools();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 30秒后停止监听，节省性能
    const timer = setTimeout(() => observer.disconnect(), 30000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return null;
}
