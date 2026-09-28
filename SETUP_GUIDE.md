# 🚀 Quick Setup Guide - SignLang

## पहली बार Setup करने के लिए

### 1️⃣ Python Dependencies Install करें

```bash
pip install -r requirements.txt
```

### 2️⃣ Node Dependencies Install करें

```bash
npm install
```

### 3️⃣ Tailwind CSS Build करें

Production के लिए (minified):
```bash
npm run build
```

Development के लिए (watch mode - auto-reload):
```bash
npm run dev
```

### 4️⃣ Database Setup करें

```bash
python manage.py migrate
```

### 5️⃣ Admin User बनाएं (Optional)

```bash
python manage.py createsuperuser
```

### 6️⃣ Development Server शुरू करें

```bash
python manage.py runserver
```

अब browser में जाएं: **http://localhost:8000**

---

## 🎨 Development Workflow

### दो terminals खोलें:

**Terminal 1** - Tailwind CSS Watch Mode:
```bash
npm run dev
```

**Terminal 2** - Django Server:
```bash
python manage.py runserver
```

अब आप templates में changes करें और browser में refresh करें!

---

## 📁 Important Files

- `templates/` - सभी HTML templates यहाँ हैं
- `static/css/input.css` - Tailwind source file (यहाँ custom CSS add करें)
- `static/css/output.css` - Generated file (इसे manually edit न करें)
- `static/js/main.js` - Custom JavaScript
- `tailwind.config.js` - Tailwind configuration
- `signlang/settings.py` - Django settings
- `signlang/urls.py` - URL routing

---

## 🎯 Available Pages

- **Home** - `/` - Landing page with hero section
- **Learn** - `/learn` - Learning courses and paths
- **Practice** - `/practice` - Practice modes and exercises
- **About** - `/about` - About the platform
- **Contact** - `/contact` - Contact form
- **Admin** - `/admin` - Django admin panel

---

## 🛠️ Customization Tips

### Colors बदलना:
`tailwind.config.js` में `colors.primary` section edit करें

### Logo/Branding बदलना:
`templates/base.html` में navigation section edit करें

### New Page बनाना:
1. `templates/` में new HTML file बनाएं
2. `signlang/urls.py` में URL add करें
3. `templates/base.html` में navigation link add करें

---

## 🚀 Production Deployment Checklist

- [ ] `npm run build` - Tailwind CSS minify करें
- [ ] `python manage.py collectstatic` - Static files collect करें
- [ ] `settings.py` में `DEBUG = False` set करें
- [ ] `ALLOWED_HOSTS` में domain add करें
- [ ] Environment variables setup करें
- [ ] Database migrations run करें

---

## 💡 Common Issues

**Issue:** Tailwind classes काम नहीं कर रहे
**Solution:** `npm run build` फिर से run करें

**Issue:** Static files load नहीं हो रही
**Solution:** `python manage.py collectstatic` run करें

**Issue:** Templates में changes दिख नहीं रहे
**Solution:** Browser cache clear करें (Ctrl + Shift + R)

---

## 📞 Need Help?

Questions या issues के लिए contact form use करें या repository में issue open करें!

Happy Coding! 🤟
