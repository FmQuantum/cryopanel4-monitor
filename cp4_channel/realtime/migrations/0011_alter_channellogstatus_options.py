# Generated by Django 4.2.1 on 2023-06-30 10:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('realtime', '0010_alter_channellogstatus_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='channellogstatus',
            options={'verbose_name': 'Channel Log Status', 'verbose_name_plural': 'Channel Log Status'},
        ),
    ]
