# Generated by Django 4.2.1 on 2023-07-13 09:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('realtime', '0013_rawmessagelog'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomName',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_id', models.CharField(max_length=100, unique=True)),
                ('custom_name', models.CharField(max_length=100)),
            ],
        ),
    ]
