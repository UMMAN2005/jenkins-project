import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 10 },  // Ramp up to 10 virtual users
        { duration: '1m', target: 50 },   // Stay at 50 virtual users
        { duration: '30s', target: 0 },   // Ramp down to 0 users
    ],
};

export default function () {
    const res = http.get('http://34.121.107.1');  // Replace with your app's URL
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 400ms': (r) => r.timings.duration < 400,
    });
    sleep(1);
}
