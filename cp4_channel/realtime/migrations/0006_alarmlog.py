# Generated by Django 4.2.1 on 2023-06-20 16:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('realtime', '0005_rename_ch_1_datalog_data_remove_datalog_ch_2_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AlarmLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('data', models.JSONField()),
            ],
        ),
    ]