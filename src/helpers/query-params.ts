import {Request} from "express";
import {PostQueryParams} from "../types";

export const  getQueryParams = (req: Request): PostQueryParams => {
    const sortBy = req.query.sortBy?.toString() || 'createdAt';
    const sortDirection = req.query.sortDirection?.toString().toLowerCase() === 'asc' ? 'asc' : 'desc';
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;

    return { sortBy, sortDirection, pageSize, pageNumber };
}

export const getPaginationDetails = (params: {pageNumber: number, pageSize: number, sortDirection: string}) => {
    const skipAmount = (params.pageNumber - 1) * params.pageSize;
    return {
        skipAmount,
        sortDir: params.sortDirection === 'asc' ? 1 : -1,
    };
}