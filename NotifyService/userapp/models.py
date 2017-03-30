from django.db import models

# Create your models here.
class Users(models.Model):
    nickname = models.CharField(max_length=200)
    email = models.CharField(max_length=200, primary_key=True)
    reg_id = models.CharField(max_length=200)
    create_date = models.DateTimeField()

