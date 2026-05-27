'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import SakuraPetals from '@/components/SakuraPetals';
import MouseFollower from '@/components/MouseFollower';
import PhotoUpload from '@/components/PhotoUpload';
import VideoUpload from '@/components/VideoUpload';
import { getAllCloudPhotos, deleteCloudPhoto, type CloudPhoto } from '@/lib/photoStorage';
import { getAllVideos, deleteVideo, type StoredVideo } from '@/lib/videoStorage';

interface Photo {
  id: string;
  src: string;
  title: string;
  date: string;
  category: string;
  isUserUploaded?: boolean;
}

interface Movie {
  id: string;
  src: string;
  title: string;
  rating: number;
  quote: string;
  date: string;
}

const categories = ['全部', '旅行', '日常', '纪念日', '美食', '电影', '视频'];

const photos: Photo[] = [
  // 九寨沟系列
  { id: 'jiuzhaigou-1', src: '/images/story1.jpg', title: '九寨沟 · 沉木', date: '2023-07-17', category: '旅行' },
  { id: 'jiuzhaigou-2', src: '/images/story2.jpg', title: '九寨沟 · 波光粼粼', date: '2023-07-17', category: '旅行' },
  { id: 'jiuzhaigou-3', src: '/images/story1.jpg', title: '九寨沟 · 诺日朗瀑布', date: '2023-07-17', category: '旅行' },
  { id: 'jiuzhaigou-4', src: '/images/story2.jpg', title: '九寨沟 · 箭竹海瀑布', date: '2023-07-17', category: '旅行' },
  // 四姑娘山系列
  { id: 'siguniangshan-1', src: '/images/story1.jpg', title: '四姑娘山 · 长坪沟', date: '2023-08-15', category: '旅行' },
  { id: 'siguniangshan-2', src: '/images/story2.jpg', title: '四姑娘山 · 双桥沟', date: '2023-08-15', category: '旅行' },
  { id: 'siguniangshan-3', src: '/images/story1.jpg', title: '四姑娘山 · 海子沟', date: '2023-08-16', category: '旅行' },
  { id: 'siguniangshan-4', src: '/images/story2.jpg', title: '四姑娘山 · 日照金山', date: '2023-08-16', category: '旅行' },
  // 黄山系列
  { id: 'huangshan-1', src: '/images/story1.jpg', title: '黄山 · 迎客松', date: '2024-03-20', category: '旅行' },
  // 旅行风景系列
  { id: 'travel-001', src: '/images/travel/travel-001.jpg', title: '旅行 · 风景01', date: '2025-05-22', category: '旅行' },
  { id: 'travel-002', src: '/images/travel/travel-002.jpg', title: '旅行 · 风景02', date: '2025-05-22', category: '旅行' },
  { id: 'travel-003', src: '/images/travel/travel-003.jpg', title: '旅行 · 风景03', date: '2025-05-22', category: '旅行' },
  { id: 'travel-004', src: '/images/travel/travel-004.jpg', title: '旅行 · 风景04', date: '2025-05-22', category: '旅行' },
  { id: 'travel-005', src: '/images/travel/travel-005.jpg', title: '旅行 · 风景05', date: '2025-05-22', category: '旅行' },
  { id: 'travel-006', src: '/images/travel/travel-006.jpg', title: '旅行 · 风景06', date: '2025-05-22', category: '旅行' },
  { id: 'travel-007', src: '/images/travel/travel-007.jpg', title: '旅行 · 风景07', date: '2025-05-22', category: '旅行' },
  { id: 'travel-008', src: '/images/travel/travel-008.jpg', title: '旅行 · 风景08', date: '2025-05-22', category: '旅行' },
  { id: 'travel-009', src: '/images/travel/travel-009.jpg', title: '旅行 · 风景09', date: '2025-05-22', category: '旅行' },
  { id: 'travel-010', src: '/images/travel/travel-010.jpg', title: '旅行 · 风景10', date: '2025-05-22', category: '旅行' },
  { id: 'travel-011', src: '/images/travel/travel-011.jpg', title: '旅行 · 风景11', date: '2025-05-22', category: '旅行' },
  { id: 'travel-012', src: '/images/travel/travel-012.jpg', title: '旅行 · 风景12', date: '2025-05-22', category: '旅行' },
  { id: 'travel-013', src: '/images/travel/travel-013.jpg', title: '旅行 · 风景13', date: '2025-05-22', category: '旅行' },
  { id: 'travel-014', src: '/images/travel/travel-014.jpg', title: '旅行 · 风景14', date: '2025-05-22', category: '旅行' },
  { id: 'travel-015', src: '/images/travel/travel-015.jpg', title: '旅行 · 风景15', date: '2025-05-22', category: '旅行' },
  { id: 'travel-016', src: '/images/travel/travel-016.jpg', title: '旅行 · 风景16', date: '2025-05-22', category: '旅行' },
  { id: 'travel-017', src: '/images/travel/travel-017.jpg', title: '旅行 · 风景17', date: '2025-05-22', category: '旅行' },
  { id: 'travel-018', src: '/images/travel/travel-018.jpg', title: '旅行 · 风景18', date: '2025-05-22', category: '旅行' },
  { id: 'travel-019', src: '/images/travel/travel-019.jpg', title: '旅行 · 风景19', date: '2025-05-22', category: '旅行' },
  { id: 'travel-020', src: '/images/travel/travel-020.jpg', title: '旅行 · 风景20', date: '2025-05-22', category: '旅行' },
  { id: 'travel-021', src: '/images/travel/travel-021.jpg', title: '旅行 · 风景21', date: '2025-05-22', category: '旅行' },
  { id: 'travel-022', src: '/images/travel/travel-022.jpg', title: '旅行 · 风景22', date: '2025-05-22', category: '旅行' },
  { id: 'travel-023', src: '/images/travel/travel-023.jpg', title: '旅行 · 风景23', date: '2025-05-22', category: '旅行' },
  { id: 'travel-024', src: '/images/travel/travel-024.jpg', title: '旅行 · 风景24', date: '2025-05-22', category: '旅行' },
  { id: 'travel-025', src: '/images/travel/travel-025.jpg', title: '旅行 · 风景25', date: '2025-05-22', category: '旅行' },
  { id: 'travel-026', src: '/images/travel/travel-026.jpg', title: '旅行 · 风景26', date: '2025-05-22', category: '旅行' },
  { id: 'travel-027', src: '/images/travel/travel-027.jpg', title: '旅行 · 风景27', date: '2025-05-22', category: '旅行' },
  { id: 'travel-028', src: '/images/travel/travel-028.jpg', title: '旅行 · 风景28', date: '2025-05-22', category: '旅行' },
  { id: 'travel-029', src: '/images/travel/travel-029.jpg', title: '旅行 · 风景29', date: '2025-05-22', category: '旅行' },
  { id: 'travel-030', src: '/images/travel/travel-030.jpg', title: '旅行 · 风景30', date: '2025-05-22', category: '旅行' },
  { id: 'travel-031', src: '/images/travel/travel-031.jpg', title: '旅行 · 风景31', date: '2025-05-22', category: '旅行' },
  { id: 'travel-032', src: '/images/travel/travel-032.jpg', title: '旅行 · 风景32', date: '2025-05-22', category: '旅行' },
  { id: 'travel-033', src: '/images/travel/travel-033.jpg', title: '旅行 · 风景33', date: '2025-05-22', category: '旅行' },
  { id: 'travel-034', src: '/images/travel/travel-034.jpg', title: '旅行 · 风景34', date: '2025-05-22', category: '旅行' },
  { id: 'travel-035', src: '/images/travel/travel-035.jpg', title: '旅行 · 风景35', date: '2025-05-22', category: '旅行' },
  { id: 'travel-036', src: '/images/travel/travel-036.jpg', title: '旅行 · 风景36', date: '2025-05-22', category: '旅行' },
  { id: 'travel-037', src: '/images/travel/travel-037.jpg', title: '旅行 · 风景37', date: '2025-05-22', category: '旅行' },
  { id: 'travel-038', src: '/images/travel/travel-038.jpg', title: '旅行 · 风景38', date: '2025-05-22', category: '旅行' },
  { id: 'travel-039', src: '/images/travel/travel-039.jpg', title: '旅行 · 风景39', date: '2025-05-22', category: '旅行' },
  { id: 'travel-040', src: '/images/travel/travel-040.jpg', title: '旅行 · 风景40', date: '2025-05-22', category: '旅行' },
  { id: 'travel-041', src: '/images/travel/travel-041.jpg', title: '旅行 · 风景41', date: '2025-05-22', category: '旅行' },
  { id: 'travel-042', src: '/images/travel/travel-042.jpg', title: '旅行 · 风景42', date: '2025-05-22', category: '旅行' },
  { id: 'travel-043', src: '/images/travel/travel-043.jpg', title: '旅行 · 风景43', date: '2025-05-22', category: '旅行' },
  { id: 'travel-044', src: '/images/travel/travel-044.jpg', title: '旅行 · 风景44', date: '2025-05-22', category: '旅行' },
  { id: 'travel-045', src: '/images/travel/travel-045.jpg', title: '旅行 · 风景45', date: '2025-05-22', category: '旅行' },
  { id: 'travel-046', src: '/images/travel/travel-046.jpg', title: '旅行 · 风景46', date: '2025-05-22', category: '旅行' },
  { id: 'travel-047', src: '/images/travel/travel-047.jpg', title: '旅行 · 风景47', date: '2025-05-22', category: '旅行' },
  { id: 'travel-048', src: '/images/travel/travel-048.jpg', title: '旅行 · 风景48', date: '2025-05-22', category: '旅行' },
  { id: 'travel-049', src: '/images/travel/travel-049.jpg', title: '旅行 · 风景49', date: '2025-05-22', category: '旅行' },
  { id: 'travel-050', src: '/images/travel/travel-050.jpg', title: '旅行 · 风景50', date: '2025-05-22', category: '旅行' },
  { id: 'travel-051', src: '/images/travel/travel-051.jpg', title: '旅行 · 风景51', date: '2025-05-22', category: '旅行' },
  { id: 'travel-052', src: '/images/travel/travel-052.jpg', title: '旅行 · 风景52', date: '2025-05-22', category: '旅行' },
  { id: 'travel-053', src: '/images/travel/travel-053.jpg', title: '旅行 · 风景53', date: '2025-05-22', category: '旅行' },
  { id: 'travel-054', src: '/images/travel/travel-054.jpg', title: '旅行 · 风景54', date: '2025-05-22', category: '旅行' },
  { id: 'travel-055', src: '/images/travel/travel-055.jpg', title: '旅行 · 风景55', date: '2025-05-22', category: '旅行' },
  { id: 'travel-056', src: '/images/travel/travel-056.jpg', title: '旅行 · 风景56', date: '2025-05-22', category: '旅行' },
  { id: 'travel-057', src: '/images/travel/travel-057.jpg', title: '旅行 · 风景57', date: '2025-05-22', category: '旅行' },
  { id: 'travel-058', src: '/images/travel/travel-058.jpg', title: '旅行 · 风景58', date: '2025-05-22', category: '旅行' },
  { id: 'travel-059', src: '/images/travel/travel-059.jpg', title: '旅行 · 风景59', date: '2025-05-22', category: '旅行' },
  { id: 'travel-060', src: '/images/travel/travel-060.jpg', title: '旅行 · 风景60', date: '2025-05-22', category: '旅行' },
  { id: 'travel-061', src: '/images/travel/travel-061.jpg', title: '旅行 · 风景61', date: '2025-05-22', category: '旅行' },
  { id: 'travel-062', src: '/images/travel/travel-062.jpg', title: '旅行 · 风景62', date: '2025-05-22', category: '旅行' },
  { id: 'travel-063', src: '/images/travel/travel-063.jpg', title: '旅行 · 风景63', date: '2025-05-22', category: '旅行' },
  { id: 'travel-064', src: '/images/travel/travel-064.jpg', title: '旅行 · 风景64', date: '2025-05-22', category: '旅行' },
  { id: 'travel-065', src: '/images/travel/travel-065.jpg', title: '旅行 · 风景65', date: '2025-05-22', category: '旅行' },
  { id: 'travel-066', src: '/images/travel/travel-066.jpg', title: '旅行 · 风景66', date: '2025-05-22', category: '旅行' },
  { id: 'travel-067', src: '/images/travel/travel-067.jpg', title: '旅行 · 风景67', date: '2025-05-22', category: '旅行' },
  { id: 'travel-068', src: '/images/travel/travel-068.jpg', title: '旅行 · 风景68', date: '2025-05-22', category: '旅行' },
  { id: 'travel-069', src: '/images/travel/travel-069.jpg', title: '旅行 · 风景69', date: '2025-05-22', category: '旅行' },
  { id: 'travel-070', src: '/images/travel/travel-070.jpg', title: '旅行 · 风景70', date: '2025-05-22', category: '旅行' },
  { id: 'travel-071', src: '/images/travel/travel-071.jpg', title: '旅行 · 风景71', date: '2025-05-22', category: '旅行' },
  { id: 'travel-072', src: '/images/travel/travel-072.jpg', title: '旅行 · 风景72', date: '2025-05-22', category: '旅行' },
  { id: 'travel-073', src: '/images/travel/travel-073.jpg', title: '旅行 · 风景73', date: '2025-05-22', category: '旅行' },
  { id: 'travel-074', src: '/images/travel/travel-074.jpg', title: '旅行 · 风景74', date: '2025-05-22', category: '旅行' },
  { id: 'travel-075', src: '/images/travel/travel-075.jpg', title: '旅行 · 风景75', date: '2025-05-22', category: '旅行' },
  { id: 'travel-076', src: '/images/travel/travel-076.jpg', title: '旅行 · 风景76', date: '2025-05-22', category: '旅行' },
  { id: 'travel-077', src: '/images/travel/travel-077.jpg', title: '旅行 · 风景77', date: '2025-05-22', category: '旅行' },
  { id: 'travel-078', src: '/images/travel/travel-078.jpg', title: '旅行 · 风景78', date: '2025-05-22', category: '旅行' },
  { id: 'travel-079', src: '/images/travel/travel-079.jpg', title: '旅行 · 风景79', date: '2025-05-22', category: '旅行' },
  { id: 'travel-080', src: '/images/travel/travel-080.jpg', title: '旅行 · 风景80', date: '2025-05-22', category: '旅行' },
  { id: 'travel-081', src: '/images/travel/travel-081.jpg', title: '旅行 · 风景81', date: '2025-05-22', category: '旅行' },
  { id: 'travel-082', src: '/images/travel/travel-082.jpg', title: '旅行 · 风景82', date: '2025-05-22', category: '旅行' },
  { id: 'travel-083', src: '/images/travel/travel-083.jpg', title: '旅行 · 风景83', date: '2025-05-22', category: '旅行' },
  { id: 'travel-084', src: '/images/travel/travel-084.jpg', title: '旅行 · 风景84', date: '2025-05-22', category: '旅行' },
  { id: 'travel-085', src: '/images/travel/travel-085.jpg', title: '旅行 · 风景85', date: '2025-05-22', category: '旅行' },
  { id: 'travel-086', src: '/images/travel/travel-086.jpg', title: '旅行 · 风景86', date: '2025-05-22', category: '旅行' },
  { id: 'travel-087', src: '/images/travel/travel-087.jpg', title: '旅行 · 风景87', date: '2025-05-22', category: '旅行' },
  { id: 'travel-088', src: '/images/travel/travel-088.jpg', title: '旅行 · 风景88', date: '2025-05-22', category: '旅行' },
  { id: 'travel-089', src: '/images/travel/travel-089.jpg', title: '旅行 · 风景89', date: '2025-05-22', category: '旅行' },
  { id: 'travel-090', src: '/images/travel/travel-090.jpg', title: '旅行 · 风景90', date: '2025-05-22', category: '旅行' },
  { id: 'travel-091', src: '/images/travel/travel-091.jpg', title: '旅行 · 风景91', date: '2025-05-22', category: '旅行' },
  { id: 'travel-092', src: '/images/travel/travel-092.jpg', title: '旅行 · 风景92', date: '2025-05-22', category: '旅行' },
  // 纪念日系列
  { id: 'ann-01', src: '/images/anniversary/ann-01.jpg', title: '纪念日 · 甜蜜瞬间', date: '2023-05-20', category: '纪念日' },
  { id: 'ann-02', src: '/images/anniversary/ann-02.jpg', title: '纪念日 · 浪漫时光', date: '2023-06-18', category: '纪念日' },
  { id: 'ann-03', src: '/images/anniversary/ann-03.jpg', title: '纪念日 · 幸福记录', date: '2023-07-22', category: '纪念日' },
  { id: 'ann-04', src: '/images/anniversary/ann-04.jpg', title: '纪念日 · 温馨时刻', date: '2023-08-19', category: '纪念日' },
  { id: 'ann-05', src: '/images/anniversary/ann-05.jpg', title: '纪念日 · 爱的见证', date: '2023-09-24', category: '纪念日' },
  { id: 'ann-06', src: '/images/anniversary/ann-06.jpg', title: '纪念日 · 美好回忆', date: '2023-10-15', category: '纪念日' },
  { id: 'ann-07', src: '/images/anniversary/ann-07.jpg', title: '纪念日 · 浪漫约会', date: '2023-11-11', category: '纪念日' },
  { id: 'ann-08', src: '/images/anniversary/ann-08.jpg', title: '纪念日 · 甜蜜相伴', date: '2023-12-25', category: '纪念日' },
  { id: 'ann-09', src: '/images/anniversary/ann-09.jpg', title: '纪念日 · 爱的每一天', date: '2024-01-01', category: '纪念日' },
  { id: 'ann-10', src: '/images/anniversary/ann-10.jpg', title: '纪念日 · 幸福日常', date: '2024-02-14', category: '纪念日' },
  // 日常生活系列
  { id: 'daily-01', src: '/images/daily/daily-01.jpg', title: '我们的日常 · 温馨时刻', date: '2024-01-15', category: '日常' },
  { id: 'daily-02', src: '/images/daily/daily-02.jpg', title: '我们的日常 · 快乐时光', date: '2024-02-14', category: '日常' },
  { id: 'daily-03', src: '/images/daily/daily-03.jpg', title: '我们的日常 · 甜蜜瞬间', date: '2024-03-08', category: '日常' },
  { id: 'daily-04', src: '/images/daily/daily-04.jpg', title: '我们的日常 · 幸福记录', date: '2024-04-12', category: '日常' },
  { id: 'daily-05', src: '/images/daily/daily-05.jpg', title: '我们的日常 · 美好回忆', date: '2024-05-20', category: '日常' },
  { id: 'daily-06', src: '/images/daily/daily-06.jpg', title: '我们的日常 · 欢笑时刻', date: '2024-06-18', category: '日常' },
  { id: 'daily-07', src: '/images/daily/daily-07.jpg', title: '我们的日常 · 浪漫约会', date: '2024-07-22', category: '日常' },
  { id: 'daily-08', src: '/images/daily/daily-08.jpg', title: '我们的日常 · 甜蜜约会', date: '2024-08-19', category: '日常' },
  { id: 'daily-09', src: '/images/daily/daily-09.jpg', title: '我们的日常 · 温暖相伴', date: '2024-09-24', category: '日常' },
  { id: 'daily-10', src: '/images/daily/daily-10.jpg', title: '我们的日常 · 快乐相伴', date: '2024-10-15', category: '日常' },
  { id: 'daily-11', src: '/images/daily/daily-11.jpg', title: '我们的日常 · 幸福日常', date: '2024-11-11', category: '日常' },
  { id: 'daily-12', src: '/images/daily/daily-12.jpg', title: '我们的日常 · 爱的记录', date: '2024-12-25', category: '日常' },
  { id: 'daily-13', src: '/images/daily/daily-13.jpg', title: '我们的日常 · 美好时光', date: '2025-01-01', category: '日常' },
  { id: 'daily-14', src: '/images/daily/daily-14.jpg', title: '我们的日常 · 甜蜜生活', date: '2025-02-14', category: '日常' },
  { id: 'daily-15', src: '/images/daily/daily-15.jpg', title: '我们的日常 · 爱的每一天', date: '2025-03-08', category: '日常' },
];

// 电影数据 - 带评分和台词
const movies: Movie[] = [
  { id: 'movie-01', src: '/images/movies/movie-01.jpg', title: '28岁未成年', rating: 7.2, quote: '愿你出走半生，归来仍是少年', date: '2023-01-15' },
  { id: 'movie-02', src: '/images/movies/movie-02.jpg', title: '甄嬛传', rating: 9.4, quote: '愿得一心人，白首不相离', date: '2023-02-20' },
  { id: 'movie-03', src: '/images/movies/movie-03.jpg', title: '从你的全世界路过', rating: 8.1, quote: '我希望有个如你一般的人', date: '2023-03-08' },
  { id: 'movie-04', src: '/images/movies/movie-04.jpg', title: '知否知否应是绿肥红瘦', rating: 8.8, quote: '既入穷巷，就该及时掉头', date: '2023-04-12' },
  { id: 'movie-05', src: '/images/movies/movie-05.jpg', title: '前任3：再见前任', rating: 8.5, quote: '一个以为不会走，一个以为会挽留', date: '2023-05-20' },
  { id: 'movie-06', src: '/images/movies/movie-06.jpg', title: '前任攻略', rating: 7.8, quote: '爱情就是在一起，就是不分离', date: '2023-06-18' },
  { id: 'movie-07', src: '/images/movies/movie-07.jpg', title: '出走的决心', rating: 8.3, quote: '人生只有一次，要为自己而活', date: '2023-07-22' },
  { id: 'movie-08', src: '/images/movies/movie-08.jpg', title: '前任4：英年早婚', rating: 8.0, quote: '婚姻不是终点，幸福才是', date: '2023-08-19' },
  { id: 'movie-09', src: '/images/movies/movie-09.jpg', title: '我，许可以', rating: 7.5, quote: '做自己，比什么都重要', date: '2023-09-24' },
  { id: 'movie-10', src: '/images/movies/movie-10.jpg', title: '长安的荔枝', rating: 8.6, quote: '一骑红尘妃子笑，无人知是荔枝来', date: '2023-10-15' },
  { id: 'movie-11', src: '/images/movies/movie-11.jpg', title: '罗小黑战记', rating: 9.1, quote: '我想和你在一起', date: '2023-11-11' },
  { id: 'movie-12', src: '/images/movies/movie-12.jpg', title: '浪浪山小妖怪', rating: 8.4, quote: '每个小妖怪都有自己的故事', date: '2023-12-25' },
  { id: 'movie-13', src: '/images/movies/movie-13.jpg', title: '阿凡达：水之道', rating: 8.7, quote: '家人是我们的软肋，也是我们的铠甲', date: '2024-01-01' },
];

// 评分星星组件
function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating / 2);
  const hasHalf = rating % 2 >= 1;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${
            i < fullStars
              ? 'text-yellow-400 fill-yellow-400'
              : i === fullStars && hasHalf
              ? 'text-yellow-400 fill-yellow-400/50'
              : 'text-gray-300'
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="ml-1 text-sm font-bold text-yellow-500">{rating}</span>
    </div>
  );
}

// 电影卡片组件 - 横向布局，类似爱奇艺/优酷风格
function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <div
      className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* 海报容器 - 横向比例，不裁剪 */}
      <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        {/* 海报图片 - 横向16:10比例，不裁剪 */}
        <div className="relative w-full aspect-[16/10] bg-[#16161a]">
          <Image
            src={movie.src}
            alt={movie.title}
            fill
            className="object-contain"
            sizes="360px"
          />
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* 评分标签 */}
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {movie.rating}
          </div>
          
          {/* 悬停显示台词 */}
          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm leading-relaxed drop-shadow-lg font-medium">
              &ldquo;{movie.quote}&rdquo;
            </p>
          </div>
        </div>
      </div>
      
      {/* 电影信息 */}
      <div className="mt-2.5 px-1">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate group-hover:text-pink-500 transition-colors">
          {movie.title}
        </h3>
        <div className="mt-1">
          <RatingStars rating={movie.rating} />
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{movie.date}</p>
      </div>
    </div>
  );
}

export default function AlbumPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [cloudPhotos, setCloudPhotos] = useState<CloudPhoto[]>([]);
  const [userVideos, setUserVideos] = useState<StoredVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<StoredVideo | null>(null);
  const [selectedPresetVideo, setSelectedPresetVideo] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 加载云端照片
  const loadCloudPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await getAllCloudPhotos();
      setCloudPhotos(stored);
    } catch (err) {
      console.warn('加载云端照片失败:', err);
      setCloudPhotos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 加载用户上传的视频
  const loadUserVideos = useCallback(async () => {
    try {
      const stored = await getAllVideos();
      setUserVideos(stored);
    } catch (err) {
      console.warn('加载用户视频失败:', err);
    }
  }, []);

  useEffect(() => {
    loadCloudPhotos();
    loadUserVideos();
  }, [loadCloudPhotos, loadUserVideos]);

  // 上传完成回调
  const handleUploaded = useCallback((photo: CloudPhoto) => {
    setCloudPhotos(prev => [...prev, photo]);
  }, []);

  // 视频上传完成回调
  const handleVideoUploaded = useCallback((video: StoredVideo) => {
    setUserVideos(prev => [...prev, video]);
  }, []);

  // 删除云端照片
  const handleDeleteCloudPhoto = useCallback(async (id: string) => {
    try {
      await deleteCloudPhoto(id);
      setCloudPhotos(prev => prev.filter(p => p.id !== id));
      if (selectedPhoto && selectedPhoto.isUserUploaded && selectedPhoto.id === id) {
        setSelectedPhoto(null);
      }
    } catch (err) {
      console.error('删除失败:', err);
      alert('删除失败，请重试');
    }
  }, [selectedPhoto]);

  // 删除用户视频
  const handleDeleteUserVideo = useCallback(async (id: string) => {
    await deleteVideo(id);
    setUserVideos(prev => prev.filter(v => v.id !== id));
    if (selectedVideo && selectedVideo.id === id) {
      setSelectedVideo(null);
    }
  }, [selectedVideo]);

  // 合并预设照片和云端照片
  const allPhotos: Photo[] = [
    ...photos,
    ...cloudPhotos.map(cp => ({
      id: cp.id,
      src: cp.url,
      title: cp.title,
      date: cp.date,
      category: cp.category,
      isUserUploaded: true as const,
    })),
  ];

  const filteredPhotos =
    activeCategory === '全部'
      ? allPhotos
      : activeCategory === '电影' || activeCategory === '视频'
      ? []
      : allPhotos.filter((photo) => photo.category === activeCategory);

  // 当前分类（用于上传按钮）
  const currentUploadCategory = activeCategory === '全部' ? '日常' : activeCategory;

  return (
    <main className="min-h-screen bg-[#fff5f7] dark:bg-[#1a1020] text-gray-800 dark:text-gray-100">
      {/* 全局特效 */}
      <SakuraPetals />
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />

      {/* CSS 动画定义 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        /* 隐藏滚动条但保留滚动功能 */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* 电影列表滚动容器 */
        .movie-scroll-container {
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .movie-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .movie-scroll-container > div {
          scroll-snap-align: start;
        }
        /* 电影列表平滑自动滚动动画 */
        @keyframes movie-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .movie-scroll-track {
          animation: movie-scroll 25s linear infinite;
          width: max-content;
        }
        /* 悬停时暂停自动滚动 */
        .movie-scroll-container:hover .movie-scroll-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* ===== 页面头部 ===== */}
      <section className="relative pt-16 pb-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent mb-3">
            时光相册
          </h1>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 tracking-wider">
            📸 记录美好瞬间
          </p>
        </div>
      </section>

      {/* ===== 相册分类标签 ===== */}
      <section className="px-4 pb-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-200/50 dark:shadow-pink-900/30 scale-105'
                    : 'bg-white dark:bg-[#1e1a2e] text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 border border-pink-100 dark:border-pink-900/30 hover:border-pink-300 dark:hover:border-pink-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 电影专区（当选择电影分类时显示） ===== */}
      {activeCategory === '电影' && (
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-4">
            {/* 电影专区标题 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  🎬 我们一起看过的电影
                </h2>
                <span className="text-sm text-gray-400">共 {movies.length} 部</span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                自动滚动 · 悬停暂停
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 横向滑动电影列表 - 自动滚动 + 手动滑动 */}
          <div className="movie-scroll-container">
            <div className="movie-scroll-track flex gap-4 pb-4">
              {/* 原始列表 */}
              {movies.map((movie, index) => (
                <MovieCard key={`a-${movie.id}`} movie={movie} index={index} />
              ))}
              {/* 复制列表实现无缝循环 */}
              {movies.map((movie, index) => (
                <MovieCard key={`b-${movie.id}`} movie={movie} index={index + movies.length} />
              ))}
            </div>
          </div>

          {/* 经典台词展示 */}
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50/80 to-rose-50/80 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-100 dark:border-pink-800/30">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                经典台词
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {movies.slice(0, 6).map((movie) => (
                  <div key={movie.id} className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm">
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-2">
                      &ldquo;{movie.quote}&rdquo;
                    </p>
                    <p className="text-xs text-pink-500 mt-2">—《{movie.title}》</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== 视频专区（当选择视频分类时显示） ===== */}
      {activeCategory === '视频' && (
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-4">
            {/* 视频专区标题 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  🎥 我们的视频
                </h2>
                <span className="text-sm text-gray-400">共 {userVideos.length + 5} 个</span>
              </div>
            </div>

            {/* 视频网格 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {userVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-in-up rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03] cursor-pointer group bg-gray-900"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* 视频封面 */}
                  <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
                    <video
                      src={video.dataUrl}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      preload="metadata"
                    />
                    {/* 播放按钮遮罩 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-pink-500/80 group-hover:scale-110 transition-all">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    {/* 时长标签 */}
                    {video.duration && video.duration > 0 && (
                      <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                  {/* 标题 */}
                  <div className="p-2 bg-gray-800/50">
                    <p className="text-xs text-gray-200 truncate">{video.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{video.date}</p>
                  </div>
                </div>
              ))}
              
              {/* 预设视频 */}
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={`preset-video-${num}`}
                  className="animate-fade-in-up rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03] cursor-pointer group bg-gray-900"
                  style={{ animationDelay: `${(userVideos.length + num - 1) * 0.05}s` }}
                  onClick={() => setSelectedPresetVideo(num)}
                >
                  {/* 视频封面 */}
                  <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
                    <video
                      src={`/videos/video-${num}.mp4`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      preload="metadata"
                    />
                    {/* 播放按钮遮罩 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-pink-500/80 group-hover:scale-110 transition-all">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* 标题 */}
                  <div className="p-2 bg-gray-800/50">
                    <p className="text-xs text-gray-200 truncate">视频 {num.toString().padStart(2, '0')}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">2025-05-22</p>
                  </div>
                </div>
              ))}
              
              {/* 上传按钮 */}
              <VideoUpload onUploaded={handleVideoUploaded} />
            </div>

            {/* 空状态 */}
            {userVideos.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">🎬</p>
                <p className="text-gray-400 dark:text-gray-500 text-lg mb-6">
                  还没有视频，上传第一个吧~
                </p>
                <button
                  onClick={() => document.getElementById('video-upload-btn')?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  上传视频
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== 照片网格（非电影/视频分类时显示） ===== */}
      {activeCategory !== '电影' && activeCategory !== '视频' && (
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="text-center py-20">
                <p className="text-gray-400">加载中...</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                {filteredPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="animate-fade-in-up rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03] cursor-pointer group bg-gray-100 dark:bg-[#1e1a2e]"
                    style={{ animationDelay: `${index * 0.03}s` }}
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    {/* 图片容器 - 统一正方形比例 */}
                    <div className="relative w-full aspect-square bg-gray-100 dark:bg-[#16161a] overflow-hidden">
                      <Image
                        src={photo.src}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                      />
                      {/* 悬停遮罩 - 简化 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                        <p className="text-white text-[10px] leading-tight line-clamp-2 drop-shadow">
                          {photo.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 上传按钮 - 内联在网格中 */}
                {activeCategory !== '电影' && (
                  <PhotoUpload
                    category={currentUploadCategory}
                    onUploaded={handleUploaded}
                  />
                )}
              </div>
            )}

            {/* 空状态 */}
            {!isLoading && filteredPhotos.length === 0 && activeCategory !== '电影' && activeCategory !== '视频' && (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">📷</p>
                <p className="text-gray-400 dark:text-gray-500 text-lg mb-6">
                  这个分类还没有照片哦~
                </p>
                <button
                  onClick={() => document.getElementById('photo-upload-btn')?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  上传照片
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== 照片模态框 - 点击任意位置关闭 ===== */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-screen flex flex-col items-center justify-center p-4 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 - 更明显 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white/90 hover:text-white transition-colors z-20 bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3 backdrop-blur-md"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 删除按钮 - 仅用户上传的照片 */}
            {selectedPhoto.isUserUploaded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCloudPhoto(selectedPhoto.id);
                }}
                className="absolute top-2 left-2 md:top-4 md:left-4 text-white/90 hover:text-red-400 transition-colors z-20 bg-white/10 hover:bg-red-500/20 rounded-full p-2 md:p-3 backdrop-blur-md"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            {/* 图片 - 完整显示 */}
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                className="object-contain rounded-lg"
                sizes="100vw"
                priority
              />
            </div>

            {/* 信息栏 */}
            <div className="mt-3 mb-2 text-center">
              <h3 className="text-lg font-semibold text-white drop-shadow-lg">
                {selectedPhoto.title}
              </h3>
              <p className="text-white/60 text-sm mt-1">{selectedPhoto.date}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== 视频播放器弹窗 ===== */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm cursor-pointer"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-screen flex flex-col items-center justify-center p-4 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVideo(null);
              }}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white/90 hover:text-white transition-colors z-20 bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3 backdrop-blur-md"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 删除按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUserVideo(selectedVideo.id);
              }}
              className="absolute top-2 left-2 md:top-4 md:left-4 text-white/90 hover:text-red-400 transition-colors z-20 bg-white/10 hover:bg-red-500/20 rounded-full p-2 md:p-3 backdrop-blur-md"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {/* 视频播放器 */}
            <div className="relative w-full flex items-center justify-center">
              <video
                src={selectedVideo.dataUrl}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] w-auto h-auto rounded-lg"
              />
            </div>

            {/* 信息栏 */}
            <div className="mt-3 mb-2 text-center">
              <h3 className="text-lg font-semibold text-white drop-shadow-lg">
                {selectedVideo.title}
              </h3>
              <p className="text-white/60 text-sm mt-1">
                {selectedVideo.date}
                {selectedVideo.duration && selectedVideo.duration > 0 && ` · ${Math.floor(selectedVideo.duration / 60)}:${Math.floor(selectedVideo.duration % 60).toString().padStart(2, '0')}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== 预设视频播放器弹窗 ===== */}
      {selectedPresetVideo !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm cursor-pointer"
          onClick={() => setSelectedPresetVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-screen flex flex-col items-center justify-center p-4 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPresetVideo(null);
              }}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white/90 hover:text-white transition-colors z-20 bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3 backdrop-blur-md"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 视频播放器 */}
            <div className="relative w-full flex items-center justify-center">
              <video
                src={`/videos/video-${selectedPresetVideo}.mp4`}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] w-auto h-auto rounded-lg"
              />
            </div>

            {/* 信息栏 */}
            <div className="mt-3 mb-2 text-center">
              <h3 className="text-lg font-semibold text-white drop-shadow-lg">
                视频 {selectedPresetVideo.toString().padStart(2, '0')}
              </h3>
              <p className="text-white/60 text-sm mt-1">2025-05-22</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== 底部返回按钮 ===== */}
      <section className="pb-10 text-center">
        <Link
          href="/love"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full shadow-lg shadow-pink-200/50 dark:shadow-pink-900/30 hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回主页
        </Link>
      </section>
    </main>
  );
}
