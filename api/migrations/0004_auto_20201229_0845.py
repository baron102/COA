# Generated by Django 2.2.12 on 2020-12-29 00:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_userroleactions'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userroleactions',
            old_name='created',
            new_name='created_at',
        ),
        migrations.RenameField(
            model_name='userroleactions',
            old_name='updated',
            new_name='updated_at',
        ),
    ]
