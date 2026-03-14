from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReceiptViewSet, DeliveryViewSet, TransferViewSet, AdjustmentViewSet

router = DefaultRouter()
router.register(r'receipts', ReceiptViewSet)
router.register(r'deliveries', DeliveryViewSet)
router.register(r'transfers', TransferViewSet)
router.register(r'adjustments', AdjustmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
