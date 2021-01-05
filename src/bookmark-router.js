/* eslint-disable semi */
'use strict'
const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('./logger')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const bookmarks = [{
  id: '41257642-5ddd-4663-9b04-4c248f971a83',
  title: 'title of bookmark',
  url: 'www.url.com'
}]

bookmarksRouter
  .route('/bookmarks')
  .get((req,res) => {
    res.json(bookmarks)
  })
  .post(bodyParser,(req,res) => {
    const { title, url } = req.body
    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }
    
    if (!url) {
      logger.error('Content is required');
      return res
        .status(400)
        .send('Invalid data');
    }
    const id = uuid();
  
    const bookmark = {
      id,
      title,
      url
    }
    bookmarks.push(bookmark);
    
    logger.info(`Bookamrk with id ${id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/card/${id}`)
      .json(bookmark);
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req,res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id === id);
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete((req,res) => {
    const { id } = req.params

    const bookmarkIndex = bookmarks.findIndex(bk => bk.id === id)
  
    if (bookmarkIndex === -1) {
      logger.error(`List with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    bookmarks.splice(bookmarkIndex, 1)
  
    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

module.exports = bookmarksRouter
