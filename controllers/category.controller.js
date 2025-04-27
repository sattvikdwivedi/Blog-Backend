// imports
const express = require('express');
const createErrors = require('http-errors');
const categoryService = require('../services/category.service');
const blogService = require('../services/blog.service');
const { Category } = require('../models/category.model');
const utils = require('../util');

const createCategory = async(req, res, next) => {
    try {
        
        let categoryBody = req.body;

        const savedCategory = await categoryService.createCategory(categoryBody);
        res.send(savedCategory);

    } catch (error) {
        next(error);
    }
}

const getCategories = async(req, res, next) => {
    try {

        let searchParams = {};
        const categories = await categoryService.readCategory(searchParams);
        res.send(categories);

    } catch (error) {
        next(error);
    }
}
const getCategorizedBlogCount = async(req, res, next) => {
    try {
        let searchParams = {};

        let bloggerId = req.params.bloggerId;
        let status = req.query.status; // 👈 get status from query params

        if (bloggerId && bloggerId.toLowerCase() != 'all') {
            searchParams.writter = bloggerId;
        }

        if (status && status.toLowerCase() !== 'all') { // 👈 add status if provided
            searchParams.status = status;
        }

        let categories = await categoryService.readCategory();
        let count = [];

        categories.forEach(c => {
            const categorySearchParams = { ...searchParams, category: c._id }; // 👈 clone searchParams properly
            count.push(
                blogService.countBlogs(categorySearchParams)
            );
        });

        count = await Promise.all(count);

        const result = utils.combineArrayObjectAndArray(categories, ['_id', 'name'], count, 'count');

        res.send(result);

    } catch (error) {
        next(error);
    }
}


 // exports
 module.exports = {
    createCategory,
    getCategories,
    getCategorizedBlogCount
 }