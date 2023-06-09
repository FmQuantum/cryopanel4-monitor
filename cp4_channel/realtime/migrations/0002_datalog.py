# Generated by Django 4.2.1 on 2023-05-15 09:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('realtime', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DataLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('value', models.DecimalField(decimal_places=2, max_digits=5)),
                ('channel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='data_logs', to='realtime.channel')),
            ],
        ),
    ]
