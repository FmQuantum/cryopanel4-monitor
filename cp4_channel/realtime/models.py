from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


# class Channel(models.Model):
#    name = models.CharField(max_length=256, default="sensor_")
#    channel = models.IntegerField(validators=[
#       MaxValueValidator(255),
#       MinValueValidator(0),
#    ])
#    is_active = models.BooleanField(default=True)

# class DataLog(models.Model):
#     created = models.DateTimeField(auto_now_add=True)
#     channel = models.ForeignKey(Channel, on_delete=models.CASCADE, null=False, blank=False, related_name='data_logs')
#     value = models.DecimalField(max_digits=5, decimal_places=2)


class Channel(models.Model):
    name = models.CharField(max_length=256, default="sensor_")
    channel = models.IntegerField(validators=[
        MaxValueValidator(255),
        MinValueValidator(0),
    ])
    is_active = models.BooleanField(default=True)


class DataLog(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()

class AlarmLog(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()