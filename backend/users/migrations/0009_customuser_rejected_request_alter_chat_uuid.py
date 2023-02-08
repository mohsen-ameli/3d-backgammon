# Generated by Django 4.1.4 on 2023-02-07 23:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_customuser_game_requests_alter_chat_uuid'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='rejected_request',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='chat',
            name='uuid',
            field=models.UUIDField(default=uuid.UUID('cd145512-35b4-4742-8d6e-fbcda72380c2'), editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
