# Generated by Django 4.2.1 on 2023-06-30 10:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('realtime', '0008_channellog_delete_channel'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ChannelLog',
            new_name='ChannelLogStatus',
        ),
    ]
