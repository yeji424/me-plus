import axios from 'axios';
import * as cheerio from 'cheerio';
import { GPTConfig } from './constants.js';

/**
 * URL에서 메타데이터를 추출하여 이미지 URL을 반환합니다.
 * @param {string} url - 메타데이터를 추출할 URL
 * @returns {Promise<string|null>} 추출된 이미지 URL 또는 null
 */
export const extractMetadata = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: GPTConfig.REQUEST_TIMEOUT,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: GPTConfig.MAX_REDIRECTS,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const getMetaContent = (selector) => {
      const element = $(selector);
      return element.attr('content') || element.text() || null;
    };

    let imageUrl =
      getMetaContent('meta[property="og:image"]') ||
      getMetaContent('meta[name="twitter:image"]') ||
      null;

    // 상대 URL을 절대 URL로 변환
    if (imageUrl && !imageUrl.startsWith('http')) {
      const validUrl = new URL(url);
      if (imageUrl.startsWith('//')) {
        imageUrl = validUrl.protocol + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = validUrl.origin + imageUrl;
      } else {
        imageUrl = validUrl.origin + '/' + imageUrl;
      }
    }

    return imageUrl;
  } catch (error) {
    console.warn('메타데이터 추출 실패:', error.message);
    return null;
  }
};
