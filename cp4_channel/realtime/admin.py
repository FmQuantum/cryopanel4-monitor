from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from pytz import timezone as pytz_timezone
from .models import Channel, DataLog, AlarmLog
from datetime import datetime
import pytz



# @admin.register(Channel)
# class ChannelAdmin(admin.ModelAdmin):
#     list_display = ('name', 'channel', 'is_active')
#     fields = ['name', 'channel', 'is_active']
#     actions = []


@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ('name', 'channel', 'is_active')

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

# @admin.register(AlarmLog)
# class AlarmLogAdmin(admin.ModelAdmin):
#     list_display = ('formatted_created',)
#     list_display_links = None

#     def formatted_created(self, obj):
#         bst_time = convert_to_bst_time(obj)
#         alarm_value = obj.data.get('Alarm')
#         print(f'from admin.py alarm value ---> {alarm_value}')
#         if alarm_value  != 'Normal':
#             return format_html('<span style="color: red;">{}</span>', bst_time)
#         return bst_time

#     formatted_created.short_description = 'Created'

#     def delete_selected_data_logs(modeladmin, queryset):
#         queryset.delete()


