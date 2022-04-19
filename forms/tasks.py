from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField
from wtforms import SubmitField
from wtforms.validators import DataRequired


class TaskForm(FlaskForm):
    title = StringField("Заголовок", name='Что хотите сделать?', validators=[DataRequired()])
    content = TextAreaField("Содержание", name='Содержание, время...')
    submit = SubmitField("Применить")
