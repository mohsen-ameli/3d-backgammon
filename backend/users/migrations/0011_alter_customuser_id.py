# Generated by Django 4.1.4 on 2023-05-28 00:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_alter_customuser_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]