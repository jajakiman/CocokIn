# CocokIn Team Workflow and Meeting Notes

> **Status:** Accepted
> **Approval:** Online team meeting
> **Team:** Zaky, Rafi, Farid
> **Development branch:** `dev`
> **Production branch:** `main`

Dokumen ini adalah panduan operasional pengerjaan CocokIn. Gunakan GitHub Issues untuk task management, `dev` untuk seluruh development, dan Pull Request hanya untuk promosi release dari `dev` ke `main`.

## 1. Keputusan Meeting

Keputusan berikut telah disetujui:

- Repository hanya memakai dua branch aktif: `dev` dan `main`.
- Semua coding, dokumentasi, migration, dan integration dilakukan langsung di `dev`.
- `main` hanya menyimpan release production.
- Feature branch, fix branch, docs branch, dan branch per anggota tidak digunakan.
- GitHub Issues menjadi sumber status dan pembagian task.
- Task-level Pull Request tidak digunakan karena source dan target tidak dapat sama-sama `dev`.
- Pull Request hanya digunakan untuk release `dev → main`.
- Setiap commit di `dev` harus kecil, dapat direview, buildable, dan green.
- Force push ke `dev` dan `main` tidak diperbolehkan.
- GitHub Actions tidak digunakan; quality gate dijalankan lokal dan melalui Vercel Git Integration.

## 2. Branch Responsibilities

### `dev`

`dev` adalah branch development dan integration.

Digunakan untuk:

- Seluruh implementasi Zaky, Rafi, dan Farid.
- Integrasi domain Talent, UMKM, Admin, chat, dan treasury.
- Dokumentasi dan design system.
- Database migration dan synthetic seed.
- Vercel preview/staging.
- Integration testing dan release candidate.

Aturan:

- Direct commit/push diperbolehkan sesuai keputusan tim.
- Setiap commit harus terkait GitHub Issue.
- Setiap commit harus lulus verification yang relevan.
- Commit setengah jadi, import rusak, test RED, type error, dan migration parsial tidak boleh dipush.
- `git push --force`, `git reset --hard`, dan penghapusan histori shared branch tidak diperbolehkan.

### `main`

`main` adalah branch production.

Aturan:

- Tidak digunakan untuk development.
- Tidak menerima direct commit.
- Hanya menerima Pull Request dari `dev`.
- Merge ke `main` memicu Vercel production deployment.
- Release memerlukan persetujuan Zaky, Rafi, dan Farid sesuai area review.

## 3. Team Ownership

| Owner | Tanggung jawab utama |
|---|---|
| Zaky | Talent, matching, design system, responsive UI, accessibility, public Passport/Portfolio |
| Rafi | UMKM, marketplace, delivery, Pusher chat, Review Hub, infrastructure, handover |
| Farid | Identity, database, consent persistence, treasury, payout/refund, support, dispute, Admin, deployment |

Detail deliverable, interface, batas kewenangan, dan completion criteria tersedia di [`TEAM_JOBDESCS.md`](TEAM_JOBDESCS.md). Indeks ownership singkat tersedia di [`TEAM_OWNERSHIP.md`](TEAM_OWNERSHIP.md).

## 4. Urutan Dokumen Wajib Dibaca

Semua anggota membaca dokumen berikut sebelum mulai:

1. [`../AGENTS.md`](../AGENTS.md) - aturan repository dan pointer dokumen.
2. [`../CONTEXT.md`](../CONTEXT.md) - bahasa domain canonical.
3. [`../PRD.md`](../PRD.md) - kebutuhan dan tujuan produk.
4. [`TEAM_WORKFLOW.md`](TEAM_WORKFLOW.md) - cara kerja tim dan Git.
5. [`TEAM_JOBDESCS.md`](TEAM_JOBDESCS.md) - tugas, interface, dan completion criteria.
6. [`BUSINESS_FLOW.md`](BUSINESS_FLOW.md) - alur lintas aktor.
7. [`BUSINESS_RULES.md`](BUSINESS_RULES.md) - aturan funding, fee, payout, refund, chat, warranty, consent, dan seed.
8. [`DATA_STATE_MODEL.md`](DATA_STATE_MODEL.md) - aggregate, state, event, reference, dan invariant.
9. [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md) - module, runtime, adapter, provider, testing, dan deployment.
10. [`../design-system/cocokin/MASTER.md`](../design-system/cocokin/MASTER.md) - foundation UI seluruh role.
11. [`superpowers/plans/2026-08-25-cocokin-foundation.md`](superpowers/plans/2026-08-25-cocokin-foundation.md) - urutan implementasi.

### Tambahan untuk Zaky

- `design-system/cocokin/pages/talent-dashboard.md`
- `design-system/cocokin/pages/onboarding.md`
- `design-system/cocokin/pages/marketing.md`
- `design-system/cocokin/pages/public-passport.md`

### Tambahan untuk Rafi

- `design-system/cocokin/pages/business-dashboard.md`
- `design-system/cocokin/pages/project-workspace.md`
- `design-system/cocokin/pages/review-hub.md`
- `design-system/cocokin/pages/project-chat.md`

### Tambahan untuk Farid

- `design-system/cocokin/pages/admin-dashboard.md`
- `design-system/cocokin/pages/funding-treasury.md`
- `docs/adr/0001-managed-modular-monolith.md`
- `docs/adr/0002-production-shaped-simulated-adapters.md`
- `docs/adr/0003-project-funds-and-liability-reserve.md`

## 5. GitHub Issue Workflow

Satu GitHub Issue mewakili satu hasil yang dapat diuji secara mandiri.

Format judul:

```text
[Zaky] Implement Arctic Depths semantic tokens
[Rafi] Implement project creation wizard
[Farid] Implement liability reserve ledger
[Shared] Verify Talent-to-UMKM tracer bullet
```

Setiap issue memuat:

- Outcome yang terlihat oleh user/developer.
- Owner dan reviewer wajib.
- Scope dan out of scope.
- Interface yang dikonsumsi dan dihasilkan.
- Authorization, consent, state, dan audit behavior.
- Responsive requirement jika memiliki UI.
- Acceptance criteria.
- Verification command.
- `Blocked by` dan `Blocks` jika memiliki dependency.

Lifecycle:

```text
Open -> needs-triage -> needs-info (jika perlu)
-> ready-for-agent -> In Progress -> Review -> Done
```

Ketika mulai, owner mengisi assignee, mengubah status menjadi `In Progress`, dan menulis komentar area file yang akan disentuh.

Contoh:

```text
Zaky mulai mengerjakan semantic design tokens.
File: src/design-system/tokens.css dan token tests.
Tidak mengubah Prisma, marketplace, atau treasury.
```

## 6. Memulai Pekerjaan di `dev`

Sebelum menyentuh file:

```bash
git switch dev
git pull --rebase origin dev
git status
```

Syarat mulai:

- Branch aktif adalah `dev`.
- Local `dev` sudah mengikuti `origin/dev`.
- Working tree bersih.
- GitHub Issue sudah assigned dan `In Progress`.
- File yang akan diedit sudah diumumkan.
- Blocking task sudah selesai.
- Owner memahami dokumen sesuai jenis perubahan.

Jika working tree berisi perubahan anggota lain, berhenti dan koordinasikan. Jangan stage, stash, reset, atau menghapus perubahan orang lain tanpa persetujuan.

## 7. Koordinasi Pekerjaan Bersamaan

Karena tiga anggota bekerja langsung di `dev`, file ownership wajib dihormati.

| Path | Primary owner |
|---|---|
| `design-system/cocokin/**`, `src/design-system/**` | Zaky |
| `src/modules/talent/**`, `src/modules/matching/**` | Zaky |
| `src/modules/business/**`, `src/modules/marketplace/**` | Rafi |
| `src/modules/delivery/**`, `src/modules/chat/**`, `src/modules/infrastructure/**` | Rafi |
| `src/modules/identity/**`, `src/modules/payments/**` | Farid |
| `src/modules/support/**`, `src/modules/disputes/**` | Farid |
| `prisma/**`, database migration | Farid sebagai migration steward |
| Shared config dan lockfile | Satu editor pada satu waktu |

Aturan koordinasi:

- Owner lain boleh mengedit dengan pemberitahuan dan review primary owner.
- `package.json` dan `pnpm-lock.yaml` hanya diedit satu orang pada satu waktu.
- Hanya satu migration aktif pada satu waktu.
- Shared interface berubah hanya setelah producer dan seluruh consumer setuju.
- Pull/rebase dilakukan sebelum memulai dan sebelum push untuk memperkecil conflict.

## 8. Implementasi dan Verification

Gunakan vertical slice:

```text
Responsive UI -> server authorization -> domain behavior
-> PostgreSQL persistence -> audit/event -> tests -> docs
```

Minimal verification berdasarkan perubahan:

```bash
corepack pnpm test
corepack pnpm typecheck
```

Untuk perubahan aplikasi luas:

```bash
corepack pnpm verify
```

Untuk critical flow:

```bash
corepack pnpm test:e2e
```

UI wajib diperiksa pada viewport yang relevan dari matriks 320, 375, 768, 1024, dan 1440px, termasuk keyboard, reduced motion, dan 200% zoom.

## 9. Review Tanpa Task-Level PR

Karena task dikerjakan langsung di `dev`, review dilakukan pada diff lokal atau commit sebelum push.

Sebelum commit:

```bash
git status
git diff
```

Kirim diff/patch atau lakukan screen-sharing kepada reviewer sesuai ownership. Reviewer memeriksa behavior, interface, test, responsive/accessibility, atau security/financial correctness sesuai area.

Jika commit sudah terlanjur dipush dan ada finding:

- Buat commit perbaikan baru.
- Jangan amend commit shared.
- Jangan rewrite history.
- Gunakan nomor issue yang sama.

## 10. Commit dan Push

Format commit:

```text
<type>: <hasil perubahan> (#issue)
```

Contoh:

```text
docs: add team workflow guide (#1)
feat: add Arctic Depths semantic tokens (#12)
feat: add Pusher channel authorization (#23)
fix: reject duplicate funding references (#35)
```

Stage hanya file task:

```bash
git add path/to/file-a path/to/file-b
```

Hindari `git add .` ketika pekerjaan anggota lain mungkin berada di working tree.

Sebelum push:

```bash
git pull --rebase origin dev
corepack pnpm verify
git push origin dev
```

Jika rebase conflict:

1. Baca setiap hunk dan intent kedua perubahan.
2. Hubungi primary owner file.
3. Selesaikan per hunk, bukan memilih semua `ours`/`theirs`.
4. Jalankan test ulang.
5. Lanjutkan rebase dan push normal tanpa force.

## 11. Dependency dan Urutan Batch

### Batch 1

| Zaky | Rafi | Farid |
|---|---|---|
| Design tokens dan shared UI contracts | Business/marketplace contracts | Database dan test foundation |

### Batch 2

| Zaky | Rafi | Farid |
|---|---|---|
| Responsive shell | Business onboarding | Auth/RBAC |

### Batch 3

| Zaky | Rafi | Farid |
|---|---|---|
| Talent onboarding | Project creation | Consent/audit |

### Batch 4

| Zaky | Rafi | Farid |
|---|---|---|
| Cocok Score | Application/selection | Simulated funding |

### Batch 5

| Zaky | Rafi | Farid |
|---|---|---|
| Talent marketplace UI | Pusher project chat | Treasury ledger |

### Batch 6

| Zaky | Rafi | Farid |
|---|---|---|
| Verified skill evidence | Review Hub/handover | Payout/refund |

### Batch 7

| Zaky | Rafi | Farid |
|---|---|---|
| Public Passport | Digital Growth/support UX | Warranty/dispute/Admin |

Interface producer harus masuk ke `dev` sebelum consumer melakukan final integration. Consumer melakukan pull/rebase setelah interface tersedia.

## 12. Release Pull Request `dev -> main`

Pull Request hanya digunakan ketika `dev` siap menjadi production release.

Required evidence:

```text
corepack pnpm verify          PASS
corepack pnpm test:e2e       PASS
Vercel Preview               PASS
Responsive matrix            PASS
Accessibility review         PASS
Security review              PASS
Treasury invariants          PASS
Migration rehearsal          PASS
No real data or secret       PASS
```

Review release:

- Zaky menyetujui UI, responsive, dan accessibility.
- Rafi menyetujui marketplace, delivery, chat, dan handover.
- Farid menyetujui identity, database, security, treasury, dan deployment.

Setelah ketiga review selesai:

```text
dev -> Pull Request -> main -> Vercel production
```

## 13. Checklist Harian

### Sebelum coding

- [ ] Branch aktif `dev`.
- [ ] `git pull --rebase origin dev` berhasil.
- [ ] Working tree bersih.
- [ ] Issue assigned dan `In Progress`.
- [ ] File yang diedit diumumkan.
- [ ] Dependency selesai.

### Sebelum commit

- [ ] Scope issue terpenuhi.
- [ ] Test relevan lulus.
- [ ] Typecheck lulus.
- [ ] Reviewer telah melihat diff untuk area wajib.
- [ ] Dokumentasi diperbarui.
- [ ] Tidak ada secret atau data nyata.

### Sebelum push

- [ ] Hanya file task yang staged.
- [ ] Commit menyertakan nomor issue.
- [ ] Pull/rebase `origin/dev` selesai.
- [ ] Verification diulang setelah conflict/rebase.
- [ ] Push tanpa force.

### Sebelum release

- [ ] Full verify dan E2E lulus.
- [ ] Preview, responsive, accessibility, security, dan treasury review lulus.
- [ ] Migration dan rollback siap.
- [ ] Ketiga owner menyetujui PR `dev -> main`.

## 14. Kondisi Darurat

### `dev` rusak

- Hentikan push baru.
- Buat GitHub Issue P0 dan tunjuk owner.
- Reproduksi dan perbaiki dengan test.
- Gunakan commit perbaikan baru; jangan rewrite shared history.

### Secret ter-commit

- Cabut/rotate secret segera.
- Anggap secret sudah bocor meskipun commit belum masuk `main`.
- Hapus dari kode dan catat incident; koordinasikan pembersihan histori secara khusus.

### Migration gagal

- Hentikan deployment/mutation terkait.
- Gunakan backup dan runbook Farid.
- Jangan menjalankan reset atau migration destruktif tanpa review.

### Conflict

- Selesaikan berdasarkan intent bersama primary owner.
- Jalankan verification setelah resolution.
- Tidak menggunakan force push.

## 15. Current Baseline Note

Dokumentasi ownership telah disetujui melalui meeting online. Scaffold Release 0 dan tiga test design-system tersedia secara lokal, tetapi test masih RED sampai `role-config`, `StatusBadge`, dan `AppShell` diimplementasikan. Test RED tersebut tidak boleh dipush sebagai baseline shared `dev` sebelum menjadi green.
