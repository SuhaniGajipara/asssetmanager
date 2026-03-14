from django.db import models
from apps.products.models import Product
from apps.users.models import User

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
    source_location = models.CharField(max_length=100, null=True, blank=True)
    destination_location = models.CharField(max_length=100, null=True, blank=True)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.operation_type} - {self.product.name} ({self.quantity})"
