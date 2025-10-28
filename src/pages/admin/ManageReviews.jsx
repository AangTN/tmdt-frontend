import React, { useMemo, useState } from 'react';

const mockReviews = [
  {
    id: 'RV001',
    orderId: 'DH1001',
    customer: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Pizza ngon, giao hàng nhanh!'
  },
  {
    id: 'RV002',
    orderId: 'DH0999',
    customer: 'Lê Minh C',
    rating: 4,
    comment: 'Ngon nhưng hơi nguội tí, shipper thân thiện.'
  },
  {
    id: 'RV003',
    orderId: 'DH0995',
    customer: 'Trần Thị B',
    rating: 2,
    comment: 'Giao chậm 15 phút, mong cải thiện.'
  }
];

const ManageReviews = () => {
  const [ratingFilter, setRatingFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredReviews = useMemo(() => {
    return mockReviews.filter((review) => {
      const matchRating = ratingFilter === 'all' || review.rating === Number(ratingFilter);
      const matchText = [review.customer, review.orderId, review.comment]
        .some((field) => field.toLowerCase().includes(search.toLowerCase()));
      return matchRating && matchText;
    });
  }, [ratingFilter, search]);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Đánh giá đơn hàng</h3>
          <small className="text-muted">Theo dõi phản hồi của khách hàng (dữ liệu demo).</small>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <input
            type="search"
            className="form-control"
            placeholder="Tìm theo khách hàng, mã đơn hoặc nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 260 }}
          />
          <select className="form-select" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
            <option value="all">Tất cả sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã đánh giá</th>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Số sao</th>
                <th>Nhận xét</th>
                <th style={{ width: 140 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">Chưa có đánh giá phù hợp.</td>
                </tr>
              ) : (
                filteredReviews.map(review => (
                  <tr key={review.id}>
                    <td className="fw-semibold">{review.id}</td>
                    <td>{review.orderId}</td>
                    <td>{review.customer}</td>
                    <td>
                      {'⭐'.repeat(review.rating)}
                      <span className="text-muted ms-1">({review.rating})</span>
                    </td>
                    <td><small>{review.comment}</small></td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" disabled>Trả lời</button>
                        <button className="btn btn-outline-danger" disabled>Ẩn đánh giá</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
