import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

export const options = {
    scenarios: {
        ramping_rps_test: {
            executor: "ramping-arrival-rate",
            startRate: 15,
            timeUnit: "1s",
            stages: [
                { duration: "1m", target: 20 },
                { duration: "1m", target: 25 },
                { duration: "1m", target: 30 },
            ],
            preAllocatedVUs: 20,
            maxVUs: 50,
        },
    },
    thresholds: {
        http_req_failed: ["rate<0.05"],
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";

    const timestamp = new Date().getTime();
    const randomValue = Math.random().toString(36).substring(2, 15);
    const uniqueId = `${timestamp}-${randomValue}`;

    const signupResponse = http.post(`${BASE_URL}/sign-up`, {
        email: `user-${uniqueId}@test.com`,
        password: "123456",
        name: `user-${uniqueId}`,
        nickname: `nickname-${uniqueId}`,
    });

    dataReceivedTrend.add(signupResponse.body.length);

    check(signupResponse, {
        "signup status is 201": (r) => r.status === 201,
    });

    sleep(1);
}
