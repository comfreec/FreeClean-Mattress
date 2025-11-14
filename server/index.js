import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// ============ API 엔드포인트 ============

// 1. 무료 케어 신청
app.post('/api/applications', (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      detail_address,
      mattress_type,
      mattress_age,
      preferred_date,
      preferred_time,
      message
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO applications
      (name, phone, address, detail_address, mattress_type, mattress_age, preferred_date, preferred_time, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      phone,
      address,
      detail_address || '',
      mattress_type || '',
      mattress_age || '',
      preferred_date || '',
      preferred_time || '',
      message || ''
    );

    res.json({
      success: true,
      message: '신청이 완료되었습니다.',
      applicationId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('신청 에러:', error);
    res.status(500).json({
      success: false,
      message: '신청 중 오류가 발생했습니다.'
    });
  }
});

// 2. 신청 목록 조회 (관리자)
app.get('/api/applications', (req, res) => {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM applications';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const applications = stmt.all(...params);

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '조회 중 오류가 발생했습니다.'
    });
  }
});

// 3. 신청 상태 업데이트
app.patch('/api/applications/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const stmt = db.prepare('UPDATE applications SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '신청을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '상태가 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('업데이트 에러:', error);
    res.status(500).json({
      success: false,
      message: '업데이트 중 오류가 발생했습니다.'
    });
  }
});

// 3-1. 신청 삭제
app.delete('/api/applications/:id', (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM applications WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: '신청을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '신청이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('삭제 에러:', error);
    res.status(500).json({
      success: false,
      message: '삭제 중 오류가 발생했습니다.'
    });
  }
});

// 4. 제품 목록 조회
app.get('/api/products', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM products ORDER BY id');
    const products = stmt.all();

    res.json({
      success: true,
      products: products.map(p => ({
        ...p,
        features: JSON.parse(p.features || '[]')
      }))
    });
  } catch (error) {
    console.error('제품 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '제품 조회 중 오류가 발생했습니다.'
    });
  }
});

// 5. 리뷰 목록 조회
app.get('/api/reviews', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC');
    const reviews = stmt.all();

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('리뷰 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '리뷰 조회 중 오류가 발생했습니다.'
    });
  }
});

// 5-1. 리뷰 작성
app.post('/api/reviews', (req, res) => {
  try {
    const { name, rating, content } = req.body;

    const stmt = db.prepare(`
      INSERT INTO reviews (name, rating, content)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(name, rating, content);

    res.json({
      success: true,
      message: '후기가 등록되었습니다.',
      reviewId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('리뷰 등록 에러:', error);
    res.status(500).json({
      success: false,
      message: '후기 등록 중 오류가 발생했습니다.'
    });
  }
});

// 6. 통계 조회 (관리자)
app.get('/api/stats', (req, res) => {
  try {
    console.log('[API] /api/stats 요청 받음');
    const totalApplications = db.prepare('SELECT COUNT(*) as count FROM applications').get();
    console.log('totalApplications:', totalApplications);

    const pendingApplications = db.prepare('SELECT COUNT(*) as count FROM applications WHERE status = "pending"').get();
    console.log('pendingApplications:', pendingApplications);

    const completedApplications = db.prepare('SELECT COUNT(*) as count FROM applications WHERE status = "completed"').get();
    console.log('completedApplications:', completedApplications);

    const totalReviews = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
    console.log('totalReviews:', totalReviews);

    res.json({
      success: true,
      stats: {
        totalApplications: totalApplications.count,
        pendingApplications: pendingApplications.count,
        completedApplications: completedApplications.count,
        totalReviews: totalReviews.count
      }
    });
  } catch (error) {
    console.error('통계 조회 에러:', error);
    console.error('에러 스택:', error.stack);
    res.status(500).json({
      success: false,
      message: '통계 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// ============ 게시판 API ============

// 7. 게시글 목록 조회
app.get('/api/posts', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, title, author, views, created_at,
      (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comment_count
      FROM posts
      ORDER BY created_at DESC
    `);
    const posts = stmt.all();

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('게시글 목록 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '게시글 목록 조회 중 오류가 발생했습니다.'
    });
  }
});

// 8. 게시글 상세 조회
app.get('/api/posts/:id', (req, res) => {
  try {
    const { id } = req.params;

    // 조회수 증가
    db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(id);

    // 게시글 조회
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('게시글 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '게시글 조회 중 오류가 발생했습니다.'
    });
  }
});

// 9. 게시글 작성
app.post('/api/posts', (req, res) => {
  try {
    const { title, content, author, password } = req.body;

    const stmt = db.prepare(`
      INSERT INTO posts (title, content, author, password)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(title, content, author, password);

    res.json({
      success: true,
      message: '게시글이 등록되었습니다.',
      postId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('게시글 작성 에러:', error);
    res.status(500).json({
      success: false,
      message: '게시글 작성 중 오류가 발생했습니다.'
    });
  }
});

// 10. 댓글 목록 조회
app.get('/api/posts/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC');
    const comments = stmt.all(id);

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('댓글 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '댓글 조회 중 오류가 발생했습니다.'
    });
  }
});

// 11. 댓글 작성
app.post('/api/posts/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body;

    const stmt = db.prepare(`
      INSERT INTO comments (post_id, author, content)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(id, author, content);

    res.json({
      success: true,
      message: '댓글이 등록되었습니다.',
      commentId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('댓글 작성 에러:', error);
    res.status(500).json({
      success: false,
      message: '댓글 작성 중 오류가 발생했습니다.'
    });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버가 포트 ${PORT}에서 실행중입니다.`);
  console.log(`📍 http://localhost:${PORT}`);
});
