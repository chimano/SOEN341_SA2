# Generated by Django 2.0.1 on 2018-02-12 03:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('so_endpoint', '0009_question_accepted_answer_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='rejected_answers_ids',
            field=models.ManyToManyField(related_name='rejected_answers_set', to='so_endpoint.Answer'),
        ),
        migrations.AlterField(
            model_name='question',
            name='accepted_answer_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='accepted_answer_set', to='so_endpoint.Answer'),
        ),
    ]
