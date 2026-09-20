# 🏛️ Odessey | أوديسي

تطبيق ويب متكامل (MERN Stack) لمقهى/مطعم **Odessey** المستوحى من الحضارة الإغريقية القديمة، مع دعم كامل للغة العربية واتجاه RTL.

## 📁 هيكلية المشروع (Monorepo)

```
odessey/
├── client/     # React + Vite + TypeScript + Tailwind CSS
├── server/     # Node.js + Express + TypeScript + MongoDB/Mongoose
└── README.md
```

## 🎨 نظام التصميم

- **الألوان**: زيتوني وذهبي (Olive/Gold)، أبيض رخامي (Marble White)، تراكوتا/نبيذي عميق (Wine Red)، كحلي إيجي عميق (Aegean Navy).
- **الخطوط**: Cairo / Tajawal (عربي).
- **الاتجاه**: RTL بالكامل (`dir="rtl"`).

## 🧩 مكونات الواجهة (كل مكوّن في ملف مستقل)

| المكوّن | الوصف |
|---|---|
| `TopBanner.tsx` | شريط علوي: أوقات الدوام، زر "من نحن"، تبديل الإشعارات |
| `Header.tsx` | الشعار، اسم المقهى، البحث، زر السلة |
| `CategoryBar.tsx` | شريط الأقسام القابل للتمرير الأفقي مع تمييز القسم النشط |
| `ProductCard.tsx` | بطاقة الصنف: صورة، اسم، وصف، سعر، زر إضافة |
| `ProductGrid.tsx` | شبكة عرض متجاوبة للأصناف |
| `FloatingCart.tsx` | زر طلب عائم + درج السلة الجانبي |
| `AboutModal.tsx` | نافذة "من نحن" المنبثقة |
| `Footer.tsx` | تذييل الصفحة بمعلومات التواصل وأوقات الدوام |

---

## ⚙️ التشغيل

### المتطلبات
- Node.js v18+
- (اختياري) MongoDB — أو استخدم قاعدة البيانات الوهمية الجاهزة للتشغيل السريع

### 1) تشغيل الخادم (Server)

```bash
cd server
npm install
cp .env.example .env
# لتشغيل سريع بدون MongoDB، اترك USE_MOCK_DB=true في ملف .env
npm run dev
```

الخادم سيعمل على: `http://localhost:5000`

### 2) تشغيل الواجهة (Client)

في نافذة طرفية أخرى:

```bash
cd client
npm install
npm run dev
```

الواجهة ستعمل على: `http://localhost:5173`

### 3) التشغيل المتزامن (اختياري)

من جذر المشروع يمكنك تشغيل الأمرين معاً بفتح تبويبين، أو تثبيت `concurrently` في الجذر:

```bash
npm install -g concurrently
concurrently "cd server && npm run dev" "cd client && npm run dev"
```

---

## 🔌 نقاط النهاية (API Endpoints)

| Method | Endpoint | الوصف |
|---|---|---|
| GET | `/api/health` | فحص حالة الخادم |
| GET | `/api/categories` | جلب جميع الأقسام |
| GET | `/api/menu` | جلب جميع أصناف القائمة |
| GET | `/api/menu?category=greek` | جلب أصناف قسم معيّن |
| GET | `/api/menu/:id` | جلب صنف واحد بالتفصيل |

---

## 🗄️ التبديل بين البيانات الوهمية و MongoDB

في `server/.env`:

```env
USE_MOCK_DB=true   # استخدام بيانات وهمية جاهزة (لا حاجة لـ MongoDB)
USE_MOCK_DB=false  # الاتصال الفعلي بقاعدة MongoDB عبر MONGO_URI
```

## 🏗️ البناء للإنتاج

```bash
# Client
cd client && npm run build

# Server
cd server && npm run build && npm start
```
