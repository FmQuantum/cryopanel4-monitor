from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from pytz import timezone as pytz_timezone
from .models import ChannelLogStatus, DataLog, AlarmLog, ConnectionsLostLog, RawMessageLog, CustomName
from datetime import datetime
import pytz



# @admin.register(Channel)
# class ChannelAdmin(admin.ModelAdmin):
#     list_display = ('name', 'channel', 'is_active')
#     fields = ['name', 'channel', 'is_active']
#     actions = []


@admin.register(ChannelLogStatus)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ('formatted_created',)
    # actions = ['delete_selected_alarm_logs']

    def formatted_created(self, obj):
        return convert_to_bst_time(obj)

    formatted_created.short_description = 'Created'

    def delete_selected_data_logs(modeladmin, queryset):
        queryset.delete()

def convert_to_bst_time(obj):
    utc_time = obj.created
    bst_tz = pytz_timezone('Europe/London')
    bst_time = utc_time.astimezone(bst_tz)
    return bst_time.strftime('%Y-%m-%d %H:%M:%S')


@admin.register(DataLog)
class DataLogAdmin(admin.ModelAdmin):
    list_display = ('formatted_created',)
    # actions = ['delete_selected_data_logs']

    def formatted_created(self, obj):
        return convert_to_bst_time(obj)

    formatted_created.short_description = 'Created'

    def delete_selected_data_logs(modeladmin, queryset):
        queryset.delete()


@admin.register(AlarmLog)
class AlarmLogAdmin(admin.ModelAdmin):
    list_display = ('formatted_created',)
    # actions = ['delete_selected_alarm_logs']

    def formatted_created(self, obj):
        return convert_to_bst_time(obj)

    formatted_created.short_description = 'Created'

    def delete_selected_data_logs(modeladmin, queryset):
        queryset.delete()


@admin.register(ConnectionsLostLog)
class ConnectionsLostLogAdmin(admin.ModelAdmin):
    list_display = ('formatted_created',)
    # actions = ['delete_selected_alarm_logs']

    def formatted_created(self, obj):
        return convert_to_bst_time(obj)

    formatted_created.short_description = 'Created'

    def delete_selected_data_logs(modeladmin, queryset):
        queryset.delete()

@admin.register(RawMessageLog)
class RawMessageLogtheAdmin(admin.ModelAdmin):
    list_display = ('formatted_created',)
    # actions = ['delete_selected_alarm_logs']

    def formatted_created(self, obj):
        return convert_to_bst_time(obj)

    formatted_created.short_description = 'Created'

    def delete_selected_data_logs(modeladmin, queryset):
        queryset.delete()

@admin.register(CustomName)
class CustomNameAdmin(admin.ModelAdmin):
    list_display = ('formatted_created','channel_id', 'custom_name')
    list_editable = ('custom_name',)
    # ordering = ('-created',)  # Sort by 'created' field in descending order

    def get_queryset(self, request):
        return super().get_queryset(request).order_by('created')

    def formatted_created(self, obj):
        return convert_to_bst_time(obj)
    
    formatted_created.short_description = 'Created'

    def delete_selected_data_logs(modeladmin, queryset):
        queryset.delete()
    

