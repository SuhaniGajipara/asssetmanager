from rest_framework import serializers
from .models import StockMovement
from apps.products.serializers import ProductSerializer

class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = '__all__'
