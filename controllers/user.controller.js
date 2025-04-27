// imports
const express = require('express');
const createErrors = require('http-errors');
const userService = require('../services/user.service');
const { User } = require('../models/user.model');
const jwtHelper = require('../helpers/jwt.helper');
const utils = require('../util');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const client = require('../helpers/jwt.helper');
const cloudinary = require('../helpers/cloudinary.helper');

const registerUser = async(req, res, next) => {
    try {
        
        let userBody = req.body;

        userBody.password = await bcrypt.hash(userBody.password, saltRounds);
        const savedUser = await userService.createUser(userBody);

        const user = utils.makeObjectSelected(savedUser, ['_id', 'first_name', 'role']);
        const accessToken = await jwtHelper.signAccessToken(savedUser._id);
        const refreshToken = await jwtHelper.signRefreshToken(savedUser._id);
        
        res.send({
            user,
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error);
    }
}

const loginUser = async(req, res, next) => {
    try {
        
        const userBody = req.body;

        const findUser = await userService.findUniqueUser({email: userBody.email});
        const passMatch = await bcrypt.compare(userBody.password, findUser.password);

        if( !passMatch ) {
            throw createErrors.BadRequest('Incorrect email or password');
        }

        const accessToken = await jwtHelper.signAccessToken(findUser._id);
        const refreshToken = await jwtHelper.signRefreshToken(findUser._id);

        const user = utils.makeObjectSelected(findUser, ['_id', 'first_name', 'role']);

        res.send({
            user,
            accessToken,
            refreshToken
        });

    } catch (error) {
        if( error.status && error.status == 404 ) {
            error = createErrors.BadRequest('Incorrect email or password');
            next(error);
        }
        next(error);
    }
}

const editUser = async(req, res, next) => {
    try {

        let userBody = req.body;

        if( req.file ) {
            userBody.img = req.file.path;

            const uploadResult = await cloudinary.uploader.upload(userBody.img, {
                folder: "avatars"
            });
    
            if( uploadResult.secure_url ) {
                userBody.img = uploadResult.secure_url;
            } else {
                throw createErrors.Forbidden("Opps, image upload failed! Try again.")
            }
        }

        await userService.updateUser(userBody);
        
        const updatedUser = await userService.findUniqueUser({_id: userBody.userId}, ['_id', 'first_name', 'role']);
        
        res.send(updatedUser);

    } catch (error) {
        next(error);
    }
}

const refreshToken = async(req, res, next) => {
    try {
        
        let oldRefreshToken = req.body.refreshToken;

        if( !oldRefreshToken ) {
            throw createErrors.Forbidden('No refreshToken');
        }

        const userId = await jwtHelper.verifyRefreshToken(oldRefreshToken);
        if( !userId ) {
            throw createErrors.Forbidden('No refreshToken');
        }

        const accessToken = await jwtHelper.signAccessToken(userId);
        const refreshToken = await jwtHelper.signRefreshToken(userId);
        res.send({accessToken, refreshToken});

    } catch (error) {
        next(error);
    }
}

const getMyData = async(req, res, next) => {
    try {
        
        const userId = req.body.userId;
        let searchParams = { _id: userId };
        let selectFields = 'first_name last_name joined role email job address about img'

        const user = await userService.findUniqueUser(searchParams, selectFields);

        res.send(user);

    } catch (error) {
        next(error);
    }
}

const getBloggerProfile = async(req, res, next) => {
    try {

        const userId = req.params.bloggerId;
        if( !userId ) {
            throw createErrors.BadRequest('No bloggerId');
        }

        let searchParams = { _id: userId };
        let selectFields = 'img first_name last_name joined role email job address about';

        const user = await userService.findUniqueUser(searchParams, selectFields);
        res.send(user);

    } catch (error) {
        next(error);
    }
}

const logout = async(req, res, next) => {
    res.send('logout is not implemented yet')
}
const uploadProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            throw createErrors.BadRequest('No file uploaded');
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "profile_pictures"
        });

        if (!uploadResult.secure_url) {
            throw createErrors.Forbidden("Image upload failed! Try again.");
        }

        const userId = req.body.userId;

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { img: uploadResult.secure_url },
          { new: true }
        );

        res.send({
            message: "Profile picture uploaded successfully",
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
};


// Add the new function to the exports
module.exports = {
    registerUser,
    loginUser,
    editUser,
    refreshToken,
    getMyData,
    getBloggerProfile,
    logout,
    uploadProfilePicture
};
