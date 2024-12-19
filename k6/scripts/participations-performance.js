import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

export const options = {
    scenarios: {
        ramping_rps_test: {
            executor: "ramping-arrival-rate",
            timeUnit: "1s",
            preAllocatedVUs: 20,
            maxVUs: 50,
            stages: [
                { duration: "30s", target: 5 },
                { duration: "1m", target: 10 },
                { duration: "1m", target: 10 },
                { duration: "30s", target: 15 },
                { duration: "30s", target: 0 },
            ],
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
    const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || "access_token";

    const cursors = [12001, 23000, 30000, 40000, 50000];
    const cursor = cursors[Math.floor(Math.random() * cursors.length)];
    const limit = 10;

    const articleIds = [23640, 12714, 11621, 43514];

    const participationsResponse = http.get(
        `${BASE_URL}/participations/articles/${articleIds[Math.floor(Math.random() * articleIds.length)]}?cursor=${cursor}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            timeout: "60s",
        },
    );

    dataReceivedTrend.add(participationsResponse.body.length);

    check(participationsResponse, {
        "participations status is 200": (r) => r.status === 200,
    });

    sleep(1);
}
