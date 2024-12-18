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
