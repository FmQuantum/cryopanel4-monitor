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


class ChannelLogStatus(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()

    class Meta:
        verbose_name = "Channel Logs Status"  # Specify the custom verbose name for the model
        verbose_name_plural = "Channel Logs Status"  # Specify the custom verbose plural name for the model


class DataLog(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()

class AlarmLog(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()

class ConnectionsLostLog(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()

class RawMessageLog(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()

class CustomName(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    channel_id = models.CharField(max_length=100, unique=True)
    custom_name = models.CharField(max_length=100)

    class Meta:
        ordering = ['-created']