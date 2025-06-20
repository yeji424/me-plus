import axios from 'axios';
import * as cheerio from 'cheerio';

export const getUrlMetadata = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // URL 유효성 검사
    let validUrl;
    try {
      validUrl = new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // HTTP/HTTPS만 허용
    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      return res
        .status(400)
        .json({ error: 'Only HTTP/HTTPS URLs are allowed' });
    }

    // 페이지 HTML 가져오기
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      maxRedirects: 5,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // 메타데이터 추출
    const getMetaContent = (selector) => {
      const element = $(selector);
      return element.attr('content') || element.text() || null;
    };

    const metadata = {
      title:
        getMetaContent('meta[property="og:title"]') ||
        getMetaContent('meta[name="twitter:title"]') ||
        $('title').text() ||
        null,
      description:
        getMetaContent('meta[property="og:description"]') ||
        getMetaContent('meta[name="twitter:description"]') ||
        getMetaContent('meta[name="description"]') ||
        null,
      image:
        getMetaContent('meta[property="og:image"]') ||
        getMetaContent('meta[name="twitter:image"]') ||
        null,
      siteName:
        getMetaContent('meta[property="og:site_name"]') ||
        validUrl.hostname ||
        null,
      url: url,
    };

    // 상대 URL을 절대 URL로 변환
    if (metadata.image && !metadata.image.startsWith('http')) {
      if (metadata.image.startsWith('//')) {
        metadata.image = validUrl.protocol + metadata.image;
      } else if (metadata.image.startsWith('/')) {
        metadata.image = validUrl.origin + metadata.image;
      } else {
        metadata.image = validUrl.origin + '/' + metadata.image;
      }
    }

    res.json(metadata);
  } catch (error) {
    console.error('메타데이터 가져오기 실패:', error.message);
    res.status(500).json({
      error: 'Failed to fetch metadata',
      message: error.message,
    });
  }
};
