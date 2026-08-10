Below is the **modified production-ready architecture** for **CoreInventory** based on your requirement:

* **Frontend:** React.js + TailwindCSS
* **Backend:** Django + Django REST Framework
* **Database:** SQLite3 (can later migrate to PostgreSQL)
* **Authentication:** JWT + OTP password reset via email

This stack is **much cleaner for hackathons and college projects**, and Django already provides strong security and structure.

---

# CoreInventory – Inventory Management System

## 1. Overall Architecture

```
React Frontend  →  Django REST API  →  SQLite3 Database
                     |
                     JWT Auth
                     |
                Email OTP Service
```

Frontend communicates with backend using **REST APIs**.

---

# 2. Project Folder Structure

## Backend (Django)

```
coreinventory_backend
│
├── manage.py
├── db.sqlite3
│
├── coreinventory
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│
├── apps
│   ├── users
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── permissions.py
│
│   ├── products
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│
│   ├── warehouse
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│
│   ├── operations
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── services.py
│   │   ├── urls.py
│
│   ├── ledger
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│
└── requirements.txt
```

---

## Frontend (React)

```
coreinventory_frontend

src
│
├── components
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── DashboardCards.jsx
│   ├── ProductTable.jsx
│
├── pages
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Receipts.jsx
│   ├── Deliveries.jsx
│   ├── Transfers.jsx
│   ├── Adjustments.jsx
│   ├── Warehouses.jsx
│
├── services
│   ├── api.js
│   ├── authService.js
│   ├── inventoryService.js
│
├── context
│   ├── AuthContext.jsx
│
├── App.jsx
├── main.jsx
```

---

# 3. Database Schema (SQLite3)

## Users

```
User
-----
id
name
email
password
role
is_verified
created_at
```

Roles:

```
Inventory Manager
Warehouse Staff
```

---

## Products

```
Product
--------
id
name
sku
category
unit
initial_stock
warehouse
reorder_level
created_at
```

---

## Warehouses

```
Warehouse
-----------
id
name
location
section
created_at
```

---

## Receipts

```
Receipt
--------
id
supplier
warehouse
status
created_by
created_at
```

---

## Deliveries

```
Delivery
---------
id
destination
warehouse
status
created_by
created_at
```

---

## Transfers

```
Transfer
---------
id
product
source_location
destination_location
quantity
created_at
```

---

## Adjustments

```
Adjustment
-----------
product
warehouse
system_quantity
counted_quantity
difference
created_by
```

---

## Stock Ledger

```
StockMovement
--------------
product
operation_type
quantity
source_location
destination_location
date
performed_by
```

Operation Types:

```
RECEIPT
DELIVERY
TRANSFER
ADJUSTMENT
```

---

# 4. Django Models Example

## Product Model

```python
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=100)
    unit = models.CharField(max_length=20)
    initial_stock = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=10)

    def __str__(self):
        return self.name
```

---

## Warehouse Model

```python
class Warehouse(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    section = models.CharField(max_length=100)

    def __str__(self):
        return self.name
```

---

## Stock Movement Model

```python
class StockMovement(models.Model):

    OPERATION_TYPES = [
        ('RECEIPT','Receipt'),
        ('DELIVERY','Delivery'),
        ('TRANSFER','Transfer'),
        ('ADJUSTMENT','Adjustment')
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    operation_type = models.CharField(max_length=20, choices=OPERATION_TYPES)
    quantity = models.IntegerField()
    source_location = models.CharField(max_length=100,null=True,blank=True)
    destination_location = models.CharField(max_length=100,null=True,blank=True)
    performed_by = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

# 5. REST API Design

## Authentication

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

## Products

```
GET /api/products
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
```

---

## Warehouses

```
GET /api/warehouses
POST /api/warehouses
```

---

## Operations

### Receipts

```
POST /api/receipts
GET /api/receipts
```

### Deliveries

```
POST /api/deliveries
GET /api/deliveries
```

### Transfers

```
POST /api/transfers
GET /api/transfers
```

### Adjustments

```
POST /api/adjustments
GET /api/adjustments
```

---

# 6. Example API Request

### Create Product

```
POST /api/products
```

Body:

```json
{
"name": "Steel Rod",
"sku": "SR-100",
"category": "Raw Material",
"unit": "piece",
"initial_stock": 100
}
```

---

### Receipt Example

```
POST /api/receipts
```

```json
{
"supplier": "ABC Steel",
"warehouse": "Main Warehouse",
"products": [
 {
   "product": "Steel Rod",
   "quantity": 50
 }
]
}
```

System will automatically create **StockMovement**

---

# 7. Dashboard KPIs

React Dashboard shows:

```
Total Products
Low Stock Items
Out of Stock Items
Pending Receipts
Pending Deliveries
Transfers
```

Example React card:

```javascript
<div className="bg-white shadow p-4 rounded">
<h2>Total Products</h2>
<p className="text-2xl font-bold">120</p>
</div>
```

---

# 8. Example Seed Data

```
Product
--------
Steel Rod
SKU: SR-100
Stock: 100

Plastic Pipe
SKU: PP-200
Stock: 60
```

Warehouse

```
Main Warehouse
Location: Ahmedabad
Section: A1
```

---

# 9. Running Project Locally

## Backend

Install dependencies

```
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
```

Run migrations

```
python manage.py makemigrations
python manage.py migrate
```

Run server

```
python manage.py runserver
```

---

## Frontend

Create React app

```
npm create vite@latest coreinventory_frontend
```

Install packages

```
npm install axios react-router-dom tailwindcss
```

Run

```
npm run dev
```

---

# 10. Real-World Features

### Low Stock Alerts

Trigger when:

```
stock < reorder_level
```

---

### SKU Search

Fast search:

```
GET /api/products?sku=SR-100
```

---

### Filters

```
Warehouse
Category
Operation Type
Status
```

---

# 11. Security

Use:

```
JWT Authentication
Password hashing
Email OTP reset
Protected API routes
```

---

