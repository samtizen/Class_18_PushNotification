# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-14 02:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='users',
            name='id',
        ),
        migrations.AlterField(
            model_name='users',
            name='req_id',
            field=models.CharField(max_length=200, primary_key=True, serialize=False),
        ),
    ]
