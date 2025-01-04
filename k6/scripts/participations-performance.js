import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

export const options = {
    scenarios: {
        simple_rps_test: {
            executor: "constant-arrival-rate",
            rate: 500,
            timeUnit: "1s",
            duration: "1m",
            preAllocatedVUs: 1500,
            maxVUs: 1500,
        },
    },
    // 태그 추가
    tags: {
        testName: "v2-participations-application",
        testType: "performance",
        component: "participations",
        version: "2.0",
    },
    thresholds: {
        http_req_failed: [{ threshold: "rate<0.05" }],
        dropped_iterations: [{ threshold: "rate<0.05" }],
        http_req_duration: [{ threshold: "p(95)<3000" }],
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

    if (participationsResponse.body)
        dataReceivedTrend.add(participationsResponse.body.length);

    check(participationsResponse, {
        "participations status is 200": (r) => r.status === 200,
    });

    sleep(1);
}
