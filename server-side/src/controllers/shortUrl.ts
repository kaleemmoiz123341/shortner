import express from "express";
import { urlModel } from "../model/shortUrl";
import axios from 'axios';

export const createUrl = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { fullUrl } = req.body;
        try {
            new URL(fullUrl);
        } catch {
            res.status(400).send({ message: 'Invalid URL format. Please provide a valid URL.' });
            return;
        }
        try {
            await axios.get(fullUrl);
            handleDatabaseLogic(fullUrl, res);
        } catch {
            res.status(400).send({ message: 'The URL is not reachable.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Something went wrong' });
    }
};

async function handleDatabaseLogic(fullUrl: string, res: express.Response): Promise<void> {
    const urlFound = await urlModel.find({ fullUrl });
    if (urlFound.length > 0) {
        res.status(409).send(urlFound);
    } else {
        const shortUrl = await urlModel.create({ fullUrl });
        res.status(201).send(shortUrl);
    }
}
export const getAllUrl = async (req: express.Request, res: express.Response) => {
    try {
        const shortUrls = await urlModel.find().sort({ createdAt: -1});
        if (shortUrls.length < 0) {
            res.status(404).send({ message: "Short Urls not found" });
        } else {
            res.status(200).send(shortUrls)
        }
    } catch (error) {
        res.status(500).send({ "message": "Something went wrong" });
    }
}
export const getUrl = async (req: express.Request, res: express.Response) => {
    try {
        const shortUrl = await urlModel.findOne({ shortUrl: req.params.id });
        if (!shortUrl) {
            res.status(404).send({ message: "Full url not found!" });
        } else {
            
            shortUrl.clicks++;
            shortUrl.save();
            res.redirect(`${shortUrl.fullUrl}`)
        }
    } catch (error) {
        res.status(500).send({ "message": "Something went wrong" });
    }
}
export const deleteUrl = async (req: express.Request, res: express.Response) => {
    try {
        const shortUrl = await urlModel.findByIdAndDelete({ _id: req.params.id });
        if (shortUrl) {
            res.status(200).send({ message: "Requested URL deleted" });
        }
    } catch (error) {
        res.status(500).send({ "message": "Something went wrong" });
    }
}