import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'coway.db'));

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    detail_address TEXT,
    mattress_type TEXT,
    mattress_age TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price_rental INTEGER,
    price_purchase INTEGER,
    description TEXT,
    features TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    content TEXT NOT NULL,
    before_image TEXT,
    after_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    password TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// 샘플 제품 데이터 삽입
const insertProduct = db.prepare(`
  INSERT OR IGNORE INTO products (id, name, category, price_rental, price_purchase, description, features, image_url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const sampleProducts = [
  {
    id: 1,
    name: '코웨이 BEREX 스마트 매트리스 S8+',
    category: '스마트 매트리스',
    price_rental: 89000,
    price_purchase: 3200000,
    description: '수면 자세를 자동으로 인식하여 최적의 편안함을 제공하는 스마트 매트리스',
    features: JSON.stringify(['자동 높이 조절', '수면 분석', '스마트폰 연동', '진드기 케어 시스템']),
    image_url: '/images/berex-s8.jpg'
  },
  {
    id: 2,
    name: '코웨이 BEREX 하이브리드 4',
    category: '하이브리드 매트리스',
    price_rental: 59000,
    price_purchase: 1800000,
    description: '스프링과 메모리폼의 완벽한 조화로 편안한 수면 제공',
    features: JSON.stringify(['독립 스프링', '메모리폼', '통풍성 우수', '체압 분산']),
    image_url: '/images/berex-hybrid4.jpg'
  },
  {
    id: 3,
    name: '코웨이 BEREX 엘리트',
    category: '프리미엄 매트리스',
    price_rental: 69000,
    price_purchase: 2200000,
    description: '프리미엄 소재와 기술로 최상의 수면 경험 제공',
    features: JSON.stringify(['천연 라텍스', '항균 처리', '온도 조절', '압력 완화']),
    image_url: '/images/berex-elite.jpg'
  }
];

sampleProducts.forEach(product => {
  insertProduct.run(
    product.id,
    product.name,
    product.category,
    product.price_rental,
    product.price_purchase,
    product.description,
    product.features,
    product.image_url
  );
});

// 샘플 리뷰 데이터 삽입
const insertReview = db.prepare(`
  INSERT OR IGNORE INTO reviews (id, name, rating, content)
  VALUES (?, ?, ?, ?)
`);

const sampleReviews = [
  {
    id: 1,
    name: '김민수',
    rating: 5,
    content: '매트리스 케어 받고 나서 천식 증상이 많이 좋아졌어요. 진드기가 정말 많이 나왔다고 하더라고요. 무료로 해주셔서 감사합니다!'
  },
  {
    id: 2,
    name: '이지은',
    rating: 5,
    content: '아이가 알레르기가 있어서 걱정했는데, 케어 후 훨씬 좋아졌어요. 전문가분이 친절하게 설명도 해주시고 매트리스 상태 리포트도 주셨어요.'
  },
  {
    id: 3,
    name: '박철수',
    rating: 5,
    content: '10년 된 매트리스라 걱정했는데, 케어 받고 나니 새것처럼 깨끗해졌어요. 코웨이 제품으로 교체도 고민중입니다.'
  }
];

sampleReviews.forEach(review => {
  insertReview.run(review.id, review.name, review.rating, review.content);
});

export default db;
