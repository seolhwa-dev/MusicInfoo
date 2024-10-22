const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
    const { query } = req;
    const { title } = query;
    const naverUrl = `https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=${encodeURIComponent(title)}`;

    try {
        const { data: html } = await axios.get(naverUrl);
        const $ = cheerio.load(html);

        // 가사
        const lyrics = $('div.cm_content_wrap > div.cm_content_area._cm_content_area_song_info > div > div.detail_info > div.text_expand.text_center._ellipsis > span').text().trim() || "가사를 찾을 수 없습니다.";

        // 가수 또는 그룹명
        const singer = $('div.cm_top_wrap._sticky._custom_select._header > div.title_area.type_keep._title_area > div > span:nth-child(3) > a').text().trim() || "가수 또는 그룹명을 찾을 수 없습니다.";

        // 발매일
        const releaseDate = $('div.cm_top_wrap._sticky._custom_select._header > div.title_area.type_keep._title_area > div > span:nth-child(5)').text().trim() || "발매일을 찾을 수 없습니다.";

        res.status(200).json({ lyrics, singer, releaseDate });
    } catch (error) {
        console.error("Error fetching song information:", error);
        res.status(500).json({ error: "노래 정보를 가져오는 중 오류가 발생했습니다." });
    }
}
