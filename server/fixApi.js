const http = require('http');

const putReq = (path, token, payload) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        const req = http.request(`http://[::1]:5000${path}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => resolve(body));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
};

const loginReq = () => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ email: 'instructor@learnhub.com', password: 'password123' });
        const req = http.request(`http://[::1]:5000/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        }, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => resolve(JSON.parse(body).token));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
};

const run = async () => {
    try {
        const token = await loginReq();
        if (!token) throw new Error("No token!");
        console.log('Got token!');

        const nlpId = '69ac5d78f16cfbb8cf8b5ed6';
        const nnId = '69ac5d78f16cfbb8cf8b5ec6';

        console.log('Updating NLP...');
        const r1 = await putReq(`/api/courses/${nlpId}`, token, {
            thumbnail: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800'
        });
        console.log('Result:', JSON.parse(r1).success);

        console.log('Updating Neural Networks...');
        const r2 = await putReq(`/api/courses/${nnId}`, token, {
            thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4628c675c?q=80&w=800'
        });
        console.log('Result:', JSON.parse(r2).success);

    } catch (e) {
        console.error(e);
    }
};

run();
