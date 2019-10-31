/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const { Mongoose } = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoose = new Mongoose();
const mockmongo = new MongoMemoryServer();

const jwt = require('jsonwebtoken');
const chai = require('chai');
const supertest = require('supertest');

const opts = require('../config/options');
const server = require('../server');
const Author = require('../models/author_model');
const User = require('../models/user_model');
const Category = require('../models/category_model');
const Book = require('../models/book_model');

// set up global variable
global.mongoose = mongoose;
global.mockmongo = mockmongo;
global.jwt = jwt;
global.supertest = supertest;
global.chai = chai;
global.expect = chai.expect;
global.opts = opts;
global.server = server;
global.Author = Author;
global.User = User;
global.Category = Category;
global.Book = Book;
