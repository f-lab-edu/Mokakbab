import { check, sleep } from "k6";
import http from "k6/http";
import { Rate, Trend } from "k6/metrics";

const dataReceivedTrend = new Trend("data_received_size", true);
// 에러율 추적을 위한 메트릭 추가
const errorRate = new Rate("errors");
const requestFailRate = new Rate("request_fails");

export const options = {
    //discardResponseBodies: true, // 응답 본문을 무시 할 수 있는 옵션으로 `data_received` 크기가 너무 커서 아웃 바운드 요금 초과 방지
    stages: [
        { duration: "2m", target: 3000 }, // 최대 부하 유지
        { duration: "1m", target: 0 }, // 빠르게 부하 감소
    ],
    tags: {
        testName: "prod-spike-articles-10",
        testType: "spike",
        component: "articles",
        version: "1.0",
    },
};

export default function () {
    const BASE_URL = __ENV.BASE_URL || "http://localhost:4000";
    const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || "access_token";

    const cursors = [12001, 23000, 30000, 40000, 50000];
    const cursor = cursors[Math.floor(Math.random() * cursors.length)];
    const limit = 10;

    const articlesResponse = http.get(
        `${BASE_URL}/articles?cursor=${cursor}&limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            timeout: "60s",
            tags: { name: "articles" },
        },
    );

    if (articlesResponse.body)
        dataReceivedTrend.add(articlesResponse.body.length);

    // 응답 상태 체크 및 에러율 기록
    const isSuccessful = check(articlesResponse, {
        "articles status is 200": (r) => r.status === 200,
    });

    if (!isSuccessful) {
        errorRate.add(1);
        requestFailRate.add(1);
    }

    if (articlesResponse.status >= 400) {
        requestFailRate.add(1);
    }

    sleep(1);
}
