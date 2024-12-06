const predictClassification = require('../services/inference');
const crypto = require('crypto');

async function predictHandler(request, h) {
    const { method } = request;
    if (method === 'get') {
        const { history } = request.server.app;
        return h.response({
            status: 'success',
            data: history,
        }).code(200);
    }

    if (method === 'post') {
        const { image } = request.payload;
        const { model, history } = request.server.app;
        const { confidenceScore, label, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            suggestion,
            createdAt,
        };

        history.push(data);

        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data,
        });

        response.code(201);
        return response;
    }

    return h.response({
        status: 'fail',
        message: 'Method not allowed',
    }).code(405);
}

module.exports = predictHandler;
