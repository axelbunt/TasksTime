from flask_wtf import FlaskForm
# from wtforms import PasswordField, StringField, TextAreaField, SubmitField, BooleanField
from wtforms.fields import *
from wtforms.validators import DataRequired


class RegisterForm(FlaskForm):
    email = EmailField('Почта', name='Почта', validators=[DataRequired()])
    password = PasswordField('Пароль', name='Пароль', validators=[DataRequired()])
    password_again = PasswordField('Повторите пароль', name='Повторите пароль',
                                   validators=[DataRequired()])
    name = StringField('Имя пользователя', name='Имя пользователя', validators=[DataRequired()])
    about = TextAreaField('Немного о себе', name='Немного о себе')
    submit = SubmitField('Войти', name='Войти')


class LoginForm(FlaskForm):
    email = EmailField('Почта', name='Почта', validators=[DataRequired()])
    password = PasswordField('Пароль', name='Пароль', validators=[DataRequired()])
    remember_me = BooleanField('Запомнить меня', name='Запомнить меня')
    submit = SubmitField('Войти', name='Войти')
