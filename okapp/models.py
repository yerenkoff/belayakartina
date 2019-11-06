from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class ProductCategory(models.Model):
	category = models.CharField(max_length=100, default='')
	parent = models.CharField(max_length=100, default='')

class Product(models.Model):
	name = models.CharField(max_length=100, default='')
	photo = models.ImageField(upload_to='images/')
	price = models.IntegerField(blank=True, null=True)
	# category = ArrayField(ArrayField(models.CharField(max_length=200, blank=True)), size=1, null=True)
	category = models.CharField(max_length=100, default='')
	amount = models.IntegerField(blank=True, null=True)
	description = models.TextField(blank=True, null=True)