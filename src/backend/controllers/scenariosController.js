'use strict';

const scenariosService = require('../services/scenariosService');

exports.list = (req, res) => {
  const { tag } = req.query;
  if (tag) return res.json(scenariosService.getByTag(tag));
  res.json(scenariosService.list());
};

exports.getByTag = (req, res) => {
  const items = scenariosService.getByTag(req.params.tag);
  if (items.length === 0)
    return res.status(404).json({ error: 'No scenarios found for tag', tag: req.params.tag });
  res.json(items);
};
