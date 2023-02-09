# Generated by Django 4.1.4 on 2023-02-08 22:27

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateField(auto_now_add=True)),
                ('turn', models.CharField(choices=[('white', 'white'), ('black', 'black')], max_length=5)),
                ('players', models.ManyToManyField(related_name='games', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
