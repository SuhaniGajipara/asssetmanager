from django.db import models
from apps.warehouse.models import Warehouse

class Product(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=100)
    unit = models.CharField(max_length=20)
    initial_stock = models.IntegerField(default=0)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True)
    reorder_level = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
