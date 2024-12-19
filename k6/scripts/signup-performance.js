import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

export const options = {
    scenarios: {
        simple_rps_test: {
            executor: "constant-arrival-rate",
            rate: 1,
            timeUnit: "1s",
            duration: "1m",
            preAllocatedVUs: 5,
            maxVUs: 10,
        },
    },
    thresholds: {
        http_req_failed: [{ threshold: "rate<0.05", abortOnFail: true }],
        dropped_iterations: [{ threshold: "rate<0.05", abortOnFail: true }],
        http_req_duration: [{ threshold: "p(95)<2000", abortOnFail: true }],
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";

    const timestamp = new Date().getTime();
    const randomValue = Math.random().toString(36).substring(2, 15);
    const uniqueId = `${timestamp}-${randomValue}`;

    const signupResponse = http.post(`${BASE_URL}/auth/sign-up`, {
        email: `user-${uniqueId}@test.com`,
        password: "123456",
        name: `user-${uniqueId}`.substring(0, 6),
        nickname: `nickname-${uniqueId}`.substring(0, 6),
    });

    dataReceivedTrend.add(signupResponse.body.length);

    const success = check(signupResponse, {
        "signup status is 201": (r) => r.status === 201,
    });

    if (!success) {
        console.error(
            `Request failed. Status: ${signupResponse.status}, Body: ${signupResponse.body}`,
        );
    }

    sleep(1);
}
