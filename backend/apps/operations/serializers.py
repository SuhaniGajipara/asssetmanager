from rest_framework import serializers
from .models import Receipt, Delivery, Transfer, Adjustment

class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = '__all__'

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'

class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfer
        fields = '__all__'

class AdjustmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adjustment
        fields = '__all__'
