import type { AnalysisResult } from '@/types';

/**
 * Demo-mode mock data used when the backend API is unavailable.
 * Shaped to match the AnalysisResult interface used by all dashboard components.
 */
export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
    projectName: 'Inventory_Management_System',
    projectOwner: 'ShashwatM24',
    projectType: 'Full-Stack Web Application',
    techStack: ['Python', 'Flask', 'SQLite', 'Jinja2', 'Bootstrap', 'SQLAlchemy', 'Werkzeug'],
    complexityScore: 72,
    complexityLabel: 'High',
    summary:
        'A comprehensive full-stack inventory management system built with Python and Flask. ' +
        'It provides complete CRUD operations for products and bills, a real-time dashboard with analytics, ' +
        'AI-powered insights via Google Gemini, secure JWT-based authentication, and PDF bill generation. ' +
        'The system uses SQLite for persistence and features a clean Bootstrap-based UI with dark mode support.',
    keyFeatures: [
        'User authentication with JWT and session management',
        'Product management — add, edit, delete, search with stock tracking',
        'Bill generation with PDF export and print-ready formatting',
        'Real-time analytics dashboard with charts and KPIs',
        'AI chatbot powered by Google Gemini for inventory insights',
        'Low-stock alerts and automated reorder notifications',
        'Role-based access control (Admin / Staff)',
        'RESTful API with JSON responses for all data endpoints',
    ],
    fileTree: [
        {
            name: 'Inventory_Management_System',
            path: '',
            type: 'folder',
            children: [
                {
                    name: 'app.py',
                    path: 'app.py',
                    type: 'file',
                },
                {
                    name: 'requirements.txt',
                    path: 'requirements.txt',
                    type: 'file',
                },
                {
                    name: 'README.md',
                    path: 'README.md',
                    type: 'file',
                },
                {
                    name: 'config.py',
                    path: 'config.py',
                    type: 'file',
                },
                {
                    name: 'models',
                    path: 'models',
                    type: 'folder',
                    children: [
                        { name: '__init__.py', path: 'models/__init__.py', type: 'file' },
                        { name: 'user.py', path: 'models/user.py', type: 'file' },
                        { name: 'product.py', path: 'models/product.py', type: 'file' },
                        { name: 'bill.py', path: 'models/bill.py', type: 'file' },
                        { name: 'category.py', path: 'models/category.py', type: 'file' },
                    ],
                },
                {
                    name: 'controllers',
                    path: 'controllers',
                    type: 'folder',
                    children: [
                        { name: 'authController.py', path: 'controllers/authController.py', type: 'file' },
                        { name: 'productController.py', path: 'controllers/productController.py', type: 'file' },
                        { name: 'billController.py', path: 'controllers/billController.py', type: 'file' },
                        { name: 'aiController.py', path: 'controllers/aiController.py', type: 'file' },
                        { name: 'analyticsController.py', path: 'controllers/analyticsController.py', type: 'file' },
                    ],
                },
                {
                    name: 'templates',
                    path: 'templates',
                    type: 'folder',
                    children: [
                        { name: 'base.html', path: 'templates/base.html', type: 'file' },
                        { name: 'dashboard.html', path: 'templates/dashboard.html', type: 'file' },
                        { name: 'products.html', path: 'templates/products.html', type: 'file' },
                        { name: 'bills.html', path: 'templates/bills.html', type: 'file' },
                        { name: 'analytics.html', path: 'templates/analytics.html', type: 'file' },
                        { name: 'chat.html', path: 'templates/chat.html', type: 'file' },
                        { name: 'login.html', path: 'templates/login.html', type: 'file' },
                    ],
                },
                {
                    name: 'static',
                    path: 'static',
                    type: 'folder',
                    children: [
                        {
                            name: 'css',
                            path: 'static/css',
                            type: 'folder',
                            children: [
                                { name: 'style.css', path: 'static/css/style.css', type: 'file' },
                            ],
                        },
                        {
                            name: 'js',
                            path: 'static/js',
                            type: 'folder',
                            children: [
                                { name: 'dashboard.js', path: 'static/js/dashboard.js', type: 'file' },
                                { name: 'chat.js', path: 'static/js/chat.js', type: 'file' },
                            ],
                        },
                    ],
                },
                {
                    name: 'instance',
                    path: 'instance',
                    type: 'folder',
                    children: [
                        { name: 'inventory.db', path: 'instance/inventory.db', type: 'file' },
                    ],
                },
            ],
        },
    ],
    languages: [
        { name: 'Python', percentage: 54, color: '#3572A5' },
        { name: 'HTML', percentage: 22, color: '#e34c26' },
        { name: 'JavaScript', percentage: 12, color: '#f1e05a' },
        { name: 'CSS', percentage: 8, color: '#563d7c' },
        { name: 'SQLite', percentage: 4, color: '#003B57' },
    ],
    commits: [
        { month: 'Sep', count: 6 },
        { month: 'Oct', count: 14 },
        { month: 'Nov', count: 22 },
        { month: 'Dec', count: 11 },
        { month: 'Jan', count: 18 },
        { month: 'Feb', count: 27 },
    ],
    architectureDiagram: `┌─────────────────────────────────────────────────┐
│               Browser (Bootstrap UI)             │
└─────────────────────┬───────────────────────────┘
                      │ HTTP Requests
┌─────────────────────▼───────────────────────────┐
│         Flask Application (app.py)               │
│  ┌──────────┐ ┌───────────┐ ┌────────────────┐  │
│  │  Auth    │ │  Product  │ │   Bill         │  │
│  │  Routes  │ │  Routes   │ │   Routes       │  │
│  └────┬─────┘ └─────┬─────┘ └───────┬────────┘  │
│       │             │               │            │
│  ┌────▼─────────────▼───────────────▼────────┐  │
│  │           SQLAlchemy ORM Layer             │  │
│  └────────────────────┬───────────────────────┘  │
│                       │                          │
│  ┌────────────────────▼───────────────────────┐  │
│  │            SQLite Database                  │  │
│  │  [users] [products] [bills] [categories]   │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │   AI Layer — Google Gemini API              │ │
│  │   Scaledown context compression             │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘`,
    preview: {
        type: 'readme',
        url: null,
        readme_content: '# Inventory Management System \n\n A comprehensive full-stack inventory management system built with Python and Flask.',
    },
};
