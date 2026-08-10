from rest_framework import viewsets
from .models import StockMovement
from .serializers import StockMovementSerializer

class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockMovement.objects.all().order_by('-date')
    serializer_class = StockMovementSerializer
