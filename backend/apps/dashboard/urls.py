from django.urls import path
from . import views

urlpatterns = [
    path('summary', views.DashboardSummaryView.as_view()),
    path('stock-movement', views.StockMovementView.as_view()),
    path('category-distribution', views.CategoryDistributionView.as_view()),
    path('warehouse-utilization', views.WarehouseUtilizationView.as_view()),
    path('low-stock', views.LowStockView.as_view()),
    path('recent-activity', views.RecentActivityView.as_view()),
]
