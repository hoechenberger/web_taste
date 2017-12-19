#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask
from flask_restplus import Api
from flask_bootstrap import Bootstrap

app = Flask(__name__)
Bootstrap(app)
api = Api(app)
api.app.secret_key = 's3cr3t'


from . import views


if __name__ == '__main__':
    app.run()
