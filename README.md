# Notes API — Express

API catatan sederhana dengan autentikasi JWT. Dibangun dengan Express, PostgreSQL (`pg`), dan `node-pg-migrate`.

## Persyaratan

- Node.js 20 atau lebih baru
- PostgreSQL (lokal, untuk pengembangan)

## Menjalankan Secara Lokal

1. Salin file contoh environment lalu sesuaikan isinya:

   ```bash
   cp .env.example .env
   ```

2. Pasang dependensi:

   ```bash
   npm install
   ```

3. Buat database PostgreSQL sesuai `DATABASE_URL` di `.env`, lalu jalankan migrasi:

   ```bash
   npm run migrate up
   ```

4. Jalankan server:

   ```bash
   npm run dev      # mode pengembangan (otomatis restart saat file berubah)
   npm start        # mode biasa
   ```

5. Cek server hidup:

   ```bash
   curl http://localhost:5000/api/health
   # → {"status":"ok"}
   ```

## Menjalankan Test

Unit test memvalidasi payload secara murni — **tidak butuh database**:

```bash
npm test
```

## Menguji dengan Postman

Impor file `postman_collection.json` ke Postman (Import → pilih file). Urutan pemakaian:

1. **Health Check** — memastikan server hidup.
2. **Auth → Register** — username unik dibuat otomatis setiap dijalankan.
3. **Auth → Login** — access token otomatis tersimpan ke variabel koleksi.
4. Folder **Catatan** — langsung bisa dipakai karena token sudah terpasang.

Untuk menguji server yang sudah di-deploy, ubah variabel koleksi `baseUrl`.

## Variabel Environment

| Variabel | Fungsi | Contoh |
|---|---|---|
| `PORT` | Port server Express | `5000` |
| `DATABASE_URL` | Alamat koneksi PostgreSQL | `postgres://user:pass@localhost:5432/notes_db` |
| `JWT_SECRET` | Kunci rahasia penandatangan JWT | (string acak yang panjang) |
| `CORS_ORIGIN` | Daftar origin frontend yang diizinkan, dipisah koma | `http://localhost:5173` |

## Daftar Endpoint

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| GET | `/api/health` | — | Cek server hidup |
| POST | `/api/auth/register` | — | Daftar user baru |
| POST | `/api/auth/login` | — | Masuk, mendapat access token |
| GET | `/api/notes` | Bearer | Daftar catatan milik user |
| POST | `/api/notes` | Bearer | Buat catatan |
| GET | `/api/notes/:id` | Bearer | Detail catatan |
| DELETE | `/api/notes/:id` | Bearer | Hapus catatan |
