# SignLang - Sign Language Learning Platform 🤟

Django-based sign language learning application with modern UI/UX using Tailwind CSS and Alpine.js.

## 🚀 Features

- **Modern UI/UX**: Built with Tailwind CSS v3.4
- **Interactive Components**: Alpine.js for dynamic interactions
- **Responsive Design**: Mobile-first approach
- **Django Backend**: Powerful Python web framework
- **Professional Templates**: Base template with navigation, footer, and message handling

## 📁 Project Structure

```
signlang/
├── static/
│   ├── css/
│   │   ├── input.css      # Tailwind source file
│   │   └── output.css     # Compiled CSS (generated)
│   ├── js/
│   │   └── main.js        # Custom JavaScript
│   ├── images/            # Image assets
│   └── fonts/             # Custom fonts
├── templates/
│   ├── base.html          # Base template
│   └── index.html         # Homepage
├── signlang/
│   ├── settings.py        # Django settings
│   ├── urls.py            # URL configuration
│   └── ...
├── manage.py
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Node dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Step 1: Install Python Dependencies

```bash
pip install django
```

### Step 2: Install Node Dependencies

```bash
npm install
```

### Step 3: Build Tailwind CSS

For production (minified):
```bash
npm run build
```

For development (watch mode):
```bash
npm run dev
```

### Step 4: Run Django Server

```bash
python manage.py migrate
python manage.py runserver
```

Visit: http://localhost:8000

## 🎨 UI Components

### Buttons
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
```

### Cards
```html
<div class="card">
    <h3>Card Title</h3>
    <p>Card content</p>
</div>
```

### Inputs
```html
<input type="text" class="input" placeholder="Enter text">
```

## 🎯 Customization

### Colors
Edit `tailwind.config.js` to customize the primary color palette:

```javascript
colors: {
  primary: {
    500: "#0ea5e9",  // Main color
    600: "#0284c7",  // Hover state
    // ... other shades
  }
}
```

### Custom Styles
Add custom CSS in `static/css/input.css` using Tailwind's @layer directive:

```css
@layer components {
  .my-custom-class {
    @apply px-4 py-2 bg-blue-500;
  }
}
```

## 📝 Adding New Pages

1. Create template in `templates/` directory
2. Add URL pattern in `signlang/urls.py`
3. Create view function or use generic views

Example:
```python
# urls.py
path('about/', TemplateView.as_view(template_name='about.html'), name='about'),
```

## 🔧 Development Workflow

1. Start Tailwind watch mode:
   ```bash
   npm run dev
   ```

2. In another terminal, start Django:
   ```bash
   python manage.py runserver
   ```

3. Make changes to templates or CSS
4. Refresh browser to see changes

## 📦 Production Deployment

1. Build Tailwind CSS:
   ```bash
   npm run build
   ```

2. Collect static files:
   ```bash
   python manage.py collectstatic
   ```

3. Set `DEBUG = False` in `settings.py`

4. Configure proper ALLOWED_HOSTS

## 🎭 Alpine.js Usage

Alpine.js is included via CDN. Example usage:

```html
<div x-data="{ open: false }">
    <button @click="open = !open">Toggle</button>
    <div x-show="open">Content</div>
</div>
```

## 📚 Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Alpine.js Documentation](https://alpinejs.dev/)

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

MIT License

---

Made with ❤️ for the sign language learning community
