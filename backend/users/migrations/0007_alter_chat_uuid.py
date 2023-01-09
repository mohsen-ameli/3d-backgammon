# Generated by Django 4.1.4 on 2023-01-09 04:04

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_chat_uuid_alter_message_sender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='uuid',
            field=models.UUIDField(default=uuid.UUID('0b32d8ac-b736-4cd0-8c79-64b2e8828e43'), editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
