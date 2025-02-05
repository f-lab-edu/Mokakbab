import { check, sleep } from "k6";
import http from "k6/http";
import { Rate, Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);
// 에러율 추적을 위한 메트릭 추가
const errorRate = new Rate("errors");
const requestFailRate = new Rate("request_fails");

export const options = {
    userAgent: __ENV.MY_USER_AGENT,
    //discardResponseBodies: true, // 응답 본문을 무시 할 수 있는 옵션으로 `data_received` 크기가 너무 커서 아웃 바운드 요금 초과 방지
    scenarios: {
        spike_test: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "2m", target: 500 }, // 1분 동안 VUs를 500으로 증가
                { duration: "1m", target: 0 }, // 30초 동안 VUs를 0으로 감소
            ],
        },
    },
    thresholds: {
        http_req_failed: ["rate<0.01"],
        http_req_duration: ["p(95)<2000"],
    },
    tags: {
        testName: "participations-21",
        testType: "spike",
        component: "participations",
        version: "1.0",
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
            tags: { name: "participations" },
        },
    );

    if (participationsResponse.body)
        dataReceivedTrend.add(participationsResponse.body.length);

    // 응답 상태 체크 및 에러율 기록
    const isSuccessful = check(participationsResponse, {
        "participations status is 200": (r) => r.status === 200,
    });

    if (!isSuccessful) {
        errorRate.add(1);
        requestFailRate.add(1);
    }

    if (participationsResponse.status >= 400) {
        requestFailRate.add(1);
    }

    sleep(0.1);
}
