# Generated by Django 4.1.4 on 2023-02-22 06:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0010_ingamemessages_show'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingamemessages',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
