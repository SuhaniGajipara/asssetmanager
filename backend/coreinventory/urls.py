from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/warehouses/', include('apps.warehouse.urls')),
    path('api/', include('apps.operations.urls')),
    path('api/ledger/', include('apps.ledger.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
]
