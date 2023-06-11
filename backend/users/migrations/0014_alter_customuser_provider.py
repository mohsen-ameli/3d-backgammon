# Generated by Django 4.1.4 on 2023-06-11 00:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_alter_customuser_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='provider',
            field=models.CharField(blank=True, choices=[('credentials', 'credentials'), ('discord', 'discord'), ('google', 'google'), ('twitter', 'twitter')], default='credentials', max_length=11),
        ),
    ]
