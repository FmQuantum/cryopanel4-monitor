# Generated by Django 4.2.1 on 2023-07-04 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('realtime', '0012_alter_channellogstatus_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='RawMessageLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('data', models.JSONField()),
            ],
        ),
    ]
