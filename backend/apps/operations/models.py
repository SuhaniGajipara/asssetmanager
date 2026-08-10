from django.db import models
from apps.warehouse.models import Warehouse
from apps.products.models import Product
from apps.users.models import User

class Receipt(models.Model):
    supplier = models.CharField(max_length=200)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default='PENDING', choices=[('PENDING', 'Pending'), ('COMPLETED', 'Completed')])
    products = models.JSONField(default=list) # [{"product": "SKU-123", "quantity": 50}]
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Delivery(models.Model):
    destination = models.CharField(max_length=200)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default='PENDING', choices=[('PENDING', 'Pending'), ('COMPLETED', 'Completed')])
    products = models.JSONField(default=list) # [{"product": "SKU-123", "quantity": 50}]
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Transfer(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    source_location = models.ForeignKey(Warehouse, related_name='transfer_out', on_delete=models.CASCADE)
    destination_location = models.ForeignKey(Warehouse, related_name='transfer_in', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class Adjustment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    system_quantity = models.IntegerField()
    counted_quantity = models.IntegerField()
    difference = models.IntegerField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
