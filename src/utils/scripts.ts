import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI: string = process.env.MONGODB_CONNECTION_STRING ?? "";
const vietnamnetURL = 'https://timkiem.vnexpress.net/?q=Ung+th%C6%B0+ph%E1%BB%95i';
const googleScholarURL = 'https://scholar.google.com/scholar?as_vis=0&q=b%E1%BB%87nh++%22ung+th%C6%B0+ph%E1%BB%95i%22&hl=vi&scisbd=1&as_sdt=0,5';

// Kết nối MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Kết nối MongoDB thành công'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Định nghĩa Schema
const articleSchema = new mongoose.Schema({
    title: String,
    link: String,
    source: String,
    date: { type: Date, default: Date.now }
});
const Article = mongoose.model('Article', articleSchema);

// Hàm lấy dữ liệu từ Vietnamnet
async function scrapeVietnamnet() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(vietnamnetURL);

    const articles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.feature-box a')).map(el => {
            const linkElement = el as HTMLAnchorElement;
            return {
                title: linkElement.innerText,
                link: linkElement.href,
                source: 'Vietnamnet'
            };
        });
    });
    
    
    await browser.close();
    return articles;
}

// Hàm lấy dữ liệu từ Google Scholar
async function scrapeGoogleScholar() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(googleScholarURL);

    const articles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.gs_rt a')).map(el => {
            const linkElement = el as HTMLAnchorElement;
            return {
                title: linkElement.innerText,
                link: linkElement.href,
                source: 'Google Scholar'
            };
        });
    });
    
    
    await browser.close();
    return articles;
}

// Hàm lưu vào MongoDB
async function saveArticles(articles: { title: string; link: string; source: string }[]) {
    for (const article of articles) {
        await Article.updateOne(
            { link: article.link },
            article,
            { upsert: true }
        );
    }
    console.log(`✅ Đã lưu ${articles.length} bài viết vào MongoDB`);
}

// Chạy tự động hàng ngày
cron.schedule('0 0 * * *', async () => {
    console.log('🚀 Bắt đầu thu thập bài viết...');
    try {
        const vietnamnetArticles = await scrapeVietnamnet();
        const scholarArticles = await scrapeGoogleScholar();
        await saveArticles([...vietnamnetArticles, ...scholarArticles]);
    } catch (error) {
        console.error('❌ Lỗi khi thu thập bài viết:', error);
    }
}, {
    timezone: 'Asia/Ho_Chi_Minh'
});

console.log('🕒 Script thu thập bài viết đã sẵn sàng chạy hàng ngày');
