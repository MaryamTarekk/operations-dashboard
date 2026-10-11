# ⚡ OpsPulse Enterprise — Requests & Operations Dashboard

لوحة تحكم عمليات وطلبات متقدمة مبنية بـ **React 19 + TypeScript + Vite + TanStack Query v5 + Tailwind CSS v4**.
تم تصميم وتطوير المشروع ليلبي كافة معايير هندسة البرمجيات وتجربة المستخدم المتميزة.

---

## 🌟 أبرز ما تم تنفيذه وتطويره

### 1. 🔍 حل مشكلة تجمد وتأخر البحث (Search Fix)
- **سبب المشكلة السابقة:** كان يوجد `key={`${location.key}:${location.search}`}` يعيد بناء الـ Component (Remounting) عند كل تحديث للـ URL، مما كان يُفقد الـ Input تركيزه ويؤدي لظهور الحروف ببطء حرفاً بحرف.
- **الحل:** تم إزالة الـ key والاعتماد على State محلي فوري (60fps Keystroke Response) مع مزامنة الـ URL عبر **Debounce (250ms)** دون إعادة بناء الصفحة، مما جعل البحث سلسًا وسريعًا للغاية.

### 2. ⚡ تغيير الـ Status مباشرة من القائمة مع Optimistic UI
- يمكن الآن تغيير حالة أي طلب (`Pending`, `Running`, `Completed`, `Failed`) **مباشرة من جدول الطلبات** عبر قائمة سريعة لكل سطر بدون الحاجة للدخول للتفاصيل.
- **Optimistic UI:** يتغير الـ Status في الواجهة فورًا وبشكل لحظي، وفي حال فشل طلب السيرفر أو انقطاع الاتصال، يعود الـ UI تلقائيًا للحالة السابقة (Rollback) مع إشعار للمستخدم.

### 3. 📝 تعديل بيانات الـ Request بالكامل مع حماية الـ Unsaved Changes
- داخل صفحة التفاصيل، أصبح متاحاً تعديل:
  - **العنوان (Title / Request Name)**
  - **المسؤول (Owner)**
  - **الأولوية (Priority: Urgent, High, Medium, Low)**
  - **الحالة (Status: Pending, Running, Completed, Failed)**
  - **الوصف والملاحظات (Description & Notes)**
- **Unsaved Changes Dialog:** إذا قام المستخدم بتعديل أي حقل وحاول الرجوع للقائمة أو مغادرة الصفحة دون حفظ، تظهر نافذة تأكيد تسأله عما إذا كان يريد تجاهل التغييرات أو البقاء لحفظها، بالإضافة لحماية المتصفح عند محاولة إغلاق الصفحة (beforeunload).

### 4. 📌 سايدبار ثابت مع التمرير (Sticky Sidebar)
- السايدبار أصبح مثبتًا في مكانه (`sticky top-0 h-screen`) مهما تم التمرير لأسفل داخل الصفحة، مع إمكانية طيه وتوسيعه (Collapsible) بسلاسة.

### 5. 🔄 التحديث التلقائي الدوري (Periodic Background Refresh)
- تم ضبط `refetchInterval` لتحديث بيانات القائمة في الخلفية كل 30 ثانية دون التأثير على الفلاتر أو رقم الصفحة الحالية أو أي نموذج مفتوح.

### 6. 🎨 تصميم بروفيشنال مع Dark & Light Mode
- نظام ألوان أنيق وجديد (**Electric Indigo / Deep Violet / Obsidian Slate**).
- دعم كامل للوضعين الداكن والفاتح مع حفظ الاختيار في `localStorage`.
- إزالة واجهات الـ testing من الشاشة لتكون تجربة المستخدم طبيعية ومهنية كـ Dashboard حقيقية، مع الاحتفاظ بملف الاختبارات البرمجي الكامل في `src/features/operations/__tests__/operations.test.ts`.

---

## 📁 هيكلية المشروع

```
src/
├── app/
│   ├── providers.tsx         # مزودات التطبيق (Theme & QueryClient)
│   └── router.tsx            # التوجيه (Landing Page & Dashboard Layout)
├── components/
│   └── layout/
│       ├── DashboardLayout.tsx # إطار الداش بورد (مع السايدبار الثابت)
│       ├── Header.tsx          # الهيدر العصري
│       └── Sidebar.tsx         # السايدبار التفاعلي الثابت
├── context/
│   └── ThemeContext.tsx      # سياق الثيم (Dark/Light Mode)
├── features/
│   ├── landing/
│   │   └── pages/LandingPage.tsx  # الصفحة الترحيبية الأولى
│   └── operations/
│       ├── api/              # Mock API ومحاكي التأخير والشبكة
│       ├── components/       # المخططات البيانية
│       ├── hooks/            # Hooks التفاعل مع البيانات والـ Optimistic Updates
│       ├── pages/            # صفحة الطلبات وصفحة التفاصيل والتعديل
│       ├── types/            # تعريفات TypeScript
│       └── __tests__/        # ملف الاختبارات الآلية
└── index.css                 # نظام الألوان والمتغيرات
```

---

## 🚀 تشغيل المشروع

```bash
# تثبيت الحزم
npm install

# تشغيل خادم التطوير
npm run dev
```

افتح المتصفح على: `http://localhost:5173`
- تفتح لك الصفحة الترحيبية الأنيقة (Landing Page).
- اضغط على **"Launch Dashboard"** للدخول إلى لوحة التحكم واستعراض كافة الميزات!
