from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        sku = self.request.query_params.get('sku', None)
        if sku is not None:
            queryset = queryset.filter(sku=sku)
        return queryset
