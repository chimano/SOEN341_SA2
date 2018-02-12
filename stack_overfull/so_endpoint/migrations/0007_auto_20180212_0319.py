# Generated by Django 2.0.1 on 2018-02-12 03:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('so_endpoint', '0006_merge_20180211_1508'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='points',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='profile',
            name='downvoted_answers',
            field=models.ManyToManyField(related_name='down_answers', to='so_endpoint.Answer'),
        ),
        migrations.AddField(
            model_name='profile',
            name='downvoted_questions',
            field=models.ManyToManyField(related_name='down_questions', to='so_endpoint.Question'),
        ),
        migrations.AddField(
            model_name='profile',
            name='upvoted_answers',
            field=models.ManyToManyField(related_name='up_answers', to='so_endpoint.Answer'),
        ),
        migrations.AddField(
            model_name='profile',
            name='upvoted_questions',
            field=models.ManyToManyField(related_name='up_questions', to='so_endpoint.Question'),
        ),
        migrations.AddField(
            model_name='question',
            name='points',
            field=models.IntegerField(default=0),
        ),
    ]
