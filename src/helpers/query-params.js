"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationDetails = exports.getQueryParams = void 0;
const getQueryParams = (req) => {
    var _a, _b;
    const sortBy = ((_a = req.query.sortBy) === null || _a === void 0 ? void 0 : _a.toString()) || 'createdAt';
    const sortDirection = ((_b = req.query.sortDirection) === null || _b === void 0 ? void 0 : _b.toString().toLowerCase()) === 'asc' ? 'asc' : 'desc';
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    const pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : 1;
    return { sortBy, sortDirection, pageSize, pageNumber };
};
exports.getQueryParams = getQueryParams;
const getPaginationDetails = (params) => {
    const skipAmount = (params.pageNumber - 1) * params.pageSize;
    return {
        skipAmount,
        sortDir: params.sortDirection === 'asc' ? 1 : -1,
    };
};
exports.getPaginationDetails = getPaginationDetails;
