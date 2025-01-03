import { check, sleep } from "k6";
import http from "k6/http";
import { Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);

export const options = {
    scenarios: {
        simple_rps_test: {
            executor: "constant-arrival-rate",
            rate: 500, // 초당 500개의 요청 (RPS)
            timeUnit: "1s", // RPS 단위 설정
            duration: "1m", // 테스트 지속 시간: 10초
            preAllocatedVUs: 700, // 미리 할당할 VU 수
            maxVUs: 1000, // 최대 VU 수
        },
    },
    // 태그 추가
    tags: {
        testName: "v2-hello-application",
        testType: "performance",
        component: "hello",
        version: "2.0",
    },
    // thresholds: {
    //     http_req_failed: [{ threshold: "rate<0.05", abortOnFail: true }],
    //     dropped_iterations: [{ threshold: "rate<0.05", abortOnFail: true }],
    //     http_req_duration: [{ threshold: "p(95)<3000", abortOnFail: true }],
    // },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
    const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || "access_token";

    const helloResponse = http.get(`${BASE_URL}`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        timeout: "60s",
    });

    dataReceivedTrend.add(helloResponse.body.length);

    check(helloResponse, {
        "hello status is 200": (r) => r.status === 200,
    });

    sleep(1);
}
