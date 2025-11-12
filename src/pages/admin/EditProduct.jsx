import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTypes, fetchCategories, fetchSizes, fetchCrusts, fetchOptions, api, assetUrl } from '../../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [crusts, setCrusts] = useState([]);
  const [options, setOptions] = useState([]);

  const [form, setForm] = useState({
    tenMonAn: '',
    moTa: '',
    hinhAnh: '',
    maLoaiMonAn: '',
    trangThai: 'Active',
    deXuat: false,
    bienThe: [{ maSize: '', giaBan: '' }],
    danhSachMaDanhMuc: [],
    danhSachMaDeBanh: [],
    danhSachMaTuyChon: []
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [typesRes, categoriesRes, sizesRes, crustsRes, optionsRes] = await Promise.all([
          fetchTypes().catch(() => []),
          fetchCategories().catch(() => []),
          fetchSizes().catch(() => []),
          fetchCrusts().catch(() => []),
          fetchOptions().catch(() => [])
        ]);
        if (!mounted) return;
        setTypes(Array.isArray(typesRes) ? typesRes : []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
        setSizes(Array.isArray(sizesRes) ? sizesRes : []);
        setCrusts(Array.isArray(crustsRes) ? crustsRes : []);
        setOptions(Array.isArray(optionsRes) ? optionsRes : []);
      } catch (err) {
        console.error('Failed to load master data:', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/foods/${id}`);
        if (!mounted) return;
        const p = res.data;
        // Map API shape to our form shape
        setForm({
          tenMonAn: p.TenMonAn || '',
          moTa: p.MoTa || '',
          hinhAnh: p.HinhAnh || '',
          maLoaiMonAn: p.MaLoaiMonAn || '',
          trangThai: p.TrangThai || 'Active',
          deXuat: !!p.DeXuat,
          bienThe: Array.isArray(p.BienTheMonAn) && p.BienTheMonAn.length > 0
            ? p.BienTheMonAn.map(b => ({
              maSize: b.MaSize == null ? '' : String(b.MaSize),
              giaBan: b.GiaBan == null ? '' : String(b.GiaBan)
            }))
            : [{ maSize: '', giaBan: '' }],
          danhSachMaDanhMuc: Array.isArray(p.DanhMuc) ? p.DanhMuc.map(d => d.MaDanhMuc) : [],
          danhSachMaDeBanh: Array.isArray(p.MonAn_DeBanh) ? p.MonAn_DeBanh.map(x => x.MaDeBanh) : [],
          danhSachMaTuyChon: Array.isArray(p.MonAn_TuyChon) ? p.MonAn_TuyChon.map(x => x.MaTuyChon) : []
        });

        if (p.HinhAnh) {
          setImagePreview(assetUrl(p.HinhAnh));
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Không thể tải dữ liệu món ăn');
      } finally {
        setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id]);

  const isPizza = form.maLoaiMonAn === '1' || form.maLoaiMonAn === 1;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'maLoaiMonAn') {
        const nextIsPizza = value === '1' || value === 1;
        if (!nextIsPizza) {
          const first = prev.bienThe && prev.bienThe.length > 0 ? prev.bienThe[0] : { maSize: '', giaBan: '' };
          next.bienThe = [{ maSize: '', giaBan: first.giaBan || '' }];
        }
      }
      return next;
    });
  };

  const handleVariantChange = (index, field, value) => {
    setForm(prev => {
      const newBienThe = [...prev.bienThe];
      newBienThe[index] = { ...newBienThe[index], [field]: value };
      return { ...prev, bienThe: newBienThe };
    });
  };

  const addVariant = () => {
    setForm(prev => {
      const isPizzaNext = prev.maLoaiMonAn === '1' || prev.maLoaiMonAn === 1;
      if (!isPizzaNext) return prev;
      const selected = new Set((prev.bienThe || []).map(v => String(v.maSize)).filter(v => v !== '' && v !== 'null'));
      const firstFree = (sizes || []).find(s => !selected.has(String(s.MaSize)));
      const nextVariant = { maSize: firstFree ? String(firstFree.MaSize) : '', giaBan: '' };
      return { ...prev, bienThe: [...prev.bienThe, nextVariant] };
    });
  };

  const removeVariant = (index) => {
    if (form.bienThe.length <= 1) return;
    setForm(prev => ({ ...prev, bienThe: prev.bienThe.filter((_, i) => i !== index) }));
  };

  const toggleCategory = (id) => {
    setForm(prev => ({
      ...prev,
      danhSachMaDanhMuc: prev.danhSachMaDanhMuc.includes(id) ? prev.danhSachMaDanhMuc.filter(x => x !== id) : [...prev.danhSachMaDanhMuc, id]
    }));
  };

  const toggleCrust = (id) => {
    setForm(prev => ({
      ...prev,
      danhSachMaDeBanh: prev.danhSachMaDeBanh.includes(id) ? prev.danhSachMaDeBanh.filter(x => x !== id) : [...prev.danhSachMaDeBanh, id]
    }));
  };

  const toggleOption = (id) => {
    setForm(prev => ({
      ...prev,
      danhSachMaTuyChon: prev.danhSachMaTuyChon.includes(id) ? prev.danhSachMaTuyChon.filter(x => x !== id) : [...prev.danhSachMaTuyChon, id]
    }));
  };

  const handleImageFileChange = (e) => {
    try {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) { setError('Vui lòng chọn đúng định dạng ảnh'); return; }
      if (file.size > 5 * 1024 * 1024) { setError('Ảnh quá lớn, tối đa 5MB'); return; }
      const localUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(localUrl);
      setForm(prev => ({ ...prev, hinhAnh: '' }));
      setError('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      MaMonAn: id ? Number(id) : undefined,
      tenMonAn: form.tenMonAn.trim(),
      moTa: form.moTa.trim(),
      maLoaiMonAn: Number(form.maLoaiMonAn),
      trangThai: form.trangThai,
      deXuat: form.deXuat,
      bienThe: form.bienThe.map(v => ({ maSize: v.maSize === '' || v.maSize === 'null' ? null : Number(v.maSize), giaBan: Number(v.giaBan) })),
      danhSachMaDanhMuc: form.danhSachMaDanhMuc,
      danhSachMaDeBanh: isPizza ? form.danhSachMaDeBanh : [],
      danhSachMaTuyChon: isPizza ? form.danhSachMaTuyChon : []
    };

    if (!payload.tenMonAn) { setError('Vui lòng nhập tên món ăn'); return; }
    if (!payload.maLoaiMonAn) { setError('Vui lòng chọn loại món ăn'); return; }
    if (!payload.bienThe.length || payload.bienThe.some(v => !v.giaBan || v.giaBan <= 0)) { setError('Vui lòng nhập giá bán hợp lệ cho tất cả biến thể'); return; }

    if (isPizza) {
      const sizesChosen = payload.bienThe.map(v => v.maSize);
      if (sizesChosen.some(v => v === null)) { setError('Vui lòng chọn size cho mỗi biến thể'); return; }
      const uniq = new Set(sizesChosen.map(String));
      if (uniq.size !== sizesChosen.length) { setError('Mỗi size chỉ được chọn một lần'); return; }
    }

    console.log('📤 Edit payload JSON (preview):', JSON.stringify(payload, null, 2));

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    if (imageFile) formData.append('hinhAnhFile', imageFile);

    setLoading(true);
    setImageUploading(!!imageFile);
    try {
      const res = await api.put(`/api/foods/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      console.log('Cập nhật món ăn thành công', res.data);
      alert('Cập nhật món ăn thành công');
      navigate('/admin/products');
    } catch (err) {
      console.error('Lỗi khi cập nhật món ăn', err);
      setError(err?.response?.data?.message || err.message || 'Không thể cập nhật món ăn');
    } finally {
      setLoading(false);
      setImageUploading(false);
    }
  };

  return (
    <div className="admin-animate-fade-in">
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <h3 className="mb-0">Sửa món ăn</h3>
          <p className="text-muted">Chỉnh sửa thông tin món ăn và lưu thay đổi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">Tên món ăn <span className="text-danger">*</span></label>
                  <input type="text" name="tenMonAn" className="form-control" value={form.tenMonAn} onChange={handleInputChange} required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">Mô tả</label>
                  <textarea name="moTa" className="form-control" rows={4} value={form.moTa} onChange={handleInputChange} />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">Ảnh sản phẩm</label>
                  <div className="d-flex gap-3 align-items-start">
                    <div style={{ minWidth: 220 }}>
                      <input type="file" accept="image/*" className="form-control" onChange={handleImageFileChange} />
                      <small className="text-muted">Chọn ảnh để thay thế (không bắt buộc)</small>
                    </div>
                    {(imagePreview || form.hinhAnh) && (
                      <div style={{ width: 140, height: 90, borderRadius: 8, overflow: 'hidden' }}>
                        <img src={imagePreview || (form.hinhAnh ? assetUrl(form.hinhAnh) : '')} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { try { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; } catch (err) { void err; } }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold mb-2">Loại món ăn</label>
                    <select name="maLoaiMonAn" className="form-select" value={form.maLoaiMonAn} onChange={handleInputChange} required>
                      <option value="">-- Chọn loại --</option>
                      {types.map(t => <option key={t.MaLoaiMonAn} value={t.MaLoaiMonAn}>{t.TenLoaiMonAn}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold mb-2">Trạng thái</label>
                    <select name="trangThai" className="form-select" value={form.trangThai} onChange={handleInputChange}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <label className="form-check"> <input type="checkbox" name="deXuat" checked={form.deXuat} onChange={handleInputChange} /> Đề xuất</label>
                  </div>
                </div>
              </div>
            </div>

            {/* variants simplified rendering */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5>Biến thể & Giá bán</h5>
                {form.bienThe.map((variant, index) => (
                  <div key={index} className="mb-3 p-3 rounded-3" style={{ background: '#f8f9fa' }}>
                    {isPizza ? (
                      <div className="mb-2">
                        <select value={variant.maSize} className="form-select" onChange={(e) => handleVariantChange(index, 'maSize', e.target.value)} required>
                          <option value="">-- Chọn size --</option>
                          {sizes.map(s => <option key={s.MaSize} value={s.MaSize}>{s.TenSize}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="mb-2">Không áp dụng size</div>
                    )}
                    <div>
                      <input type="number" className="form-control" value={variant.giaBan} onChange={(e) => handleVariantChange(index, 'giaBan', e.target.value)} placeholder="Giá bán" required />
                    </div>
                    {isPizza && form.bienThe.length > 1 && (<button type="button" className="btn btn-sm btn-danger mt-2" onClick={() => removeVariant(index)}>Xóa</button>)}
                  </div>
                ))}
                {isPizza && <button type="button" className="btn btn-outline-primary" onClick={addVariant}>Thêm biến thể</button>}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5>Danh mục</h5>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map(cat => {
                    const selected = form.danhSachMaDanhMuc.includes(cat.MaDanhMuc);
                    return (
                      <button type="button" key={cat.MaDanhMuc} onClick={() => toggleCategory(cat.MaDanhMuc)} className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-light'}`}>
                        {cat.TenDanhMuc}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {isPizza && (
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5>Đế bánh</h5>
                  {crusts.map(c => (
                    <label key={c.MaDeBanh} className="d-block">
                      <input type="checkbox" checked={form.danhSachMaDeBanh.includes(c.MaDeBanh)} onChange={() => toggleCrust(c.MaDeBanh)} /> {c.TenDeBanh}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {isPizza && (
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5>Tùy chọn thêm</h5>
                  {options.map(o => (
                    <label key={o.MaTuyChon} className="d-block">
                      <input type="checkbox" checked={form.danhSachMaTuyChon.includes(o.MaTuyChon)} onChange={() => toggleOption(o.MaTuyChon)} /> {o.TenTuyChon}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-danger w-100" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
