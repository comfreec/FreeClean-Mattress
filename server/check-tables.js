import Database from 'better-sqlite3';

const db = new Database('./coway.db');

console.log('=== 데이터베이스 테이블 목록 ===');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(tables);

console.log('\n=== reviews 테이블 확인 ===');
try {
  const reviews = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
  console.log('reviews 테이블 존재, 행 수:', reviews.count);
} catch (error) {
  console.log('reviews 테이블 에러:', error.message);
}

db.close();
