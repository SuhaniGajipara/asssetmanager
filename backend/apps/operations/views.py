from rest_framework import viewsets
from .models import Receipt, Delivery, Transfer, Adjustment
from .serializers import ReceiptSerializer, DeliverySerializer, TransferSerializer, AdjustmentSerializer
from apps.products.models import Product
from apps.ledger.models import StockMovement

class ReceiptViewSet(viewsets.ModelViewSet):
    queryset = Receipt.objects.all()
    serializer_class = ReceiptSerializer

    def perform_create(self, serializer):
        receipt = serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
        # Process products JSON and update stock
        for item in receipt.products:
            # item looks like {"product": "Steel Rod", "quantity": 50} or SKU
            product_name = item.get('product')
            quantity = item.get('quantity', 0)
            try:
                # Try to map by name or SKU
                product = Product.objects.filter(name=product_name).first() or Product.objects.filter(sku=product_name).first()
                if product:
                    product.initial_stock += quantity # updating initial stock as stock
                    product.save()

                    StockMovement.objects.create(
                        product=product,
                        operation_type='RECEIPT',
                        quantity=quantity,
                        destination_location=receipt.warehouse.name,
                        performed_by=receipt.created_by
                    )
            except Exception as e:
                print(f"Error processing receipt item: {e}")

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer

    def perform_create(self, serializer):
        delivery = serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
        for item in delivery.products:
            product_name = item.get('product')
            quantity = item.get('quantity', 0)
            product = Product.objects.filter(name=product_name).first() or Product.objects.filter(sku=product_name).first()
            if product:
                product.initial_stock -= quantity
                product.save()

                StockMovement.objects.create(
                    product=product,
                    operation_type='DELIVERY',
                    quantity=-quantity,
                    source_location=delivery.warehouse.name,
                    performed_by=delivery.created_by
                )

class TransferViewSet(viewsets.ModelViewSet):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer

    def perform_create(self, serializer):
        transfer = serializer.save()
        StockMovement.objects.create(
            product=transfer.product,
            operation_type='TRANSFER',
            quantity=transfer.quantity,
            source_location=transfer.source_location.name,
            destination_location=transfer.destination_location.name,
            performed_by=self.request.user if self.request.user.is_authenticated else None
        )

class AdjustmentViewSet(viewsets.ModelViewSet):
    queryset = Adjustment.objects.all()
    serializer_class = AdjustmentSerializer

    def perform_create(self, serializer):
        adjustment = serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
        adjustment.product.initial_stock = adjustment.counted_quantity
        adjustment.product.save()
        
        StockMovement.objects.create(
            product=adjustment.product,
            operation_type='ADJUSTMENT',
            quantity=adjustment.difference,
            source_location=adjustment.warehouse.name,
            performed_by=adjustment.created_by
        )
