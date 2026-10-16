# Moodle Quiz Launcher

صفحة ثابتة خفيفة لفتح اختبارات Moodle في التطبيق على Android وiPhone، مع إظهار بدائل عند تعذر الفتح.

## النشر على GitHub Pages

1. أنشئ مستودعًا عامًا جديدًا باسم `moodle-quiz-launcher`.
2. ارفع الملفات الموجودة في هذه الحزمة إلى جذر المستودع.
3. افتح `Settings` ثم `Pages`.
4. ضمن `Build and deployment` اختر:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/(root)`
5. اضغط `Save` وانتظر ظهور رابط النشر.

سيكون الرابط غالبًا:

```text
https://USERNAME.github.io/moodle-quiz-launcher/
```

## صيغة رابط الاختبار

```text
https://USERNAME.github.io/moodle-quiz-launcher/?id=261566
```

## إضافة أسبوع جديد

عدّل `quizzes.js` فقط، وأضف سجلًا لكل شعبة داخل `window.QUIZZES`:

```javascript
"رقم_الاختبار": {
  course: "العلوم والحياة | الصف الرابع | الشعبة 1",
  title: "اختبار الأسبوع الجديد",
  deadline: "الخميس 11:59 مساءً",
  duration: "60 دقيقة",
  attempts: "محاولة واحدة",
  active: true
}
```

ثم نفّذ Commit. لا تعدّل `index.html` أو `app.js` أو `styles.css` عند إضافة أسبوع جديد.

## إيقاف رابط اختبار

غيّر داخل سجل الاختبار:

```javascript
active: false
```

## الاختبار قبل الاعتماد

- افتح الرابط في نافذة خاصة.
- اختبره على Android وiPhone.
- تحقق من رقم الاختبار والشعبة والمدة والموعد.
- تأكد من ظهور البدائل إذا منع المتصفح الفتح التلقائي.
- لا توقف رابط Google Apps Script القديم قبل اعتماد روابط GitHub Pages عمليًا.
