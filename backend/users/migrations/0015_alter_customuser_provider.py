# Generated by Django 4.1.4 on 2023-06-11 20:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_alter_customuser_provider'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='provider',
            field=models.CharField(blank=True, choices=[('credentials', 'credentials'), ('discord', 'discord'), ('google', 'google'), ('twitch', 'twitch')], default='credentials', max_length=11),
        ),
    ]
