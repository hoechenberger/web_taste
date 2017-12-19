#!/usr/bin/env python
# -*- coding: utf-8 -*-

from setuptools import setup

setup(
    name='web_taste',
    packages=['web_taste'],
    include_package_data=True,
    install_requires=[
        'flask', 'flask_restplus', 'flask_bootstrap', 'wtforms', 'flask-wtf'
    ],
)
