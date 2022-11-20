const express = require("express");
const tagsRouter = express.Router();

const { getAllTags } = require('../db');

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    let { tagName } = req.params;
    
    // decode %23happy to #happy
    tagName = decodeURIComponent(tagName)
  
    try {
      const allPosts = await getPostsByTagName(tagName);
  
      const posts = allPosts.filter(post => {
        if (post.active) {
          return true;
        }
  
        if (req.user && req.user.id === post.author.id) {
          return true;
        }
  
        return false;
      })
  
      res.send({ posts });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

module.exports = tagsRouter;