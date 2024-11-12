import http from 'k6/http';
import { check, sleep } from 'k6';

// Commit

export let options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 50 },
        { duration: '10s', target: 0 },
    ],
};

export default function () {
    const res = http.get('http://34.121.107.1');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 400ms': (r) => r.timings.duration < 400,
    });
    sleep(1);
}
