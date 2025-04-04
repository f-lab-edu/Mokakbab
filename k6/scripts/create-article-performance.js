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
        testName: "create-article-2",
        testType: "spike",
        component: "create-article",
        version: "1.0",
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
    const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || "access_token";

    const randomValue = Math.random().toString(36).substring(2, 15);

    const articlesResponse = http.post(
        `${BASE_URL}/articles`,
        JSON.stringify({
            title: `서울 강서구 독서 모임 모집합니다 ${randomValue}`,
            content: `매주 토요일 오후 2시에 우장산역 근처 카페에서 독서 모임을 진행합니다. 함께 책을 읽고 이야기 나누실 분들을 모집합니다. ${randomValue}`,
            startTime: "2025-02-04T04:00:00.000Z",
            endTime: "2025-02-04T13:00:00.000Z",
            categoryId: 1,
            regionId: 1,
            districtId: 4,
        }),
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            timeout: "60s",
            tags: { name: "articles" },
        },
    );

    if (articlesResponse.body)
        dataReceivedTrend.add(articlesResponse.body.length);

    // 응답 상태 체크 및 에러율 기록
    const isSuccessful = check(articlesResponse, {
        "articles status is 201": (r) => r.status === 201,
    });

    if (!isSuccessful) {
        errorRate.add(1);
        requestFailRate.add(1);
    }

    if (articlesResponse.status >= 400) {
        requestFailRate.add(1);
    }

    sleep(0.1);
}
