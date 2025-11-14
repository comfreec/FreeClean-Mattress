const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ============ API 엔드포인트 ============

// 1. 무료 케어 신청
app.post('/api/applications', async (req, res) => {
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

    const applicationData = {
      name,
      phone,
      address,
      detail_address: detail_address || '',
      mattress_type: mattress_type || '',
      mattress_age: mattress_age || '',
      preferred_date: preferred_date || '',
      preferred_time: preferred_time || '',
      message: message || '',
      status: 'pending',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('applications').add(applicationData);

    res.json({
      success: true,
      message: '신청이 완료되었습니다.',
      applicationId: docRef.id
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
app.get('/api/applications', async (req, res) => {
  try {
    const { status } = req.query;

    let query = db.collection('applications');

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.orderBy('created_at', 'desc').get();
    const applications = [];

    snapshot.forEach(doc => {
      applications.push({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate().toISOString()
      });
    });

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
app.patch('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.collection('applications').doc(id).update({ status });

    res.json({
      success: true,
      message: '상태가 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('업데이트 에러:', error);
    if (error.code === 'not-found') {
      return res.status(404).json({
        success: false,
        message: '신청을 찾을 수 없습니다.'
      });
    }
    res.status(500).json({
      success: false,
      message: '업데이트 중 오류가 발생했습니다.'
    });
  }
});

// 3-1. 신청 삭제
app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('applications').doc(id).delete();

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
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').orderBy('id').get();
    const products = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      products.push({
        id: doc.id,
        ...data,
        features: Array.isArray(data.features) ? data.features : JSON.parse(data.features || '[]')
      });
    });

    res.json({
      success: true,
      products
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
app.get('/api/reviews', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').orderBy('created_at', 'desc').get();
    const reviews = [];

    snapshot.forEach(doc => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate().toISOString()
      });
    });

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
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, content } = req.body;

    const reviewData = {
      name,
      rating,
      content,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('reviews').add(reviewData);

    res.json({
      success: true,
      message: '후기가 등록되었습니다.',
      reviewId: docRef.id
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
app.get('/api/stats', async (req, res) => {
  try {
    console.log('[API] /api/stats 요청 받음');

    const [
      totalApplicationsSnapshot,
      pendingApplicationsSnapshot,
      completedApplicationsSnapshot,
      totalReviewsSnapshot
    ] = await Promise.all([
      db.collection('applications').count().get(),
      db.collection('applications').where('status', '==', 'pending').count().get(),
      db.collection('applications').where('status', '==', 'completed').count().get(),
      db.collection('reviews').count().get()
    ]);

    res.json({
      success: true,
      stats: {
        totalApplications: totalApplicationsSnapshot.data().count,
        pendingApplications: pendingApplicationsSnapshot.data().count,
        completedApplications: completedApplicationsSnapshot.data().count,
        totalReviews: totalReviewsSnapshot.data().count
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
app.get('/api/posts', async (req, res) => {
  try {
    const postsSnapshot = await db.collection('posts').orderBy('created_at', 'desc').get();
    const posts = [];

    for (const doc of postsSnapshot.docs) {
      const data = doc.data();
      const commentsSnapshot = await db.collection('comments').where('post_id', '==', doc.id).count().get();

      posts.push({
        id: doc.id,
        title: data.title,
        author: data.author,
        views: data.views || 0,
        created_at: data.created_at?.toDate().toISOString(),
        comment_count: commentsSnapshot.data().count
      });
    }

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
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('posts').doc(id);

    // 조회수 증가
    await docRef.update({
      views: admin.firestore.FieldValue.increment(1)
    });

    // 게시글 조회
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      post: {
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate().toISOString()
      }
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
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author, password } = req.body;

    const postData = {
      title,
      content,
      author,
      password,
      views: 0,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('posts').add(postData);

    res.json({
      success: true,
      message: '게시글이 등록되었습니다.',
      postId: docRef.id
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
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await db.collection('comments')
      .where('post_id', '==', id)
      .orderBy('created_at', 'asc')
      .get();

    const comments = [];
    snapshot.forEach(doc => {
      comments.push({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate().toISOString()
      });
    });

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
app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body;

    const commentData = {
      post_id: id,
      author,
      content,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('comments').add(commentData);

    res.json({
      success: true,
      message: '댓글이 등록되었습니다.',
      commentId: docRef.id
    });
  } catch (error) {
    console.error('댓글 작성 에러:', error);
    res.status(500).json({
      success: false,
      message: '댓글 작성 중 오류가 발생했습니다.'
    });
  }
});

// API를 Firebase Functions로 export
exports.api = functions.https.onRequest(app);
