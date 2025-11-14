import Database from 'better-sqlite3';

const db = new Database('./coway.db');

console.log('=== 최근 신청 내역 ===');
const applications = db.prepare('SELECT * FROM applications ORDER BY created_at DESC LIMIT 5').all();
console.log('신청 건수:', applications.length);
console.log(applications);

console.log('\n=== 전체 신청 건수 ===');
const count = db.prepare('SELECT COUNT(*) as total FROM applications').get();
console.log('총 신청:', count.total);

db.close();
